import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationHeader } from "@/components/navigation-header";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Order, WishlistItem, Product } from "@shared/schema";
import { User, Package, Heart, MapPin } from "lucide-react";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const { user } = useAuth();

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: wishlistItems = [] } = useQuery<(WishlistItem & { product: Product })[]>({
    queryKey: ["/api/wishlist"],
  });

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    username: user?.username || "",
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    console.log("Profile update:", profileForm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-2">
                  <Button
                    variant={activeSection === "profile" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection("profile")}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Button>
                  <Button
                    variant={activeSection === "orders" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection("orders")}
                  >
                    <Package className="h-4 w-4 mr-3" />
                    Orders
                  </Button>
                  <Button
                    variant={activeSection === "wishlist" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection("wishlist")}
                  >
                    <Heart className="h-4 w-4 mr-3" />
                    Wishlist
                  </Button>
                  <Button
                    variant={activeSection === "addresses" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection("addresses")}
                  >
                    <MapPin className="h-4 w-4 mr-3" />
                    Addresses
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="submit">Update Profile</Button>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {activeSection === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No orders found.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">Order #{order.id}</h4>
                              <p className="text-sm text-gray-600">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${order.total}</p>
                              <Badge 
                                variant={
                                  order.status === "completed" ? "default" :
                                  order.status === "processing" ? "secondary" :
                                  "outline"
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeSection === "wishlist" && (
              <Card>
                <CardHeader>
                  <CardTitle>Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  {wishlistItems.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Your wishlist is empty.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex items-center space-x-4">
                            {item.product.imageUrl && (
                              <img 
                                src={item.product.imageUrl} 
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">{item.product.description}</p>
                              <p className="font-semibold text-primary-600">${item.product.price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeSection === "addresses" && (
              <Card>
                <CardHeader>
                  <CardTitle>Saved Addresses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center py-8">No saved addresses found.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
