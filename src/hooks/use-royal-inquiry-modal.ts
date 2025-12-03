
import { create } from 'zustand';

type RoyalInquiryModalStore = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const useOpenRoyalInquiryModal = create<RoyalInquiryModalStore>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
}));
