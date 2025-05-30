<template>
  <div class="bg-white flex items-center justify-center p-2 rounded-2xl shadow-sm border border-gray-100 w-full mx-auto">
    <!-- Wrapper flex container with equal width children -->
    
      <div
        v-for="(dayData, index) in weekData"
        :key="index"
        :class="[
            'flex items-center justify-stretch ',
            index === weekData.length-1 ? '' : 'w-full'
          ]"
      >
        <!-- Day content container -->
        <div class="gap-y-2 h-full">
          <!-- Day Label -->
          <div class="text-black font-medium text-sm text-center">
            {{ dayData.day }}
          </div>
          
          <!-- Progress Circle -->
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 my-2',
              getCircleClasses(getDayStatus(dayData, index))
            ]"
          >
            <!-- Check Icon -->
            <svg
              v-if="getDayStatus(dayData, index) === 'active-completed' || getDayStatus(dayData, index) === 'completed'"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </div>
          
          <!-- Progress Numbers -->
            <div class="text-gray-400 text-xs text-center">
             <span>{{ dayData.completed }}/ </span> <br/> <span>{{ dayData.total }}</span>
            </div>
        </div>
        
        <!-- Connector Line (attached to each day except the last) -->
        <div
          v-if="index < weekData.length - 1"
          :class="[
            'h-1 flex transition-all duration-200 flex-grow mb-2',
            getConnectorClasses(
              getDayStatus(dayData, index),
              getDayStatus(weekData[index + 1], index + 1)
            )
          ]"
        />
      </div>
   
  </div>
</template>

<script>
const DAY_LABELS = ['M', 'T', 'W', 'Th', 'F', 'Sat', 'Su']

export default {
  name: 'WeeklyProgressTracker',
  props: {
    history: {
      type: Array,
      required: true,
      validator: v => v.length === 7 && v.every(n => typeof n === 'number')
    },
    dailyTarget: {
      type: Number,
      required: true,
      validator: v => v > 0
    },
    activeDay: {
      type: Number,
      required: true,
      validator: v => v >= 0 && v <= 6
    }
  },
  computed: {
    weekData() {
      return DAY_LABELS.map((day, index) => ({
        day,
        completed: this.history[index],
        total: this.dailyTarget,
        status: this.history[index] >= this.dailyTarget ? 'completed' : 'pending'
      }))
    }
  },
  methods: {
    getDayStatus(day, index) {
      if (index === this.activeDay && day.completed >= day.total) return 'active-completed'
      if (day.completed >= day.total) return 'completed'
      return 'pending'
    },
    
    getCircleClasses(status) {
      switch (status) {
        case 'active-completed':
          return 'bg-[#10a7b0] text-white border-[#10a7b0]'
        case 'completed':
          return 'bg-white text-[#10a7b0] border-[#10a7b0] border-2'
        case 'pending':
          return 'bg-gray-300 text-gray-500 border-gray-300'
        default:
          return 'bg-gray-300 text-gray-500 border-gray-300'
      }
    },
    
    getConnectorClasses(currentStatus, nextStatus) {
      const isCurrentCompleted = currentStatus === 'completed' || currentStatus === 'active-completed'
      const isNextCompleted = nextStatus === 'completed' || nextStatus === 'active-completed'

      if (isCurrentCompleted && isNextCompleted) {
        return 'bg-teal-500'
      }
      
      // If the current day is completed (active or not) and the next is pending, the line should still be active color up to the next point.
      if (isCurrentCompleted && nextStatus === 'pending') {
           return 'bg-teal-500'
      }
      return 'bg-transparent'
    }
  }
}
</script>