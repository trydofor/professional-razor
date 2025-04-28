import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

describe('useVueErrorHandler', () => {
  describe('handleError', () => {
    it('should handle synchronous errors', () => {
      // Child component that triggers the error
      const ChildComponent = defineComponent({
        setup() {
          const { handleError } = useVueErrorHandler();
          return {
            throwError: () => handleError(new Error('Test error')),
          };
        },
        template: '<div></div>',
      });

      // Parent component that captures the error
      const ParentComponent = defineComponent({
        setup() {
          onErrorCaptured(() => {
            return false; // prevent error from propagating
          });
          return () => h(ChildComponent);
        },
      });

      const wrapper = mount(ParentComponent);
      const child = wrapper.findComponent(ChildComponent);
      expect(() => child.vm.throwError()).not.toThrow();
    });
  });

  describe('handleCatch', () => {
    it('should handle synchronous functions without errors', () => {
      // Child component with successful execution
      const ChildComponent = defineComponent({
        setup() {
          const { handleCatch } = useVueErrorHandler();
          return {
            execSuccess: () => handleCatch(() => 'success'),
          };
        },
        template: '<div></div>',
      });

      // Parent component with error boundary
      const ParentComponent = defineComponent({
        setup() {
          onErrorCaptured(() => {
            return false; // prevent error from propagating
          });
          return () => h(ChildComponent);
        },
      });

      const wrapper = mount(ParentComponent);
      const child = wrapper.findComponent(ChildComponent);
      expect(child.vm.execSuccess()).toBe('success');
    });

    it('should catch synchronous errors', () => {
      // Child component that throws an error
      const ChildComponent = defineComponent({
        setup() {
          const { handleCatch } = useVueErrorHandler();
          return {
            execError: () => handleCatch(() => {
              throw new Error('Sync error');
            }),
          };
        },
        template: '<div></div>',
      });

      // Parent component with error boundary
      const ParentComponent = defineComponent({
        setup() {
          onErrorCaptured(() => {
            return false; // prevent error from propagating
          });
          return () => h(ChildComponent);
        },
      });

      const wrapper = mount(ParentComponent);
      const child = wrapper.findComponent(ChildComponent);

      // Should not throw when executed
      expect(() => child.vm.execError()).not.toThrow();
    });

    it('should handle successful promises', async () => {
      // Child component with async success
      const ChildComponent = defineComponent({
        setup() {
          const { handleCatch } = useVueErrorHandler();
          return {
            execAsync: () => handleCatch(async () => 'async success'),
          };
        },
        template: '<div></div>',
      });

      // Parent component with error boundary
      const ParentComponent = defineComponent({
        setup() {
          onErrorCaptured(() => {
            return false; // prevent error from propagating
          });
          return () => h(ChildComponent);
        },
      });

      const wrapper = mount(ParentComponent);
      const child = wrapper.findComponent(ChildComponent);
      const result = await child.vm.execAsync();
      expect(result).toBe('async success');
    });

    it('should catch promise rejections', async () => {
      // Child component that throws async error
      const ChildComponent = defineComponent({
        setup() {
          const { handleCatch } = useVueErrorHandler();
          return {
            execAsyncError: () => handleCatch(async () => {
              // console.log('>>> ChildComponent execAsyncError');
              throw new Error('Async error');
            }),
          };
        },
        template: '<div></div>',
      });

      // Parent component with error boundary
      const ParentComponent = defineComponent({
        setup() {
          onErrorCaptured(() => {
            // console.log('>>> promise rejections onErrorCaptured');
            return false; // prevent error from propagating
          });
          return () => h(ChildComponent);
        },
      });

      const wrapper = mount(ParentComponent);
      const child = wrapper.findComponent(ChildComponent);

      // Should not throw when executed
      await expect(child.vm.execAsyncError()).resolves.toBeUndefined();
    });
  });
});
