import i18n from '../i18n';

export const apiFetch = (url, options = {}) => {
  options.headers = options.headers || {};
  options.headers['Accept-Language'] = i18n.language || 'he';
  return fetch(url, options);
};

export default apiFetch;
