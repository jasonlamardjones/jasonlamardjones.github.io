/*
 * Phase 1 renderer for this prototype section only.
 * - Renders all user-facing strings from the config file (tokens); no brand
 *   string is hard-coded here.
 * - English renders by default. PT fields exist in config/data but no
 *   language toggle is wired in Phase 1 (structure-only decision).
 * - No analytics, no persistence, no free-text input, no external requests
 *   beyond the two local JSON data files.
 */
(function () {
  'use strict';

  var C = window.PRASA_CONFIG;
  var LANG = 'en';

  /* ---------- string helpers ---------- */

  function t(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    var s = value[LANG] != null ? value[LANG] : value.en;
    return s == null ? '' : s;
  }

  function resolve(path) {
    var cur = C;
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return null;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function subBrand(s) {
    return String(s).split('[BRAND_NAME]').join(t(C.BRAND_NAME));
  }

  function text(pathOrValue) {
    var v = typeof pathOrValue === 'string' ? resolve(pathOrValue) : pathOrValue;
    return subBrand(t(v));
  }

  function el(tag, className, content) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (content != null) node.textContent = content;
    return node;
  }

  /* ---------- token rendering (all pages) ---------- */

  function renderTokens() {
    var nodes = document.querySelectorAll('[data-t]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = text(nodes[i].getAttribute('data-t'));
    }
    var boundaries = document.querySelectorAll('[data-boundary-short]');
    for (var j = 0; j < boundaries.length; j++) {
      boundaries[j].textContent = text(C.BOUNDARY_SHORT);
    }
  }

  function renderTitle() {
    var page = document.body.getAttribute('data-page');
    var pageTitle = page && C.PAGE_TITLES[page] ? t(C.PAGE_TITLES[page]) : '';
    document.title = pageTitle ? pageTitle + ' · ' + t(C.BRAND_NAME) : t(C.BRAND_NAME);
  }

  function fetchJson(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + path);
      return res.json();
    });
  }

  /* ---------- station grid (home) ---------- */

  var STATION_ORDER = [
    { key: 'guide', href: null },
    { key: 'works', href: null },
    { key: 'learn', href: null },
    { key: 'board', href: 'board.html' },
    { key: 'business', href: null },
    { key: 'start', href: 'start.html' }
  ];

  function renderStations(container) {
    STATION_ORDER.forEach(function (station) {
      var li = el('li', 'station-card');
      var label = t(C.STATION_LABELS[station.key]);
      var promise = t(C.STATION_PROMISES[station.key]);
      var body;
      if (station.href) {
        body = el('a', 'station-link');
        body.href = station.href;
        li.appendChild(body);
      } else {
        body = li;
      }
      body.appendChild(el('h3', null, label));
      body.appendChild(el('p', null, promise));
      var tag = el('span', 'tag ' + (station.href ? 'open' : 'soon'),
        t(station.href ? C.STATION_STATUS.open : C.STATION_STATUS.coming_soon));
      body.appendChild(tag);
      container.appendChild(li);
    });
  }

  /* ---------- board rendering (board page + home preview) ---------- */

  function boardCard(item) {
    var li = el('li', 'board-card');
    var card = el('article');
    card.appendChild(el('h3', null, t(item.title)));
    card.appendChild(el('p', 'status', t(C.BOARD.labels.status) + ': ' + t(item.status)));
    card.appendChild(el('p', null, t(item.what)));

    var dl = el('dl');
    function row(labelToken, value) {
      dl.appendChild(el('dt', null, t(labelToken)));
      dl.appendChild(el('dd', null, value));
    }
    row(C.BOARD.labels.deadline, t(item.deadline));
    row(C.BOARD.labels.who, t(item.who));
    row(C.BOARD.labels.posted, t(item.posted));
    card.appendChild(dl);

    if (item.link) {
      var a = el('a', 'btn ghost', t(C.BOARD.labels.link));
      a.href = item.link;
      a.target = '_blank';
      a.rel = 'noopener';
      card.appendChild(a);
      card.appendChild(el('span', 'link-note', t(C.BOARD.link_note)));
    }
    li.appendChild(card);
    return li;
  }

  function renderBoard(container, limit) {
    /* QA hook: ?demo=empty exercises the empty state without editing data. */
    var forceEmpty = /[?&]demo=empty(&|$)/.test(window.location.search);
    fetchJson('data/board.json').then(function (data) {
      var items = (data && data.items) || [];
      if (forceEmpty) items = [];
      if (!items.length) {
        var empty = el('p', 'board-empty', t(C.BOARD.empty_state));
        container.parentNode.replaceChild(empty, container);
        return;
      }
      if (limit) items = items.slice(0, limit);
      items.forEach(function (item) {
        container.appendChild(boardCard(item));
      });
    }).catch(function () {
      var err = el('p', 'notice', t(C.BOARD.load_error));
      container.parentNode.replaceChild(err, container);
    });
  }

  /* ---------- about page (full boundary + about sections) ---------- */

  function renderBoundaryFull(container) {
    C.BOUNDARY_FULL.forEach(function (block) {
      var section = el('section');
      section.appendChild(el('h2', null, text(block.heading)));
      section.appendChild(el('p', null, text(block.body)));
      container.appendChild(section);
    });
  }

  function renderAboutList(container, items) {
    items.forEach(function (item) {
      container.appendChild(el('li', null, text(item)));
    });
  }

  /* ---------- finder (tap-only, no persistence) ---------- */

  function initFinder(ids) {
    var questionBox = document.getElementById(ids.question);
    var optionsBox = document.getElementById(ids.options);
    var resultBox = document.getElementById(ids.result);
    var backBtn = document.getElementById(ids.back);
    var restartBtn = document.getElementById(ids.restart);

    backBtn.textContent = t(C.FINDER.back);
    restartBtn.textContent = t(C.FINDER.restart);

    fetchJson('data/finder-tree.json').then(function (tree) {
      var trail = [];

      function clear(node) {
        while (node.firstChild) node.removeChild(node.firstChild);
      }

      function renderLeaf(leaf) {
        clear(questionBox);
        clear(optionsBox);
        clear(resultBox);
        if (leaf.coming_soon) {
          resultBox.appendChild(el('span', 'tag-soon', t(C.FINDER.coming_soon_tag)));
        }
        resultBox.appendChild(el('p', 'step-label', t(C.FINDER.result_station_label)));
        resultBox.appendChild(el('p', 'station-name', t(C.STATION_LABELS[leaf.station])));
        resultBox.appendChild(el('p', 'step-label', t(C.FINDER.first_step_label)));
        resultBox.appendChild(el('p', 'step-text', t(leaf.first_step_text)));
        if (leaf.station === 'board') {
          var go = el('a', 'btn', t(C.FINDER.open_board_cta));
          go.href = 'board.html';
          resultBox.appendChild(go);
        }
        backBtn.hidden = false;
        restartBtn.hidden = false;
        resultBox.setAttribute('tabindex', '-1');
        resultBox.focus();
      }

      function renderNode(nodeId) {
        var node = tree.nodes[nodeId];
        if (!node) return;
        if (node.leaf) {
          renderLeaf(node.leaf);
          return;
        }
        clear(resultBox);
        clear(questionBox);
        clear(optionsBox);
        questionBox.appendChild(el('h2', null, t(node.question)));
        node.options.forEach(function (option) {
          var btn = el('button', null, t(option.label));
          btn.type = 'button';
          btn.addEventListener('click', function () {
            trail.push(nodeId);
            renderNode(option.next);
          });
          optionsBox.appendChild(btn);
        });
        backBtn.hidden = trail.length === 0;
        restartBtn.hidden = trail.length === 0;
      }

      backBtn.addEventListener('click', function () {
        var prev = trail.pop();
        renderNode(prev || tree.root);
      });

      restartBtn.addEventListener('click', function () {
        trail = [];
        renderNode(tree.root);
      });

      renderNode(tree.root);
    }).catch(function () {
      questionBox.textContent = '';
      optionsBox.textContent = '';
      resultBox.textContent = t(C.FINDER.load_error);
    });
  }

  /* ---------- boot ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    renderTitle();
    renderTokens();

    var stations = document.getElementById('stationGrid');
    if (stations) renderStations(stations);

    var boardList = document.getElementById('boardList');
    if (boardList) renderBoard(boardList, 0);

    var boardPreview = document.getElementById('boardPreview');
    if (boardPreview) renderBoard(boardPreview, 3);

    var whatIs = document.getElementById('aboutWhatIs');
    if (whatIs) renderAboutList(whatIs, C.ABOUT.what_is_items);

    var whatNot = document.getElementById('aboutWhatNot');
    if (whatNot) renderAboutList(whatNot, C.ABOUT.what_not_items);

    var boundaryFull = document.getElementById('boundaryFull');
    if (boundaryFull) renderBoundaryFull(boundaryFull);

    if (document.getElementById('finderOptions')) {
      initFinder({
        question: 'finderQuestion',
        options: 'finderOptions',
        result: 'finderResult',
        back: 'finderBack',
        restart: 'finderRestart'
      });
    }
  });
})();
