import { create } from "zustand";


const useModalStore = create(set => ({
    isModal: false,
    modalName: '',
    selectedIndex: null,
    modalItem: [],

    actions: {
        setIsModal: (bool) => set({ isModal: bool }),
        setModalName: (name) => set({ modalName: name }),
        openModal: () => set({ isModal: true }),
        closeModal: () => set({ isModal: false }),
        setSelectedIndex: (index) => set({ selectedIndex: index }),
        selectedModalOpen: (name) => set({ isModal: true, modalName: name }),
        selectedModalOpenInItem: (name, item) => set({ isModal: true, modalName: name, modalItem: item }),
        selectedModalClose: () => set({ isModal: false, modalName: '' }),
        setModalItem: (fieldName, value) =>
            set((state) => ({ modalItem: { ...state.modalItem, [fieldName]: value } })),
    },
}))


// useModalState 커스텀 훅
/**
 * @keys
 * - isModal
 * - modalName
 * - selectedIndex
 * - modalItem
 */
export const useModalState = () => {
    const { isModal, modalName, modalItem, selectedIndex } = useModalStore();
    return { isModal, modalName, selectedIndex, modalItem };
};

// useModalActions 커스텀 훅
/**
 * @keys
 * - actions
 * - setIsModal
 * - setModalName
 * - openModal
 * - closeModal
 * - setSelectedIndex
 * - selectedModalOpen
 * - selectedModalClose
 * - selectedModalOpenInItem
 * - setModalItem
 */
export const useModalActions = () => {
    const { setIsModal, setModalName, setSelectedIndex, openModal, closeModal, selectedModalOpen, selectedModalClose, selectedModalOpenInItem, setModalItem } = useModalStore.getState().actions;
    return { setIsModal, setModalName, setSelectedIndex, openModal, closeModal, selectedModalOpen, selectedModalClose, selectedModalOpenInItem, setModalItem };
};