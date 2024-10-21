import { describe, it, expect, vi } from 'vitest';
import { ref, nextTick } from 'vue';
import { selectElement, focusElement, scrollElement } from '../utils/element-action';

describe('selectElement', () => {
  it('should return the element by id', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'test-element';
    document.body.appendChild(mockElement);

    const result = selectElement('test-element');
    expect(result).toBe(mockElement);

    // Clean up
    document.body.removeChild(mockElement);
  });

  it('should return the element from Ref', () => {
    const mockElement = document.createElement('div');
    const mockRef = ref({ $el: mockElement });

    const result = selectElement(mockRef);
    expect(result).toBe(mockElement);
  });
});

describe('focusElement', () => {
  it('should call setFocus if the method exists', async () => {
    const mockElement = {
      setFocus: vi.fn(),
      scrollIntoView: vi.fn(),
    };
    const mockRef = ref({ $el: mockElement });

    await focusElement(mockRef);
    await nextTick(); // wait for nextTick

    expect(mockElement.setFocus).toHaveBeenCalled();
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
  });

  it('should call focus if setFocus does not exist', async () => {
    const mockElement = {
      focus: vi.fn(),
      scrollIntoView: vi.fn(),
    };
    const mockRef = ref({ $el: mockElement });

    await focusElement(mockRef);
    await nextTick(); // wait for nextTick

    expect(mockElement.focus).toHaveBeenCalled();
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
  });
});

describe('scrollElement', () => {
  it('should call scrollIntoView', async () => {
    const mockElement = {
      scrollIntoView: vi.fn(),
    };
    const mockRef = ref({ $el: mockElement });

    await scrollElement(mockRef);
    await nextTick(); // wait for nextTick

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
  });
});
