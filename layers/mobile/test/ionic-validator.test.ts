// Import testing utilities
import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';
import { validateIonicInput } from '../utils/ionic-validator';

// Mock Ionic IonInput component
const mockClassList = {
  add: vi.fn(),
  remove: vi.fn(),
};

const mockInputRef = ref({
  $el: {
    classList: mockClassList,
  },
});

describe('validateIonicInput', () => {
  // Test case: valid input using regex pattern
  it('should add ion-valid class for valid input', () => {
    const validateFn = validateIonicInput(mockInputRef, /^[1-9][0-9]?$/);

    // Simulate valid input
    const inputEvent = { target: { value: '10' } } as unknown as Event;
    const result = validateFn(inputEvent);

    expect(result).toBe(true);
    expect(mockClassList.add).toHaveBeenCalledWith('ion-valid');
    expect(mockClassList.remove).toHaveBeenCalledWith('ion-invalid');
  });

  // Test case: invalid input using regex pattern
  it('should add ion-invalid class for invalid input', () => {
    const validateFn = validateIonicInput(mockInputRef, /^[1-9][0-9]?$/);

    // Simulate invalid input
    const inputEvent = { target: { value: '100' } } as unknown as Event;
    const result = validateFn(inputEvent);

    expect(result).toBe(false);
    expect(mockClassList.add).toHaveBeenCalledWith('ion-invalid');
    expect(mockClassList.remove).toHaveBeenCalledWith('ion-valid');
  });

  // Test case: input blur event
  it('should add ion-touched class on blur', () => {
    const validateFn = validateIonicInput(mockInputRef, /^[1-9][0-9]?$/);

    // Simulate blur event
    const blurEvent = new Event('blur');
    const result = validateFn(blurEvent);

    expect(result).toBeNull();
    expect(mockClassList.add).toHaveBeenCalledWith('ion-touched');
  });

  // Test case: direct string input
  it('should add ion-valid class for valid string input', () => {
    const validateFn = validateIonicInput(mockInputRef, /^[1-9][0-9]?$/);

    // Simulate valid string input
    const result = validateFn('5');

    expect(result).toBe(true);
    expect(mockClassList.add).toHaveBeenCalledWith('ion-valid');
    expect(mockClassList.remove).toHaveBeenCalledWith('ion-invalid');
  });

  // Test case: invalid string input
  it('should add ion-invalid class for invalid string input', () => {
    const validateFn = validateIonicInput(mockInputRef, /^[1-9][0-9]?$/);

    // Simulate invalid string input
    const result = validateFn('100');

    expect(result).toBe(false);
    expect(mockClassList.add).toHaveBeenCalledWith('ion-invalid');
    expect(mockClassList.remove).toHaveBeenCalledWith('ion-valid');
  });
});
