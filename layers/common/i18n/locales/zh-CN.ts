export default {
  error: {
    authn: {
      unauthorized: '未经授权的请求',
      onlyUserPass: '仅支持账号密码方式登录',
      badCredentials: '密码错误',
      locked: '账号已锁定',
      disabled: '账号已禁用',
      expired: '账号已过期',
      credentialsExpired: '密码已过期',
      failureWaiting1: '密码错误，请{0}秒后重试',
    },
    authz: {
      accessDenied: '禁止访问',
    },
    assert: {
      true: '必须是true',
      false: '必须是false',
      null: '必须是null',
      notNull: '必须不是null',
      empty: '必须是空',
      notEmpty: '必须不是空',
      equal1: '必须等于{0}',
      notEqual1: '必须不等于{0}',
      greaterEqual1: '必须大于等于{0}',
      greater1: '必须大于{0}',
      lessEqual1: '必须小于等于{0}',
      less1: '必须小于{0}',
      true1: '{0}必须是true',
      false1: '{0}必须是false',
      null1: '{0}必须是null',
      notNull1: '{0}必须不是null',
      empty1: '{0}必须是空',
      notEmpty1: '{0}必须不是空',
      equal2: '{0}必须等于{1}',
      notEqual2: '{0}必须不等于{1}',
      greaterEqual2: '{0}必须大于等于{1}',
      greater2: '{0}必须大于{1}',
      lessEqual2: '{0}必须小于等于{1}',
      less2: '{0}必须小于{1}',
    },
    system: {
      message1: '系统错误，{0}',
    },
    fetcher: {
      400: '错误的请求，请检查输入',
      401: '未授权，请登录后重试',
      403: '禁止访问，无权限',
      404: '未找到，请检查 URL',
      405: '方法不允许，请检查请求方法',
      406: '不可接受，请检查 Accept 头',
      408: '请求超时，请稍后重试',
      409: '请求冲突，请检查请求内容',
      410: '资源已删除，不再可用',
      411: '需要指定长度，请提供 Content-Length',
      412: '前置条件未满足，请检查请求条件',
      413: '请求体过大，请检查请求内容',
      414: 'URI 过长，请检查 URL 长度',
      415: '不支持的媒体类型，请检查请求格式',
      417: '预期失败，请检查 Expect 头',
      422: '无法处理的实体，请检查请求内容',
      429: '请求过多，请稍后重试',
      500: '服务器内部错误，请稍后重试',
      501: '未实现，服务器不支持该请求',
      502: '网关错误，请稍后重试',
      503: '服务不可用，请稍后重试',
      504: '网关超时，请稍后重试',
      505: 'HTTP 版本不支持，请检查请求版本',
    },
  },
  ui: {
    button: {
      submit: '提交',
      cancel: '取消',
      confirm: '确认',
      close: '关闭',
      ok: '确定',
      back: '返回',
      next: '下一步',
      prev: '上一步',
      retry: '重试',
      delete: '删除',
      edit: '编辑',
      save: '保存',
      reset: '重置',
      clear: '清除',
      search: '搜索',
      filter: '过滤',
      sort: '排序',
    },
    label: {
      notice: '通知',
      error: '错误',
      warning: '警告',
      info: '信息',
      success: '成功',
    },
  },
};
