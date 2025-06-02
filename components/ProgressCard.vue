<template>
  <v-card
    class="min-w-[360px] mx-1 !rounded-[24px] py-3 px-5 sm:px-10 sm:min-w-[720px] w-full sm:w-[35vw] sm:mx-auto font-roboto bg-white shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] elevation-2 sm:p-8"
  >
    <v-row class="flex items-center justify-between w-full !mb-10" no-gutters>
      <v-card-title class="heading !p-0">
        <span class="text-3xl sm:text-5xl !font-bold">Today's Progress </span>
      </v-card-title>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :attach="true"
        offset-y
        left
        :max-width="300"
        :min-width="200"
        :nudge-bottom="10"
        :nudge-left="10"
        offset-overflow
        content-class="progress-menu"

      >
        <template #activator="{ on, attrs }">
          <v-btn large class="w-[48px] h-[48px]" icon v-bind="attrs" v-on="on">
            <v-icon color="#484a54">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="openTargetDialog">
            <v-list-item-title>Set Daily Target</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>
    <div class="flex justify-center items-center mb-8">
      <v-tooltip v-if="progressPercentage < 100" :attach="true" top>
        <template #activator="{ on, attrs }">
          <div v-bind="attrs" class="rounded-full border-[18px] border-[#fafafa]" v-on="on">
            <v-progress-circular
              :value="progressPercentage"
              color="#0d848b"
              background="#eeeeee"
              class="relative !w-[240px] !h-[240px] /* mobile first */ sm:!w-[280px] sm:!h-[280px] /* small screens */ md:!w-[320px] md:!h-[320px] /* medium screens */ lg:!w-[360px] lg:!h-[360px] /* large screens */"
            >
              <div
                class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 sm:w-[120px] w-[160px] flex flex-col items-center"
              >
                <p
                  class="text-[1.8rem] sm:text-[2rem] md:text-[2.2rem] lg:text-[2.4rem] font-bold leading-[1.1] tracking-[-1px] flex items-center"
                >
                  <span class="text-[#11334d] font-bold">{{ todayWords }}</span>
                  <span
                    class="text-[#484a54] text-[1.5rem] sm:text-[1.7rem] md:text-[1.8rem] lg:text-[2rem]"
                    >/{{ dailyTarget }}</span
                  >
                </p>
                <div
                  class="text-[0.9rem] sm:text-[1rem] md:text-[1.05rem] lg:text-[1.1rem] text-[#484a54] mt-0.5"
                >
                  Per Day
                </div>
              </div>
            </v-progress-circular>
          </div>
        </template>
        <span class="text-white text-xl">Keep going — {{ wordsToTarget }} words to target!</span>
      </v-tooltip>
      <div v-else class="rounded-full border-[18px] border-[#fafafa]">
        <v-progress-circular
          :value="progressPercentage"
          color="#0d848b"
          background="#eeeeee"
          class="relative !w-[240px] !h-[240px] /* mobile first */ sm:!w-[280px] sm:!h-[280px] /* small screens */ md:!w-[320px] md:!h-[320px] /* medium screens */ lg:!w-[360px] lg:!h-[360px] /* large screens */"
        >
          <div
            class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 sm:w-[120px] w-[160px] flex flex-col items-center"
          >
            <p
              class="text-[1.8rem] sm:text-[2rem] md:text-[2.2rem] lg:text-[2.4rem] font-bold leading-[1.1] tracking-[-1px] flex items-center"
            >
              <span class="text-[#11334d] font-bold">{{ todayWords }}</span>
              <span
                class="text-[#484a54] text-[1.5rem] sm:text-[1.7rem] md:text-[1.8rem] lg:text-[2rem]"
                >/{{ dailyTarget }}</span
              >
            </p>
            <div
              class="text-[0.9rem] sm:text-[1rem] md:text-[1.05rem] lg:text-[1.1rem] text-[#484a54] mt-0.5"
            >
              Per Day
            </div>
          </div>
        </v-progress-circular>
      </div>
    </div>
    <WeeklyProgressTracker :history="history" :daily-target="dailyTarget" :active-day="activeDay" />
    <v-dialog
      v-model="targetDialog"
      max-width="400"
      persistent
      attach
      overlay-opacity="0.5"
      overlay-color="#000"
      content-class="!rounded-3xl"
    >
      <v-card class="!rounded-3xl py-5">
        <v-card-title class="headline !pb-6 px-6 text-[1.5rem] font-semibold"
          >Set Daily Target</v-card-title
        >
        <v-card-text class="py-5 px-6">
          <v-text-field
            v-model.number="newTarget"
            label="Daily Target"
            type="number"
            min="1"
            :rules="targetRules"
            autofocus
            outlined
            dense
            hide-details="auto"
            @keyup.enter="saveTarget"
          />
        </v-card-text>
        <v-card-actions class="pt-2 px-6 !pb-0">
          <div class="flex justify-between items-center w-full">
            <v-btn class="" @click="cancelTarget">Cancel</v-btn>
            <v-btn class="!bg-teal-400 !text-white" :disabled="!isValidTarget" @click="saveTarget">
              Save
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="targetDialog"></v-overlay>
  </v-card>
</template>

<script>
import WeeklyProgressTracker from './WeeklyProgressTracker.vue'

export default {
  name: 'ProgressCard',
  components: {
    WeeklyProgressTracker
  },
  props: {
    history: {
      type: Array,
      required: true,
      validator: (v) => v.length === 7 && v.every((n) => typeof n === 'number')
    },
    dailyTarget: {
      type: Number,
      required: true,
      validator: (v) => v > 0
    },
    activeDay: {
      type: Number,
      required: true,
      validator: (v) => v >= 0 && v <= 6
    },
    onUpdateTarget: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      targetDialog: false,
      menu: false,
      newTarget: this.dailyTarget,
      targetRules: [
        (v) => !!v || 'Target is required',
        (v) => (v && v > 0) || 'Target must be greater than 0',
        (v) => (v && Number.isInteger(Number(v))) || 'Target must be a whole number'
      ]
    }
  },
  computed: {
    todayWords() {
      return this.history[this.activeDay] || 0
    },
    progressPercentage() {
      return this.calculateProgressPercentage(this.todayWords, this.dailyTarget)
    },
    wordsToTarget() {
      return Math.max(0, this.dailyTarget - this.todayWords)
    },
    isValidTarget() {
      return this.newTarget > 0 && Number.isInteger(Number(this.newTarget))
    },
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
          return 'bg-teal-500 text-white border-teal-500'
        case 'completed':
          return 'bg-white text-teal-500 border-teal-500 border-2'
        case 'pending':
          return 'bg-gray-300 text-gray-500 border-gray-300'
        default:
          return 'bg-gray-300 text-gray-500 border-gray-300'
      }
    },
    getConnectorClasses(currentStatus, nextStatus) {
      if (currentStatus === 'active-completed' && nextStatus === 'completed') {
        return 'bg-teal-500'
      }
      return 'bg-gray-300'
    },
    calculateProgressPercentage(current, target) {
      if (target <= 0) return 0
      const percentage = (current / target) * 100
      return Math.min(percentage, 100)
    },
    openTargetDialog() {
      this.menu = false
      this.$nextTick(() => {
        this.targetDialog = true
      })
    },
    saveTarget() {
      if (this.isValidTarget) {
        console.log('Saving new daily target:', this.newTarget)
        this.onUpdateTarget(this.newTarget)
        this.targetDialog = false
        this.newTarget = this.dailyTarget
      }
    },
    cancelTarget() {
      this.targetDialog = false
      this.newTarget = this.dailyTarget
    }
  }
}
</script>
<style scoped>
.progress-menu {
  position: absolute;
  z-index: 100;
  max-height: calc(100vh - 100px); /* Adjust based on your needs */
  overflow-y: auto;
}
</style>