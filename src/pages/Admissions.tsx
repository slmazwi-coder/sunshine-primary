import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Upload, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { db, auth, storage, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '../components/FirebaseProvider';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const applicationYear = 2027;

type UploadKey =
  | 'birthCertificate'
  | 'latestReport'
  | 'parentId'
  | 'proofOfResidence'
  | 'immunizationRecord'
  | 'transferLetter';

const uploadLabels: { key: UploadKey; label: string; required?: boolean }[] = [
  { key: 'birthCertificate', label: 'Certified copy of Learner’s Birth Certificate', required: true },
  { key: 'latestReport', label: 'Latest School Report', required: true },
  { key: 'parentId', label: 'Copy of Parent/Guardian ID', required: true },
  { key: 'proofOfResidence', label: 'Proof of Residence', required: true },
  { key: 'immunizationRecord', label: 'Immunization Record (Clinic Card)', required: false },
  { key: 'transferLetter', label: 'Transfer Letter (if applicable)', required: false },
];

export default function Admissions() {
  const { user } = useFirebase();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    grade: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
  });

  const [uploads, setUploads] = useState<Partial<Record<UploadKey, File | null>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGradeChange = (value: string) => {
    setFormData({ ...formData, grade: value });
  };

  const handleFileChange =
    (key: UploadKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setUploads((prev) => ({ ...prev, [key]: file }));
    };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error('Failed to login');
    }
  };

  const uploadDocuments = async (refNum: string) => {
    const results: Record<string, { name: string; url: string; path: string; type: string; size: number }> = {};

    for (const item of uploadLabels) {
      const file = uploads[item.key];
      if (!file) {
        if (item.required) throw new Error(`Missing required document: ${item.label}`);
        continue;
      }

      const safeName = file.name.replace(/\s+/g, '_');
      const path = `applications/${applicationYear}/${refNum}/${item.key}/${Date.now()}_${safeName}`;
      const fileRef = storageRef(storage, path);

      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      results[item.key] = {
        name: file.name,
        url,
        path,
        type: file.type,
        size: file.size,
      };
    }

    return results;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    const path = 'applications';
    const refNum = `SUN-${applicationYear}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    try {
      // Upload files first, then save doc URLs in Firestore
      const documentUploads = await uploadDocuments(refNum);

      await addDoc(collection(db, path), {
        applicationYear,
        studentName: `${formData.firstName} ${formData.lastName}`,
        grade: formData.grade,
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        address: formData.address,
        dob: formData.dob,
        parentUid: user?.uid || 'anonymous',
        status: 'Received',
        submittedAt: serverTimestamp(),
        referenceNumber: refNum,
        documents: documentUploads,
      });

      setReferenceNumber(refNum);
      setStep(3);
      toast.success('Application submitted successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Admissions</h1>
          <p className="text-slate-600">Online applications are now open for {applicationYear}.</p>
        </motion.div>

        {/* Steps Indicator */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10" />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                step >= s ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > s ? <CheckCircle2 size={20} /> : s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Admission Requirements</CardTitle>
                <CardDescription>Please ensure you have the following documents ready before applying.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {uploadLabels.map((doc) => (
                    <li key={doc.key} className="flex items-center gap-3 text-slate-700">
                      <CheckCircle2 className="text-green-500" size={18} />
                      {doc.label}
                      {doc.required ? <span className="text-xs text-slate-500">(required)</span> : null}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => setStep(2)} className="w-full mt-6">
                  Start Online Application
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {!user && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Login recommended</CardTitle>
                  <CardDescription>
                    Logging in helps us link your application to your account. You can still apply without logging in.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button type="button" variant="outline" onClick={handleLogin} className="w-full">
                    Continue with Google
                  </Button>
                </CardContent>
              </Card>
            )}

            <form onSubmit={handleSubmit}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      required
                      placeholder="Enter student's first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      required
                      placeholder="Enter student's last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" required value={formData.dob} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Applying for Grade</Label>
                    <Select required onValueChange={handleGradeChange} value={formData.grade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                          <SelectItem key={g} value={`Grade ${g}`}>
                            Grade {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Parent/Guardian Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Full Name</Label>
                    <Input
                      id="parentName"
                      required
                      placeholder="Enter parent's full name"
                      value={formData.parentName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentEmail">Email Address</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">Phone Number</Label>
                    <Input
                      id="parentPhone"
                      type="tel"
                      required
                      placeholder="012 345 6789"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Physical Address</Label>
                    <Input
                      id="address"
                      required
                      placeholder="Enter home address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Upload supporting documents</CardTitle>
                  <CardDescription>Uploads are accepted as PDF or images. Please upload clear, readable copies.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {uploadLabels.map((doc) => (
                    <div key={doc.key} className="space-y-2">
                      <Label htmlFor={doc.key}>
                        {doc.label} {doc.required ? '(required)' : '(optional)'}
                      </Label>
                      <Input
                        id={doc.key}
                        type="file"
                        accept="application/pdf,image/*"
                        required={doc.required}
                        onChange={handleFileChange(doc.key)}
                      />
                      {uploads[doc.key] ? (
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <Upload size={14} /> {uploads[doc.key]?.name}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" size={18} /> Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Received!</h2>
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 inline-block">
              <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Your Reference Number</p>
              <p className="text-2xl font-mono font-bold text-primary">{referenceNumber}</p>
            </div>
            <p className="text-slate-600 mb-8">
              Thank you for applying to Sunshine Primary School. We have received your application and will contact you shortly.
            </p>
            <Button asChild nativeButton={false}>
              <a href="/">Return to Home</a>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
