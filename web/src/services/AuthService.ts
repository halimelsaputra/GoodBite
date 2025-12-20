const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7860/api';

// Safely parse JSON responses (handles HTML/error bodies gracefully)
const parseResponse = async (response: Response) => {
  const text = await response.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    // Non-JSON response (e.g., HTML error page)
    data = { error: text || response.statusText };
  }

  if (!response.ok) {
    throw new Error(data.error || response.statusText);
  }

  return data;
};

export const AuthService = {
  // =============== CUSTOMER ROUTES ===============
  
  async registerCustomer(data: {
    username: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) {
    const response = await fetch(`${API_URL}/customers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return parseResponse(response);
  },

  async loginCustomer(username: string, password: string) {
    const response = await fetch(`${API_URL}/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return parseResponse(response);
  },

  // =============== SELLER ROUTES ===============

  async registerSeller(data: {
    username: string;
    storeName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) {
    const response = await fetch(`${API_URL}/sellers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return parseResponse(response);
  },

  async loginSeller(username: string, password: string) {
    const response = await fetch(`${API_URL}/sellers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return parseResponse(response);
  },

  // =============== SELLER MANAGEMENT ===============

  async getSellerPackages(sellerId: string) {
    const response = await fetch(`${API_URL}/sellers/${sellerId}/packages`);
    if (!response.ok) throw new Error('Failed to fetch packages');
    return parseResponse(response);
  },

  async updatePackage(
    sellerId: string,
    packageId: string,
    data: any
  ) {
    const response = await fetch(
      `${API_URL}/sellers/${sellerId}/packages/${packageId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );
    return parseResponse(response);
  },

  async updateSellerProfile(sellerId: string, data: any) {
    const response = await fetch(`${API_URL}/sellers/${sellerId}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return parseResponse(response);
  },

  async deleteSellerAccount(sellerId: string) {
    const response = await fetch(`${API_URL}/sellers/${sellerId}`, {
      method: 'DELETE',
    });
    return parseResponse(response);
  },

  async getAllSellers() {
    const response = await fetch(`${API_URL}/sellers`);
    if (!response.ok) throw new Error('Failed to fetch sellers');
    return parseResponse(response);
  },

  async getPackageReviews(packageId: string) {
    const response = await fetch(`${API_URL}/packages/${packageId}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return parseResponse(response);
  },

  async createPackageReview(packageId: string, data: { name: string; rating: number; comment: string; sellerId?: string }) {
    const response = await fetch(`${API_URL}/packages/${packageId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return parseResponse(response);
  },

  async getSellerReviews(sellerId: string) {
    const response = await fetch(`${API_URL}/sellers/${sellerId}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return parseResponse(response);
  },
};
