import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sun, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { GoogleGenAI } from '@google/genai';

const SCHOOL_INFO = `
School Name: Sunshine Primary School
Location: No 7 Leach Lane, Matatiele, 4730, Eastern Cape, South Africa
Phone: 039 737 3324
Email: sunshine501590@gmail.com
Type: Independent / Private Primary School
Grades: Grade 1 to Grade 7
Classes: Two classes per grade (A and B)
Principal: Mr MM Mbobo
Stats: ± 260+ learners and ± 15+ educators
Admissions: Online application available on the website. Required docs: Birth certificate, ID, Report, Proof of residence, Clinic card.
Fees: Grade 1-3 (R18,500/year), Grade 4-6 (R20,200/year), Grade 7 (R22,000/year). 5% discount if paid by Jan 31.
Uniform Shop: Available on website for order requests.
`;

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hello! I am the Sunshine Primary assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: `You are a helpful assistant for Sunshine Primary School. Use the following information to answer questions: ${SCHOOL_INFO}. Be polite, professional, and concise. If you don't know the answer, ask the user to contact the school office at 039 737 3324.`
        }
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.text || "I'm sorry, I couldn't process that request." }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting right now. Please try again later or call us directly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl border-primary/20">
              <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sun size={20} /> Sunshine Assistant
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                    <X size={20} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-slate-100 text-slate-900 rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none">
                          <Loader2 className="animate-spin text-primary" size={16} />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t bg-white">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                  >
                    <Input 
                      placeholder="Ask a question..." 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                      <Send size={18} />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        size="icon" 
        className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </Button>
    </div>
  );
}
