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
