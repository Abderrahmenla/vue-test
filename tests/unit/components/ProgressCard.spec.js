import { shallowMount } from '@vue/test-utils'
import ProgressCard from '@/todays-progress-card/components/ProgressCard.vue'

describe('ProgressCard', () => {
  // Test case for calculateProgressPercentage helper method
  it('calculates progress percentage and clamps at 100%', () => {
    const wrapper = shallowMount(ProgressCard)
    const calculateProgressPercentage = wrapper.vm.calculateProgressPercentage

    // Test case 1: Target is 0 or less
    expect(calculateProgressPercentage(50, 0)).toBe(0);
    expect(calculateProgressPercentage(50, -10)).toBe(0);

    // Test case 2: Current is less than target
    expect(calculateProgressPercentage(50, 100)).toBe(50);
    expect(calculateProgressPercentage(75, 150)).toBe(50);

    // Test case 3: Current is equal to target
    expect(calculateProgressPercentage(100, 100)).toBe(100);

    // Test case 4: Current is greater than target (should clamp at 100)
    expect(calculateProgressPercentage(150, 100)).toBe(100);
    expect(calculateProgressPercentage(1001, 1000)).toBe(100);
  });

  // Add other tests for ProgressCard component here
}) 