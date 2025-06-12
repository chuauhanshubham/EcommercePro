// server/index.ts
import dotenv from "dotenv";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var MemStorage = class {
  users;
  categories;
  products;
  cartItems;
  orders;
  orderItems;
  wishlistItems;
  reviews;
  currentUserId;
  currentCategoryId;
  currentProductId;
  currentCartItemId;
  currentOrderId;
  currentOrderItemId;
  currentWishlistItemId;
  currentReviewId;
  sessionStore;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.categories = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.cartItems = /* @__PURE__ */ new Map();
    this.orders = /* @__PURE__ */ new Map();
    this.orderItems = /* @__PURE__ */ new Map();
    this.wishlistItems = /* @__PURE__ */ new Map();
    this.reviews = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentWishlistItemId = 1;
    this.currentReviewId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
    });
    this.initializeData();
  }
  initializeData() {
    const defaultCategories = [
      { name: "Electronics", slug: "electronics", description: "Electronic devices and gadgets" },
      { name: "Fashion", slug: "fashion", description: "Clothing and accessories" },
      { name: "Home & Garden", slug: "home-garden", description: "Home and garden products" },
      { name: "Sports", slug: "sports", description: "Sports and fitness equipment" }
    ];
    defaultCategories.forEach((cat) => {
      const category = { ...cat, id: this.currentCategoryId++ };
      this.categories.set(category.id, category);
    });
    const defaultProducts = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality audio with noise cancellation",
        price: "299.99",
        stock: 25,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        name: "Smart Fitness Watch",
        description: "Track your health and fitness goals",
        price: "199.99",
        stock: 30,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        name: "Professional Camera",
        description: "Capture stunning photos and videos",
        price: "899.99",
        stock: 15,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        name: "Ultra Thin Laptop",
        description: "Powerful performance in a sleek design",
        price: "1299.99",
        stock: 10,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        name: "Gaming Console Pro",
        description: "Next-gen gaming experience",
        price: "499.99",
        stock: 20,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        name: "Latest Smartphone",
        description: "Advanced features and stunning display",
        price: "799.99",
        stock: 35,
        categoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        name: "Designer Sunglasses",
        description: "Premium eyewear with UV protection",
        price: "149.99",
        stock: 50,
        categoryId: 2,
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        name: "Travel Backpack",
        description: "Durable and spacious for all adventures",
        price: "89.99",
        stock: 40,
        categoryId: 2,
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    defaultProducts.forEach((prod) => {
      const product = { ...prod, id: this.currentProductId++ };
      this.products.set(product.id, product);
    });
    const adminUser = {
      id: this.currentUserId++,
      username: "admin",
      password: "cbbbf1862930477113be700bfcc97d8dc53078290c9edf88242643b51e279e34f0cb43fd12bc072d6e984e745adefb4d1ca03c21b3e3811c32f2e0112bed3f43.1a0f04199b3dc42427d56c7a5503b883",
      // "admin123" properly hashed
      email: "admin@ecommercepro.com",
      firstName: "Admin",
      lastName: "User",
      isAdmin: true,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(adminUser.id, adminUser);
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }
  async createUser(insertUser) {
    const user = {
      ...insertUser,
      id: this.currentUserId++,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      isAdmin: false,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(user.id, user);
    return user;
  }
  async updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Category methods
  async getCategories() {
    return Array.from(this.categories.values());
  }
  async getCategory(id) {
    return this.categories.get(id);
  }
  async createCategory(insertCategory) {
    const category = {
      ...insertCategory,
      id: this.currentCategoryId++,
      description: insertCategory.description || null
    };
    this.categories.set(category.id, category);
    return category;
  }
  async updateCategory(id, updates) {
    const category = this.categories.get(id);
    if (!category) return void 0;
    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  async deleteCategory(id) {
    return this.categories.delete(id);
  }
  // Product methods
  async getProducts(categoryId) {
    const allProducts = Array.from(this.products.values()).filter((p) => p.isActive);
    if (categoryId) {
      return allProducts.filter((p) => p.categoryId === categoryId);
    }
    return allProducts;
  }
  async getProduct(id) {
    return this.products.get(id);
  }
  async createProduct(insertProduct) {
    const product = {
      ...insertProduct,
      id: this.currentProductId++,
      description: insertProduct.description || null,
      categoryId: insertProduct.categoryId || null,
      stock: insertProduct.stock || 0,
      imageUrl: insertProduct.imageUrl || null,
      isActive: insertProduct.isActive !== false ? true : false,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.products.set(product.id, product);
    return product;
  }
  async updateProduct(id, updates) {
    const product = this.products.get(id);
    if (!product) return void 0;
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  async deleteProduct(id) {
    return this.products.delete(id);
  }
  async searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (p) => p.isActive && (p.name.toLowerCase().includes(lowerQuery) || p.description?.toLowerCase().includes(lowerQuery))
    );
  }
  // Cart methods
  async getCartItems(userId) {
    const userCartItems = Array.from(this.cartItems.values()).filter((item) => item.userId === userId);
    return userCartItems.map((item) => ({
      ...item,
      product: this.products.get(item.productId)
    })).filter((item) => item.product);
  }
  async addToCart(insertCartItem) {
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
    );
    if (existingItem) {
      existingItem.quantity += insertCartItem.quantity || 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }
    const cartItem = {
      ...insertCartItem,
      id: this.currentCartItemId++,
      quantity: insertCartItem.quantity || 1,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.cartItems.set(cartItem.id, cartItem);
    return cartItem;
  }
  async updateCartItem(id, quantity) {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return void 0;
    cartItem.quantity = quantity;
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  async removeFromCart(id) {
    return this.cartItems.delete(id);
  }
  async clearCart(userId) {
    const userCartItems = Array.from(this.cartItems.entries()).filter(([_, item]) => item.userId === userId);
    userCartItems.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }
  // Order methods
  async getOrders(userId) {
    const allOrders = Array.from(this.orders.values());
    if (userId) {
      return allOrders.filter((order) => order.userId === userId);
    }
    return allOrders;
  }
  async getOrder(id) {
    return this.orders.get(id);
  }
  async getOrderWithItems(id) {
    const order = this.orders.get(id);
    if (!order) return void 0;
    const orderItemsList = Array.from(this.orderItems.values()).filter((item) => item.orderId === id);
    const items = orderItemsList.map((item) => ({
      ...item,
      product: this.products.get(item.productId)
    })).filter((item) => item.product);
    return { ...order, items };
  }
  async createOrder(insertOrder, items) {
    const order = {
      ...insertOrder,
      id: this.currentOrderId++,
      status: insertOrder.status || "pending",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.orders.set(order.id, order);
    items.forEach((insertItem) => {
      const orderItem = {
        ...insertItem,
        id: this.currentOrderItemId++,
        orderId: order.id
      };
      this.orderItems.set(orderItem.id, orderItem);
    });
    return order;
  }
  async updateOrderStatus(id, status) {
    const order = this.orders.get(id);
    if (!order) return void 0;
    order.status = status;
    this.orders.set(id, order);
    return order;
  }
  // Wishlist methods
  async getWishlistItems(userId) {
    const userWishlistItems = Array.from(this.wishlistItems.values()).filter((item) => item.userId === userId);
    return userWishlistItems.map((item) => ({
      ...item,
      product: this.products.get(item.productId)
    })).filter((item) => item.product);
  }
  async addToWishlist(insertWishlistItem) {
    const wishlistItem = {
      ...insertWishlistItem,
      id: this.currentWishlistItemId++,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.wishlistItems.set(wishlistItem.id, wishlistItem);
    return wishlistItem;
  }
  async removeFromWishlist(userId, productId) {
    const item = Array.from(this.wishlistItems.entries()).find(
      ([_, item2]) => item2.userId === userId && item2.productId === productId
    );
    if (item) {
      return this.wishlistItems.delete(item[0]);
    }
    return false;
  }
};
var storage = new MemStorage();

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
var sessionSettings = {
  secret: process.env.SESSION_SECRET,
  // <-- આ લાઇનમાં `!` છે, જેનો અર્થ છે એ જરૂર છે
  resave: false,
  saveUninitialized: false,
  store: storage.sessionStore
};
async function comparePasswords(supplied, stored) {
  const parts = stored.split(".");
  if (parts.length !== 2) {
    return false;
  }
  const [hashed, salt] = parts;
  if (!hashed || !salt) {
    return false;
  }
  try {
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = await scryptAsync(supplied, salt, 64);
    if (hashedBuf.length !== suppliedBuf.length) {
      return false;
    }
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    return false;
  }
}
function setupAuth(app2) {
  const sessionSettings2 = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings2));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password)
    });
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description")
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  categoryId: integer("category_id").references(() => categories.id),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  shippingAddress: text("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull()
});
var wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true
});
var insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});
var insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({
  id: true,
  createdAt: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.post("/api/categories", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : void 0;
      const products2 = await storage.getProducts(categoryId);
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/search", async (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    try {
      const products2 = await storage.searchProducts(query);
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });
  app2.put("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const product = await storage.updateProduct(id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Failed to update product" });
    }
  });
  app2.delete("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.get("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const cartItems2 = await storage.getCartItems(req.user.id);
      res.json(cartItems2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });
  app2.post("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });
  app2.put("/api/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to update cart item" });
    }
  });
  app2.delete("/api/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.removeFromCart(id);
      if (!deleted) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });
  app2.delete("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      await storage.clearCart(req.user.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const orders2 = req.user?.isAdmin ? await storage.getOrders() : await storage.getOrders(req.user.id);
      res.json(orders2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrderWithItems(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      if (!req.user?.isAdmin && order.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const { order, items } = req.body;
      const validatedOrder = insertOrderSchema.parse({
        ...order,
        userId: req.user.id
      });
      const createdOrder = await storage.createOrder(validatedOrder, items);
      await storage.clearCart(req.user.id);
      res.status(201).json(createdOrder);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });
  app2.put("/api/orders/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to update order status" });
    }
  });
  app2.get("/api/wishlist", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const wishlistItems2 = await storage.getWishlistItems(req.user.id);
      res.json(wishlistItems2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });
  app2.post("/api/wishlist", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const { productId } = req.body;
      const wishlistItem = await storage.addToWishlist({
        userId: req.user.id,
        productId
      });
      res.status(201).json(wishlistItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to add to wishlist" });
    }
  });
  app2.delete("/api/wishlist/:productId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const productId = parseInt(req.params.productId);
      const deleted = await storage.removeFromWishlist(req.user.id, productId);
      if (!deleted) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });
  app2.get("/api/admin/stats", async (req, res) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const products2 = await storage.getProducts();
      const orders2 = await storage.getOrders();
      const categories2 = await storage.getCategories();
      const totalRevenue = orders2.reduce((sum, order) => sum + parseFloat(order.total), 0);
      res.json({
        totalProducts: products2.length,
        totalOrders: orders2.length,
        totalCategories: categories2.length,
        revenue: totalRevenue.toFixed(2),
        totalCustomers: new Set(orders2.map((o) => o.userId)).size
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });
  app2.post("/api/payment/process", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    try {
      const { amount, paymentMethod, cardDetails } = req.body;
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      const paymentResult = {
        success: true,
        transactionId: `txn_${Date.now()}`,
        amount,
        paymentMethod,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      res.json(paymentResult);
    } catch (error) {
      res.status(500).json({ message: "Payment processing failed" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = Number(process.env.PORT) || 5e3;
  app.listen(port, "0.0.0.0", () => {
    console.log(`\u2705 Server is running on port ${port}`);
  });
})();
