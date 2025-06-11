import { Category } from "@shared/schema";

interface CategoryGridProps {
  categories: Category[];
  onCategorySelect: (categoryId: number | null) => void;
}

export function CategoryGrid({ categories, onCategorySelect }: CategoryGridProps) {
  const categoryImages: Record<string, string> = {
    electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    fashion: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    "home-garden": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="group cursor-pointer"
              onClick={() => onCategorySelect(category.id)}
            >
              <img 
                src={categoryImages[category.slug] || categoryImages.electronics} 
                alt={category.name}
                className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform"
              />
              <h3 className="text-lg font-semibold text-center mt-4 group-hover:text-primary-600 transition-colors">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
