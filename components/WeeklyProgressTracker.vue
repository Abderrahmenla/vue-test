<template>
  <div class="bg-white flex items-center justify-center px-4 pt-3 pb-8 rounded-2xl shadow-sm border border-gray-300 w-full mx-auto">
      <div
        v-for="(dayData, index) in weekData"
        :key="index"
        :class="[
            'flex items-center justify-stretch ',
            index === weekData.length-1 ? '' : 'w-full'
          ]"
      >
        <div class="h-full">
          <div class="text-black font-medium text-sm text-center">
            {{ dayData.day }}
          </div>
          
          <div
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 mt-2 mb-8 relative',
              getCircleClasses(dayData, index)
            ]"
          >

            
            <v-icon v-if="dayData.completed >= dayData.total || activeDay === index" size="24" :color=" dayData.completed >= dayData.total  ? '#fff' : '#10a7b0'">mdi-check</v-icon>

            <div :class="['text-gray-400 text-xs text-center absolute bottom-[-20px] left-1/2 -translate-x-1/2',
              activeDay < index ? 'hidden'  : ''
            ]">
             
               {{ dayData.completed }}/{{ dayData.total }}
           
            </div>
          </div>
          
        </div>
        
        <!-- Connector Line (attached to each day except the last) -->
        <div
          v-if="index < weekData.length - 1"
          :class="[
            'h-1 flex transition-all duration-200 flex-grow ',
            getConnectorClasses(
              index,
              weekData[index + 1]
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
      }))
    }
  },
  methods: {
    isDayCompleted(day) {
       return day.completed >= day.total
    },
    isActiveDay(index) {
      return index === this.activeDay
    },
    
    getCircleClasses(day, index) {
      const isCompleted = this.isDayCompleted(day);
      const isActive = this.isActiveDay(index);
      
      const classes = [
        'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 my-2',
      ];

      if (isActive) {
        // Active day styling: white background, teal border, and teal text
        classes.push('bg-white border-2 border-[#10a7b0]');
        // Text color is teal for active day
        classes.push('text-[#10a7b0]');

      } else {
        // Non-active day styling: filled teal if completed, grey if incomplete
        if (isCompleted) {
          classes.push('bg-[#10a7b0] text-white');
        } else {
          classes.push('bg-gray-300 text-gray-500');
        }
      }

      return classes;
    },
    
    getConnectorClasses(currentDay ,nextDay) {
      const isNextCompleted = this.isDayCompleted(nextDay);

      if (isNextCompleted || this.activeDay === currentDay + 1) {
        return 'bg-[#0d848b]'; 
      }
      
      return 'bg-transparent'; // Grey connector otherwise
    }
  }
}
</script>