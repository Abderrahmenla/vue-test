import { mount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import ProgressCard from '@/components/ProgressCard.vue'

// Create local Vue instance
const localVue = createLocalVue()

describe('ProgressCard.vue', () => {
  let vuetify
  let wrapper

  // Mock props
  const mockProps = {
    history: [1200, 800, 600, 400, 200, 0, 1500],
    dailyTarget: 1000,
    activeDay: 1,
    onUpdateTarget: jest.fn()
  }

  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = mount(ProgressCard, {
      localVue,
      vuetify,
      propsData: mockProps
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  describe('Progress Percentage Calculation', () => {
    it('should calculate correct percentage when current is less than target', () => {
      const component = wrapper.vm
      const result = component.calculateProgressPercentage(700, 1000)
      expect(result).toBe(70)
    })

    it('should calculate correct percentage when current equals target', () => {
      const component = wrapper.vm
      const result = component.calculateProgressPercentage(1000, 1000)
      expect(result).toBe(100)
    })

    it('should clamp percentage to 100 when current exceeds target', () => {
      const component = wrapper.vm
      const result = component.calculateProgressPercentage(1500, 1000)
      expect(result).toBe(100)
    })

    it('should handle zero target gracefully', () => {
      const component = wrapper.vm
      const result = component.calculateProgressPercentage(500, 0)
      expect(result).toBe(0)
    })

    it('should handle negative values correctly', () => {
      const component = wrapper.vm
      const result = component.calculateProgressPercentage(-100, 1000)
      expect(result).toBe(-10) // This will be clamped by Math.min in the computed property
    })

    it('should return correct percentage for decimal values', () => {
      const component = wrapper.vm
      const result = component.calculateProgressPercentage(333, 1000)
      expect(result).toBe(33.3)
    })
  })

  describe('Component Rendering', () => {
    it('should render the component with correct title', () => {
      expect(wrapper.find('h2').text()).toBe("Today's Progress")
    })

    it('should display correct today\'s words and target in progress ring', () => {
      expect(wrapper.vm.todayWords).toBe(800) // history[1]
      expect(wrapper.vm.dailyTarget).toBe(1000)
    })

    it('should render seven day pills', () => {
      const dayPills = wrapper.findAll('.day-pill')
      expect(dayPills.length).toBe(7)
    })

    it('should apply correct classes to completed and active days', () => {
      const dayPills = wrapper.findAll('.day-pill')
      
      // Monday (index 0) - completed (1200 >= 1000)
      expect(dayPills.at(0).classes()).toContain('day-pill--completed')
      
      // Tuesday (index 1) - active but not completed
      expect(dayPills.at(1).classes()).toContain('day-pill--active')
      expect(dayPills.at(1).classes()).not.toContain('day-pill--completed')
      
      // Sunday (index 6) - completed (1500 >= 1000)
      expect(dayPills.at(6).classes()).toContain('day-pill--completed')
      
      // Wednesday (index 2) - incomplete (600 < 1000)
      expect(dayPills.at(2).classes()).toContain('day-pill--incomplete')
    })
  })

  describe('Computed Properties', () => {
    it('should calculate progress percentage correctly', () => {
      expect(wrapper.vm.progressPercentage).toBe(80) // 800/1000 * 100
    })

    it('should calculate words to target correctly', () => {
      expect(wrapper.vm.wordsToTarget).toBe(200) // 1000 - 800
    })

    it('should return 0 words to target when already achieved', () => {
      wrapper.setProps({
        ...mockProps,
        activeDay: 0 // Monday with 1200 words
      })
      expect(wrapper.vm.wordsToTarget).toBe(0) // max(0, 1000 - 1200)
    })
  })

  describe('Day Completion Logic', () => {
    it('should correctly identify completed days', () => {
      const component = wrapper.vm
      
      expect(component.isCompleted(0)).toBe(true)  // Monday: 1200 >= 1000
      expect(component.isCompleted(1)).toBe(false) // Tuesday: 800 < 1000
      expect(component.isCompleted(2)).toBe(false) // Wednesday: 600 < 1000
      expect(component.isCompleted(3)).toBe(false) // Thursday: 400 < 1000
      expect(component.isCompleted(4)).toBe(false) // Friday: 200 < 1000
      expect(component.isCompleted(5)).toBe(false) // Saturday: 0 < 1000
      expect(component.isCompleted(6)).toBe(true)  // Sunday: 1500 >= 1000
    })
  })

  describe('Target Dialog Functionality', () => {
    it('should open target dialog when menu item is clicked', async () => {
      // Open the menu first
      const menuButton = wrapper.find('.v-btn')
      await menuButton.trigger('click')
      
      // Find and click the "Set Daily Target" menu item
      const menuItems = wrapper.findAll('.v-list-item')
      const targetMenuItem = menuItems.at(0)
      await targetMenuItem.trigger('click')
      
      expect(wrapper.vm.targetDialog).toBe(true)
    })

    it('should validate target input correctly', async () => {
      wrapper.setData({ newTarget: 1500 })
      expect(wrapper.vm.isValidTarget).toBe(true)
      
      wrapper.setData({ newTarget: 0 })
      expect(wrapper.vm.isValidTarget).toBe(false)
      
      wrapper.setData({ newTarget: -100 })
      expect(wrapper.vm.isValidTarget).toBe(false)
      
      wrapper.setData({ newTarget: null })
      expect(wrapper.vm.isValidTarget).toBe(false)
    })

    it('should call onUpdateTarget when saving valid target', async () => {
      const mockCallback = jest.fn()
      wrapper.setProps({
        ...mockProps,
        onUpdateTarget: mockCallback
      })
      
      wrapper.setData({ 
        targetDialog: true,
        newTarget: 1500 
      })
      
      await wrapper.vm.saveTarget()
      
      expect(mockCallback).toHaveBeenCalledWith(1500)
      expect(wrapper.vm.targetDialog).toBe(false)
    })

    it('should not call onUpdateTarget when target is invalid', async () => {
      const mockCallback = jest.fn()
      wrapper.setProps({
        ...mockProps,
        onUpdateTarget: mockCallback
      })
      
      wrapper.setData({ 
        targetDialog: true,
        newTarget: 0 
      })
      
      await wrapper.vm.saveTarget()
      
      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe('Tooltip Behavior', () => {
    it('should show tooltip when progress is less than 100%', () => {
      // Current setup: 800/1000 = 80% < 100%
      wrapper.vm.handleMouseEnter()
      expect(wrapper.vm.showTooltip).toBe(true)
    })

    it('should not show tooltip when progress is 100% or more', async () => {
      // Set active day to a completed day
      wrapper.setProps({
        ...mockProps,
        activeDay: 0 // Monday with 1200 words (120%)
      })
      
      await wrapper.vm.$nextTick()
      wrapper.vm.handleMouseEnter()
      expect(wrapper.vm.showTooltip).toBe(false)
    })

    it('should hide tooltip on mouse leave', () => {
      wrapper.setData({ showTooltip: true })
      wrapper.vm.handleMouseLeave()
      expect(wrapper.vm.showTooltip).toBe(false)
    })
  })

  describe('Props Validation', () => {
    it('should validate history prop correctly', () => {
      const historyValidator = ProgressCard.props.history.validator
      
      expect(historyValidator([1, 2, 3, 4, 5, 6, 7])).toBe(true)
      expect(historyValidator([1, 2, 3])).toBe(false) // Wrong length
      expect(historyValidator([1, 2, 3, 4, 5, 6, 'invalid'])).toBe(false) // Non-number
    })

    it('should validate dailyTarget prop correctly', () => {
      const targetValidator = ProgressCard.props.dailyTarget.validator
      
      expect(targetValidator(1000)).toBe(true)
      expect(targetValidator(0)).toBe(false)
      expect(targetValidator(-100)).toBe(false)
    })

    it('should validate activeDay prop correctly', () => {
      const activeDayValidator = ProgressCard.props.activeDay.validator
      
      expect(activeDayValidator(0)).toBe(true)
      expect(activeDayValidator(6)).toBe(true)
      expect(activeDayValidator(-1)).toBe(false)
      expect(activeDayValidator(7)).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero values in history array', async () => {
      wrapper.setProps({
        ...mockProps,
        history: [0, 0, 0, 0, 0, 0, 0],
        activeDay: 0
      })
      
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.todayWords).toBe(0)
      expect(wrapper.vm.progressPercentage).toBe(0)
      expect(wrapper.vm.wordsToTarget).toBe(1000)
    })

    it('should handle very large numbers correctly', async () => {
      wrapper.setProps({
        ...mockProps,
        history: [10000, 5000, 3000, 2000, 1000, 500, 100],
        activeDay: 0
      })
      
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.todayWords).toBe(10000)
      expect(wrapper.vm.progressPercentage).toBe(100) // Clamped to 100
    })
  })
})