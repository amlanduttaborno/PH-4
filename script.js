// Green Earth Website JS
const API_BASE = 'https://openapi.programming-hero.com/api';
const categoriesEl = document.getElementById('categories');
const treesGridEl = document.getElementById('trees-grid');
const spinnerEl = document.getElementById('spinner');
const cartListEl = document.getElementById('cart-list');
const cartTotalEl = document.getElementById('cart-total');
const modalEl = document.getElementById('modal');
const modalContentEl = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');

let categories = [];
let trees = [];
let cart = [];
let activeCategoryId = null;

// Show spinner
function showSpinner(show) {
  spinnerEl.classList.toggle('hidden', !show);
}

// Fetch categories
function loadCategories() {
  showSpinner(true);
  const url = 'https://openapi.programming-hero.com/api/categories';
  console.log('Fetching categories:', url);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Categories response:', data);
      categories = Array.isArray(data.categories) ? data.categories : [];
      if (!categories.length) {
        categoriesEl.innerHTML = '<div class=\"text-red-600\">No categories found.</div>';
      } else {
        renderCategories();
      }
      showSpinner(false);
    })
    .catch(err => {
      categoriesEl.innerHTML = '<div class="text-red-600">Failed to load categories.</div>';
      showSpinner(false);
    });
}

// Render categories
function renderCategories() {
  categoriesEl.innerHTML = '';
  // All Trees button
  const allBtn = document.createElement('button');
  allBtn.textContent = 'All Trees';
  allBtn.className = 'w-full text-left py-2 px-4 rounded font-medium transition-colors mb-1';
  allBtn.onclick = () => {
    activeCategoryId = null;
    highlightActiveCategory();
    loadTrees();
  };
  categoriesEl.appendChild(allBtn);
  // Other categories
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat.category_name;
    btn.className = 'w-full text-left py-2 px-4 rounded font-medium transition-colors mb-1 hover:bg-green-100';
    btn.onclick = () => {
      activeCategoryId = cat.id;
      highlightActiveCategory();
      loadTrees(cat.id);
    };
    btn.dataset.id = cat.id;
    categoriesEl.appendChild(btn);
  });
  highlightActiveCategory();
}

function highlightActiveCategory() {
  Array.from(categoriesEl.children).forEach(btn => {
    btn.classList.remove('bg-green-700', 'text-white');
    btn.classList.add('bg-white', 'text-green-900');
    btn.classList.remove('hover:bg-green-100');
    if (!activeCategoryId && btn.textContent === 'All Trees') {
      btn.classList.add('bg-green-700', 'text-white');
      btn.classList.remove('bg-white', 'text-green-900');
    } else if (btn.dataset.id === activeCategoryId) {
      btn.classList.add('bg-green-700', 'text-white');
      btn.classList.remove('bg-white', 'text-green-900');
    } else {
      btn.classList.add('hover:bg-green-100');
    }
  });
}

// Fetch trees
function loadTrees(categoryId) {
  showSpinner(true);
  let url = 'https://openapi.programming-hero.com/api/plants';
  if (categoryId) {
    // Ensure categoryId is a valid value, not the string '${id}'
    url = `https://openapi.programming-hero.com/api/category/${encodeURIComponent(categoryId)}`;
  }
  console.log('Fetching trees:', url);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Trees response:', data);
      trees = Array.isArray(data.plants) ? data.plants : [];
      renderTrees();
      showSpinner(false);
    })
    .catch(err => {
      treesGridEl.innerHTML = '<div class="text-red-600 col-span-3">Failed to load trees.</div>';
      showSpinner(false);
    });
}

// Render trees
function renderTrees() {
  treesGridEl.innerHTML = '';
  if (!trees.length) {
    treesGridEl.innerHTML = '<div class="text-center text-gray-500 col-span-3">No trees found.</div>';
    return;
  }
  treesGridEl.className = 'grid grid-cols-1 md:grid-cols-3 gap-6';
  trees.forEach(tree => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow p-4 flex flex-col h-full border border-green-50';
    card.innerHTML = `
      <div class="bg-gray-100 rounded-lg mb-3 flex items-center justify-center" style="height:120px;">
        <img src="${tree.image}" alt="${tree.name}" class="object-cover h-full w-full rounded-lg" style="max-height:120px; max-width:100%;">
      </div>
      <h3 class="font-bold text-base text-gray-900 mb-1" data-id="${tree.id}">${tree.name}</h3>
      <p class="text-sm text-gray-700 mb-2">${tree.description || tree.small_description || ''}</p>
      <div class="flex items-center mb-3">
        <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">${tree.category || tree.category_name}</span>
        <span class="ml-auto font-bold text-gray-900">৳${tree.price || tree.price || ''}</span>
      </div>
      <button class="w-full bg-green-700 text-white py-2 rounded-full font-semibold text-base mt-auto hover:bg-green-800 transition-all" data-id="${tree.id}">Add to Cart</button>
    `;
    card.querySelector('h3').onclick = () => showTreeModal(tree.id);
    card.querySelector('button').onclick = () => addToCart(tree);
    treesGridEl.appendChild(card);
  });
}

// Modal logic
function showTreeModal(treeId) {
  modalEl.classList.remove('hidden');
  modalContentEl.innerHTML = '<div class="flex justify-center items-center h-32"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div></div>';
  // Ensure treeId is a valid value, not the string '${id}'
  const url = `https://openapi.programming-hero.com/api/plant/${encodeURIComponent(treeId)}`;
  console.log('Fetching tree details:', url);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const tree = data.data;
      if (tree) {
        modalContentEl.innerHTML = `
          <img src="${tree.image}" alt="${tree.name}" class="h-40 w-full object-cover rounded mb-4 bg-gray-100">
          <h3 class="font-bold text-xl text-green-900 mb-2">${tree.name}</h3>
          <p class="mb-2">${tree.description}</p>
          <span class="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs mb-2">${tree.category}</span>
          <div class="font-bold text-green-900 mb-2">Price: ฿${tree.price}</div>
        `;
      } else {
        modalContentEl.innerHTML = '<div class="text-red-600">Tree details not found.</div>';
      }
    })
    .catch(() => {
      modalContentEl.innerHTML = '<div class="text-red-600">Failed to load tree details.</div>';
    });
}
closeModalBtn.onclick = () => {
  modalEl.classList.add('hidden');
};
window.onclick = e => {
  if (e.target === modalEl) modalEl.classList.add('hidden');
};

// Cart logic
function addToCart(tree) {
  const found = cart.find(item => item.id === tree.id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...tree, qty: 1 });
  }
  renderCart();
}
function removeFromCart(treeId) {
  cart = cart.filter(item => item.id !== treeId);
  renderCart();
}
function renderCart() {
  cartListEl.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center mb-2 bg-green-50 rounded px-2 py-1';
    div.innerHTML = `
      <span>${item.name} <span class="text-xs text-gray-600">฿${item.price} × ${item.qty}</span></span>
      <button class="text-gray-400 hover:text-red-600 ml-2 text-lg font-bold" title="Remove">&times;</button>
    `;
    div.querySelector('button').onclick = () => removeFromCart(item.id);
    cartListEl.appendChild(div);
  });
  cartTotalEl.textContent = `฿${total}`;
}

// Donate form
const donateForm = document.getElementById('donate-form');
donateForm.onsubmit = e => {
  e.preventDefault();
  alert('Thank you for your donation!');
  donateForm.reset();
};

// Initial load
loadCategories();
loadTrees();
