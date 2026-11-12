// Markdown extensions for the docs, kept to plain Markdown so the pages stay
// editable in the CMS:
//
//   > [!TIP] Title          callout (TIP, INFO, NOTE, WARNING)
//   > Body text
//
//   ## 1. Step title        numbered step heading
//
//   ```cards                grid of link cards
//   - [Title](/docs/page): Short description
//   ```
//
//   ```mermaid title="..."  diagram, rendered in the browser
//   flowchart LR ...
//   ```

const ICONS = {
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  warning: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  tip: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>',
};
const TYPES = { TIP: 'tip', INFO: 'info', NOTE: 'info', IMPORTANT: 'info', WARNING: 'warning', CAUTION: 'warning' };

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const html = (value) => ({ type: 'html', value });

function callout(node) {
  const first = node.children[0];
  const text = first?.type === 'paragraph' ? first.children[0] : null;
  const match = text?.type === 'text' ? text.value.match(/^\[!(\w+)\][ \t]*([^\n]*)\n?/) : null;
  if (!match || !TYPES[match[1].toUpperCase()]) return null;
  const type = TYPES[match[1].toUpperCase()];
  const title = match[2].trim();
  text.value = text.value.slice(match[0].length);
  if (!text.value) first.children.shift();
  if (!first.children.length) node.children.shift();
  const open = `<div class="callout ${type}"><div class="calloutBody"><span class="calloutIcon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[type]}</svg></span><div class="calloutContent">${title ? `<p class="calloutTitle">${escape(title)}</p>` : ''}<div class="calloutText">`;
  return [html(open), ...node.children, html('</div></div></div></div>')];
}

function cards(value) {
  const items = value
    .split('\n')
    .map((line) => line.match(/^\s*-\s*\[([^\]]+)\]\(([^)]+)\)\s*:?\s*(.*)$/))
    .filter(Boolean)
    .map(([, title, href, desc]) => `<a href="${escape(href)}" class="docCard"><div class="docCardTitle">${escape(title)}</div><div class="docCardDesc">${escape(desc)}</div></a>`);
  return html(`<div class="docCards">${items.join('')}</div>`);
}

function mermaid(value, meta) {
  const title = meta?.match(/title="([^"]*)"/)?.[1] ?? '';
  const src = escape(value.trim());
  return html(`<figure class="docsDiagram" aria-label="${escape(title)}"><div class="diagramCanvas"><pre class="mermaid">${src}</pre></div>${title ? `<figcaption>${escape(title)}</figcaption>` : ''}<details><summary>View diagram source</summary><pre><code>${src}</code></pre></details></figure>`);
}

function step(node) {
  const text = node.children[0];
  const match = node.depth === 2 && text?.type === 'text' ? text.value.match(/^(\d+)\.\s+/) : null;
  if (!match) return;
  text.value = text.value.slice(match[0].length);
  node.data = { ...node.data, hProperties: { className: ['stepHeading'], 'data-step': match[1] } };
  node.children = [html(`<span class="stepBadge">${match[1]}</span><span class="stepTitle">`), ...node.children, html('</span>')];
}

function walk(parent) {
  if (!parent.children) return;
  for (let i = 0; i < parent.children.length; i++) {
    const node = parent.children[i];
    if (node.type === 'blockquote') {
      const replaced = callout(node);
      if (replaced) {
        parent.children.splice(i, 1, ...replaced);
        i += replaced.length - 1;
        replaced.forEach(walk);
        continue;
      }
    }
    if (node.type === 'code' && node.lang === 'cards') parent.children[i] = cards(node.value);
    else if (node.type === 'code' && node.lang === 'mermaid') parent.children[i] = mermaid(node.value, node.meta);
    else if (node.type === 'heading') step(node);
    walk(node);
  }
}

export default function remarkDocs() {
  return (tree) => walk(tree);
}
