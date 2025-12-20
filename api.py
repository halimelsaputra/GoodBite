import os
import json
import uuid
from datetime import datetime
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# === Config ===
DATA_DIR = os.getenv("DATA_DIR", os.path.join(os.path.dirname(__file__), "data"))
USERS_FILE = os.path.join(DATA_DIR, "users.json")
SELLERS_FILE = os.path.join(DATA_DIR, "sellers.json")
REVIEWS_FILE = os.path.join(DATA_DIR, "reviews.json")
PACKAGES_DIR = os.path.join(DATA_DIR, "packages")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(PACKAGES_DIR, exist_ok=True)

# === Helpers ===
def read_json(path: str, default: Any):
    try:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass
    return default


def write_json(path: str, data: Any):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def read_packages_file(seller_id: str) -> List[Dict]:
    return read_json(os.path.join(PACKAGES_DIR, f"{seller_id}.json"), [])


def write_packages_file(seller_id: str, data: List[Dict]):
    write_json(os.path.join(PACKAGES_DIR, f"{seller_id}.json"), data)


def find_seller_id_by_package_id(package_id: str) -> str | None:
    try:
        for filename in os.listdir(PACKAGES_DIR):
            seller_id = os.path.splitext(filename)[0]
            packages = read_packages_file(seller_id)
            if any(p.get("id") == package_id for p in packages):
                return seller_id
    except Exception:
        pass
    return None


def new_id() -> str:
    return uuid.uuid4().hex[:9]


# === App ===
app = FastAPI(title="GoodBite API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "OK", "timestamp": datetime.utcnow().isoformat()}


# ========== CUSTOMER ==========
@app.post("/api/customers/register")
def register_customer(payload: Dict[str, Any]):
    required = ["username", "name", "email", "phone", "password", "confirmPassword"]
    if any(not payload.get(k) for k in required):
        raise HTTPException(status_code=400, detail="Semua field wajib diisi")
    if payload["password"] != payload["confirmPassword"]:
        raise HTTPException(status_code=400, detail="Password tidak cocok")

    users = read_json(USERS_FILE, [])
    if any(u.get("username") == payload["username"] for u in users):
        raise HTTPException(status_code=400, detail="Username sudah digunakan")
    if any(u.get("email") == payload["email"] for u in users):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    user = {
        "id": new_id(),
        "username": payload["username"],
        "name": payload["name"],
        "email": payload["email"],
        "phone": payload["phone"],
        "password": payload["password"],  # plaintext, sama seperti server.js
        "createdAt": datetime.utcnow().isoformat(),
    }
    users.append(user)
    write_json(USERS_FILE, users)
    return {
        "success": True,
        "user": {"id": user["id"], "name": user["name"], "phone": user["phone"], "createdAt": user["createdAt"]},
    }


@app.post("/api/customers/login")
def login_customer(payload: Dict[str, Any]):
    username = payload.get("username")
    password = payload.get("password")
    users = read_json(USERS_FILE, [])
    user = next((u for u in users if u.get("username") == username), None)
    if not user or user.get("password") != password:
        raise HTTPException(status_code=401, detail="Username atau password salah")
    return {
        "success": True,
        "user": {"id": user["id"], "name": user["name"], "phone": user["phone"], "createdAt": user["createdAt"]},
    }


# ========== SELLER ==========
@app.post("/api/sellers/register")
def register_seller(payload: Dict[str, Any]):
    required = ["username", "storeName", "email", "phone", "password", "confirmPassword"]
    if any(not payload.get(k) for k in required):
        raise HTTPException(status_code=400, detail="Semua field wajib diisi")
    if payload["password"] != payload["confirmPassword"]:
        raise HTTPException(status_code=400, detail="Password tidak cocok")

    sellers = read_json(SELLERS_FILE, [])
    if any(s.get("username") == payload["username"] for s in sellers):
        raise HTTPException(status_code=400, detail="Username sudah digunakan")
    if any(s.get("email") == payload["email"] for s in sellers):
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    seller = {
        "id": new_id(),
        "username": payload["username"],
        "storeName": payload["storeName"],
        "email": payload["email"],
        "phone": payload["phone"],
        "password": payload["password"],
        "createdAt": datetime.utcnow().isoformat(),
    }
    sellers.append(seller)
    write_json(SELLERS_FILE, sellers)

    default_package = {
        "id": new_id(),
        "sellerId": seller["id"],
        "storeName": seller["storeName"],
        "location": "",
        "category": "",
        "price": 0,
        "originalValue": 0,
        "available": 0,
        "pickupTime": "",
        "description": "",
        "image": "",
        "createdAt": datetime.utcnow().isoformat(),
    }
    write_packages_file(seller["id"], [default_package])

    return {
        "success": True,
        "seller": {
          "id": seller["id"],
          "username": seller["username"],
          "storeName": seller["storeName"],
          "email": seller["email"],
          "phone": seller["phone"],
          "createdAt": seller["createdAt"],
        },
    }


@app.post("/api/sellers/login")
def login_seller(payload: Dict[str, Any]):
    username = payload.get("username")
    password = payload.get("password")
    sellers = read_json(SELLERS_FILE, [])
    seller = next((s for s in sellers if s.get("username") == username), None)
    if not seller or seller.get("password") != password:
        raise HTTPException(status_code=401, detail="Username atau password salah")
    return {
        "success": True,
        "seller": {
            "id": seller["id"],
            "username": seller["username"],
            "storeName": seller["storeName"],
            "email": seller["email"],
            "phone": seller["phone"],
            "createdAt": seller["createdAt"],
        },
    }


@app.get("/api/sellers/{seller_id}/packages")
def get_seller_packages(seller_id: str):
    return read_packages_file(seller_id)


@app.put("/api/sellers/{seller_id}/packages/{package_id}")
def update_seller_package(seller_id: str, package_id: str, payload: Dict[str, Any]):
    packages = read_packages_file(seller_id)
    idx = next((i for i, p in enumerate(packages) if p.get("id") == package_id), -1)
    if idx == -1:
        raise HTTPException(status_code=404, detail="Package tidak ditemukan")
    packages[idx] = {**packages[idx], **payload}
    write_packages_file(seller_id, packages)
    return {"success": True, "package": packages[idx]}


@app.get("/api/packages/{package_id}/reviews")
def get_package_reviews(package_id: str):
    reviews = read_json(REVIEWS_FILE, [])
    return [r for r in reviews if r.get("packageId") == package_id]


@app.post("/api/packages/{package_id}/reviews")
def create_package_review(package_id: str, payload: Dict[str, Any]):
    name = payload.get("name")
    rating = payload.get("rating")
    comment = payload.get("comment")
    seller_id_payload = payload.get("sellerId")
    if not name or rating is None or not comment:
        raise HTTPException(status_code=400, detail="name, rating, dan comment wajib diisi")

    try:
        numeric_rating = int(rating)
    except Exception:
        raise HTTPException(status_code=400, detail="rating harus 1-5")
    if numeric_rating < 1 or numeric_rating > 5:
        raise HTTPException(status_code=400, detail="rating harus 1-5")

    seller_id = seller_id_payload or find_seller_id_by_package_id(package_id)

    reviews = read_json(REVIEWS_FILE, [])
    new_review = {
        "id": new_id(),
        "packageId": package_id,
        "sellerId": seller_id,
        "name": name,
        "rating": numeric_rating,
        "comment": comment,
        "createdAt": datetime.utcnow().isoformat(),
    }
    reviews.append(new_review)
    write_json(REVIEWS_FILE, reviews)
    return {"success": True, "review": new_review}


@app.get("/api/sellers/{seller_id}/reviews")
def get_seller_reviews(seller_id: str):
    reviews = read_json(REVIEWS_FILE, [])
    return [r for r in reviews if r.get("sellerId") == seller_id]


@app.put("/api/sellers/{seller_id}/profile")
def update_seller_profile(seller_id: str, payload: Dict[str, Any]):
    sellers = read_json(SELLERS_FILE, [])
    idx = next((i for i, s in enumerate(sellers) if s.get("id") == seller_id), -1)
    if idx == -1:
        raise HTTPException(status_code=404, detail="Seller tidak ditemukan")
    sellers[idx] = {**sellers[idx], **payload}
    write_json(SELLERS_FILE, sellers)
    return {"success": True, "seller": sellers[idx]}


@app.delete("/api/sellers/{seller_id}")
def delete_seller_account(seller_id: str):
    sellers = read_json(SELLERS_FILE, [])
    filtered = [s for s in sellers if s.get("id") != seller_id]
    write_json(SELLERS_FILE, filtered)

    package_file = os.path.join(PACKAGES_DIR, f"{seller_id}.json")
    if os.path.exists(package_file):
        os.remove(package_file)

    return {"success": True}


@app.get("/api/sellers")
def get_all_sellers():
    sellers = read_json(SELLERS_FILE, [])
    safe = []
    for s in sellers:
        copy = {k: v for k, v in s.items() if k != "password"}
        safe.append(copy)
    return safe


if __name__ == "__main__":
    port = int(os.getenv("PORT", "7860"))
    uvicorn.run("api:app", host="0.0.0.0", port=port)
