const ADMIN_PASSWORD = 'rohit@2580';
const menuKey = 'cngCafeMenu';
const settingsKey = 'cngCafeSettings';
const defaultMenu = [
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
  { id: 'watermelon-ice', name: 'Watermelon Ice', category: 'coolers', label: 'Mojito', price: 59, description: 'Fresh, fizzy and very good at disappearing.', visual: 'cooler' },
  { id: 'lemon-mint', name: 'Lemon Cool Mint', category: 'coolers', label: 'Mojito', price: 59, description: 'Bright citrus with a cool mint finish.', visual: 'cooler-green' },
];

const loginScreen = document.querySelector('#login-screen');
const adminApp = document.querySelector('#admin-app');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const menuEditor = document.querySelector('#menu-editor');
const settingsForm = document.querySelector('#settings-form');
const saveStatus = document.querySelector('#save-status');

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

function getMenu() { return readJson(menuKey, defaultMenu); }

function renderEditor() {
  menuEditor.innerHTML = getMenu().map((item, index) => `
    <div class="menu-editor__row" data-index="${index}">
      <label>Name<input data-field="name" value="${escapeHtml(item.name)}" /></label>
      <label>Category<select data-field="category"><option value="coffee" ${item.category === 'coffee' ? 'selected' : ''}>Coffee / chai</option><option value="bites" ${item.category === 'bites' ? 'selected' : ''}>Bites</option><option value="sandwiches" ${item.category === 'sandwiches' ? 'selected' : ''}>Sandwiches</option><option value="coolers" ${item.category === 'coolers' ? 'selected' : ''}>Coolers</option></select></label>
      <label>Price<input data-field="price" type="number" min="0" value="${item.price}" /></label>
      <label>Description<textarea data-field="description">${escapeHtml(item.description)}</textarea></label>
      <button class="menu-editor__remove" type="button" data-remove="${index}" aria-label="Remove ${escapeHtml(item.name)}">×</button>
    </div>
  `).join('');
  menuEditor.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => {
    const menu = getMenu(); menu.splice(Number(button.dataset.remove), 1); localStorage.setItem(menuKey, JSON.stringify(menu)); renderEditor(); setStatus('Item removed. Save changes when ready.');
  }));
}

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }

function collectMenu() {
  return [...menuEditor.querySelectorAll('.menu-editor__row')].map((row, index) => {
    const get = (field) => row.querySelector(`[data-field="${field}"]`).value.trim();
    const old = getMenu()[index] || {};
    return { ...old, id: old.id || `cng-item-${Date.now()}-${index}`, name: get('name'), category: get('category'), label: old.label || 'CNG special', price: Number(get('price')) || 0, description: get('description'), visual: old.visual || 'coffee' };
  }).filter((item) => item.name);
}

function setStatus(message, error = false) { saveStatus.textContent = message; saveStatus.classList.toggle('is-error', error); window.clearTimeout(setStatus.timer); setStatus.timer = window.setTimeout(() => { saveStatus.textContent = ''; }, 3500); }

function unlock() { loginScreen.hidden = true; adminApp.hidden = false; const settings = readJson(settingsKey, { whatsapp: '918800325150', contact: '+91 88003 25150', instagram: 'https://www.instagram.com/chainashtagupshup?igsh=MWt0OTRlMWpiM3V2cg==', announcement: 'Now serving slow sips & good energy' }); Object.entries(settings).forEach(([key, value]) => { const field = settingsForm.elements[key]; if (field) field.value = value; }); renderEditor(); }

loginForm.addEventListener('submit', (event) => { event.preventDefault(); if (document.querySelector('#admin-password').value === ADMIN_PASSWORD) { sessionStorage.setItem('cngCafeAdminUnlocked', '1'); unlock(); } else { loginError.textContent = 'That password does not open this counter.'; } });
document.querySelector('#save-all').addEventListener('click', () => { const settings = Object.fromEntries(new FormData(settingsForm).entries()); localStorage.setItem(settingsKey, JSON.stringify(settings)); localStorage.setItem(menuKey, JSON.stringify(collectMenu())); setStatus('Saved. Refresh the public site to see updates.'); });
document.querySelector('#add-item').addEventListener('click', () => { const menu = getMenu(); menu.push({ id: `cng-item-${Date.now()}`, name: 'New CNG Special', category: 'bites', label: 'CNG special', price: 99, description: 'Add a delicious description here.', visual: 'burger' }); localStorage.setItem(menuKey, JSON.stringify(menu)); renderEditor(); setStatus('New item added.'); });
document.querySelector('#reset-data').addEventListener('click', () => { localStorage.removeItem(menuKey); localStorage.removeItem(settingsKey); renderEditor(); settingsForm.reset(); setStatus('Demo data reset.'); });
document.querySelector('#logout').addEventListener('click', () => { sessionStorage.removeItem('cngCafeAdminUnlocked'); window.location.reload(); });
if (sessionStorage.getItem('cngCafeAdminUnlocked') === '1') unlock();
