export const useProgress = () => {
  const progress = ref(0)
  
  const updateProgress = (value: number) => {
    progress.value = value
  }

  return {
    progress,
    updateProgress
  }
} 