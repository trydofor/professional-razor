import { describe, expect, it } from 'vitest';

describe('ClassThrown helpers', () => {
  it('creates NavigateThrown with route payload', () => {
    const route = { name: 'home' };
    const thrown = new NavigateThrown(route);
    expect(thrown.name).toBe('NavigateThrown');
    expect(thrown.route).toBe(route);
  });

  it('creates IgnoredThrown with custom message', () => {
    const thrown = new IgnoredThrown('skip this');
    expect(thrown.name).toBe('IgnoredThrown');
    expect(thrown.message).toBe('skip this');
  });

  it('creates DataThrown with arbitrary payload', () => {
    const payload = { foo: 'bar' };
    const thrown = new DataThrown('custom', payload);
    expect(thrown.name).toBe('DataThrown');
    expect(thrown.type).toBe('custom');
    expect(thrown.data).toBe(payload);
  });

  it('wraps notify data in NotifyThrown', () => {
    const notifyFromString = new NotifyThrown({ message: 'warning', notifyLevel: GlobalNotifyLevel.Warning });
    expect(notifyFromString.notify).toMatchObject({ message: 'warning', notifyLevel: GlobalNotifyLevel.Warning });

    const notifyFromObject = new NotifyThrown({
      message: 'ok',
      notifyLevel: GlobalNotifyLevel.Success,
      notifyStyle: GlobalNotifyStyle.Toast,
    });
    expect(notifyFromObject.notify).toMatchObject({
      message: 'ok',
      notifyLevel: GlobalNotifyLevel.Success,
      notifyStyle: GlobalNotifyStyle.Toast,
    });
  });

  it('creates NoticeThrown from arrays and varargs', () => {
    const noticeA = { message: 'A' } as I18nNotice;
    const noticeB = { message: 'B' } as I18nNotice;

    const fromArray = new NoticeThrown([noticeA, noticeB]);
    expect(fromArray.notices).toEqual([noticeA, noticeB]);

    const fromArgs = new NoticeThrown(noticeA, noticeB);
    expect(fromArgs.notices).toEqual([noticeA, noticeB]);
  });
});
