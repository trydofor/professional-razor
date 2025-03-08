export default {
  error: {
    assert: {
      true: 'must be true',
      false: 'must be false',
      null: 'must be null',
      notNull: 'must not be null',
      empty: 'must be empty',
      notEmpty: 'must not be empty',
      equal1: 'must equal {0}',
      notEqual1: 'must not equal {0}',
      greaterEqual1: 'must be greater than or equal to {0}',
      greater1: 'must be greater than {0}',
      lessEqual1: 'must be less than or equal to {0}',
      less1: 'must be less than {0}',
      true1: '{0} must be true',
      false1: '{0} must be false',
      null1: '{0} must be null',
      notNull1: '{0} must not be null',
      empty1: '{0} must be empty',
      notEmpty1: '{0} must not be empty',
      equal2: '{0} must equal {1}',
      notEqual2: '{0} must not equal {1}',
      greaterEqual2: '{0} must be greater than or equal to {1}',
      greater2: '{0} must be greater than {1}',
      lessEqual2: '{0} must be less than or equal to {1}',
      less2: '{0} must be less than {1}',
    },
    system: {
      message1: 'system error, {0}',
    },
    fetcher: {
      400: 'bad request, please check the input',
      401: 'unauthorized, login and try again',
      403: 'forbidden, access denied',
      404: 'not found, please check the url',
      405: 'method not allowed, please check the method',
      406: 'not acceptable, please check the accept',
      408: 'request timeout, please try again later',
      409: 'conflict, please check the request',
      413: 'payload too large, please check the payload',
      415: 'unsupported media type, please check the media type',
      422: 'unprocessable entity, please check the entity',
      429: 'too many requests, please try again later',
      500: 'internal server error, please try again later',
      502: 'bad gateway, please try again later',
      503: 'service unavailable, please try again later',
      504: 'gateway timeout, please try again later',
    },
  },
  ui: {
    button: {
      submit: 'Submit',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      ok: 'OK',
      back: 'Back',
      next: 'Next',
      prev: 'Prev',
      retry: 'Retry',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      reset: 'Reset',
      clear: 'Clear',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
    },
    label: {
      notice: 'Notice',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      success: 'Success',
    },
  },
};
