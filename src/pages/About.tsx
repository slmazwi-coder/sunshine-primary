import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">About Our School</h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            Sunshine Primary School is a leading independent educational institution in Matatiele, dedicated to fostering a love for learning and academic excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission & Vision</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Our Mission</h3>
                <p className="text-slate-600">
                  To provide a high-quality, inclusive education that empowers learners to reach their full potential and become responsible, compassionate citizens.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Our Vision</h3>
                <p className="text-slate-600">
                  To be the preferred primary school in the Eastern Cape, known for academic integrity, innovation, and a vibrant school community.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop"
              alt="Classroom"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Principal Section */}
        <section className="bg-slate-50 rounded-3xl p-8 md:p-12 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
                  alt="Principal Mr MM Mbobo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <span className="text-primary font-bold uppercase tracking-wider text-sm">Message from the Principal</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">Mr MM Mbobo</h2>
              <blockquote className="text-lg text-slate-700 italic border-l-4 border-primary pl-6 py-2 mb-6">
                "At Sunshine Primary, we believe that every child has a unique light. Our role is to provide the environment and guidance to help that light shine brightest. We are more than just a school; we are a family dedicated to the future of our children."
              </blockquote>
              <p className="text-slate-600">
                Mr Mbobo has led Sunshine Primary with a vision of excellence and community integration. Under his leadership, the school has grown in both size and reputation, maintaining a focus on individual learner progress and staff development.
              </p>
            </div>
          </div>
        </section>

        {/* School History/Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Independent Status</h3>
              <p className="text-sm text-slate-600">
                As an independent school, we have the flexibility to implement innovative teaching methods while adhering to national curriculum standards.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Matatiele Community</h3>
              <p className="text-sm text-slate-600">
                Deeply rooted in the Matatiele community, we take pride in our local heritage and the diverse backgrounds of our learners.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Grade 1 - 7</h3>
              <p className="text-sm text-slate-600">
                Our comprehensive primary education prepares learners for the transition to high school with confidence and a strong academic foundation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
