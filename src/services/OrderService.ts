import { Order, OrderData, OrderJSON } from "@/models/Order";

/**
 * OrderService - OOP Service Class (Singleton Pattern)
 * Handles all order-related business logic and data persistence
 * Orders are stored per user to maintain session isolation
 */
export class OrderService {
  private static instance: OrderService;
  private orders: Order[] = [];
  private readonly STORAGE_KEY_PREFIX = "goodbite_orders_";
  private currentUserPhone: string = "";

  // Private constructor for Singleton pattern
  private constructor() {
    this.setCurrentUser();
    this.loadOrders();
  }

  // Singleton getInstance method
  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * Set current user from localStorage
   */
  private setCurrentUser(): void {
    try {
      const userData = localStorage.getItem("goodbite_user");
      if (userData) {
        const user = JSON.parse(userData);
        this.currentUserPhone = user.phone || "";
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      this.currentUserPhone = "";
    }
  }

  /**
   * Get storage key for current user
   */
  private getStorageKey(): string {
    return this.STORAGE_KEY_PREFIX + this.currentUserPhone;
  }

  /**
   * Load orders from localStorage for current user
   */
  private loadOrders(): void {
    try {
      if (!this.currentUserPhone) {
        this.orders = [];
        return;
      }
      
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        const ordersJSON: OrderJSON[] = JSON.parse(stored);
        this.orders = ordersJSON.map(json => Order.fromJSON(json));
      } else {
        this.orders = [];
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      this.orders = [];
    }
  }

  /**
   * Save orders to localStorage for current user
   */
  private saveOrders(): void {
    try {
      if (!this.currentUserPhone) {
        console.error("No user logged in, cannot save orders");
        return;
      }
      
      const ordersJSON = this.orders.map(order => order.toJSON());
      localStorage.setItem(this.getStorageKey(), JSON.stringify(ordersJSON));
    } catch (error) {
      console.error("Error saving orders:", error);
    }
  }

  /**
   * Switch to a different user and load their orders
   * Call this when user logs in or switches account
   */
  public switchUser(userPhone: string): void {
    this.currentUserPhone = userPhone;
    this.loadOrders();
  }

  /**
   * Clear current user session
   * Call this when user logs out
   */
  public clearUserSession(): void {
    this.currentUserPhone = "";
    this.orders = [];
  }

  /**
   * Create a new order
   */
  public createOrder(orderData: OrderData): Order {
    const newOrder = new Order(orderData);
    this.orders.push(newOrder);
    this.saveOrders();
    return newOrder;
  }

  /**
   * Get order by ID
   */
  public getOrderById(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  /**
   * Get all orders
   */
  public getAllOrders(): Order[] {
    return [...this.orders]; // Return copy to prevent external modification
  }

  /**
   * Refresh orders from localStorage
   * Useful when orders might have been updated externally
   */
  public refreshOrders(): void {
    this.loadOrders();
  }

  /**
   * Get orders by status
   */
  public getOrdersByStatus(status: "pending" | "picked" | "expired"): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  /**
   * Get pending orders
   */
  public getPendingOrders(): Order[] {
    return this.orders.filter(order => order.isPending());
  }

  /**
   * Get picked orders
   */
  public getPickedOrders(): Order[] {
    return this.orders.filter(order => order.isPicked());
  }

  /**
   * Update order status to picked
   */
  public markOrderAsPicked(orderId: string): boolean {
    const order = this.getOrderById(orderId);
    if (order && order.isPending()) {
      order.markAsPicked();
      this.saveOrders();
      return true;
    }
    return false;
  }

  /**
   * Update order status to expired
   */
  public markOrderAsExpired(orderId: string): boolean {
    const order = this.getOrderById(orderId);
    if (order && order.isPending()) {
      order.markAsExpired();
      this.saveOrders();
      return true;
    }
    return false;
  }

  /**
   * Delete order by ID
   */
  public deleteOrder(orderId: string): boolean {
    const index = this.orders.findIndex(order => order.id === orderId);
    if (index !== -1) {
      this.orders.splice(index, 1);
      this.saveOrders();
      return true;
    }
    return false;
  }

  /**
   * Get total orders count
   */
  public getTotalOrdersCount(): number {
    return this.orders.length;
  }

  /**
   * Get total revenue from all orders
   */
  public getTotalRevenue(): number {
    return this.orders.reduce((total, order) => total + order.price, 0);
  }

  /**
   * Check if order exists
   */
  public orderExists(orderId: string): boolean {
    return this.orders.some(order => order.id === orderId);
  }

  /**
   * Clear all orders (for testing or reset)
   */
  public clearAllOrders(): void {
    this.orders = [];
    if (this.currentUserPhone) {
      localStorage.removeItem(this.getStorageKey());
    }
  }
}

// Export singleton instance
export const orderService = OrderService.getInstance();
