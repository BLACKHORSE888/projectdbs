import { Timestamp } from 'firebase/firestore';

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  createdAt?: Timestamp | Date | null;
}

export interface NutritionInfo {
  servingSize: string;
  energyKcal: number;
  proteinG: number;
  carbsG: number;
  fiberG: number;
  fatG: number;
  saturatedFatG: number;
  sodiumMg: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  flavour: string;
  milletType: string;
  price: number;
  trialPrice: number;
  weightGrams: number;
  trialWeightGrams: number;
  images: string[];
  ingredients: string[];
  nutrition: NutritionInfo;
  stock: number;
  featured: boolean;
  createdAt?: Timestamp | Date | null;
}

export type PackVariant = 'standard' | 'trial';

export interface CartItem {
  productId: string;
  name: string;
  flavour: string;
  variant: PackVariant;
  variantLabel: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'COD_UPI_CONFIRM' | 'RAZORPAY';

export interface ShippingAddress {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  pincode: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  address: ShippingAddress;
  phone: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  createdAt?: Timestamp | Date | null;
}

export type TrialRequestStatus = 'Pending' | 'Approved' | 'Dispatched' | 'Completed';

export interface TrialRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  pincode: string;
  preferredFlavour: string;
  currentSnackHabit: string;
  feedbackConsent: boolean;
  tasteFeedback?: string;
  status: TrialRequestStatus;
  createdAt?: Timestamp | Date | null;
}

export interface SurveyResponse {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  currentSnackingHabits: string;
  monthlySpend: string;
  preferredFlavours: string[];
  willingnessToPay: number;
  tasteRating: number;
  wouldBuyAgain: 'Yes' | 'Maybe' | 'No';
  comments: string;
  createdAt?: Timestamp | Date | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Timestamp | Date | null;
}
