export interface PromoCode {
  id?: number;
  code: string;
  amount: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  expiryDate: string;
  usageLimit?: number;
  usageCount?: number;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
  createdAt?: string;
  updatedAt?: string;
}

export interface PromoCodeFilter {
  code?: string;
  status?: 'ACTIVE' | 'EXPIRED' | 'DISABLED';
  startDate?: string;
  endDate?: string;
}
