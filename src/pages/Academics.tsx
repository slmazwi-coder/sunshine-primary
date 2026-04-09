import { motion } from 'motion/react';
import { BookOpen, Users, Music, Trophy, Palette, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Academics() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Academic Excellence</h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            Our curriculum is designed to challenge and inspire. We offer a balanced approach that covers core subjects and a wide range of extracurricular activities.
          </p>
        </motion.div>

        {/* Grades Overview */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Grades 1 – 7</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { grade: 'Grade 1 & 2', focus: 'Foundational Literacy & Numeracy', icon: BookOpen },
              { grade: 'Grade 3 & 4', focus: 'Developing Critical Thinking', icon: Users },
              { grade: 'Grade 5 & 6', focus: 'Advanced Subject Mastery', icon: Code },
              { grade: 'Grade 7', focus: 'High School Readiness', icon: Trophy },
            ].map((item, i) => (
              <Card key={item.grade} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <item.icon className="text-primary mb-2" size={24} />
                  <CardTitle>{item.grade}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm">{item.focus}</p>
                  <p className="text-xs text-slate-400 mt-2">Classes: A & B per grade</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Curriculum Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Curriculum</h2>
            <p className="text-slate-600 mb-6">
              We follow the CAPS curriculum as a baseline, enriched with independent school standards to ensure our learners are globally competitive.
            </p>
            <ul className="space-y-4">
              {[
                'English Home Language',
                'Afrikaans/isiXhosa First Additional Language',
                'Mathematics',
                'Natural Sciences & Technology',
                'Social Sciences (History & Geography)',
                'Life Skills & Physical Education',
                'Creative Arts'
              ].map((subject) => (
                <li key={subject} className="flex items-center gap-3 text-slate-700">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  {subject}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Class Structure</h2>
            <p className="text-slate-600 mb-4">
              To maintain high standards of teaching, we limit class sizes and provide two classes per grade:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <span className="font-bold text-primary block">Class A</span>
                <span className="text-sm text-slate-500">Focused learning environment</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <span className="font-bold text-primary block">Class B</span>
                <span className="text-sm text-slate-500">Collaborative learning space</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-6 italic">
              * Classes are balanced based on academic and social needs.
            </p>
          </div>
        </div>

        {/* Activities */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Extracurricular Activities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[
              { name: 'Soccer', icon: Trophy },
              { name: 'Netball', icon: Trophy },
              { name: 'Choir', icon: Music },
              { name: 'Drama', icon: Palette },
              { name: 'Chess', icon: Code },
              { name: 'Debating', icon: Users },
              { name: 'Art Club', icon: Palette },
              { name: 'Athletics', icon: Trophy },
            ].map((activity) => (
              <div key={activity.name} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <activity.icon size={28} />
                </div>
                <span className="font-bold text-slate-900">{activity.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
