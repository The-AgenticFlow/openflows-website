// Blocks for the Markdown editor's "+" menu. Each one writes plain Markdown
// that the site renders specially (see src/lib/remark-docs.mjs).
/* global CMS */

const escapeHtml = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

CMS.registerEditorComponent({
  id: 'callout',
  label: 'Callout',
  fields: [
    { name: 'type', label: 'Type', widget: 'select', options: [{ label: 'Tip', value: 'TIP' }, { label: 'Info', value: 'INFO' }, { label: 'Warning', value: 'WARNING' }], default: 'TIP' },
    { name: 'title', label: 'Title', widget: 'string', required: false },
    { name: 'body', label: 'Text', widget: 'markdown', buttons: ['bold', 'italic', 'code', 'link', 'bulleted-list', 'numbered-list'] },
  ],
  pattern: /^> \[!(TIP|INFO|NOTE|WARNING|CAUTION|IMPORTANT)\][ \t]*(.*)((?:\n>.*)*)/,
  fromBlock: (m) => ({
    type: { NOTE: 'INFO', IMPORTANT: 'INFO', CAUTION: 'WARNING' }[m[1]] ?? m[1],
    title: m[2].trim(),
    body: m[3].split('\n').slice(1).map((l) => l.replace(/^> ?/, '')).join('\n').trim(),
  }),
  toBlock: (o) => [`> [!${o.type || 'TIP'}]${o.title ? ` ${o.title}` : ''}`, ...String(o.body ?? '').split('\n').map((l) => (l ? `> ${l}` : '>'))].join('\n'),
  toPreview: (o) => `<div style="border-left:3px solid #0f6b5c;background:#eef5f2;padding:12px 16px;border-radius:8px"><strong>${escapeHtml(o.title || o.type)}</strong><p>${escapeHtml(o.body)}</p></div>`,
});

CMS.registerEditorComponent({
  id: 'cards',
  label: 'Link cards',
  fields: [
    {
      name: 'cards',
      label: 'Cards',
      widget: 'list',
      summary: '{{fields.title}}',
      fields: [
        { name: 'title', label: 'Title', widget: 'string' },
        { name: 'href', label: 'Link', widget: 'string', hint: 'For example /docs/guides/troubleshooting' },
        { name: 'desc', label: 'Description', widget: 'string', required: false },
      ],
    },
  ],
  pattern: /^```cards\n([\s\S]*?)\n```/,
  fromBlock: (m) => ({
    cards: m[1]
      .split('\n')
      .map((l) => l.match(/^\s*-\s*\[([^\]]+)\]\(([^)]+)\)\s*:?\s*(.*)$/))
      .filter(Boolean)
      .map(([, title, href, desc]) => ({ title, href, desc })),
  }),
  toBlock: (o) => ['```cards', ...(o.cards ?? []).map((c) => `- [${c.title}](${c.href})${c.desc ? `: ${c.desc}` : ''}`), '```'].join('\n'),
  toPreview: (o) => `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">${(o.cards ?? []).map((c) => `<div style="border:1px solid #ddd;border-radius:8px;padding:10px"><strong>${escapeHtml(c.title)}</strong><br><small>${escapeHtml(c.desc)}</small></div>`).join('')}</div>`,
});

CMS.registerEditorComponent({
  id: 'diagram',
  label: 'Diagram (Mermaid)',
  fields: [
    { name: 'title', label: 'Caption', widget: 'string', required: false },
    { name: 'source', label: 'Mermaid source', widget: 'code', default_language: 'markdown', output_code_only: true, allow_language_selection: false, hint: 'See mermaid.js.org for the syntax, for example "flowchart LR" or "sequenceDiagram".' },
  ],
  pattern: /^```mermaid(?:[ \t]+title="([^"]*)")?\n([\s\S]*?)\n```/,
  fromBlock: (m) => ({ title: m[1] ?? '', source: m[2] }),
  toBlock: (o) => `\`\`\`mermaid${o.title ? ` title="${String(o.title).replace(/"/g, "'")}"` : ''}\n${o.source ?? ''}\n\`\`\``,
  toPreview: (o) => `<figure><pre>${escapeHtml(o.source)}</pre><figcaption>${escapeHtml(o.title)}</figcaption></figure>`,
});
