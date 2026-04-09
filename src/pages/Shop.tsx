import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Minus, X, CheckCircle2, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { toast } from 'sonner';
import { Product, CartItem } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '../components/FirebaseProvider';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const products: Product[] = [
  { id: '1', name: 'School Blazer', price: 450, category: 'Uniform', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop', description: 'Navy blue blazer with school crest.' },
  { id: '2', name: 'White Shirt (Short Sleeve)', price: 120, category: 'Uniform', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', description: 'Cotton blend white short-sleeve shirt.' },
  { id: '3', name: 'School Tie', price: 85, category: 'Uniform', image: 'https://images.unsplash.com/photo-1589756823851-ede1be674188?q=80&w=1000&auto=format&fit=crop', description: 'Striped navy and amber school tie.' },
  { id: '4', name: 'Grey Trousers', price: 220, category: 'Uniform', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop', description: 'Durable grey school trousers.' },
  { id: '5', name: 'Tracksuit Top', price: 350, category: 'Sportswear', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1000&auto=format&fit=crop', description: 'Warm tracksuit top for sports activities.' },
  { id: '6', name: 'School Backpack', price: 280, category: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop', description: 'Ergonomic backpack with school logo.' },
];

export default function Shop() {
  const { user, userProfile } = useFirebase();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error('Failed to login');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to place an order request');
      return;
    }

    setIsSubmitting(true);
    const path = 'orders';
    try {
      await addDoc(collection(db, path), {
        parentName: userProfile?.name || user.displayName || 'Parent',
        parentPhone: '', // Could be added to profile later
        items: cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        total: total,
        parentUid: user.uid,
        status: 'Pending',
        submittedAt: serverTimestamp(),
      });
      toast.success('Order request sent! Our shop admin will contact you for payment and collection.');
      setCart([]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">School Shop</h1>
            <p className="text-slate-600">Official Sunshine Primary School uniforms and accessories.</p>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button className="relative h-12 px-6">
                <ShoppingCart className="mr-2" size={20} />
                Cart
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white border-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingBag size={20} /> Your Cart
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto py-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag className="mx-auto text-slate-200 mb-4" size={64} />
                    <p className="text-slate-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{item.name}</h4>
                          <p className="text-sm text-slate-500">R {item.price}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, -1)}>
                              <Minus size={14} />
                            </Button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, 1)}>
                              <Plus size={14} />
                            </Button>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                          <X size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <SheetFooter className="border-t pt-6 flex-col gap-4">
                  <div className="flex justify-between items-center w-full mb-4">
                    <span className="text-slate-600">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">R {total}</span>
                  </div>
                  {!user ? (
                    <Button className="w-full h-12" onClick={handleLogin}>Login to Order</Button>
                  ) : (
                    <Button className="w-full h-12 text-lg" onClick={handleCheckout} disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="mr-2 animate-spin" /> Processing...</> : 'Place Order Request'}
                    </Button>
                  )}
                  <p className="text-xs text-center text-slate-400">
                    This is an order request. You will be contacted for payment and collection details.
                  </p>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden group border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 backdrop-blur-sm border-none">
                    {product.category}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <span className="font-bold text-primary text-lg">R {product.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => addToCart(product)}>
                    <Plus className="mr-2" size={18} /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Floating Cart Button for Mobile/Convenience */}
        <div className="fixed bottom-24 right-6 z-40 md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="w-14 h-14 rounded-full shadow-lg relative">
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white border-white">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingBag size={20} /> Your Cart
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto py-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag className="mx-auto text-slate-200 mb-4" size={64} />
                    <p className="text-slate-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{item.name}</h4>
                          <p className="text-sm text-slate-500">R {item.price}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, -1)}>
                              <Minus size={14} />
                            </Button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, 1)}>
                              <Plus size={14} />
                            </Button>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                          <X size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <SheetFooter className="border-t pt-6 flex-col gap-4">
                  <div className="flex justify-between items-center w-full mb-4">
                    <span className="text-slate-600">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">R {total}</span>
                  </div>
                  {!user ? (
                    <Button className="w-full h-12" onClick={handleLogin}>Login to Order</Button>
                  ) : (
                    <Button className="w-full h-12 text-lg" onClick={handleCheckout} disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="mr-2 animate-spin" /> Processing...</> : 'Place Order Request'}
                    </Button>
                  )}
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Info Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">How to Order</h3>
            <p className="text-sm text-slate-600">Add items to your cart and submit an order request. Our shop manager will contact you to finalize the purchase.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Collection</h3>
            <p className="text-sm text-slate-600">Orders can be collected from the school admin office during school hours (08:00 - 15:00).</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-2">Returns Policy</h3>
            <p className="text-sm text-slate-600">Items can be exchanged within 7 days of collection if they are in original condition with tags attached.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
