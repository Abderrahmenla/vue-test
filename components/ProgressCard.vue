<template>
  <v-card class="progress-card elevation-2 p-8 rounded-xl">
    <v-row class="flex items-center justify-between w-full " no-gutters>
      <v-card-title class="headline font-weight-bold mb-0 !p-0">Today's Progress</v-card-title>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :attach="true"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon color="#484a54">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            @click="openTargetDialog"
          >
            <v-list-item-title>Set Daily Target</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>
    <div class="progress-center-wrap flex justify-center items-center mb-8">
      <v-tooltip bottom v-if="progressPercentage < 100">
        <template v-slot:activator="{ on, attrs }">
          <div v-on="on" v-bind="attrs">
            <div class="rounded-full border-[18px] border-[#fafafa]" >
              <v-progress-circular
                :size="320"
                :width="32"
                :value="progressPercentage"
                color="#0d848b"
                background="#eeeeee"
                class="progress-ring"
              >
                <div class="progress-center-content d-flex flex-column align-center">
                  <span class="progress-main-number">
                    <span class="main-bold">{{ todayWords }}</span>
                    <span class="main-light">/{{ dailyTarget }}</span>
                  </span>
                  <div class="progress-label">Per Day</div>
                </div>
              </v-progress-circular>
            </div>
          </div>
        </template>
        <span>Keep going — {{ wordsToTarget }} words to target!</span>
      </v-tooltip>
      <div v-else class="rounded-full border-[18px] border-[#fafafa]" >
        <v-progress-circular
          :size="320"
          :width="32"
          :value="progressPercentage"
          color="#0d848b"
          background="#eeeeee"
          class="progress-ring"
        >
          <div class="progress-center-content d-flex flex-column align-center">
            <span class="progress-main-number">
              <span class="main-bold">{{ todayWords }}</span>
              <span class="main-light">/{{ dailyTarget }}</span>
            </span>
            <div class="progress-label">Per Day</div>
          </div>
        </v-progress-circular>
      </div>

    </div>
    <WeeklyProgressTracker
      :history="history"
      :daily-target="dailyTarget"
      :active-day="activeDay"
    />
    <v-dialog v-model="targetDialog" max-width="400" persistent attach overlay-opacity="0.5"
    overlay-color="black">
      <v-card class="target-dialog">
        <v-card-title class="headline">Set Daily Target</v-card-title>
        <v-card-text>
          <v-text-field
            v-model.number="newTarget"
            label="Daily Target"
            type="number"
            min="1"
            :rules="targetRules"
            autofocus
            @keyup.enter="saveTarget"
            outlined
            dense
            hide-details="auto"
          />
        </v-card-text>
        <v-card-actions>
         <div class="flex justify-between items-center w-full">
           <v-btn text @click="cancelTarget">Cancel</v-btn>
           <v-btn 
             color="primary" 
             :disabled="!isValidTarget" 
             @click="saveTarget"
           >
             Save
           </v-btn>
         </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        v => !!v || 'Target is required',
        v => (v && v > 0) || 'Target must be greater than 0',
        v => (v && Number.isInteger(Number(v))) || 'Target must be a whole number'
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
      return this.newTarget && this.newTarget > 0 && Number.isInteger(Number(this.newTarget))
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
.progress-card {
  min-width: 450px;
  width: 35vw;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.04);
}
.progress-center-wrap {
  margin: 0 0 24px 0;
}
.progress-ring {
  position: relative;
}
.progress-center-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.progress-main-number {
  font-size: 2.4rem;
  font-weight: 700;
  color: #008080;
  line-height: 1.1;
  letter-spacing: -1px;
}
.main-bold {
  color: #11334d;
  font-weight: 700;
}
.main-light {
  color: #484a54;
  font-weight: 400;
  font-size: 2rem;
}
.progress-label {
  font-size: 1.1rem;
  color: #484a54;
  font-weight: 400;
  margin-top: 2px;
}
.target-dialog {
  border-radius: 16px;
}
.target-dialog .v-card__title {
  padding: 20px 24px 0;
  font-size: 1.5rem;
  font-weight: 600;
}
.target-dialog .v-card__text {
  padding: 20px 24px;
}
.target-dialog .v-card__actions {
  padding: 8px 24px 20px;
}
.translate-y-0\.5 {
  transform: translateY(0.125rem);
}
.-translate-y-0\.5 {
  transform: translateY(-0.125rem);
}
@media (max-width: 400px) {
  .progress-card {
    min-width: 320px;
    margin: 0 4px;
    padding: 16px 4px 12px 4px;
  }
  .progress-center-content {
    width: 120px;
  }
}
</style>