import { Package, PackageData, PackageJSON } from "@/models/Package";
import { packages as packagesData } from "@/data/packages";

/**
 * PackageService - OOP Service Class (Singleton Pattern)
 * Handles all package-related business logic
 */
export class PackageService {
  private static instance: PackageService;
  private packages: Package[] = [];

  // Private constructor for Singleton pattern
  private constructor() {
    this.initializePackages();
  }

  // Singleton getInstance method
  public static getInstance(): PackageService {
    if (!PackageService.instance) {
      PackageService.instance = new PackageService();
    }
    return PackageService.instance;
  }

  /**
   * Initialize packages from data
   */
  private initializePackages(): void {
    this.packages = packagesData.map(pkg => new Package(pkg));
  }

  /**
   * Get package by ID
   */
  public getPackageById(id: string): Package | undefined {
    return this.packages.find(pkg => pkg.id === id);
  }

  /**
   * Get all packages
   */
  public getAllPackages(): Package[] {
    return [...this.packages]; // Return copy to prevent external modification
  }

  /**
   * Get available packages only
   */
  public getAvailablePackages(): Package[] {
    return this.packages.filter(pkg => pkg.isAvailable());
  }

  /**
   * Get packages by category
   */
  public getPackagesByCategory(category: string): Package[] {
    return this.packages.filter(pkg => 
      pkg.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get packages by location
   */
  public getPackagesByLocation(location: string): Package[] {
    return this.packages.filter(pkg => 
      pkg.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  /**
   * Search packages by store name or description
   */
  public searchPackages(query: string): Package[] {
    const lowerQuery = query.toLowerCase();
    return this.packages.filter(pkg => 
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
