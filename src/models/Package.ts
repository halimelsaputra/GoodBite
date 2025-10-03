/**
 * Package Model - OOP Class
 * Represents a package/product entity with encapsulation and business logic
 */
export class Package {
  private _id: string;
  private _storeName: string;
  private _location: string;
  private _category: string;
  private _price: number;
  private _originalValue: number;
  private _available: number;
  private _pickupTime: string;
  private _description: string;
  private _image: string;

  constructor(data: PackageData) {
    this._id = data.id;
    this._storeName = data.storeName;
    this._location = data.location;
    this._category = data.category;
    this._price = data.price;
    this._originalValue = data.originalValue;
    this._available = data.available;
    this._pickupTime = data.pickupTime;
    this._description = data.description;
    this._image = data.image;
  }

  // Getters (Encapsulation)
  get id(): string {
    return this._id;
  }

  get storeName(): string {
    return this._storeName;
  }

  get location(): string {
    return this._location;
  }

  get category(): string {
    return this._category;
  }

  get price(): number {
    return this._price;
  }

  get originalValue(): number {
    return this._originalValue;
  }

  get available(): number {
    return this._available;
  }

  get pickupTime(): string {
    return this._pickupTime;
  }

  get description(): string {
    return this._description;
  }

  get image(): string {
    return this._image;
  }

  // Business Logic Methods
  public isAvailable(): boolean {
    return this._available > 0;
  }

  public calculateDiscount(): number {
    return this._originalValue - this._price;
  }

  public calculateDiscountPercentage(): number {
    return Math.round((this.calculateDiscount() / this._originalValue) * 100);
  }

  public getFormattedPrice(): string {
    return `Rp ${this._price.toLocaleString('id-ID')}`;
  }

  public getFormattedOriginalValue(): string {
    return `Rp ${this._originalValue.toLocaleString('id-ID')}`;
  }

  public decreaseAvailability(): boolean {
    if (this._available > 0) {
      this._available--;
      return true;
    }
    return false;
  }

  public increaseAvailability(): void {
    this._available++;
  }

  // Convert to plain object
  public toJSON(): PackageJSON {
    return {
      id: this._id,
      storeName: this._storeName,
      location: this._location,
      category: this._category,
      price: this._price,
      originalValue: this._originalValue,
      available: this._available,
      pickupTime: this._pickupTime,
      description: this._description,
      image: this._image
    };
  }

  // Create Package instance from plain object
  public static fromJSON(json: PackageJSON): Package {
    return new Package(json);
  }
}

// Type definitions
export interface PackageData {
  id: string;
  storeName: string;
  location: string;
  category: string;
  price: number;
  originalValue: number;
  available: number;
  pickupTime: string;
  description: string;
  image: string;
}

export interface PackageJSON {
  id: string;
  storeName: string;
  location: string;
  category: string;
  price: number;
  originalValue: number;
  available: number;
  pickupTime: string;
  description: string;
  image: string;
}
