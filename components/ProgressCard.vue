<template>
  <v-card class="progress-card elevation-2 p-8 rounded-xl">
    <v-row class="flex items-center justify-between w-full " no-gutters>
      <v-card-title class="headline font-weight-bold mb-0 !p-0">Today's Progress</v-card-title>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :z-index="1000" 
        :attach="true"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
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
            <v-progress-circular
              :size="220"
              :width="18"
              :value="progressPercentage"
              color="#008080"
              background="#F1F3F4"
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
        </template>
        <span>Keep going — {{ wordsToTarget }} words to target!</span>
      </v-tooltip>
      <v-progress-circular
        v-else
        :size="220"
        :width="18"
        :value="progressPercentage"
        color="#008080"
        background="#F1F3F4"
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
    <v-card class="p-4 day-pills-container" outlined>
      <v-row align="center" justify="start" class="day-pills-row" no-gutters>
        <v-col
          v-for="(day, i) in pills"
          :key="day.label"
          class="day-pill-col d-flex flex-column align-center"
          cols="auto"
        >
          <div class="day-label font-weight-bold text-center mb-1">{{ day.label }}</div>
          <div class="d-flex align-center">
            <v-avatar
              :color="day.completed ? '#008080' : '#E5E7EB'"
              :class="[
                'day-pill',
                { 'active-outline': i === activeDay && !day.completed }
              ]"
              size="40"
            >
              <v-icon v-if="day.completed" color="white">mdi-check</v-icon>
              <v-icon v-else-if="i === activeDay" color="#008080">mdi-check</v-icon>
            </v-avatar>
            <div
              v-if="i < pills.length - 1"
              class="pill-connector"
              :style="{
                background: pills[i].completed && pills[i+1].completed ? '#008080' : '#E5E7EB'
              }"
            ></div>
          </div>
          <div class="day-progress mt-1">{{ history[i] }}/{{ dailyTarget }}</div>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog v-model="targetDialog" max-width="400" persistent>
      <v-card class="target-dialog">
        <v-card-title class="headline">Set Daily Target</v-card-title>
        <v-card-text>
          <v-text-field
            v-model.number="newTarget"
            label="Daily Target (words)"
            type="number"
            min="1"
            :rules="targetRules"
            autofocus
            @keyup.enter="saveTarget"
            outlined
            dense
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="cancelTarget">Cancel</v-btn>
          <v-btn color="primary" :disabled="!isValidTarget" @click="saveTarget">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
const DAY_LABELS = ['M', 'T', 'W', 'Th', 'F', 'Sat', 'Su']
export default {
  name: 'ProgressCard',
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
      newTarget: null,
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
    pills() {
      return DAY_LABELS.map((label, i) => ({
        label,
        completed: this.history[i] >= this.dailyTarget
      }))
    }
  },
  methods: {
    debugMenu() {
      console.log('Menu button clicked')
      console.log('Vuetify version:', this.$vuetify.version)
    },
    calculateProgressPercentage(current, target) {
      if (target <= 0) return 0
      const percentage = (current / target) * 100
      return Math.min(percentage, 100)
    },
    openTargetDialog() {
      this.$nextTick(() => {
        this.newTarget = this.dailyTarget
        this.targetDialog = true
      })
    },
    saveTarget() {
      if (this.isValidTarget) {
        this.onUpdateTarget(this.newTarget)
        this.targetDialog = false
      }
    },
    cancelTarget() {
      this.targetDialog = false
      this.newTarget = null
    }
  }
}
</script>

<style scoped>
.progress-card {
  min-width: 320px;
  max-width: 600px;
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
  color: #008080;
  font-weight: 700;
}
.main-light {
  color: #888;
  font-weight: 400;
  font-size: 2rem;
}
.progress-label {
  font-size: 1.1rem;
  color: #888;
  font-weight: 400;
  margin-top: 2px;
}
.day-pills-container {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #E5E7EB;
  box-shadow: none;
  margin: 0 auto;
  max-width: 100%;
  overflow-x: auto;
}
.day-pills-row {
  flex-wrap: nowrap !important;
  gap: 0;
  min-width: 320px;
}
.day-pill-col {
  flex: 1;
  min-width: 44px;
  padding: 0 2px;
}
.day-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 2px;
  text-align: center;
}
.day-pill {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  transition: box-shadow 0.2s;
  box-shadow: none;
  border: none;
}
.active-outline {
  box-shadow: 0 0 0 2px #008080;
  border: 2px solid #008080;
  background: #fff !important;
}
.pill-connector {
  width: 32px;
  height: 2.5px;
  border-radius: 1px;
  margin: 0 2px;
  background: #E5E7EB;
}
.day-progress {
  font-size: 0.95rem;
  color: #B0B3B8;
  text-align: center;
  line-height: 1;
  min-width: 60px;
  margin-top: 2px;
  font-weight: 500;
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
  .day-pill {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
  .day-pill-col {
    min-width: 28px;
  }
  .day-progress {
    font-size: 0.7rem;
    min-width: 40px;
  }
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
.menu-item {
  cursor: pointer;
}
.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>