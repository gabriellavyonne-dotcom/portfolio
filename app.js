const select = selector => document.querySelector(selector);
const local = location.protocol === 'file:' ||
  ['localhost', '127.0.0.1', '[::1]', '0.0.0.0'].includes(location.hostname);
const previewMode = local || new URLSearchParams(location.search).get('preview') === '1';

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function link(text, url, className) {
  const node = element('a', text, className);
  node.href = url;
  return node;
}

function liveLink(url, label = 'Live preview') {
  const anchor = link(label + ' ↗', url, 'button primary');
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.setAttribute('aria-label', label + ' (opens in a new tab)');
  return anchor;
}

function tags(items) {
  const list = element('ul', '', 'tags');
  items.forEach(item => list.append(element('li', item)));
  return list;
}

document.querySelectorAll('[data-profile]').forEach(anchor => {
  const key = anchor.dataset.profile;
  if (!portfolio[key]) return;
  anchor.href = key === 'email' ? 'mailto:' + portfolio.email : portfolio[key];
  anchor.hidden = false;
});

select('#bio').textContent = portfolio.bio;
select('#preview-contact').hidden = !previewMode || Boolean(portfolio.github && portfolio.email);
select('#portrait-caption').hidden = !previewMode || Boolean(portfolio.photo);
if (portfolio.photo) {
  const photo = select('#headshot');
  photo.addEventListener('load', () => {
    photo.hidden = false;
    select('#monogram').hidden = true;
  });
  photo.addEventListener('error', () => {
    select('#portrait-caption').hidden = !previewMode;
    select('#portrait-caption').textContent = 'Check the photo filename and path in portfolio-data.js.';
  });
  photo.src = portfolio.photo;
}

if (portfolio.skills.length || previewMode) {
  select('#skills-panel').hidden = false;
  if (portfolio.skills.length) select('#skills').replaceChildren(...tags(portfolio.skills).children);
  else select('#skills').replaceWith(element('p', 'Add the languages, frameworks and tools you use.'));
}
if (portfolio.currentlyLearning || previewMode) {
  select('#learning-panel').hidden = false;
  select('#learning').textContent = portfolio.currentlyLearning || 'Add a technology you are learning and what you are building with it.';
}

const credentialHints = {
  certificates: 'certificate name, issuer, date and verification link.',
  achievements: 'milestone and accomplishments.',
  experience: 'roles, internships or education.'
};
for (const [key, hint] of Object.entries(credentialHints)) {
  const entries = portfolio[key];
  if (!entries.length && !previewMode) continue;
  select('#credentials').hidden = false;
  select('#credentials-nav').hidden = false;
  select('#' + key + '-panel').hidden = false;
  const list = select('#' + key);
  if (!entries.length) list.append(element('p', hint));
  entries.forEach(entry => {
    const card = element('article');
    card.append(element('h4', entry.title));
    if (entry.detail) card.append(element('p', entry.detail));
    if (entry.url) card.append(link('View details ↗', entry.url));
    list.append(card);
  });
}

const feature = select('#featured');
const archive = select('#archive');
const controls = select('#controls');
let active = 0;

function makePreview(project) {
  const panel = element('div', '', 'preview');
  const art = element('div', '', 'art');
  art.setAttribute('aria-hidden', 'true');
  const bar = element('div', '', 'art-bar');
  bar.append(element('i'), element('i'), element('i'));
  const body = element('div', '', 'art-body');
  body.append(element('strong', project.title), element('p', (project.stack || []).join(' / ')));
  art.append(bar, body);
  panel.append(art);
  if (project.image) {
    const image = element('img');
    image.alt = project.imageAlt || ('Preview of ' + project.title);
    image.addEventListener('load', () => {
      panel.classList.add('has-image');
      panel.replaceChildren(image);
    });
    image.src = project.image;
  }
  return panel;
}

function showProject(index) {
  const count = portfolio.projects.length;
  if (!count) return;
  active = (index + count) % count;
  const project = portfolio.projects[active];
  const copy = element('div', '', 'feature-copy');
  copy.append(element('p', project.sample ? 'Sample demo' : 'Project overview', 'label'), element('h3', project.title), element('p', project.summary));
  if (project.contribution) copy.append(element('p', project.contribution));
  if (project.outcome) copy.append(element('p', project.outcome));
  if (project.stack?.length) copy.append(tags(project.stack));
  const actions = element('div', '', 'actions');
  if (project.demo) actions.append(liveLink(project.demo, project.demoLabel));
  if (actions.childElementCount) copy.append(actions);
  feature.replaceChildren(makePreview(project), copy);
  select('#position').textContent = (active + 1) + ' / ' + count;
  feature.setAttribute('aria-label', 'Featured project: ' + project.title);
}

if (portfolio.projects.length) showProject(0);
else feature.append(element('p', 'Project details will be added here.'));
controls.hidden = portfolio.projects.length < 2;
if (portfolio.projects.length > 1) {
  portfolio.projects.forEach((project, index) => {
    const item = element('article');
    const button = element('button', 'View project →', 'button');
    button.type = 'button';
    button.setAttribute('aria-label', 'View ' + project.title);
    button.addEventListener('click', () => {
      showProject(index);
      feature.focus();
    });
    item.append(makePreview(project));
    const body = element('div', '', 'archive-copy');
    body.append(element('p', project.sample ? 'Sample demo' : 'Project', 'label'),
      element('h3', project.title), element('p', project.summary));
    if (project.stack?.length) body.append(tags(project.stack));
    const actions = element('div', '', 'actions');
    actions.append(button);
    if (project.demo) actions.append(liveLink(project.demo));
    body.append(actions);
    item.append(body);
    archive.append(item);
  });

  select('#previous').addEventListener('click', () => showProject(active - 1));
  select('#next').addEventListener('click', () => showProject(active + 1));
  select('#work').addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    if (feature.contains(event.target)) feature.focus();
    showProject(active + (event.key === 'ArrowRight' ? 1 : -1));
  });

  let touchStart;
  feature.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1 ? event.touches[0] : undefined;
  }, { passive: true });
  feature.addEventListener('touchcancel', () => { touchStart = undefined; });
  feature.addEventListener('touchend', event => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const horizontal = touch.clientX - touchStart.clientX;
    const vertical = touch.clientY - touchStart.clientY;
    touchStart = undefined;
    if (Math.abs(horizontal) > 50 && Math.abs(horizontal) > Math.abs(vertical)) {
      if (feature.contains(document.activeElement)) feature.focus();
      showProject(active + (horizontal < 0 ? 1 : -1));
    }
  });
}

select('#share').addEventListener('click', async () => {
  const status = select('#share-status');
  const url = portfolio.publicUrl || (!local ? location.origin + location.pathname : '');
  if (!url) {
    status.textContent = 'Publish to GitHub Pages to get a public portfolio link.';
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    status.textContent = 'Portfolio link copied.';
  } catch {
    status.replaceChildren('Copy this address: ', link(url, url));
  }
});

// Reveal sections as they enter the viewport. Content stays visible when motion is reduced.
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('entered');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.quick-links, .section').forEach(section => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}
{
  const gallery = document.querySelector('#work #archive');
  const cards = [...gallery.querySelectorAll('article')];
  const pageSize = 2;

  if (cards.length > pageSize) {
    let page = 0;
    const pageCount = Math.ceil(cards.length / pageSize);

    const pager = document.createElement('nav');
    pager.className = 'project-pagination';
    pager.setAttribute('aria-label', 'Project gallery pages');

    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'button';
    previous.textContent = '← Previous';

    const status = document.createElement('span');
    status.setAttribute('role', 'status');

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'button';
    next.textContent = 'Next →';

    function showPage() {
      const start = page * pageSize;
      const end = Math.min(start + pageSize, cards.length);

      cards.forEach((card, index) => {
        card.hidden = index < start || index >= end;
      });

      status.textContent = `${start + 1}–${end} of ${cards.length} projects`;
      previous.disabled = page === 0;
      next.disabled = page === pageCount - 1;
    }

    previous.addEventListener('click', () => {
      page -= 1;
      showPage();
      if (previous.disabled) next.focus();
    });

    next.addEventListener('click', () => {
      page += 1;
      showPage();
      if (next.disabled) previous.focus();
    });

    pager.append(previous, status, next);
    gallery.after(pager);
    showPage();
  }
}
