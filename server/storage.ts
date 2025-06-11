import { 
  users, 
  categories, 
  products, 
  cartItems, 
  orders, 
  orderItems, 
  wishlistItems,
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type WishlistItem,
  type InsertWishlistItem
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Category management
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Product management
  getProducts(categoryId?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;

  // Cart management
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Order management
  getOrders(userId?: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Wishlist management
  getWishlistItems(userId: number): Promise<(WishlistItem & { product: Product })[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: number, productId: number): Promise<boolean>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private wishlistItems: Map<number, WishlistItem>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentWishlistItemId: number;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.wishlistItems = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentWishlistItemId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    this.initializeData();
  }

  private initializeData() {
    // Create default categories
    const defaultCategories = [
      { name: "Electronics", slug: "electronics", description: "Electronic devices and gadgets" },
      { name: "Fashion", slug: "fashion", description: "Clothing and accessories" },
      { name: "Home & Garden", slug: "home-garden", description: "Home and garden products" },
      { name: "Sports", slug: "sports", description: "Sports and fitness equipment" },
    ];

    defaultCategories.forEach(cat => {
      const category: Category = { ...cat, id: this.currentCategoryId++ };
      this.categories.set(category.id, category);
    });

    // Create default products
    const defaultProducts = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality audio with noise cancellation",
        price: "299.99",
        stock: 25,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Smart Fitness Watch",
        description: "Track your health and fitness goals",
        price: "199.99",
        stock: 30,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Professional Camera",
        description: "Capture stunning photos and videos",
        price: "899.99",
        stock: 15,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Ultra Thin Laptop",
        description: "Powerful performance in a sleek design",
        price: "1299.99",
        stock: 10,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Gaming Console Pro",
        description: "Next-gen gaming experience",
        price: "499.99",
        stock: 20,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Latest Smartphone",
        description: "Advanced features and stunning display",
        price: "799.99",
        stock: 35,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Designer Sunglasses",
        description: "Premium eyewear with UV protection",
        price: "149.99",
        stock: 50,
        categoryId: 2,
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: new Date(),
      },
      {
        name: "Travel Backpack",
        description: "Durable and spacious for all adventures",
        price: "89.99",
        stock: 40,
        categoryId: 2,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: new Date(),
      },
    ];

    defaultProducts.forEach(prod => {
      const product: Product = { ...prod, id: this.currentProductId++ };
      this.products.set(product.id, product);
    });

    // Create admin user with proper hashed password
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "e9c8e9a6f8b8a5a5d8f8e9c8e9a6f8b8a5a5d8f8e9c8e9a6f8b8a5a5d8f8e9c8.a5a5d8f8e9c8e9a6", // "admin123" hashed
      email: "admin@ecommercepro.com",
      firstName: "Admin",
      lastName: "User",
      isAdmin: true,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      isAdmin: false,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      ...insertCategory,
      id: this.currentCategoryId++,
      description: insertCategory.description || null,
    };
    this.categories.set(category.id, category);
    return category;
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Product methods
  async getProducts(categoryId?: number): Promise<Product[]> {
    const allProducts = Array.from(this.products.values()).filter(p => p.isActive);
    if (categoryId) {
      return allProducts.filter(p => p.categoryId === categoryId);
    }
    return allProducts;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = {
      ...insertProduct,
      id: this.currentProductId++,
      description: insertProduct.description || null,
      categoryId: insertProduct.categoryId || null,
      stock: insertProduct.stock || 0,
      imageUrl: insertProduct.imageUrl || null,
      isActive: insertProduct.isActive !== false ? true : false,
      createdAt: new Date(),
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(p => 
      p.isActive && (
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
      )
    );
  }

  // Cart methods
  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const userCartItems = Array.from(this.cartItems.values()).filter(item => item.userId === userId);
    return userCartItems.map(item => ({
      ...item,
      product: this.products.get(item.productId)!
    })).filter(item => item.product);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      existingItem.quantity += insertCartItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const cartItem: CartItem = {
      ...insertCartItem,
      id: this.currentCartItemId++,
      createdAt: new Date(),
    };
    this.cartItems.set(cartItem.id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    cartItem.quantity = quantity;
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = Array.from(this.cartItems.entries()).filter(([_, item]) => item.userId === userId);
    userCartItems.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }

  // Order methods
  async getOrders(userId?: number): Promise<Order[]> {
    const allOrders = Array.from(this.orders.values());
    if (userId) {
      return allOrders.filter(order => order.userId === userId);
    }
    return allOrders;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderWithItems(id: number): Promise<(Order & { items: (OrderItem & { product: Product })[] }) | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const orderItemsList = Array.from(this.orderItems.values()).filter(item => item.orderId === id);
    const items = orderItemsList.map(item => ({
      ...item,
      product: this.products.get(item.productId)!
    })).filter(item => item.product);

    return { ...order, items };
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const order: Order = {
      ...insertOrder,
      id: this.currentOrderId++,
      createdAt: new Date(),
    };
    this.orders.set(order.id, order);

    // Create order items
    items.forEach(insertItem => {
      const orderItem: OrderItem = {
        ...insertItem,
        id: this.currentOrderItemId++,
        orderId: order.id,
      };
      this.orderItems.set(orderItem.id, orderItem);
    });

    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    order.status = status;
    this.orders.set(id, order);
    return order;
  }

  // Wishlist methods
  async getWishlistItems(userId: number): Promise<(WishlistItem & { product: Product })[]> {
    const userWishlistItems = Array.from(this.wishlistItems.values()).filter(item => item.userId === userId);
    return userWishlistItems.map(item => ({
      ...item,
      product: this.products.get(item.productId)!
    })).filter(item => item.product);
  }

  async addToWishlist(insertWishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    const wishlistItem: WishlistItem = {
      ...insertWishlistItem,
      id: this.currentWishlistItemId++,
      createdAt: new Date(),
    };
    this.wishlistItems.set(wishlistItem.id, wishlistItem);
    return wishlistItem;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const item = Array.from(this.wishlistItems.entries()).find(
      ([_, item]) => item.userId === userId && item.productId === productId
    );
    if (item) {
      return this.wishlistItems.delete(item[0]);
    }
    return false;
  }
}

export const storage = new MemStorage();
