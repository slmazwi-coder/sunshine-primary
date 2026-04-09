import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const news = [
  {
    id: '1',
    title: 'Welcome Back: Term 1 2026',
    date: 'Jan 15, 2026',
    excerpt: 'We are excited to welcome all our learners and staff back for the new academic year. Let’s make it a year of growth and success!',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Grade 7 Leadership Camp',
    date: 'Feb 02, 2026',
    excerpt: 'Our Grade 7 learners recently attended a leadership camp focused on teamwork, responsibility, and preparing for high school.',
    image: 'https://images.unsplash.com/photo-1526726538690-5cbf95642cb0?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Annual Sports Day Announcement',
    date: 'Feb 10, 2026',
    excerpt: 'Get ready for our annual sports day! Join us for a day of fun, competition, and school spirit on March 15th.',
    image: 'https://images.unsplash.com/photo-1461896756985-214652a61f91?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'New Science Lab Inauguration',
    date: 'Feb 20, 2026',
    excerpt: 'We are proud to announce the opening of our state-of-the-art science lab, enhancing the learning experience for our senior grades.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop'
  }
];

export default function News() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Latest News & Events</h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            Stay updated with the latest happenings, achievements, and upcoming events at Sunshine Primary School.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col md:flex-row border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="md:w-3/5 flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                      <Calendar size={14} />
                      {item.date}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6">
                      {item.excerpt}
                    </p>
                    <Button variant="link" className="p-0 text-primary font-bold group-hover:gap-2 transition-all">
                      Read More <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <section className="mt-20 bg-slate-50 rounded-3xl p-8 md:p-12 text-center border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Subscribe to our Newsletter</h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            Get the latest school news and announcements delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button className="h-12 px-8">Subscribe</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
