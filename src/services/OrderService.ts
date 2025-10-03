import { Order, OrderData, OrderJSON } from "@/models/Order";

/**
 * OrderService - OOP Service Class (Singleton Pattern)
 * Handles all order-related business logic and data persistence
 */
export class OrderService {
  private static instance: OrderService;
  private orders: Order[] = [];
  private readonly STORAGE_KEY = "goodbite_orders";

  // Private constructor for Singleton pattern
  private constructor() {
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
   * Load orders from localStorage
   */
  private loadOrders(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const ordersJSON: OrderJSON[] = JSON.parse(stored);
        this.orders = ordersJSON.map(json => Order.fromJSON(json));
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      this.orders = [];
    }
  }

  /**
   * Save orders to localStorage
   */
  private saveOrders(): void {
    try {
      const ordersJSON = this.orders.map(order => order.toJSON());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ordersJSON));
    } catch (error) {
      console.error("Error saving orders:", error);
    }
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
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Export singleton instance
export const orderService = OrderService.getInstance();
