import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuetify from 'vuetify'
import ProgressCard from '@/components/ProgressCard.vue'

// Create local Vue instance for testing
const localVue = createLocalVue()

describe('ProgressCard', () => {
  let vuetify
  let defaultProps

  beforeEach(() => {
    vuetify = new Vuetify()

    // Default props that the component requires
    defaultProps = {
      history: [50, 75, 100, 25, 80, 90, 120], // 7 days of word counts
      dailyTarget: 100,
      activeDay: 6, // Today (Sunday = 6)
      onUpdateTarget: jest.fn()
    }
  })

  // Test case for calculateProgressPercentage helper method
  it('calculates progress percentage and clamps at 100%', () => {
    const wrapper = shallowMount(ProgressCard, {
      localVue,
      vuetify,
      propsData: defaultProps
    })

    const calculateProgressPercentage = wrapper.vm.calculateProgressPercentage

    // Test case 1: Target is 0 or less
    expect(calculateProgressPercentage(50, 0)).toBe(0)
    expect(calculateProgressPercentage(50, -10)).toBe(0)

    // Test case 2: Current is less than target
    expect(calculateProgressPercentage(50, 100)).toBe(50)
    expect(calculateProgressPercentage(75, 150)).toBe(50)

    // Test case 3: Current is equal to target
    expect(calculateProgressPercentage(100, 100)).toBe(100)

    // Test case 4: Current is greater than target (should clamp at 100)
    expect(calculateProgressPercentage(150, 100)).toBe(100)
    expect(calculateProgressPercentage(1001, 1000)).toBe(100)
  })

  // Additional test for component mounting
  it('mounts without crashing', () => {
    const wrapper = shallowMount(ProgressCard, {
      localVue,
      vuetify,
      propsData: defaultProps
    })
    expect(wrapper.exists()).toBe(true)
  })

  // Test with custom props
  it('renders with props correctly', () => {
    const customProps = {
      history: [25, 50, 75, 100, 125, 150, 75], // Custom history
      dailyTarget: 100,
      activeDay: 6, // Today
      onUpdateTarget: jest.fn()
    }

    const wrapper = shallowMount(ProgressCard, {
      localVue,
      vuetify,
      propsData: customProps
    })

    expect(wrapper.props().history).toEqual(customProps.history)
    expect(wrapper.props().dailyTarget).toBe(100)
    expect(wrapper.props().activeDay).toBe(6)
  })

  // Test computed properties
  it('calculates todayWords correctly', () => {
    const wrapper = shallowMount(ProgressCard, {
      localVue,
      vuetify,
      propsData: defaultProps
    })

    // Today's words should be history[activeDay] = history[6] = 120
    expect(wrapper.vm.todayWords).toBe(120)
  })

  it('calculates progressPercentage correctly', () => {
    const wrapper = shallowMount(ProgressCard, {
      localVue,
      vuetify,
      propsData: defaultProps
    })

    // Progress should be 100% since todayWords (120) >= dailyTarget (100)
    expect(wrapper.vm.progressPercentage).toBe(100)
  })

  it('calculates wordsToTarget correctly', () => {
    const propsUnderTarget = {
      ...defaultProps,
      history: [50, 75, 100, 25, 80, 90, 75], // Today = 75 words
      activeDay: 6
    }

    const wrapper = shallowMount(ProgressCard, {
      localVue,
      vuetify,
      propsData: propsUnderTarget
    })

    // Words to target should be 100 - 75 = 25
    expect(wrapper.vm.wordsToTarget).toBe(25)
  })

  it('handles target dialog correctly', async () => {
    const wrapper = shallowMount(ProgressCard, {
      localVue,
      vuetify,
      propsData: defaultProps
    })

    // Initially dialog should be closed
    expect(wrapper.vm.targetDialog).toBe(false)

    // Open dialog
    wrapper.vm.openTargetDialog()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.targetDialog).toBe(true)
  })

  it('validates target input correctly', () => {
    const wrapper = shallowMount(ProgressCard, {
      localVue,
      vuetify,
      propsData: defaultProps
    })

    // Valid target
    wrapper.setData({ newTarget: 150 })
    expect(wrapper.vm.isValidTarget).toBe(true)

    // Invalid targets
    wrapper.setData({ newTarget: 0 })
    expect(wrapper.vm.isValidTarget).toBe(false)

    wrapper.setData({ newTarget: -5 })
    expect(wrapper.vm.isValidTarget).toBe(false)

    wrapper.setData({ newTarget: 1.5 })
    expect(wrapper.vm.isValidTarget).toBe(false)
  })
})
