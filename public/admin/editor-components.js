// Blocks for the Markdown editor's "Insert" menu. Each one writes plain
// Markdown that the website renders specially (see src/lib/remark-docs.mjs).
// The guide for editors is the docs page /docs/contributing/editing-content.
/* global CMS */

const escapeHtml = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const CALLOUT_TYPES = { TIP: 'Tip', INFO: 'Note', WARNING: 'Warning' };
const CALLOUT_COLORS = { TIP: '#0f6b5c', INFO: '#2f6fb3', WARNING: '#b7791f' };

// Highlighted box that stands out from the text: a tip, a note or a warning.
CMS.registerEditorComponent({
  id: 'callout',
  label: 'Callout box (tip, note or warning)',
  icon: 'info',
  fields: [
    {
      name: 'type',
      label: 'Kind',
      widget: 'select',
      options: [
        { label: 'Tip: a helpful shortcut or good practice (green)', value: 'TIP' },
        { label: 'Note: useful background information (blue)', value: 'INFO' },
        { label: 'Warning: something that can go wrong (amber)', value: 'WARNING' },
      ],
      default: 'TIP',
    },
    { name: 'title', label: 'Heading', widget: 'string', required: false, hint: 'Short bold line at the top of the box, for example "Before you start".' },
    { name: 'body', label: 'Text', widget: 'markdown', buttons: ['bold', 'italic', 'code', 'link', 'bulleted-list', 'numbered-list'], hint: 'What the reader should know. Keep it to a few sentences.' },
  ],
  pattern: /^> \[!(TIP|INFO|NOTE|WARNING|CAUTION|IMPORTANT)\][ \t]*(.*)((?:\n>.*)*)/,
  fromBlock: (m) => ({
    type: { NOTE: 'INFO', IMPORTANT: 'INFO', CAUTION: 'WARNING' }[m[1]] ?? m[1],
    title: m[2].trim(),
    body: m[3].split('\n').slice(1).map((l) => l.replace(/^> ?/, '')).join('\n').trim(),
  }),
  toBlock: (o) => [`> [!${o.type || 'TIP'}]${o.title ? ` ${o.title}` : ''}`, ...String(o.body ?? '').split('\n').map((l) => (l ? `> ${l}` : '>'))].join('\n'),
  toPreview: (o) => {
    const color = CALLOUT_COLORS[o.type] ?? CALLOUT_COLORS.TIP;
    return `<div style="border:1px solid ${color}55;border-left:3px solid ${color};border-radius:8px;padding:12px 16px"><strong style="color:${color}">${escapeHtml(o.title || CALLOUT_TYPES[o.type] || 'Tip')}</strong><p style="margin:6px 0 0">${escapeHtml(o.body)}</p></div>`;
  },
});

// A grid of clickable boxes, each linking to another page. Used on overview
// pages so readers can jump to the next thing to read.
CMS.registerEditorComponent({
  id: 'cards',
  label: 'Link cards (grid of links to other pages)',
  icon: 'grid_view',
  fields: [
    {
      name: 'cards',
      label: 'Cards',
      label_singular: 'card',
      widget: 'list',
      collapsed: true,
      summary: '{{fields.title}}  →  {{fields.href}}',
      hint: 'Each card is a clickable box with a title and one line of description. Readers see them side by side in a grid.',
      fields: [
        { name: 'title', label: 'Title', widget: 'string', hint: 'Bold text on the card, usually the name of the page it links to.' },
        { name: 'href', label: 'Links to', widget: 'string', hint: 'The page address, for example /docs/guides/troubleshooting, or a full https:// link.' },
        { name: 'desc', label: 'Description', widget: 'string', required: false, hint: 'One short line under the title.' },
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
  toPreview: (o) =>
    `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">${(o.cards ?? [])
      .map((c) => `<div style="border:1px solid #8885;border-radius:8px;padding:10px 12px"><strong>${escapeHtml(c.title)}</strong><br><small>${escapeHtml(c.desc)}</small></div>`)
      .join('')}</div>`,
});

// A drawing (flowchart, sequence diagram...) written as text with Mermaid.
CMS.registerEditorComponent({
  id: 'diagram',
  label: 'Diagram (drawn from text)',
  icon: 'schema',
  fields: [
    { name: 'title', label: 'Caption', widget: 'string', required: false, hint: 'Short line shown under the diagram.' },
    {
      name: 'source',
      label: 'Diagram text',
      widget: 'text',
      hint: 'Written in Mermaid. Example: "flowchart LR" on the first line, then "A[Issue] --> B[Plan] --> C[Pull request]". Try it at mermaid.live first.',
    },
  ],
  pattern: /^```mermaid(?:[ \t]+title="([^"]*)")?\n([\s\S]*?)\n```/,
  fromBlock: (m) => ({ title: m[1] ?? '', source: m[2] }),
  toBlock: (o) => `\`\`\`mermaid${o.title ? ` title="${String(o.title).replace(/"/g, "'")}"` : ''}\n${o.source ?? ''}\n\`\`\``,
  toPreview: (o) => `<figure><pre>${escapeHtml(o.source)}</pre><figcaption>${escapeHtml(o.title)}</figcaption></figure>`,
});
