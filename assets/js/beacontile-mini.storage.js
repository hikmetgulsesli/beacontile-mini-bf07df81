(function () {
  'use strict';

  const STORAGE_KEY = 'beacontile-mini-state';

  function isAvailable() {
    try {
      const test = '__beacontile_storage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  function save(value) {
    if (!isAvailable()) return { ok: false, error: 'storage_unavailable' };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || 'save_failed' };
    }
  }

  function load() {
    if (!isAvailable()) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clear() {
    if (!isAvailable()) return { ok: false, error: 'storage_unavailable' };
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message || 'clear_failed' };
    }
  }

  window.beaconStorage = {
    STORAGE_KEY,
    isAvailable,
    save,
    load,
    clear
  };
})();
