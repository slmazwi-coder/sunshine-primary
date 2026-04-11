import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, GraduationCap, Users, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1577896851231-70ef1460011e?q=80&w=2070&auto=format&fit=crop",
      alt: "School Building"
    },
    {
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=2070&auto=format&fit=crop",
      alt: "Students Learning"
    },
    {
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop",
      alt: "Classroom Activity"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={heroImages[currentImage].url}
              alt={heroImages[currentImage].alt}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Empowering Bright Minds for a <span className="text-white">Brighter Future</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Sunshine Primary School provides a nurturing and excellence-driven environment for learners from Grade 1 to Grade 7 in Matatiele.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8" nativeButton={false}>
                <Link to="/admissions">Apply Online <ArrowRight className="ml-2" size={20} /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-white/10 border-white/20 hover:bg-white/20 text-white" nativeButton={false}>
                <Link to="/contact">Visit Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Learners', value: '260+', icon: Users },
              { label: 'Educators', value: '15+', icon: GraduationCap },
              { label: 'Grades', value: '1 - 7', icon: BookOpen },
              { label: 'Excellence', value: '100%', icon: Award },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <stat.icon className="text-primary" size={32} />
                </div>
                <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
                <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Sunshine Primary?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We are committed to providing a holistic educational experience that balances academic rigor with personal growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality Education',
                desc: 'Small class sizes (A & B classes) ensure personalized attention for every learner.',
                icon: CheckCircle2
              },
              {
                title: 'Safe Environment',
                desc: 'A secure and welcoming campus where children feel safe to explore and learn.',
                icon: CheckCircle2
              },
              {
                title: 'Holistic Growth',
                desc: 'Beyond academics, we focus on character building, sports, and cultural activities.',
                icon: CheckCircle2
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
              >
                <item.icon className="text-primary mb-4" size={32} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to join the Sunshine family?</h2>
          <p className="text-lg mb-10 opacity-90 max-w-2xl mx-auto text-slate-300">
            Admissions for the upcoming academic year are now open. Apply online today to secure a place for your child.
          </p>
          <Button asChild size="lg" className="text-lg px-10" nativeButton={false}>
            <Link to="/admissions">Start Application</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
