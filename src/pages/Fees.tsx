import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Download, Info, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '../components/FirebaseProvider';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function Fees() {
  const { user } = useFirebase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    paymentRef: '',
    amount: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error('Failed to login');
    }
  };

  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit proof of payment');
      return;
    }

    setIsSubmitting(true);
    const path = 'payments';
    try {
      await addDoc(collection(db, path), {
        studentName: formData.studentName,
        paymentRef: formData.paymentRef,
        amount: parseFloat(formData.amount) || 0,
        parentUid: user.uid,
        status: 'Pending',
        submittedAt: serverTimestamp(),
      });
      toast.success('Proof of payment uploaded successfully! Our admin will verify it shortly.');
      setFormData({ studentName: '', paymentRef: '', amount: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">School Fees</h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            We strive to keep our fees competitive while maintaining high standards of education and facilities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Fee Structure */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure 2026</CardTitle>
                <CardDescription>Annual and monthly breakdown for all grades.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grade</TableHead>
                      <TableHead>Annual Fee</TableHead>
                      <TableHead>Monthly (11 Months)</TableHead>
                      <TableHead>Registration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { grade: 'Grade 1 - 3', annual: 'R 18,500', monthly: 'R 1,680', reg: 'R 1,500' },
                      { grade: 'Grade 4 - 6', annual: 'R 20,200', monthly: 'R 1,835', reg: 'R 1,500' },
                      { grade: 'Grade 7', annual: 'R 22,000', monthly: 'R 2,000', reg: 'R 1,500' },
                    ].map((row) => (
                      <TableRow key={row.grade}>
                        <TableCell className="font-medium">{row.grade}</TableCell>
                        <TableCell>{row.annual}</TableCell>
                        <TableCell>{row.monthly}</TableCell>
                        <TableCell>{row.reg}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                  <Info className="text-amber-600 shrink-0" size={20} />
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> A 5% discount applies if the full annual fee is paid before 31 January 2026.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Details */}
          <div className="space-y-8">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={20} /> Banking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs opacity-70 uppercase tracking-wider">Bank</span>
                  <p className="font-bold">First National Bank (FNB)</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs opacity-70 uppercase tracking-wider">Account Name</span>
                  <p className="font-bold">Sunshine Primary School</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs opacity-70 uppercase tracking-wider">Account Number</span>
                  <p className="font-bold">6284 9302 112</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs opacity-70 uppercase tracking-wider">Branch Code</span>
                  <p className="font-bold">210521</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs opacity-70 uppercase tracking-wider">Reference</span>
                  <p className="font-bold">Student Name & Grade</p>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full h-12">
              <Download className="mr-2" size={18} /> Download Fee Schedule (PDF)
            </Button>
          </div>
        </div>

        {/* Proof of Payment Upload */}
        <section className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Submit Proof of Payment</CardTitle>
              <CardDescription>Already made a payment? Upload details here for verification.</CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-4">You must be logged in to submit proof of payment.</p>
                  <Button onClick={handleLogin}>Login with Google</Button>
                </div>
              ) : (
                <form onSubmit={handleUploadProof} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Full Name</Label>
                      <Input id="studentName" required placeholder="Enter student name" value={formData.studentName} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentRef">Payment Reference</Label>
                      <Input id="paymentRef" required placeholder="e.g. John Doe Gr3" value={formData.paymentRef} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount Paid (R)</Label>
                    <Input id="amount" type="number" required placeholder="e.g. 1680" value={formData.amount} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proof">Upload Receipt (PDF/Image)</Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Input id="proof" type="file" className="hidden" />
                      <Label htmlFor="proof" className="cursor-pointer flex flex-col items-center">
                        <Download className="text-slate-400 mb-2" size={24} />
                        <span className="text-sm text-slate-600">Click to select file (Optional for demo)</span>
                      </Label>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 animate-spin" /> Uploading...</> : 'Upload Proof of Payment'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
