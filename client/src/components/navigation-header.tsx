import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCartSheet } from "./shopping-cart";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { 
  Search, 
  User, 
  Settings, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin,
  Truck,
  ShieldCheck,
  CreditCard,
  Star
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function NavigationHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  const { data: searchResults = [], isLoading: searchLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`, { 
        credentials: "include" 
      });
      if (!response.ok) return [];
      return response.json();
    },
    enabled: searchQuery.trim().length > 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation("/");
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-primary-600 text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>support@ecommercepro.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <Truck className="h-3 w-3" />
              <span>Free Shipping Over $50</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => setLocation("/")}
                className="flex items-center space-x-3 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow">
                  EP
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    EcommercePro
                  </h1>
                  <p className="text-xs text-gray-500">Premium Shopping Experience</p>
                </div>
              </button>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search for products, brands, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-16 py-3 text-lg border-2 border-gray-200 focus:border-primary-500 rounded-xl"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg"
                  >
                    Search
                  </Button>
                </div>
                
                {/* Search Results Dropdown */}
                {searchQuery.trim().length > 2 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-2 max-h-96 overflow-y-auto z-50">
                    {searchLoading ? (
                      <div className="p-4 text-center text-gray-500">Searching...</div>
                    ) : searchResults.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {searchResults.slice(0, 5).map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              setSearchQuery("");
                              setLocation(`/product/${product.id}`);
                            }}
                            className="w-full p-4 text-left hover:bg-gray-50 flex items-center space-x-3"
                          >
                            {product.imageUrl && (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-500">${product.price}</p>
                            </div>
                          </button>
                        ))}
                        {searchResults.length > 5 && (
                          <div className="p-3 text-center">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setLocation(`/search?q=${encodeURIComponent(searchQuery)}`)}
                            >
                              View all {searchResults.length} results
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">No products found</div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* User Account */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName || user.username}
                        </p>
                        <p className="text-xs text-gray-500">My Account</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <DropdownMenuItem onClick={() => setLocation("/admin")}>
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation("/auth")}
                    className="rounded-xl"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setLocation("/auth")}
                    className="rounded-xl"
                  >
                    Register
                  </Button>
                </div>
              )}
              
              {/* Shopping Cart */}
              <ShoppingCartSheet />
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <ShoppingCartSheet />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </form>

                    {/* Mobile Navigation Links */}
                    <div className="space-y-2">
                      {user ? (
                        <>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start" 
                            onClick={() => {
                              setLocation("/dashboard");
                              setMobileMenuOpen(false);
                            }}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Dashboard
                          </Button>
                          {user.isAdmin && (
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start" 
                              onClick={() => {
                                setLocation("/admin");
                                setMobileMenuOpen(false);
                              }}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Admin Panel
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start" 
                            onClick={handleLogout}
                            disabled={logoutMutation.isPending}
                          >
                            Logout
                          </Button>
                        </>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            setLocation("/auth");
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign In / Register
                        </Button>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>support@ecommercepro.com</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>24/7 Customer Support</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 pt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Truck className="h-4 w-4 text-green-600" />
                        <span>Free Shipping Over $50</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span>Premium Quality</span>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
