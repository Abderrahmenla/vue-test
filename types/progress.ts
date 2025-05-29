export interface ProgressItem {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

export interface ProgressState {
  items: ProgressItem[]
  totalProgress: number
} 