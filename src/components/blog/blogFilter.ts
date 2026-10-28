// Filters the blog list by topic and search text, and keeps the choice in the URL so it can be shared.

const root = document.querySelector<HTMLElement>('[data-blog]');

if (root) {
  const items = [...root.querySelectorAll<HTMLElement>('[data-post]')];
  const lead = root.querySelector<HTMLElement>('[data-lead-card]');
  const input = root.querySelector<HTMLInputElement>('[data-blog-search]');
  const form = root.querySelector<HTMLFormElement>('[data-blog-search-form]');
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-topic-button]')];
  const status = root.querySelector<HTMLElement>('[data-blog-status]');
  const empty = root.querySelector<HTMLElement>('[data-blog-empty]');
  const clear = root.querySelector<HTMLButtonElement>('[data-blog-clear]');

  const params = new URLSearchParams(window.location.search);
  const known = new Set(buttons.map((button) => button.dataset.topicButton ?? ''));
  const startTopic = params.get('topic') ?? '';
  const state = { topic: known.has(startTopic) ? startTopic : '', query: params.get('q') ?? '' };

  const writeUrl = () => {
    const next = new URLSearchParams();
    if (state.topic) next.set('topic', state.topic);
    if (state.query.trim()) next.set('q', state.query.trim());
    const query = next.toString();
    history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
  };

  const apply = (animate: boolean) => {
    const query = state.query.trim().toLowerCase();
    const filtering = Boolean(state.topic) || query !== '';
    let shown = 0;

    items.forEach((item) => {
      const topicOk = !state.topic || item.dataset.topic === state.topic;
      const queryOk = !query || (item.dataset.search ?? '').includes(query);
      const isLead = item.dataset.lead === 'true';
      // With no filter the featured post has its own large block, so its list entry stays hidden.
      const visible = topicOk && queryOk && (filtering || !isLead);
      const wasHidden = item.hidden;
      item.hidden = !visible;
      if (visible && wasHidden && animate) {
        item.removeAttribute('data-entering');
        void item.offsetWidth;
        item.setAttribute('data-entering', '');
      }
      if (topicOk && queryOk) shown += 1;
    });

    if (lead) lead.hidden = filtering;

    buttons.forEach((button) => {
      const active = (button.dataset.topicButton ?? '') === state.topic;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (status) {
      status.textContent = filtering
        ? `${shown} ${shown === 1 ? 'post' : 'posts'} found`
        : `${items.length} ${items.length === 1 ? 'post' : 'posts'}`;
    }
    if (empty) empty.hidden = shown > 0;
  };

  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      state.topic = button.dataset.topicButton ?? '';
      writeUrl();
      apply(true);
    }),
  );

  input?.addEventListener('input', () => {
    state.query = input.value;
    writeUrl();
    apply(true);
  });

  form?.addEventListener('submit', (event) => event.preventDefault());

  clear?.addEventListener('click', () => {
    state.topic = '';
    state.query = '';
    if (input) input.value = '';
    writeUrl();
    apply(true);
    input?.focus();
  });

  if (input) input.value = state.query;
  apply(false);
}
