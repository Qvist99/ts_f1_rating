import { create } from "zustand";

interface LoginModalStore {
    isOpen: boolean;
    open: (redirectPath?: string) => void;
    close: () => void;
    redirectPath?: string;
}

export const useLoginModal = create<LoginModalStore>((set) => ({
    isOpen: false,
    open: (redirectPath?: string) => set({ isOpen: true, redirectPath }),
    close: () => set({ isOpen: false, redirectPath: undefined }),
}));
