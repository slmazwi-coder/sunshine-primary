export interface AdmissionApplication {
  id: string;
  studentName: string;
  studentSurname: string;
  grade: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  status: 'Received' | 'In Review' | 'Missing Docs' | 'Accepted' | 'Waitlisted' | 'Rejected';
  submittedAt: any;
}

export interface Payment {
  id: string;
  studentName: string;
  grade: string;
  amount: number;
  date: any;
  reference: string;
  status: 'Pending' | 'Verified' | 'Failed';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Uniform' | 'Sportswear' | 'Accessories';
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: 'Letter' | 'Circular' | 'Policy';
  url: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
}
