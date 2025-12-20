import { Package } from "@/models/Package";
import { AuthService } from "./AuthService";

/**
 * PackageService - OOP Service Class (Singleton Pattern)
 * Handles all package-related business logic
 */
export class PackageService {
  private static instance: PackageService;
  private packages: Package[] = [];

  // Private constructor for Singleton pattern
  private constructor() {}

  // Singleton getInstance method
  public static getInstance(): PackageService {
    if (!PackageService.instance) {
      PackageService.instance = new PackageService();
    }
    return PackageService.instance;
  }

  /**
   * Load all seller packages from API
   */
  private async loadSellerPackagesFromAPI(): Promise<Package[]> {
    const packages: Package[] = [];
    
    try {
      // Get all sellers from API
      const sellers = await AuthService.getAllSellers();
      
      // For each seller, load their packages
      for (const seller of sellers) {
        try {
          const sellerPackages = await AuthService.getSellerPackages(seller.id);
          sellerPackages.forEach((pkg: any) => {
            // Skip packages that are still empty/default (seller belum mengisi)
            const isFilled =
              pkg &&
              pkg.category &&
              pkg.location &&
              pkg.pickupTime &&
              pkg.description &&
              Number(pkg.price) > 0 &&
              Number(pkg.originalValue) > 0;

            if (!isFilled) return;

            packages.push(
              new Package({
                ...pkg,
                sellerId: pkg.sellerId || seller.id,
                image: pkg.image || "/api/placeholder/300/300",
              })
            );
          });
        } catch (error) {
          console.error(`Error loading packages for seller ${seller.id}:`, error);
        }
      }
    } catch (error) {
      console.error("Error loading sellers from API:", error);
    }

    return packages;
  }

  /**
   * Get package by ID
   */
  public async getPackageById(id: string): Promise<Package | undefined> {
    // Try to find in already loaded packages first
    let pkg = this.packages.find(p => p.id === id);
    if (pkg) return pkg;

    // If not found, load from API
    try {
      const sellerPackages = await this.loadSellerPackagesFromAPI();
      pkg = sellerPackages.find(p => p.id === id);
      if (pkg) {
        this.packages.push(pkg);
      }
      return pkg;
    } catch (error) {
      console.error("Error getting package by ID from API:", error);
      return undefined;
    }
  }

  /**
   * Get all packages
   */
  public async getAllPackages(): Promise<Package[]> {
    try {
      // Start with whatever packages are already loaded
      const allPackages = [...this.packages];
      
      // Load seller packages from API
      const sellerPackages = await this.loadSellerPackagesFromAPI();
      
      // Merge and deduplicate
      const mergedPackages = allPackages.concat(
        sellerPackages.filter(sp => !allPackages.some(ap => ap.id === sp.id))
      );
      
      this.packages = mergedPackages;
      return [...mergedPackages]; // Return copy
    } catch (error) {
      console.error("Error getting all packages:", error);
      return [...this.packages]; // Return current packages on error
    }
  }

  /**
   * Get available packages only
   */
  public async getAvailablePackages(): Promise<Package[]> {
    const packages = await this.getAllPackages();
    return packages.filter(pkg => pkg.isAvailable());
  }

  /**
   * Get packages by category
   */
  public async getPackagesByCategory(category: string): Promise<Package[]> {
    const packages = await this.getAllPackages();
    return packages.filter(pkg => 
      pkg.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get packages by location
   */
  public async getPackagesByLocation(location: string): Promise<Package[]> {
    const packages = await this.getAllPackages();
    return packages.filter(pkg => 
      pkg.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  /**
   * Search packages by store name or description
   */
  public async searchPackages(query: string): Promise<Package[]> {
    const packages = await this.getAllPackages();
    const lowerQuery = query.toLowerCase();
    return packages.filter(pkg => 
      pkg.storeName.toLowerCase().includes(lowerQuery) ||
      pkg.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get packages sorted by price (ascending)
   */
  public getPackagesSortedByPrice(ascending: boolean = true): Package[] {
    const sorted = [...this.packages].sort((a, b) => 
      ascending ? a.price - b.price : b.price - a.price
    );
    return sorted;
  }

  /**
   * Get packages sorted by discount percentage
   */
  public getPackagesSortedByDiscount(): Package[] {
    return [...this.packages].sort((a, b) => 
      b.calculateDiscountPercentage() - a.calculateDiscountPercentage()
    );
  }

  /**
   * Get featured packages (highest discount)
   */
  public getFeaturedPackages(limit: number = 3): Package[] {
    return this.getPackagesSortedByDiscount().slice(0, limit);
  }

  /**
   * Decrease package availability
   */
  public decreasePackageAvailability(packageId: string): boolean {
    const pkg = this.getPackageById(packageId);
    if (pkg) {
      return pkg.decreaseAvailability();
    }
    return false;
  }

  /**
   * Increase package availability
   */
  public increasePackageAvailability(packageId: string): boolean {
    const pkg = this.getPackageById(packageId);
    if (pkg) {
      pkg.increaseAvailability();
      return true;
    }
    return false;
  }

  /**
   * Get total packages count
   */
  public getTotalPackagesCount(): number {
    return this.packages.length;
  }

  /**
   * Get available packages count
   */
  public getAvailablePackagesCount(): number {
    return this.getAvailablePackages().length;
  }

  /**
   * Check if package exists and is available
   */
  public isPackageAvailable(packageId: string): boolean {
    const pkg = this.getPackageById(packageId);
    return pkg ? pkg.isAvailable() : false;
  }

  /**
   * Get all unique categories
   */
  public getAllCategories(): string[] {
    const categories = this.packages.map(pkg => pkg.category);
    return [...new Set(categories)];
  }

  /**
   * Get all unique locations
   */
  public getAllLocations(): string[] {
    const locations = this.packages.map(pkg => pkg.location);
    return [...new Set(locations)];
  }
}

// Export singleton instance
export const packageService = PackageService.getInstance();
