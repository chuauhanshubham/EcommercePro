import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ArrowRight, Star, Truck, Shield, CreditCard, Users, Award, CheckCircle } from "lucide-react";

export function HeroSection() {
  const [, setLocation] = useLocation();
  
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { icon: Truck, text: "Free Shipping", subtext: "On orders over $50" },
    { icon: Shield, text: "Secure Payment", subtext: "256-bit SSL encryption" },
    { icon: CreditCard, text: "Easy Returns", subtext: "30-day return policy" },
    { icon: Award, text: "Premium Quality", subtext: "Carefully curated products" }
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "10K+", label: "Products" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "Rating" }
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex items-center space-x-2">
              <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 text-sm font-medium">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                Trusted by 50,000+ customers
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Premium Products
                <span className="block text-blue-100">at Your Fingertips</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-lg">
                Discover amazing deals on thousands of carefully curated products with lightning-fast shipping and secure checkout.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={scrollToProducts}
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl backdrop-blur-sm"
                onClick={() => setLocation("/auth")}
              >
                Join Free
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold">{stat.number}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative">
            {/* Main Product Showcase */}
            <div className="relative bg-white/10 rounded-3xl p-8 backdrop-blur-sm border border-white/20 shadow-2xl">
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 rounded-full px-4 py-2 text-sm font-bold shadow-lg">
                Hot Deal!
              </div>
              
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Premium Shopping Experience" 
                className="rounded-2xl shadow-xl w-full h-64 lg:h-80 object-cover"
              />
              
              {/* Floating Product Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl max-w-48">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" 
                    alt="Product" 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-gray-900 font-medium text-sm">Premium Headphones</p>
                    <p className="text-primary-600 font-bold">$299.99</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl max-w-48">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" 
                    alt="Product" 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-gray-900 font-medium text-sm">Smart Watch</p>
                    <p className="text-primary-600 font-bold">$199.99</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 lg:mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.text}</h3>
                    <p className="text-blue-200 text-sm">{feature.subtext}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <p className="text-blue-200 mb-6">Trusted by leading brands worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {/* Brand placeholders - in real app these would be actual brand logos */}
            <div className="bg-white/20 rounded-lg px-6 py-3 text-white font-bold">BRAND</div>
            <div className="bg-white/20 rounded-lg px-6 py-3 text-white font-bold">TECH</div>
            <div className="bg-white/20 rounded-lg px-6 py-3 text-white font-bold">STORE</div>
            <div className="bg-white/20 rounded-lg px-6 py-3 text-white font-bold">SHOP</div>
          </div>
        </div>
      </div>
    </section>
  );
}
