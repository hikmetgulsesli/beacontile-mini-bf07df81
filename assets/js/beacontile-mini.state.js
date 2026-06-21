(function () {
  'use strict';

  const STATUS_ORDER = ['ok', 'warn', 'down'];

  const DEFAULT_STATE = Object.freeze({
    tiles: [
      { id: 'tile-1', label: 'Service A', status: 'ok' },
      { id: 'tile-2', label: 'Service B', status: 'warn' },
      { id: 'tile-3', label: 'Service C', status: 'down' }
    ],
    records: [],
    activeView: 'operations',
    searchQuery: '',
    insightsFilter: 'all',
    draft: null,
    lastError: null
  });

  let state = clone(DEFAULT_STATE);
  const listeners = [];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getState() {
    return clone(state);
  }

  function emit() {
    const snapshot = getState();
    const targets = listeners.slice();
    targets.forEach(function (cb) {
      try {
        cb(snapshot);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('state listener error', err);
      }
    });
  }

  function set(patch) {
    state = { ...state, ...patch };
    emit();
  }

  function replace(next) {
    state = clone(next);
    emit();
  }

  function subscribe(cb) {
    listeners.push(cb);
    return function unsubscribe() {
      const idx = listeners.indexOf(cb);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function setTileStatus(id, status) {
    if (!STATUS_ORDER.includes(status)) return;
    set({
      tiles: state.tiles.map(t => (t.id === id ? { ...t, status } : t)),
      lastError: null
    });
  }

  function toggleTile(id) {
    set({
      tiles: state.tiles.map(t => {
        if (t.id !== id) return t;
        const idx = STATUS_ORDER.indexOf(t.status);
        const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
        return { ...t, status: next };
      }),
      lastError: null
    });
  }

  function reset() {
    replace(DEFAULT_STATE);
  }

  function exportState() {
    return JSON.stringify(getState(), null, 2);
  }

  function setView(view) {
    if (!['operations', 'editor', 'insights'].includes(view)) return;
    set({ activeView: view, draft: null, lastError: null });
  }

  function setSearchQuery(query) {
    set({ searchQuery: String(query) });
  }

  function setInsightsFilter(filter) {
    set({ insightsFilter: String(filter) });
  }

  function createRecord() {
    set({
      draft: { id: 'rec-' + Date.now(), label: '', status: 'ok', details: '', tags: [] },
      activeView: 'editor'
    });
  }

  function selectRecord(id) {
    const record = state.records.find(r => r.id === id);
    if (record) {
      set({ draft: clone(record), activeView: 'editor', lastError: null });
    }
  }

  function saveRecord(record) {
    if (!record || !record.id || !record.label) {
      set({ lastError: 'Record ID and label are required.' });
      return;
    }
    const nextRecords = state.records.filter(r => r.id !== record.id);
    nextRecords.push(clone(record));
    set({ records: nextRecords, draft: null, activeView: 'operations', lastError: null });
  }

  function cancelEdit() {
    set({ draft: null, activeView: 'operations', lastError: null });
  }

  function updateDraft(patch) {
    if (!state.draft) return;
    set({ draft: { ...state.draft, ...patch } });
  }

  function retryLoad() {
    set({ lastError: null });
  }

  function deleteRecord(id) {
    set({ records: state.records.filter(r => r.id !== id), lastError: null });
  }

  window.beaconState = {
    getState,
    subscribe,
    replace,
    setTileStatus,
    toggleTile,
    reset,
    exportState,
    setView,
    setSearchQuery,
    setInsightsFilter,
    createRecord,
    selectRecord,
    saveRecord,
    cancelEdit,
    updateDraft,
    retryLoad,
    deleteRecord,
    defaultState: () => clone(DEFAULT_STATE)
  };
})();
