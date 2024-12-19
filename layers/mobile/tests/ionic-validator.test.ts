// Import testing utilities
import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';
import { ionicValidateInput } from '../utils/ionic-validator';

describe('ionicValidateInput', () => {
  it('validates input correctly with a regex', () => {
    const mockClassList = {
      add: vi.fn(),
      remove: vi.fn(),
    };

    const inputRef = ref({ $el: { classList: mockClassList } });
    const checkFun = /^[1-9][0-9]?$/;
    const modelRef = ref('');

    const validator = ionicValidateInput(inputRef, checkFun, modelRef);

    // Test valid input
    const event = {
      target: { value: '25' },
      type: 'input',
    } as unknown as Event;

    expect(validator(event)).toBe(true);
    expect(mockClassList.add).toHaveBeenCalledWith('ion-valid');
    expect(mockClassList.remove).toHaveBeenCalledWith('ion-invalid');

    // Reset mocks
    mockClassList.add.mockClear();
    mockClassList.remove.mockClear();

    // Test invalid input
    const invalidEvent = {
      target: { value: '-5' },
      type: 'input',
    } as unknown as Event;

    expect(validator(invalidEvent)).toBe(false);
    expect(mockClassList.add).toHaveBeenCalledWith('ion-invalid');
    expect(mockClassList.remove).toHaveBeenCalledWith('ion-valid');
  });

  it('adds ion-touched class on blur', () => {
    const mockClassList = {
      add: vi.fn(),
      remove: vi.fn(),
    };

    const inputRef = ref({ $el: { classList: mockClassList } });
    const checkFun = /^[1-9][0-9]?$/;

    const validator = ionicValidateInput(inputRef, checkFun);

    const blurEvent = { type: 'blur' } as unknown as Event;

    expect(validator(blurEvent)).toBe(null);
    expect(mockClassList.add).toHaveBeenCalledWith('ion-touched');
  });

  it('validates input with a custom function', () => {
    const mockClassList = {
      add: vi.fn(),
      remove: vi.fn(),
    };

    const inputRef = ref({ $el: { classList: mockClassList } });
    const checkFun = (value: string) => value === 'valid';
    const modelRef = ref('');

    const validator = ionicValidateInput(inputRef, checkFun, modelRef);

    // Test valid input
    expect(validator('valid')).toBe(true);
    expect(mockClassList.add).toHaveBeenCalledWith('ion-valid');
    expect(mockClassList.remove).toHaveBeenCalledWith('ion-invalid');

    // Reset mocks
    mockClassList.add.mockClear();
    mockClassList.remove.mockClear();

    // Test invalid input
    expect(validator('invalid')).toBe(false);
    expect(mockClassList.add).toHaveBeenCalledWith('ion-invalid');
    expect(mockClassList.remove).toHaveBeenCalledWith('ion-valid');
  });

  it('uses modelRef value when event is null', () => {
    const mockClassList = {
      add: vi.fn(),
      remove: vi.fn(),
    };

    const inputRef = ref({ $el: { classList: mockClassList } });
    const checkFun = /^[1-9][0-9]?$/;
    const modelRef = ref('42');

    const validator = ionicValidateInput(inputRef, checkFun, modelRef);

    expect(validator()).toBe(true);
    expect(validator(null)).toBe(true);
    expect(validator(undefined)).toBe(true);
    expect(mockClassList.add).toHaveBeenCalledWith('ion-valid');
    expect(mockClassList.remove).toHaveBeenCalledWith('ion-invalid');
  });
});
