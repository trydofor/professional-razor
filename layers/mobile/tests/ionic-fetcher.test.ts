import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadingController, alertController } from '@ionic/vue';
import type { DataResult, PageResult } from '&razor-common/types/common-result';

vi.mock('@ionic/vue', () => ({
  alertController: {
    create: vi.fn().mockResolvedValue({ present: vi.fn() }),
  },
  loadingController: {
    create: vi.fn().mockResolvedValue({ present: vi.fn(), dismiss: vi.fn() }),
  },
}));

describe('defaultFetchAlerter', () => {
  it('should return an alert when error is null', () => {
    const result = { message: 'Test error' };
    const alertResult = defaultFetchAlerter(result, null);
    expect(alertResult.alert).toBeDefined();
    expect(alertResult.alert?.header).toBe('Data Processing Error');
    expect(alertResult.alert?.message).toBe('Test error');
  });

  it('should return network error alert when error is present', () => {
    const error = new Error('Network error');
    const alertResult = defaultFetchAlerter(null, error);
    expect(alertResult.alert).toBeDefined();
    expect(alertResult.alert?.header).toBe('Network Request Error');
    expect(alertResult.alert?.message).toBe('Network error');
    expect(alertResult.result).toEqual({ success: false });
  });
});

describe('ionicFetchResult', () => {
  it('should return data when fetch succeeds', async () => {
    const mockData = { success: true, data: 'Test' };
    const fetching = vi.fn().mockResolvedValue(mockData);
    const result = await ionicFetchResult(fetching);
    expect(result).toEqual(mockData);
  });

  it('should handle error and show alert', async () => {
    const fetching = vi.fn().mockRejectedValue(new Error('Fetch failed'));
    const result = await ionicFetchResult(fetching, { alerter: defaultFetchAlerter });
    expect(result).toEqual({ success: false });
    expect(alertController.create).toHaveBeenCalled();
  });
});

describe('ionicFetchData', () => {
  it('should return DataResult on success', async () => {
    const mockData = { success: true, data: 'Test' };
    const fetching = vi.fn().mockResolvedValue(mockData);
    const result = await ionicFetchData(fetching);
    expect(result).toEqual(mockData);
  });
});

describe('ionicFetchPage', () => {
  it('should return PageResult on success', async () => {
    const mockData = { success: true, data: ['item1', 'item2'], page: 1 } as PageResult<string>;
    const fetching = vi.fn().mockResolvedValue(mockData);
    const result = await ionicFetchPage(fetching);
    expect(result).toEqual(mockData);
  });
});
