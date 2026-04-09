import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, CreditCard, ShoppingBag, LogOut, Search, Filter, Download, CheckCircle2, Clock, AlertCircle, Loader2, Eye, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useFirebase } from '../components/FirebaseProvider';
import { format } from 'date-fns';

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useFirebase();
  const [applications, setApplications] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    setLoading(true);
    
    // Subscribe to Applications
    const qApps = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'));
    const unsubApps = onSnapshot(qApps, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'applications'));

    // Subscribe to Payments
    const qPayments = query(collection(db, 'payments'), orderBy('submittedAt', 'desc'));
    const unsubPayments = onSnapshot(qPayments, (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'payments'));

    // Subscribe to Orders
    const qOrders = query(collection(db, 'orders'), orderBy('submittedAt', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));

    return () => {
      unsubApps();
      unsubPayments();
      unsubOrders();
    };
  }, [isAdmin]);

  const updateStatus = async (collectionName: string, id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, collectionName, id), { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${id}`);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'MMM dd, yyyy');
  };

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="mx-auto text-destructive mb-4" size={48} />
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You do not have administrator privileges. Please contact the school office if you believe this is an error.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/">Return to Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredApps = applications.filter(app => 
    app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.parentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Welcome back, {user?.displayName || 'Administrator'}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <a href="/">View Site</a>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="applications" className="space-y-8">
          <TabsList className="bg-white border p-1 h-12">
            <TabsTrigger value="applications" className="px-6">
              <Users className="mr-2" size={16} /> Applications
            </TabsTrigger>
            <TabsTrigger value="payments" className="px-6">
              <CreditCard className="mr-2" size={16} /> Payments
            </TabsTrigger>
            <TabsTrigger value="shop" className="px-6">
              <ShoppingBag className="mr-2" size={16} /> Shop Orders
            </TabsTrigger>
          </TabsList>

          {/* Applications Module */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Admissions Applications</CardTitle>
                    <CardDescription>Manage and review student applications.</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input 
                        placeholder="Search students..." 
                        className="pl-9" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon"><Filter size={18} /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Parent</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApps.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-slate-400">No applications found</TableCell>
                        </TableRow>
                      ) : (
                        filteredApps.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.studentName}</TableCell>
                            <TableCell>{app.grade}</TableCell>
                            <TableCell>{app.parentName}</TableCell>
                            <TableCell>{formatDate(app.submittedAt)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className={
                                  app.status === 'Accepted' ? 'bg-green-100 text-green-700' : 
                                  app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                                  'bg-blue-100 text-blue-700'
                                }
                              >
                                {app.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" title="Accept" onClick={() => updateStatus('applications', app.id, 'Accepted')}>
                                  <Check className="text-green-600" size={18} />
                                </Button>
                                <Button variant="ghost" size="icon" title="Reject" onClick={() => updateStatus('applications', app.id, 'Rejected')}>
                                  <X className="text-red-600" size={18} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Module */}
          <TabsContent value="payments">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-xl text-green-600"><CheckCircle2 size={24} /></div>
                    <div>
                      <p className="text-sm text-slate-500">Verified Payments</p>
                      <p className="text-2xl font-bold">R {payments.filter(p => p.status === 'Verified').reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><Clock size={24} /></div>
                    <div>
                      <p className="text-sm text-slate-500">Pending Verification</p>
                      <p className="text-2xl font-bold">R {payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><LayoutDashboard size={24} /></div>
                    <div>
                      <p className="text-sm text-slate-500">Total Submissions</p>
                      <p className="text-2xl font-bold">{payments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Fee Payments Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-slate-400">No payments found</TableCell>
                      </TableRow>
                    ) : (
                      payments.map((pay) => (
                        <TableRow key={pay.id}>
                          <TableCell className="font-medium">{pay.studentName}</TableCell>
                          <TableCell>{pay.paymentRef}</TableCell>
                          <TableCell>R {pay.amount?.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(pay.submittedAt)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="secondary" 
                              className={pay.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                            >
                              {pay.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => updateStatus('payments', pay.id, 'Verified')}>Verify</Button>
                              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => updateStatus('payments', pay.id, 'Rejected')}>Reject</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shop Orders Module */}
          <TabsContent value="shop">
            <Card>
              <CardHeader>
                <CardTitle>Uniform Shop Orders</CardTitle>
                <CardDescription>Manage order requests from parents.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parent</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                          <ShoppingBag className="mx-auto mb-4 opacity-20" size={48} />
                          <p>No active order requests at the moment.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.parentName}</TableCell>
                          <TableCell>
                            <div className="text-xs">
                              {order.items?.map((item: any, i: number) => (
                                <div key={i}>{item.quantity}x {item.name}</div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>R {order.total?.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(order.submittedAt)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => updateStatus('orders', order.id, 'Completed')}>Complete</Button>
                              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => updateStatus('orders', order.id, 'Cancelled')}>Cancel</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
