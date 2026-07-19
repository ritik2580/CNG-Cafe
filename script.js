const menuItems = [
  { id: 'classic-cold-coffee', name: 'Classic Cold Coffee', category: 'coffee', label: 'Cold coffee', price: 69, description: 'Creamy, cold and always the right answer.', art: '🥤' },
  { id: 'dark-chocolate-coffee', name: 'Dark Chocolate Coffee', category: 'coffee', label: 'Cold coffee', price: 79, description: 'Deep cocoa, soft sweetness, zero regrets.', art: '🍫' },
  { id: 'oreo-coffee', name: 'Oreo Cold Coffee', category: 'coffee', label: 'Cold coffee', price: 89, description: 'Cookie-loaded for serious cravings.', art: '◉' },
  { id: 'kulhad-chai', name: 'Kulhad Masala Chai', category: 'coffee', label: 'Chai', price: 20, description: 'Spiced, warm and poured in a little kulhad.', art: '☕' },
  { id: 'crispy-vada-pav', name: 'Crispy Vada Pav', category: 'bites', label: 'Mumbai special', price: 45, description: 'Crunchy, buttery and properly chutney-d.', art: '🍔' },
  { id: 'paneer-burger', name: 'Paneer Patty Burger', category: 'bites', label: 'Burgers', price: 99, description: 'Big flavour, soft bun, full comfort mode.', art: '🍔' },
  { id: 'salty-fries', name: 'Classic Salty Fries', category: 'bites', label: 'Quick bites', price: 69, description: 'The table disappears when these arrive.', art: '🍟' },
  { id: 'kurkure-momos', name: 'Veg Kurkure Momos', category: 'bites', label: 'Quick bites', price: 99, description: 'Ten crispy reasons to share. Or not.', art: '🥟' },
  { id: 'mix-veg-sandwich', name: 'Mix Veg Sandwich', category: 'sandwiches', label: 'Hot & grill', price: 49, description: 'Toasty, cheesy and made for one-hand eating.', art: '🥪' },
  { id: 'paneer-tikka-sandwich', name: 'Paneer Tikka Sandwich', category: 'sandwiches', label: 'Hot & grill', price: 59, description: 'Smoky paneer, melty cheese, toasted edges.', art: '🧀' },
  { id: 'pizza-sandwich', name: 'Mix Veg Pizza Sandwich', category: 'sandwiches', label: 'Hot & grill', price: 69, description: 'Pizza energy, sandwich convenience.', art: '🍕' },
  { id: 'watermelon-ice', name: 'Watermelon Ice', category: 'coolers', label: 'Mojito', price: 59, description: 'Fresh, fizzy and very good at disappearing.', art: '🍉' },
  { id: 'lemon-mint', name: 'Lemon Cool Mint', category: 'coolers', label: 'Mojito', price: 59, description: 'Bright citrus with a cool mint finish.', art: '🍋' },
  { id: 'blueberry-ice-tea', name: 'Blueberry Ice Tea', category: 'coolers', label: 'Ice tea', price: 59, description: 'Fruity, chilled and made for golden hour.', art: '🫐' },
];

const whatsappNumber = '918800325150';
const menuGrid = document.querySelector('#menu-grid');
const categoryButtons = [...document.querySelectorAll('.menu-tab')];
const orderList = document.querySelector('#order-list');
const orderTotal = document.querySelector('#order-total');
const selectedOrder = new Map();

function renderMenu(category = 'all') {
  if (!menuGrid) return;
  const visibleItems = menuItems.filter((item) => category === 'all' || item.category === category);
  menuGrid.innerHTML = visibleItems.map((item, index) => `
    <article class="menu-card" style="animation-delay:${index * 45}ms">
      <div class="menu-card__head"><span class="menu-card__category">${item.label}</span><span class="menu-card__price">₹${item.price}</span></div>
      <div class="menu-card__art" aria-hidden="true">${item.art}</div>
      <h3>${item.name}</h3><p>${item.description}</p>
      <button class="menu-card__add" type="button" data-add-id="${item.id}" aria-label="Add ${item.name} to preorder">+</button>
    </article>
  `).join('');
  menuGrid.querySelectorAll('[data-add-id]').forEach((button) => button.addEventListener('click', () => addToOrder(button.dataset.addId)));
}

function addToOrder(id) {
  selectedOrder.set(id, (selectedOrder.get(id) || 0) + 1);
  renderOrder();
  const card = document.querySelector(`[data-add-id="${id}"]`)?.closest('.menu-card');
  card?.animate([{ transform: 'scale(1)' }, { transform: 'scale(.96)' }, { transform: 'scale(1)' }], { duration: 260 });
}

function changeQuantity(id, delta) {
  const next = (selectedOrder.get(id) || 0) + delta;
  if (next <= 0) selectedOrder.delete(id); else selectedOrder.set(id, next);
  renderOrder();
}

function renderOrder() {
  if (!orderList || !orderTotal) return;
  const items = [...selectedOrder.entries()].map(([id, quantity]) => ({ item: menuItems.find((item) => item.id === id), quantity })).filter(({ item }) => item);
  if (!items.length) {
    orderList.innerHTML = '<div class="order-empty">Your order is empty.<br /><span>Tap <b>+</b> on a menu item above.</span></div>';
    orderTotal.textContent = '0';
    return;
  }
  orderList.innerHTML = items.map(({ item, quantity }) => `
    <div class="order-row"><span class="order-row__name">${item.name}</span><span class="order-row__price">₹${item.price * quantity}</span><span class="order-qty"><button type="button" data-quantity-id="${item.id}" data-delta="-1" aria-label="Remove one ${item.name}">−</button><span>${quantity}</span><button type="button" data-quantity-id="${item.id}" data-delta="1" aria-label="Add one ${item.name}">+</button></span></div>
  `).join('');
  orderList.querySelectorAll('[data-quantity-id]').forEach((button) => button.addEventListener('click', () => changeQuantity(button.dataset.quantityId, Number(button.dataset.delta))));
  orderTotal.textContent = items.reduce((total, { item, quantity }) => total + item.price * quantity, 0);
}

categoryButtons.forEach((button) => button.addEventListener('click', () => {
  categoryButtons.forEach((tab) => { const active = tab === button; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', String(active)); });
  renderMenu(button.dataset.category);
}));

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
function toggleMenu(open) { menuToggle?.classList.toggle('is-open', open); siteNav?.classList.toggle('is-open', open); document.body.classList.toggle('menu-open', open); menuToggle?.setAttribute('aria-expanded', String(open)); }
menuToggle?.addEventListener('click', () => toggleMenu(!siteNav.classList.contains('is-open')));
siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));

function animateCounters() {
  document.querySelectorAll('[data-count]').forEach((counter) => {
    const target = Number(counter.dataset.count);
    const decimals = String(target).includes('.') ? 1 : 0;
    const start = performance.now();
    const tick = (now) => { const progress = Math.min((now - start) / 900, 1); const eased = 1 - Math.pow(1 - progress, 3); counter.textContent = (target * eased).toFixed(decimals); if (progress < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}
const stats = document.querySelector('.stats');
if (stats) new IntersectionObserver((entries, observer) => { if (entries[0].isIntersecting) { animateCounters(); observer.disconnect(); } }, { threshold: .4 }).observe(stats);

function updateScrollProgress() { const scrollable = document.documentElement.scrollHeight - window.innerHeight; const progress = document.querySelector('.scroll-progress span'); if (progress) progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`; }
window.addEventListener('scroll', updateScrollProgress, { passive: true });
document.addEventListener('pointermove', (event) => { document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`); document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`); });

document.querySelector('#preorder-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!selectedOrder.size) { document.querySelector('#preorder')?.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(0)' }], { duration: 320 }); return; }
  const form = new FormData(event.currentTarget);
  const items = [...selectedOrder.entries()].map(([id, quantity]) => { const item = menuItems.find((entry) => entry.id === id); return `• ${item.name} x${quantity} — ₹${item.price * quantity}`; });
  const total = [...selectedOrder.entries()].reduce((sum, [id, quantity]) => sum + menuItems.find((item) => item.id === id).price * quantity, 0);
  const message = `*New CNG CAFE Pre-order*\n\n*Name:* ${form.get('name')}\n*Phone:* ${form.get('phone')}\n*Pick-up:* ${form.get('pickup')}\n\n*Order:*\n${items.join('\n')}\n\n*Estimated total:* ₹${total}\n*Notes:* ${form.get('notes') || 'None'}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

renderMenu();
renderOrder();
updateScrollProgress();
