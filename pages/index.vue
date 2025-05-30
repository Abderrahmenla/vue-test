<template>
  <v-container fluid class="demo-container">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- Main Progress Card -->
        <div class="demo-card-wrapper mb-12">
          <ProgressCard
            :history="mockData.history"
            :daily-target="mockData.dailyTarget"
            :active-day="mockData.activeDay"
            :on-update-target="handleUpdateTarget"
          />
        </div>

        <!-- Demo Controls -->
        <v-card class="demo-controls rounded-[24px] mb-12" elevation="1">
          <v-card-title class="subtitle-1">
            <v-icon left>mdi-tune</v-icon>
            Demo Controls
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="mockData.activeDay"
                  :items="dayOptions"
                  label="Active Day"
                  outlined
                  dense
                  item-text="text"
                  item-value="value"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="mockData.dailyTarget"
                  label="Daily Target"
                  type="number"
                  outlined
                  dense
                  min="1"
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12">
                <v-subheader class="pl-0">Weekly Progress (Words Written)</v-subheader>
                <v-row>
                  <v-col 
                    v-for="(day, index) in weekDays" 
                    :key="index"
                    cols="12" 
                    sm="6" 
                    md="4" 
                    lg="3"
                  >
                    <v-text-field
                      v-model.number="mockData.history[index]"
                      :label="day"
                      type="number"
                      outlined
                      dense
                      min="0"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      top
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import ProgressCard from '~/components/ProgressCard.vue'

export default {
  name: 'IndexPage',
  components: {
    ProgressCard
  },
  data() {
    return {
      mockData: {
        // Monday = 0, Sunday = 6
        history: [1001, 700, 450, 0, 0, 0, 0], // Mon, Tue, Wed, Thu, Fri, Sat, Sun
        dailyTarget: 1000,
        activeDay: 1 // Tuesday (0-indexed)
      },
      snackbar: {
        show: false,
        text: '',
        color: 'success'
      },
      weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      dayOptions: [
        { text: 'Monday', value: 0 },
        { text: 'Tuesday', value: 1 },
        { text: 'Wednesday', value: 2 },
        { text: 'Thursday', value: 3 },
        { text: 'Friday', value: 4 },
        { text: 'Saturday', value: 5 },
        { text: 'Sunday', value: 6 }
      ]
    }
  },
  computed: {
    todayProgress() {
      const current = this.mockData.history[this.mockData.activeDay]
      const target = this.mockData.dailyTarget
      if (target <= 0) return 0
      return Math.min(Math.round((current / target) * 100), 100)
    },
    weeklyTotal() {
      return this.mockData.history.reduce((sum, words) => sum + words, 0)
    },
    completedDays() {
      return this.mockData.history.filter(words => words >= this.mockData.dailyTarget).length
    }
  },
  methods: {
    handleUpdateTarget(newTarget) {
      console.log('Target updated to:', newTarget)
      this.mockData.dailyTarget = newTarget
      
      // Show success message in snackbar
      this.snackbar = {
        show: true,
        text: `Daily target updated to ${newTarget} words`,
        color: 'success'
      }
    }
  },
  head() {
    return {
      title: 'Today\'s Progress Card Demo',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Interactive demo of the Today\'s Progress card component built with Nuxt 2 and Vuetify 2'
        }
      ]
    }
  }
}
</script>

<style scoped>
.demo-container {
  min-height: 100vh;
  padding: 24px 12px;
  background: #f0f3f3;
}

.demo-header {
  margin-bottom: 2rem;
}

.demo-card-wrapper {
  display: flex;
  justify-content: center;
  padding: 0 16px;
}

.demo-controls,
.demo-stats,
.demo-instructions {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.demo-list {
  padding-left: 20px;
}

.demo-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .demo-container {
    padding: 16px 8px;
  }
  
  .demo-card-wrapper {
    padding: 0 8px;
  }
}
</style>