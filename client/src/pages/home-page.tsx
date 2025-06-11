import { NavigationHeader } from "@/components/navigation-header";
import { HeroSection } from "@/components/hero-section";
import { CategoryGrid } from "@/components/category-grid";
import { ProductCard } from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("name");

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/products?categoryId=${selectedCategory}`
        : "/api/products";
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <main>
        <HeroSection />
        
        <CategoryGrid 
          categories={categories} 
          onCategorySelect={handleCategoryFilter}
        />
        
        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50" id="products">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                {selectedCategory ? "Filtered Products" : "Featured Products"}
              </h2>
              <div className="flex space-x-4">
                <select 
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                {selectedCategory && (
                  <button 
                    className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => handleCategoryFilter(null)}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">EcommercePro</h3>
              <p className="text-gray-300 mb-4">
                Your trusted partner for online shopping with quality products, competitive prices, and exceptional customer service.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 EcommercePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
