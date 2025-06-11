import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: wishlistItems = [] } = useQuery({
    queryKey: ["/api/wishlist"],
    enabled: !!user,
  });

  const isInWishlist = wishlistItems.some((item: any) => item.productId === product.id);

  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      if (isInWishlist) {
        await apiRequest("DELETE", `/api/wishlist/${product.id}`);
      } else {
        await apiRequest("POST", "/api/wishlist", { productId: product.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: `${product.name} has been ${isInWishlist ? "removed from" : "added to"} your wishlist.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    addToCart(product.id, 1);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }
    toggleWishlistMutation.mutate();
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden rounded-t-lg">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Button 
            size="sm"
            variant="secondary"
            className="rounded-full p-2 bg-white/80 hover:bg-white"
            onClick={handleToggleWishlist}
            disabled={toggleWishlistMutation.isPending}
          >
            <Heart 
              className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">${product.price}</span>
          <Button onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-orange-600 text-sm mt-2">Only {product.stock} left in stock!</p>
        )}
        {product.stock === 0 && (
          <p className="text-red-600 text-sm mt-2">Out of stock</p>
        )}
      </CardContent>
    </Card>
  );
}
