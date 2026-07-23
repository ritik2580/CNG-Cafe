const defaultMenuItems = [
  { id: 'classic-cold-coffee', name: 'Classic Cold Coffee', category: 'coffee', label: 'Cold coffee', price: 69, description: 'Creamy, cold and always the right answer.', visual: 'coffee' },
  { id: 'dark-chocolate-coffee', name: 'Dark Chocolate Coffee', category: 'coffee', label: 'Cold coffee', price: 79, description: 'Deep cocoa, soft sweetness, zero regrets.', visual: 'coffee-dark' },
  { id: 'oreo-coffee', name: 'Oreo Cold Coffee', category: 'coffee', label: 'Cold coffee', price: 89, description: 'Cookie-loaded for serious cravings.', visual: 'coffee-oreo' },
  { id: 'kulhad-chai', name: 'Kulhad Masala Chai', category: 'coffee', label: 'Chai', price: 20, description: 'Spiced, warm and poured in a little kulhad.', visual: 'chai' },
  { id: 'crispy-vada-pav', name: 'Crispy Vada Pav', category: 'bites', label: 'Mumbai special', price: 45, description: 'Crunchy, buttery and properly chutney-d.', visual: 'burger-small' },
  { id: 'paneer-burger', name: 'Paneer Patty Burger', category: 'bites', label: 'Burgers', price: 99, description: 'Big flavour, soft bun, full comfort mode.', visual: 'burger' },
  { id: 'salty-fries', name: 'Classic Salty Fries', category: 'bites', label: 'Quick bites', price: 69, description: 'The table disappears when these arrive.', visual: 'fries' },
  { id: 'kurkure-momos', name: 'Veg Kurkure Momos', category: 'bites', label: 'Quick bites', price: 99, description: 'Ten crispy reasons to share. Or not.', visual: 'momos' },
  { id: 'mix-veg-sandwich', name: 'Mix Veg Sandwich', category: 'sandwiches', label: 'Hot & grill', price: 49, description: 'Toasty, cheesy and made for one-hand eating.', visual: 'sandwich' },
  { id: 'paneer-tikka-sandwich', name: 'Paneer Tikka Sandwich', category: 'sandwiches', label: 'Hot & grill', price: 59, description: 'Smoky paneer, melty cheese, toasted edges.', visual: 'sandwich-dark' },
  { id: 'pizza-sandwich', name: 'Mix Veg Pizza Sandwich', category: 'sandwiches', label: 'Hot & grill', price: 69, description: 'Pizza energy, sandwich convenience.', visual: 'sandwich' },
  { id: 'watermelon-ice', name: 'Watermelon Ice', category: 'coolers', label: 'Mojito', price: 59, description: 'Fresh, fizzy and very good at disappearing.', visual: 'cooler' },
  { id: 'lemon-mint', name: 'Lemon Cool Mint', category: 'coolers', label: 'Mojito', price: 59, description: 'Bright citrus with a cool mint finish.', visual: 'cooler-green' },
  { id: 'blueberry-ice-tea', name: 'Blueberry Ice Tea', category: 'coolers', label: 'Ice tea', price: 59, description: 'Fruity, chilled and made for golden hour.', visual: 'cooler-blue' },
];

const savedMenu = JSON.parse(localStorage.getItem('cngCafeMenu') || 'null');
let menuItems = Array.isArray(savedMenu) && savedMenu.length ? savedMenu : defaultMenuItems;

const whatsappNumber = '918800325150';
let cafeSettings = JSON.parse(localStorage.getItem('cngCafeSettings') || '{}');
let configuredWhatsapp = cafeSettings.whatsapp || whatsappNumber;
const supabaseConfig = window.CNG_SUPABASE_CONFIG;
const supabaseClient = window.supabase && supabaseConfig ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey) : null;
const menuGrid = document.querySelector('#menu-grid');
const categoryButtons = [...document.querySelectorAll('.menu-tab')];
const orderList = document.querySelector('#order-list');
const orderTotal = document.querySelector('#order-total');
const cartDock = document.querySelector('#cart-dock');
const cartDockCopy = document.querySelector('#cart-dock-copy');
const cartDockTotal = document.querySelector('#cart-dock-total');
const cartDockCount = document.querySelector('.cart-dock__icon span');
const cartHeadCount = document.querySelector('#cart-head-count');
const selectedOrder = new Map();

const announcementCopy = document.querySelector('.announcement > span:nth-child(2)');

function applyCafeSettings() {
  configuredWhatsapp = cafeSettings.whatsapp || whatsappNumber;
  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    if (cafeSettings.contact) {
      const digits = cafeSettings.contact.replace(/[^0-9+]/g, '');
      link.href = `tel:${digits}`;
      link.textContent = cafeSettings.contact;
    }
  });
  document.querySelectorAll('.form-note b').forEach((label) => { if (cafeSettings.contact) label.textContent = cafeSettings.contact; });
  document.querySelectorAll('a[href*="instagram.com"]').forEach((link) => { if (cafeSettings.instagram) link.href = cafeSettings.instagram; });
  if (announcementCopy && cafeSettings.announcement) announcementCopy.textContent = cafeSettings.announcement;
}

async function loadSharedCafeData() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.from(supabaseConfig.table).select('menu, settings').eq('id', supabaseConfig.rowId).single();
  if (error || !data) return;
  if (Array.isArray(data.menu) && data.menu.length) menuItems = data.menu;
  if (data.settings && typeof data.settings === 'object') cafeSettings = data.settings;
  applyCafeSettings();
  renderMenu(document.querySelector('.menu-tab.is-active')?.dataset.category || 'all');
}

function renderMenu(category = 'all') {
  if (!menuGrid) return;
  const visibleItems = menuItems.filter((item) => category === 'all' || item.category === category);
  menuGrid.innerHTML = visibleItems.map((item, index) => `
    <article class="menu-card" style="animation-delay:${index * 45}ms">
      <div class="menu-card__head"><span class="menu-card__category">${item.label}</span><span class="menu-card__price">₹${item.price}</span></div>
      <div class="menu-card__art menu-card__art--${item.visual}" aria-hidden="true"><span class="art-main"></span><span class="art-detail"></span><span class="art-highlight"></span></div>
      <h3>${item.name}</h3><p>${item.description}</p>
      <button class="menu-card__add" type="button" data-add-id="${item.id}" aria-label="Add ${item.name} to preorder">+</button>
    </article>
  `).join('');
  menuGrid.querySelectorAll('[data-add-id]').forEach((button) => button.addEventListener('click', () => addToOrder(button.dataset.addId, button)));
}

function addToOrder(id, sourceButton) {
  selectedOrder.set(id, (selectedOrder.get(id) || 0) + 1);
  flyToCart(sourceButton);
  renderOrder();
  const card = document.querySelector(`[data-add-id="${id}"]`)?.closest('.menu-card');
  card?.animate([{ transform: 'scale(1)' }, { transform: 'scale(.96)' }, { transform: 'scale(1)' }], { duration: 260 });
}

function flyToCart(sourceButton) {
  const source = sourceButton?.closest('.menu-card')?.querySelector('.menu-card__art');
  if (!source || !cartDock) return;
  const sourceRect = source.getBoundingClientRect();
  const targetRect = cartDock.getBoundingClientRect();
  const flyer = source.cloneNode(true);
  flyer.classList.add('cart-flyer');
  Object.assign(flyer.style, { left: `${sourceRect.left}px`, top: `${sourceRect.top}px`, width: `${sourceRect.width}px`, height: `${sourceRect.height}px` });
  document.body.appendChild(flyer);
  flyer.animate([{ left: `${sourceRect.left}px`, top: `${sourceRect.top}px`, transform: 'scale(1) rotate(0deg)', opacity: 1 }, { left: `${targetRect.left + targetRect.width / 2 - 20}px`, top: `${targetRect.top + targetRect.height / 2 - 20}px`, transform: 'scale(.2) rotate(28deg)', opacity: .1 }], { duration: 720, easing: 'cubic-bezier(.2,.8,.2,1)' }).finished.then(() => flyer.remove()).catch(() => flyer.remove());
  cartDock.classList.remove('cart-dock--pulse');
  requestAnimationFrame(() => cartDock.classList.add('cart-dock--pulse'));
}

function changeQuantity(id, delta) {
  const next = (selectedOrder.get(id) || 0) + delta;
  if (next <= 0) selectedOrder.delete(id); else selectedOrder.set(id, next);
  renderOrder();
}

function renderOrder() {
  if (!orderList || !orderTotal) return;
  const items = [...selectedOrder.entries()].map(([id, quantity]) => ({ item: menuItems.find((item) => item.id === id), quantity })).filter(({ item }) => item);
  const quantityTotal = items.reduce((total, { quantity }) => total + quantity, 0);
  const valueTotal = items.reduce((total, { item, quantity }) => total + item.price * quantity, 0);
  if (cartDockCount) cartDockCount.textContent = quantityTotal;
  if (cartDockTotal) cartDockTotal.textContent = valueTotal;
  if (cartHeadCount) cartHeadCount.textContent = `${quantityTotal} ${quantityTotal === 1 ? 'item' : 'items'}`;
  cartDock?.classList.toggle('cart-dock--filled', quantityTotal > 0);
  if (cartDockCopy) cartDockCopy.textContent = quantityTotal ? `${quantityTotal} ${quantityTotal === 1 ? 'item' : 'items'} · Tap to view` : 'Add something delicious';
  cartDock?.setAttribute('aria-label', quantityTotal ? `View cart with ${quantityTotal} items` : 'View your empty cart');
  if (!items.length) {
    orderList.innerHTML = '<div class="order-empty">Your order is empty.<br /><span>Tap <b>+</b> on a menu item above.</span></div>';
    orderTotal.textContent = '0';
    return;
  }
  orderList.innerHTML = items.map(({ item, quantity }) => `
    <div class="order-row"><span class="order-row__name">${item.name}</span><span class="order-row__price">₹${item.price * quantity}</span><span class="order-qty"><button type="button" data-quantity-id="${item.id}" data-delta="-1" aria-label="Remove one ${item.name}">−</button><span>${quantity}</span><button type="button" data-quantity-id="${item.id}" data-delta="1" aria-label="Add one ${item.name}">+</button></span></div>
  `).join('');
  orderList.querySelectorAll('[data-quantity-id]').forEach((button) => button.addEventListener('click', () => changeQuantity(button.dataset.quantityId, Number(button.dataset.delta))));
  orderTotal.textContent = valueTotal;
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
cartDock?.addEventListener('click', () => document.querySelector('#preorder')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));

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
  window.open(`https://wa.me/${configuredWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

applyCafeSettings();
renderMenu();
renderOrder();
updateScrollProgress();
loadSharedCafeData();

const preloader = document.querySelector('#site-preloader');
window.addEventListener('load', () => window.setTimeout(() => preloader?.classList.add('is-ready'), 450), { once: true });
window.setTimeout(() => preloader?.classList.add('is-ready'), 2400);
