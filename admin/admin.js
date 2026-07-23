const defaultSettings = {
  whatsapp: '918800325150',
  contact: '+91 88003 25150',
  instagram: 'https://www.instagram.com/chainashtagupshup?igsh=MWt0OTRlMWpiM3V2cg==',
  announcement: 'Now serving slow sips & good energy'
};

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
  { id: 'pizza-sandwich', name: 'Mix Veg Pizza Sandwich', category: 'sandwiches', label: 'Hot & grill', price: 69, description: 'Pizza energy, sandwich convenience.', visual: 'sandwich' },
  { id: 'watermelon-ice', name: 'Watermelon Ice', category: 'coolers', label: 'Mojito', price: 59, description: 'Fresh, fizzy and very good at disappearing.', visual: 'cooler' },
  { id: 'lemon-mint', name: 'Lemon Cool Mint', category: 'coolers', label: 'Mojito', price: 59, description: 'Bright citrus with a cool mint finish.', visual: 'cooler-green' },
  { id: 'blueberry-ice-tea', name: 'Blueberry Ice Tea', category: 'coolers', label: 'Ice tea', price: 59, description: 'Fruity, chilled and made for golden hour.', visual: 'cooler-blue' }
];

const config = window.CNG_SUPABASE_CONFIG;
const supabaseClient = window.supabase && config ? window.supabase.createClient(config.url, config.publishableKey) : null;
const loginScreen = document.querySelector('#login-screen');
const adminApp = document.querySelector('#admin-app');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const menuEditor = document.querySelector('#menu-editor');
const settingsForm = document.querySelector('#settings-form');
const saveStatus = document.querySelector('#save-status');
let workingMenu = [...defaultMenu];

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function setStatus(message, error = false) {
  saveStatus.textContent = message;
  saveStatus.classList.toggle('is-error', error);
  window.clearTimeout(setStatus.timer);
  setStatus.timer = window.setTimeout(() => { saveStatus.textContent = ''; }, 5000);
}

function renderEditor() {
  menuEditor.innerHTML = workingMenu.map((item, index) => `
    <div class="menu-editor__row" data-index="${index}">
      <label>Name<input data-field="name" value="${escapeHtml(item.name)}" /></label>
      <label>Category<select data-field="category"><option value="coffee" ${item.category === 'coffee' ? 'selected' : ''}>Coffee / chai</option><option value="bites" ${item.category === 'bites' ? 'selected' : ''}>Bites</option><option value="sandwiches" ${item.category === 'sandwiches' ? 'selected' : ''}>Sandwiches</option><option value="coolers" ${item.category === 'coolers' ? 'selected' : ''}>Coolers</option></select></label>
      <label>Price<input data-field="price" type="number" min="0" value="${item.price}" /></label>
      <label>Description<textarea data-field="description">${escapeHtml(item.description)}</textarea></label>
      <button class="menu-editor__remove" type="button" data-remove="${index}" aria-label="Remove ${escapeHtml(item.name)}">×</button>
    </div>
  `).join('');
  menuEditor.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => {
    workingMenu.splice(Number(button.dataset.remove), 1);
    renderEditor();
  }));
}

function collectMenu() {
  return [...menuEditor.querySelectorAll('.menu-editor__row')].map((row, index) => {
    const get = (field) => row.querySelector(`[data-field="${field}"]`).value.trim();
    const existing = workingMenu[index] || {};
    return { ...existing, id: existing.id || `cng-item-${Date.now()}-${index}`, name: get('name'), category: get('category'), label: existing.label || 'CNG special', price: Number(get('price')) || 0, description: get('description'), visual: existing.visual || 'burger' };
  }).filter((item) => item.name);
}

function setSettings(settings) {
  Object.entries({ ...defaultSettings, ...settings }).forEach(([key, value]) => {
    const field = settingsForm.elements[key];
    if (field) field.value = value;
  });
}

async function loadDashboard() {
  const { data, error } = await supabaseClient.from(config.table).select('menu, settings').eq('id', config.rowId).single();
  if (error) {
    setStatus('Run supabase-setup.sql in Supabase first, then reload this page.', true);
    workingMenu = [...defaultMenu];
    setSettings(defaultSettings);
  } else {
    workingMenu = Array.isArray(data.menu) && data.menu.length ? data.menu : [...defaultMenu];
    setSettings(data.settings || defaultSettings);
  }
  renderEditor();
}

async function unlock() {
  loginScreen.hidden = true;
  adminApp.hidden = false;
  await loadDashboard();
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!supabaseClient) { loginError.textContent = 'Supabase configuration did not load. Refresh and try again.'; return; }
  loginError.textContent = '';
  const { error } = await supabaseClient.auth.signInWithPassword({ email: document.querySelector('#admin-email').value.trim(), password: document.querySelector('#admin-password').value });
  if (error) { loginError.textContent = 'Sign-in failed. Check your Supabase owner email and password.'; return; }
  await unlock();
});

document.querySelector('#save-all').addEventListener('click', async () => {
  workingMenu = collectMenu();
  const settings = Object.fromEntries(new FormData(settingsForm).entries());
  const { error } = await supabaseClient.from(config.table).update({ menu: workingMenu, settings, updated_at: new Date().toISOString() }).eq('id', config.rowId);
  if (error) { setStatus('Could not save. Check the owner row and RLS policy in Supabase.', true); return; }
  setStatus('Saved to the shared menu. Customers will see it after refresh.');
});

document.querySelector('#add-item').addEventListener('click', () => {
  workingMenu.push({ id: `cng-item-${Date.now()}`, name: 'New CNG Special', category: 'bites', label: 'CNG special', price: 99, description: 'Add a delicious description here.', visual: 'burger' });
  renderEditor();
});

document.querySelector('#reset-data').addEventListener('click', () => loadDashboard());
document.querySelector('#logout').addEventListener('click', async () => { await supabaseClient.auth.signOut(); window.location.reload(); });

if (supabaseClient) {
  supabaseClient.auth.getSession().then(({ data }) => { if (data.session) unlock(); });
}
