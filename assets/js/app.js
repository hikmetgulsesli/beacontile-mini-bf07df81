(function () {
  'use strict';

  const state = window.beaconState;
  const storage = window.beaconStorage;

  const els = {};

  function init() {
    cacheElements();
    hydrate();
    bindGlobalEvents();
    render();
    state.subscribe(function () {
      persist();
      render();
    });
    exposeRuntimeBridge();
  }

  function cacheElements() {
    els.root = document.querySelector('[data-setfarm-root]');
    els.navOperations = document.querySelector('[data-action-id="ACT_NAV_OPERATIONS"]');
    els.navEditor = document.querySelector('[data-action-id="ACT_NAV_EDITOR"]');
    els.navInsights = document.querySelector('[data-action-id="ACT_NAV_INSIGHTS"]');
    els.operationsView = document.getElementById('view-operations');
    els.editorView = document.getElementById('view-editor');
    els.insightsView = document.getElementById('view-insights');
    els.tileList = document.getElementById('tile-list');
    els.recordList = document.getElementById('record-list');
    els.recordSearch = document.querySelector('[data-action-id="ACT_SEARCH_RECORDS"]');
    els.createRecordBtn = document.querySelector('[data-action-id="ACT_CREATE_RECORD"]');
    els.editorForm = document.getElementById('record-editor-form');
    els.draftId = document.getElementById('draft-id');
    els.draftLabel = document.getElementById('draft-label');
    els.draftDetails = document.getElementById('draft-details');
    els.draftStatus = document.getElementById('draft-status');
    els.draftTags = document.getElementById('draft-tags');
    els.tagList = document.getElementById('tag-list');
    els.saveRecordBtn = document.querySelector('[data-action-id="ACT_SAVE_RECORD"]');
    els.cancelEditBtn = document.querySelector('[data-action-id="ACT_CANCEL_EDIT"]');
    els.resetBtn = document.querySelector('[data-action-id="ACT_RESET"]');
    els.exportBtn = document.querySelector('[data-action-id="ACT_EXPORT_SUMMARY"]');
    els.insightsFilter = document.querySelector('[data-action-id="ACT_FILTER_INSIGHTS"]');
    els.insightsMetrics = document.getElementById('insights-metrics');
    els.lastError = document.getElementById('last-error');
  }

  function hydrate() {
    const persisted = storage.load();
    if (persisted && Array.isArray(persisted.tiles)) {
      state.replace(persisted);
    }
  }

  function persist() {
    const result = storage.save(state.getState());
    if (result && !result.ok) {
      console.error('Failed to persist state:', result.error);
    }
  }

  function bindGlobalEvents() {
    if (els.navOperations) {
      els.navOperations.addEventListener('click', function (e) {
        e.preventDefault();
        state.setView('operations');
      });
    }
    if (els.navEditor) {
      els.navEditor.addEventListener('click', function (e) {
        e.preventDefault();
        state.createRecord();
      });
    }
    if (els.navInsights) {
      els.navInsights.addEventListener('click', function (e) {
        e.preventDefault();
        state.setView('insights');
      });
    }

    if (els.resetBtn) {
      els.resetBtn.addEventListener('click', function () {
        state.reset();
      });
    }

    if (els.exportBtn) {
      els.exportBtn.addEventListener('click', function () {
        const data = state.exportState();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'beacontile-mini-export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    if (els.createRecordBtn) {
      els.createRecordBtn.addEventListener('click', function () {
        state.createRecord();
      });
    }

    if (els.recordSearch) {
      els.recordSearch.addEventListener('input', function (e) {
        state.setSearchQuery(e.target.value);
      });
    }

    if (els.editorForm) {
      els.editorForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const draft = state.getState().draft;
        const record = {
          id: (els.draftId && els.draftId.value) || String(Date.now()),
          label: (els.draftLabel && els.draftLabel.value) || '',
          details: (els.draftDetails && els.draftDetails.value) || '',
          status: (els.draftStatus && els.draftStatus.value) || 'ok',
          tags: (draft && Array.isArray(draft.tags)) ? draft.tags.slice() : []
        };
        state.saveRecord(record);
      });
    }

    if (els.cancelEditBtn) {
      els.cancelEditBtn.addEventListener('click', function () {
        state.cancelEdit();
      });
    }

    if (els.insightsFilter) {
      els.insightsFilter.addEventListener('change', function (e) {
        state.setInsightsFilter(e.target.value);
      });
    }

    if (els.tileList) {
      els.tileList.addEventListener('click', function (e) {
        const toggleBtn = e.target.closest('[data-action-id="ACT_TOGGLE_TILE"]');
        if (toggleBtn) {
          const tileId = toggleBtn.getAttribute('data-tile-id');
          if (tileId) state.toggleTile(tileId);
          return;
        }
        const setBtn = e.target.closest('[data-action-id^="ACT_SET_TILE_"]');
        if (setBtn) {
          const tileId = setBtn.getAttribute('data-tile-id');
          const action = setBtn.getAttribute('data-action-id');
          const statusMap = {
            'ACT_SET_TILE_OK': 'ok',
            'ACT_SET_TILE_WARN': 'warn',
            'ACT_SET_TILE_DOWN': 'down'
          };
          if (tileId && statusMap[action]) state.setTileStatus(tileId, statusMap[action]);
        }
      });
    }

    if (els.draftTags) {
      els.draftTags.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const value = e.target.value.trim();
        if (!value) return;
        const current = state.getState().draft;
        if (!current) return;
        const tags = Array.isArray(current.tags) ? current.tags.slice() : [];
        if (!tags.includes(value)) tags.push(value);
        state.updateDraft({ tags: tags });
        e.target.value = '';
      });
    }

    if (els.tagList) {
      els.tagList.addEventListener('click', function (e) {
        const removeBtn = e.target.closest('[data-action-id="ACT_REMOVE_TAG"]');
        if (!removeBtn) return;
        const tag = removeBtn.getAttribute('data-tag');
        const current = state.getState().draft;
        if (!current || !tag) return;
        const tags = Array.isArray(current.tags) ? current.tags.slice() : [];
        state.updateDraft({ tags: tags.filter(function (t) { return t !== tag; }) });
      });
    }

    if (els.recordList) {
      els.recordList.addEventListener('click', function (e) {
        const editBtn = e.target.closest('[data-action-id="ACT_SELECT_RECORD"]');
        if (editBtn) {
          const recordId = editBtn.getAttribute('data-record-id');
          if (recordId) state.selectRecord(recordId);
          return;
        }
        const deleteBtn = e.target.closest('[data-action-id="ACT_DELETE_RECORD"]');
        if (deleteBtn) {
          const recordId = deleteBtn.getAttribute('data-record-id');
          if (recordId && confirm('Delete this record?')) state.deleteRecord(recordId);
        }
      });
    }
  }

  function render() {
    const s = state.getState();
    renderNav(s.activeView);
    renderTiles(s.tiles);
    renderRecords(s.records, s.searchQuery);
    renderEditor(s.draft);
    renderInsights(s);
    renderError(s.lastError);
    showView(s.activeView);
  }

  function renderNav(activeView) {
    [els.navOperations, els.navEditor, els.navInsights].forEach(function (el) {
      if (!el) return;
      el.classList.remove('active');
    });
    if (activeView === 'operations' && els.navOperations) els.navOperations.classList.add('active');
    if (activeView === 'editor' && els.navEditor) els.navEditor.classList.add('active');
    if (activeView === 'insights' && els.navInsights) els.navInsights.classList.add('active');
  }

  function showView(view) {
    if (els.operationsView) els.operationsView.hidden = view !== 'operations';
    if (els.editorView) els.editorView.hidden = view !== 'editor';
    if (els.insightsView) els.insightsView.hidden = view !== 'insights';
  }

  function renderTiles(tiles) {
    if (!els.tileList) return;
    els.tileList.innerHTML = tiles.map(function (tile) {
      return (
        '<article class="tile tile-' + escapeHtml(tile.status) + '" data-tile-id="' + escapeHtml(tile.id) + '">' +
        '<h3>' + escapeHtml(tile.label) + '</h3>' +
        '<span class="tile-status">' + escapeHtml(tile.status.toUpperCase()) + '</span>' +
        '<button type="button" class="tile-toggle" data-action-id="ACT_TOGGLE_TILE" data-tile-id="' + escapeHtml(tile.id) + '">Toggle</button>' +
        '<div class="tile-actions">' +
        '<button type="button" data-action-id="ACT_SET_TILE_OK" data-tile-id="' + escapeHtml(tile.id) + '">OK</button>' +
        '<button type="button" data-action-id="ACT_SET_TILE_WARN" data-tile-id="' + escapeHtml(tile.id) + '">Warn</button>' +
        '<button type="button" data-action-id="ACT_SET_TILE_DOWN" data-tile-id="' + escapeHtml(tile.id) + '">Down</button>' +
        '</div>' +
        '</article>'
      );
    }).join('');
  }

  function renderRecords(records, query) {
    if (!els.recordList) return;
    const q = (query || '').toLowerCase();
    const filtered = records.filter(function (r) {
      return !q || (r.label && r.label.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      els.recordList.innerHTML = '<p class="empty">No records found.</p>';
      return;
    }

    els.recordList.innerHTML = filtered.map(function (r) {
      return (
        '<div class="record-card" data-record-id="' + escapeHtml(r.id) + '">' +
        '<div class="record-title">' + escapeHtml(r.label) + ' <span class="badge badge-' + escapeHtml(r.status) + '">' + escapeHtml(r.status) + '</span></div>' +
        '<div class="record-actions">' +
        '<button type="button" data-action-id="ACT_SELECT_RECORD" data-record-id="' + escapeHtml(r.id) + '">edit</button>' +
        '<button type="button" data-action-id="ACT_DELETE_RECORD" data-record-id="' + escapeHtml(r.id) + '">PURGE</button>' +
        '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderEditor(draft) {
    if (!els.editorForm) return;
    if (!draft) {
      els.editorForm.reset();
      if (els.draftId) els.draftId.readOnly = false;
      if (els.tagList) els.tagList.innerHTML = '';
      return;
    }
    if (els.draftId) {
      els.draftId.value = draft.id || '';
      els.draftId.readOnly = !!draft.id;
    }
    if (els.draftLabel) els.draftLabel.value = draft.label || '';
    if (els.draftDetails) els.draftDetails.value = draft.details || '';
    if (els.draftStatus) els.draftStatus.value = draft.status || 'ok';
    renderTags(draft.tags);
  }

  function renderTags(tags) {
    if (!els.tagList) return;
    const list = Array.isArray(tags) ? tags : [];
    if (list.length === 0) {
      els.tagList.innerHTML = '';
      return;
    }
    els.tagList.innerHTML = list.map(function (tag) {
      return (
        '<span class="tag-chip">' + escapeHtml(tag) +
        '<button type="button" data-action-id="ACT_REMOVE_TAG" data-tag="' + escapeHtml(tag) + '" aria-label="Remove ' + escapeHtml(tag) + '">&times;</button>' +
        '</span>'
      );
    }).join('');
  }

  function renderInsights(s) {
    if (!els.insightsMetrics) return;
    const counts = { ok: 0, warn: 0, down: 0 };
    s.tiles.forEach(function (t) {
      if (counts[t.status] !== undefined) counts[t.status]++;
    });
    const totalRecords = s.records.length;
    const filter = s.insightsFilter;
    const visibleTiles = filter === 'all' ? s.tiles : s.tiles.filter(function (t) { return t.status === filter; });

    els.insightsMetrics.innerHTML =
      '<div class="metric"><span class="metric-value">' + counts.ok + '</span><span class="metric-label">OK</span></div>' +
      '<div class="metric"><span class="metric-value">' + counts.warn + '</span><span class="metric-label">Warn</span></div>' +
      '<div class="metric"><span class="metric-value">' + counts.down + '</span><span class="metric-label">Down</span></div>' +
      '<div class="metric"><span class="metric-value">' + totalRecords + '</span><span class="metric-label">Records</span></div>' +
      '<div class="tile-summary">' + visibleTiles.map(function (t) {
        return '<span class="badge badge-' + t.status + '">' + escapeHtml(t.label) + '</span>';
      }).join(' ') + '</div>';
  }

  function renderError(error) {
    if (!els.lastError) return;
    if (!error) {
      els.lastError.hidden = true;
      els.lastError.textContent = '';
      return;
    }
    els.lastError.hidden = false;
    els.lastError.textContent = error;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function exposeRuntimeBridge() {
    window.app = {
      state: state.getState(),
      actions: {
        toggleTile: state.toggleTile,
        setTileStatus: state.setTileStatus,
        reset: state.reset,
        setView: state.setView,
        createRecord: state.createRecord,
        selectRecord: state.selectRecord,
        saveRecord: state.saveRecord,
        cancelEdit: state.cancelEdit,
        deleteRecord: state.deleteRecord,
        setSearchQuery: state.setSearchQuery,
        setInsightsFilter: state.setInsightsFilter
      },
      getState: state.getState,
      reset: state.reset,
      setTileStatus: state.setTileStatus
    };

    // Keep the exposed state fresh after every update.
    state.subscribe(function (snapshot) {
      window.app.state = snapshot;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
