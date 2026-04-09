import { motion } from 'motion/react';
import { FileText, Download, ExternalLink, ShieldCheck, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const documents = [
  { id: '1', title: 'School Prospectus 2026', category: 'General', date: '2025-11-15', size: '2.4 MB' },
  { id: '2', title: 'Code of Conduct', category: 'Policy', date: '2025-10-20', size: '1.1 MB' },
  { id: '3', title: 'Admission Policy', category: 'Policy', date: '2025-10-20', size: '0.8 MB' },
  { id: '4', title: 'Term 1 Calendar 2026', category: 'Circular', date: '2026-01-10', size: '0.5 MB' },
  { id: '5', title: 'Uniform Requirements', category: 'General', date: '2025-12-05', size: '1.5 MB' },
  { id: '6', title: 'Stationery List Grade 1-3', category: 'General', date: '2025-12-05', size: '0.9 MB' },
  { id: '7', title: 'Stationery List Grade 4-7', category: 'General', date: '2025-12-05', size: '0.9 MB' },
  { id: '8', title: 'POPI Act Compliance', category: 'Policy', date: '2025-09-12', size: '1.2 MB' },
];

export default function Documents() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Documents & Policies</h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            Access important school documents, policies, and circulars. All files are available in PDF format.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col hover:border-primary transition-colors group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
                      {doc.category}
                    </Badge>
                    <span className="text-xs text-slate-400">{doc.date}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {doc.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                    <FileText size={16} />
                    <span>PDF Document • {doc.size}</span>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-all">
                    <Download className="mr-2" size={18} /> Download
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Security/Trust Section */}
        <div className="mt-20 p-8 bg-slate-900 text-white rounded-3xl flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white/10 p-4 rounded-2xl">
            <ShieldCheck size={48} className="text-primary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">Secure Document Access</h3>
            <p className="text-slate-400 text-sm">
              All documents are verified and scanned for security. If you have trouble accessing any file, please contact the school administration office.
            </p>
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Contact Admin <ExternalLink className="ml-2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
