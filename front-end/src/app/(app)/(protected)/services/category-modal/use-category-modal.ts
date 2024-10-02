import { ApiResponse, CategoryCreateOutput } from '@/http'
import { Category } from '@/types/entities/service'
import { create } from 'zustand'

type onSubmitCategory = (category: CategoryCreateOutput) => Promise<ApiResponse<Category>>

export interface CategoryModalStore {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onSubmit?: onSubmitCategory
  setOnSubmit: (onSubmit: onSubmitCategory) => void
}

export const useCategoryModal = create<CategoryModalStore>()(set => ({
  isOpen: false,
  setIsOpen: value => set(state => ({ isOpen: value, onSubmit: state.isOpen ? state.onSubmit : undefined })),
  setOnSubmit: onSubmit => set({ onSubmit })
}))
