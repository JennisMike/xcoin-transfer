export type LoginFormInputs = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterFormInputs = {
  fullName: string;
  dob: string;
  gender: "male" | "female";
  occupation: "working" | "student";
  institution?: string;
  country: string;
  email: string;
  password: string;
};

export interface Transaction {
  id: string;
  date: string;
  type: "buy" | "sell" | "convert" | "deposit" | "withdraw";
  amount: number;
  currency: string;
  targetAmount?: number;
  targetCurrency?: string;
  fee: number;
  status: "completed" | "pending" | "failed" | "processing";
  reference: string;
  description?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  joinedDate: string;
  verificationLevel: "unverified" | "basic" | "intermediate" | "advanced";
  avatarUrl: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
  preferredCurrency: string;
  language: string;
  notifications: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    marketingEmails?: boolean;
  };
}

export interface UserMin {
  email: string;
  fullName: string;
  id: string;
}

export interface ExhangeRateType {
  RMB: number;
  XAF: number;
  [key: string]: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ProtectedWrapperProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export interface Subscription {
  type: string;
  trialEnd: Date | null;
}

export interface WalletProps {
  balance: number;
  subscriptionType: "standard" | "premium" | "business";
  isExpired?: boolean;
}

export interface Card {
  balance: number;
  subscriptionType: "standard" | "premium" | "business";
  isEpired?: boolean;
  rate: number;
}

export interface PaymentData {
  amount: string;
  currency?: string; // USD, EUR, GBP, etc.
  description?: string;
  external_reference?: string;
  from?: string;
}

export interface PaymentModalType {
  isOpen: boolean;
  closeModal: () => void;
  paymentData: PaymentData;
  setPhone?: (phone: string) => void;
  setAmount: (amount: string) => void;
  setCurrency: (currency: string) => void;
}

// Define interfaces for the encrypted response
export interface EncryptedResponse {
  encrypted: boolean;
  iv: string;
  data: string;
  tag: string;
  timestamp: number;
  error?: string;
}

export interface EncryptedData {
  encrypted: boolean;
  iv: string;
  data: string;
  tag?: string;
  timestamp: number;
}

export interface TransferRequest {
  timestamp: Date;
  id: string;
  userId: string;
  username: string;
  email: string;
  amount: number;
  xCoinAmount: number;
  rmbAmount: number;
  targetAmount: number;
  targetCurrency: string;
  exchangeRate: number;
  status: "pending" | "approved" | "declined";
  createdAt: Date;
  paymentMethod: string;
}

export type XcoinRequest = {
  rmbAmount: number;
  timestamp: string | number | Date;
  email: string;
  username: string;
  id: string;
  date: string;
  reference?: string;
  amount: number;
  type: "Premium" | "Standard" | "Business";
  status: "pending" | "completed";
};

export interface ConvertXcoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    username?: string;
    amount: number;
    phone?: string;
  }) => void;
  destinationCurrency: string;
  amount: number;
}
