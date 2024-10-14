// VARIABLES
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');

resetUI()

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item)
  })

  resetUI()
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

  // ADD ITEM TO DOM ELEMENT
  addItemToDOM(newItem)

  // ADD ITEM TO LOCAL STORAGE
  addItemToStorage(newItem)


  resetUI()

  // CLEAR INPUT AFTER NEW ITEM ADDED
  itemInput.value = ''
}

// ADD ITEM TO DOM

  function addItemToDOM(item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red')
  li.appendChild(button);

  // ADD LI TO DOM
  itemList.appendChild(li)
}

// ADD ITEM TO STORAGE
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage()

  itemsFromStorage.push(item);

  // CONVERT TO JSON STRING AND SET TO LOCAL STORAGE
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));

  resetUI()
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
  const icon = createIcon("fa-solid fa-plus");
  button.appendChild(icon);
  return button;
}

// CREATE ICON
function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

// REMOVE ITEM
function removeItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    e.target.parentElement.parentElement.remove();
  }
  resetUI()
}

// CLEAR ALL LIST ITEMS
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild)
  }
  resetUI()
}

// FILTER ITEMS
function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase()
  
  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase()

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  })
}

// RESET UI FOR ITEMS PRIOR TO ADD/REMOVAL OF FILTER LIST & CLEAR BTN
function resetUI() {
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none'
    itemFilter.style.display = 'none'
  } else {
    clearBtn.style.display = 'block'
    itemFilter.style.display = 'block'
  }
}

// INITIALIZE APP
function init() {
  // EVENT LISTENERS
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', removeItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems)
  
  resetUI();
}

init()
