/**
 * Order Model - OOP Class
 * Represents an order entity with encapsulation and business logic
 */
export class Order {
  private _id: string;
  private _packageId: string;
  private _storeName: string;
  private _location: string;
  private _price: number;
  private _pickupTime: string;
  private _orderTime: string;
  private _status: "pending" | "picked" | "expired";
  private _confirmationCode: string;
  private _customerName: string;
  private _customerPhone: string;

  constructor(data: OrderData) {
    this._id = data.id || this.generateId();
    this._packageId = data.packageId;
    this._storeName = data.storeName;
    this._location = data.location;
    this._price = data.price;
    this._pickupTime = data.pickupTime;
    this._orderTime = data.orderTime || new Date().toISOString();
    this._status = data.status || "pending";
    this._confirmationCode = data.confirmationCode || this.generateConfirmationCode();
    this._customerName = data.customerName;
    this._customerPhone = data.customerPhone;
  }

  // Getters (Encapsulation)
  get id(): string {
    return this._id;
  }

  get packageId(): string {
    return this._packageId;
  }

  get storeName(): string {
    return this._storeName;
  }

  get location(): string {
    return this._location;
  }

  get price(): number {
    return this._price;
  }

  get pickupTime(): string {
    return this._pickupTime;
  }

  get orderTime(): string {
    return this._orderTime;
  }

  get status(): "pending" | "picked" | "expired" {
    return this._status;
  }

  get confirmationCode(): string {
    return this._confirmationCode;
  }

  get customerName(): string {
    return this._customerName;
  }

  get customerPhone(): string {
    return this._customerPhone;
  }

  // Business Logic Methods
  public isExpired(): boolean {
    return this._status === "expired";
  }

  public isPending(): boolean {
    return this._status === "pending";
  }

  public isPicked(): boolean {
    return this._status === "picked";
  }

  public markAsPicked(): void {
    if (this._status === "pending") {
      this._status = "picked";
    }
  }

  public markAsExpired(): void {
    if (this._status === "pending") {
      this._status = "expired";
    }
  }

  public getFormattedPrice(): string {
    return `Rp ${this._price.toLocaleString('id-ID')}`;
  }

  public getFormattedOrderTime(): string {
    return new Date(this._orderTime).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Private helper methods
  private generateId(): string {
    return Date.now().toString();
  }

  private generateConfirmationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Convert to plain object for storage/API
  public toJSON(): OrderJSON {
    return {
      id: this._id,
      packageId: this._packageId,
      storeName: this._storeName,
      location: this._location,
      price: this._price,
      pickupTime: this._pickupTime,
      orderTime: this._orderTime,
      status: this._status,
      confirmationCode: this._confirmationCode,
      customerName: this._customerName,
      customerPhone: this._customerPhone
    };
  }

  // Create Order instance from plain object
  public static fromJSON(json: OrderJSON): Order {
    return new Order(json);
  }
}

// Type definitions
export interface OrderData {
  id?: string;
  packageId: string;
  storeName: string;
  location: string;
  price: number;
  pickupTime: string;
  orderTime?: string;
  status?: "pending" | "picked" | "expired";
  confirmationCode?: string;
  customerName: string;
  customerPhone: string;
}

export interface OrderJSON {
  id: string;
  packageId: string;
  storeName: string;
  location: string;
  price: number;
  pickupTime: string;
  orderTime: string;
  status: "pending" | "picked" | "expired";
  confirmationCode: string;
  customerName: string;
  customerPhone: string;
}
