import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Premium Products at Your Fingertips
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover amazing deals on thousands of products with fast shipping and secure checkout.
            </p>
            <Button 
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100"
              onClick={scrollToProducts}
            >
              Shop Now
            </Button>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern e-commerce shopping experience" 
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
