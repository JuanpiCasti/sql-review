(function () {
  const chapters = [
    ['data-types-and-null.html',      'Data types & NULL',              'Foundations'],
    ['schema-and-constraints.html',   'Schema design & constraints',    'Foundations'],
    ['joins.html',                    'Joins',                          'Querying'],
    ['aggregates-group-by.html',      'Aggregates & GROUP BY',          'Querying'],
    ['window-functions.html',         'Window functions',               'Querying'],
    ['ctes.html',                     'CTEs & recursion',               'Querying'],
    ['full-text-search.html',         'Full-text search',               'Querying'],
    ['jsonb.html',                    'JSONB',                          'Querying'],
    ['transactions.html',             'Transactions',                   'Concurrency'],
    ['isolation-levels.html',         'Isolation levels',               'Concurrency'],
    ['mvcc.html',                     'MVCC & VACUUM',                  'Concurrency'],
    ['locking-deadlocks.html',        'Locking & deadlocks',            'Concurrency'],
    ['indexes.html',                  'Indexes',                        'Storage'],
    ['partitioning.html',             'Partitioning',                   'Storage'],
    ['explain-planner.html',          'EXPLAIN & the planner',          'Storage'],
    ['functions-and-triggers.html',   'Functions & triggers',           'Operations'],
    ['configuration-and-tuning.html', 'Configuration & tuning',         'Operations'],
    ['replication-and-wal.html',      'Replication & WAL',              'Operations'],
  ];

  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  document.querySelectorAll('details.chapter-menu').forEach(function (details) {
    const heading = document.createElement('h2');
    heading.className = 'chapter-menu-heading';
    heading.innerHTML = 'Postgres Study <span class="ornament">·</span> <em>Contents</em>';
    details.appendChild(heading);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'chapter-menu-close';
    closeBtn.setAttribute('aria-label', 'Close contents');
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      details.removeAttribute('open');
    });
    details.appendChild(closeBtn);

    const list = document.createElement('ul');
    let lastPart = null;
    chapters.forEach(function (entry) {
      const href = entry[0], title = entry[1], part = entry[2];
      if (part !== lastPart) {
        const head = document.createElement('li');
        head.className = 'chapter-menu-part';
        head.textContent = part;
        list.appendChild(head);
        lastPart = part;
      }
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = title;
      if (href.toLowerCase() === current) {
        a.setAttribute('aria-current', 'page');
      }
      li.appendChild(a);
      list.appendChild(li);
    });
    details.appendChild(list);

    details.addEventListener('toggle', function () {
      const anyOpen = !!document.querySelector('details.chapter-menu[open]');
      document.body.classList.toggle('menu-open', anyOpen);
    });
  });

  document.addEventListener('click', function (e) {
    document.querySelectorAll('details.chapter-menu[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('details.chapter-menu[open]').forEach(function (d) {
      d.removeAttribute('open');
      const summary = d.querySelector(':scope > summary');
      if (summary) summary.focus();
    });
  });
})();
