import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BrandConfig } from '../types';

interface BrandStore {
  brand: BrandConfig;
  updateBrand: (partial: Partial<BrandConfig>) => void;
}

export const useBrandStore = create<BrandStore>()(
  persist(
    (set) => ({
      brand: {
        companyName: 'MerchantCRM',
        logoUrl: '',
        primaryColor: '#0FBCAE',
      },
      updateBrand: (partial) =>
        set((state) => ({ brand: { ...state.brand, ...partial } })),
    }),
    { name: 'crm_brand' }
  )
);
