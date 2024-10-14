// VARIABLES
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

resetUI()

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  })

  resetUI();
}

// ADD NEW LIST ITEM
function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // VALIDATE INPUT
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // CHECK FOR EDIT MODE
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode')

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;  
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item is already on your list');
      return;
    }
  }

  // ADD ITEM TO DOM ELEMENT
  addItemToDOM(newItem);

  // ADD ITEM TO LOCAL STORAGE
  addItemToStorage(newItem);

   resetUI();

  // CLEAR INPUT AFTER NEW ITEM ADDED
  itemInput.value = '';
}

// ADD ITEM TO DOM

  function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // ADD LI TO DOM
  itemList.appendChild(li);
}

// ADD ITEM TO STORAGE
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  // CONVERT TO JSON STRING AND SET TO LOCAL STORAGE
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));

  resetUI();
}

// GET ITEMS FROM STORAGE
function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

// CREATE BUTTON
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon("fa-solid fa-x");
  button.appendChild(icon);
  return button;
}

// CREATE ICON
function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

// ONCLICK ITEM
function onClickItem(e) {
  if (e.target.parentElement.classList.contains
    ('remove-item')) {
      removeItem(e.target.parentElement.parentElement);
    } else {
      setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

// SET ITEM TO EDIT
function setItemToEdit(item) {
  isEditMode = true;

  itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'))


  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></I> Update Item';
  formBtn.style.backgroundColor = '#228B22'
  itemInput.value = item.textContent;
}

// REMOVE ITEM
function removeItem(item) {
  if (confirm('Are you sure?')) {
    item.remove();

    removeItemFromStorage(item.textContent);

    resetUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // FILTER OUT ITEM TO BE REMOVED
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // RE-SET TO LOCAL STORAGE
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// CLEAR ALL LIST ITEMS
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // CLEAR ALL IN LOCALSTORAGE
  localStorage.removeItem('items');

  resetUI()
}

// FILTER ITEMS
function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();
  
  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  })
}

// RESET UI FOR ITEMS PRIOR TO ADD/REMOVAL OF FILTER LIST & CLEAR BTN
function resetUI() {
  itemInput.value = ''

  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

// INITIALIZE APP
function init() {
  // EVENT LISTENERS
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  
  resetUI();
}

init();