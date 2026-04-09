import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Facebook, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We will get back to you as soon as possible.');
  };

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            Have questions? We're here to help. Reach out to us via phone, email, or visit our campus in Matatiele.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              {[
                { icon: MapPin, title: 'Physical Address', content: 'No 7 Leach Lane, Matatiele, 4730' },
                { icon: Phone, title: 'Phone Number', content: '039 737 3324' },
                { icon: Mail, title: 'Email Address', content: 'sunshine501590@gmail.com' },
                { icon: Clock, title: 'Office Hours', content: 'Mon - Fri: 08:00 - 15:00' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-600">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="bg-slate-900 text-white border-none">
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm mb-6">Stay connected with our school community on social media.</p>
                <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  <a href="https://www.facebook.com/p/Sunshine-Primary-School-100054347539686/" target="_blank" rel="noreferrer">
                    <Facebook className="mr-2" size={18} /> Facebook Page
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input id="name" required placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" required placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" required placeholder="Write your message here..." className="min-h-[150px]" />
                  </div>
                  <Button type="submit" className="w-full h-12 text-lg">
                    Send Message <Send className="ml-2" size={18} />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-20 rounded-3xl overflow-hidden h-[400px] bg-slate-100 relative border border-slate-200">
           <div className="absolute inset-0 flex items-center justify-center text-slate-400 flex-col gap-2">
            <MapPin size={48} />
            <p className="font-bold">Google Maps Integration</p>
            <p className="text-sm">No 7 Leach Lane, Matatiele, 4730</p>
            <Button asChild variant="outline" className="mt-4">
              <a href="https://www.google.com/maps/search/No+7+Leach+Lane,+Matatiele,+4730" target="_blank" rel="noreferrer">
                Open in Google Maps
              </a>
            </Button>
          </div>
          {/* In a real app, you'd use an iframe or a map library here */}
        </div>
      </div>
    </div>
  );
}
