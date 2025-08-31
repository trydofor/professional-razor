import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RunModeBar from '../components/RunModeBar.vue';

vi.setConfig({ testTimeout: 10000 });

vi.useFakeTimers();

const mockFetch = vi.fn();
vi.stubGlobal('$fetch', mockFetch);

describe('RunModeBar.vue', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('renders correctly for Develop', async () => {
    const wrapper = mount(RunModeBar, {
      props: { runMode: 'Develop' },
      global: { stubs: { Teleport: true } },
    });
    await vi.runAllTimersAsync();
    expect(wrapper.html()).toContain('#3b82f6');
  });

  it('renders correctly for Test', async () => {
    const wrapper = mount(RunModeBar, {
      props: { runMode: 'Test' },
      global: { stubs: { Teleport: true } },
    });
    await vi.runAllTimersAsync();
    expect(wrapper.html()).toContain('#22c55e');
  });

  it('renders with custom barSize', async () => {
    const wrapper = mount(RunModeBar, {
      props: { runMode: 'Test', barSize: 10 },
      global: { stubs: { Teleport: true } },
    });
    await vi.runAllTimersAsync();
    expect(wrapper.html()).toContain('10px');
  });

  it('hides and reappears after custom time', async () => {
    const wrapper = mount(RunModeBar, {
      props: { runMode: 'Develop', barHide: 1 },
      global: { stubs: { Teleport: true } },
    });
    await vi.runAllTimersAsync();

    const div = wrapper.find('div');
    expect(div.exists()).toBe(true);
    await div.trigger('click');
    expect((wrapper.vm as SafeAny).runModeStyle.display).toBe('none');

    await vi.advanceTimersByTimeAsync(2000);
    expect((wrapper.vm as SafeAny).runModeStyle.display).toBe('block');
  });

  it('uses fallback API when runMode is not provided', async () => {
    mockFetch.mockResolvedValueOnce('dev');
    const wrapper = mount(RunModeBar, {
      props: {},
      global: { stubs: { Teleport: true } },
    });
    await vi.runAllTimersAsync();
    expect(mockFetch).toHaveBeenCalled();
    expect(wrapper.html()).toContain('#3b82f6');
  });

  it('accepts async function as runMode', async () => {
    const wrapper = mount(RunModeBar, {
      props: { runMode: async () => 'Test' },
      global: { stubs: { Teleport: true } },
    });
    await vi.runAllTimersAsync();
    expect(wrapper.html()).toContain('#22c55e');
  });

  it('renders nothing when unknown runMode is given', async () => {
    const wrapper = mount(RunModeBar, {
      props: { runMode: 'Nothing' },
      global: { stubs: { Teleport: true } },
    });
    await vi.runAllTimersAsync();
    expect(wrapper.html()).not.toContain('background-color');
  });

  it('supports left side bar rendering', async () => {
    const wrapper = mount(RunModeBar, {
      props: { runMode: 'Develop', barSide: 'left', barSize: 5 },
      global: { stubs: { Teleport: true } },
    });
    await vi.runAllTimersAsync();
    expect(wrapper.html()).toContain('width: 5px');
  });
});
