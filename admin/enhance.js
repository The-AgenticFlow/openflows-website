// Presentation only: turns Decap's one-line entry summaries ("Title · Date ·
// Category", or "3.  Title" for docs) into a title with quieter metadata.
// Decap keeps rendering its own markup; this adds a sibling row next to it and
// CSS hides the original, so nothing here can change saved content.
(() => {
  const SEP = /\s+·\s+/;

  const build = (text) => {
    const row = document.createElement('span');
    row.className = 'of-row';
    let title = text.trim();
    const order = title.match(/^(\d+)\.\s+(.*)$/);
    if (order) {
      const badge = document.createElement('span');
      badge.className = 'of-badge';
      badge.textContent = order[1] === '0' ? 'Overview' : order[1];
      row.append(badge);
      title = order[2];
    }
    const [main, ...meta] = title.split(SEP).filter(Boolean);
    const t = document.createElement('span');
    t.className = 'of-title';
    t.textContent = main ?? '';
    row.append(t);
    if (meta.length) {
      const m = document.createElement('span');
      m.className = 'of-meta';
      meta.forEach((part, i) => {
        const chip = document.createElement('span');
        chip.className = i === meta.length - 1 && meta.length > 1 ? 'of-chip' : 'of-date';
        chip.textContent = part;
        m.append(chip);
      });
      row.append(m);
    }
    return row;
  };

  const enhance = () => {
    document.querySelectorAll('[class*="-ListCardLink"]').forEach((link) => {
      const heading = link.querySelector('[class*="-ListCardTitle"]');
      if (!heading) return;
      const text = heading.firstChild?.textContent ?? heading.textContent;
      if (link.dataset.ofText === text) return;
      try {
        link.querySelector(':scope > .of-row')?.remove();
        link.append(build(text));
        link.dataset.ofText = text;
        link.classList.add('of-enhanced');
      } catch {
        /* leave Decap's own row visible */
      }
    });
  };

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      enhance();
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
