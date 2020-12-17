// storage controller
const StorageController = (function () {
  return {
    storeItem: item => {
      let items;
      if (!localStorage.getItem('items')) {
        items = [];
        items.push(item);
        // Set item
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: () => {
      let items;
      if (localStorage.getItem('items')) {
        items = JSON.parse(localStorage.getItem('items'));
      } else {
        items = [];
      }
      return items;
    },
    updateLocaleStorage: updatedItem => {
      const items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteFromLocalStorage: itemToDelete => {
      const items = JSON.parse(localStorage.getItem('items'));
      filtredItems = items.filter(item => item.id !== itemToDelete.id);
      localStorage.setItem('items', JSON.stringify(filtredItems));
    },
    clearItemsFromLocalStorage: () => {
      localStorage.removeItem('items');
    }
  };
})();

// item controller
const ItemController = (function () {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    // items: [
    //   // { id: 0, name: 'Steak Dinner', calories: 1000 },
    //   // { id: 1, name: 'Cake', calories: 600 },
    //   // { id: 2, name: 'Apple', calories: 500 }
    // ],
    items: StorageController.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };
  return {
    addItem: (name, calories) => {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      calories = Number(calories);

      // create new Item
      const newItem = new Item(ID, name, calories);

      // Add the Item into items array
      data.items.push(newItem);
      return newItem;
    },
    getItems: () => data.items,
    logData: () => console.log(data.items),
    getTotalCalories: () => {
      const totalCalories = data.items.reduce((totalCalories, item) => {
        const total = totalCalories + item.calories;
        return total;
      }, 0);
      return totalCalories.toFixed(2);
    },
    getItemById: id => {
      const item = data.items.find(item => item.id === id);
      return item;
    },
    updateItem: (name, calories) => {
      const item = data.items.find(item => item.id === data.currentItem.id);
      item.name = name;
      item.calories = calories;
      return item;
    },
    setCurrentItem: item => {
      data.currentItem = item;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    deleteItem: itemToDelete => {
      const item = data.items.find(item => item.id === itemToDelete.id);
      const index = data.items.indexOf(item);
      data.items.splice(index, 1);
    },
    clearAllItems: () => {
      data.items = [];
    }
  };
})();

// UI controller
const UIController = (function () {
  // Selectors
  const UISelectors = {
    itemList: 'item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: 'item-name',
    itemCaloriesInput: 'item-calories',
    totalCalories: '.total-calories'
  };

  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert list items
      document.getElementById(UISelectors.itemList).innerHTML = html;
    },
    getSelectors: () => UISelectors,
    getItemInput: () => {
      const itemNameInput = document.getElementById(UISelectors.itemNameInput)
        .value;
      const itemCaloriesInput = document.getElementById(
        UISelectors.itemCaloriesInput
      ).value;
      return {
        name: itemNameInput,
        calories: itemCaloriesInput
      };
    },
    addListItem: item => {
      // display ItemList
      document.getElementById(UISelectors.itemList).style.display = 'block';

      // Create li
      const li = document.createElement('li');
      li.className = 'collection-item';

      //add Id
      li.id = `item-${item.id}`;
      // Add html
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      //Insert Element into UI
      document
        .getElementById(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },
    hideList: () => {
      document.getElementById(UISelectors.itemList).style.display = 'none';
    },
    updateTotalCalories: () => {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = ItemController.getTotalCalories();
    },
    addItemToForm: () => {
      document.getElementById(
        UISelectors.itemNameInput
      ).value = ItemController.getCurrentItem().name;
      document.getElementById(
        UISelectors.itemCaloriesInput
      ).value = ItemController.getCurrentItem().calories;
      UIController.showEditState();
    },
    clearInputs: () => {
      document.getElementById(UISelectors.itemNameInput).value = '';
      document.getElementById(UISelectors.itemCaloriesInput).value = '';
    },
    clearEditState: () => {
      UIController.clearInputs();
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
    },
    showEditState: () => {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },
    updatedListItem: item => {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(listItem => {
        const itemId = listItem.getAttribute('id');
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      });
    },
    deletelistItem: ({ id }) => {
      const ID = `item-${id}`;
      const itemToDelete = document.getElementById(ID);
      itemToDelete.remove();
    },
    deletelistItems: () => {
      const listItems = document.querySelectorAll(UISelectors.listItems);
      listItems.forEach(li => {
        li.remove();
      });
    }
  };
})();

// App controller
const AppController = (function (
  ItemController,
  UIController,
  StorageController
) {
  const itemAddSubmit = e => {
    const input = UIController.getItemInput();

    // Check for name and calories inputs
    if (input.name !== '' && input.calories !== '') {
      // Add new item
      const newItem = ItemController.addItem(input.name, input.calories);
      UIController.addListItem(newItem);

      // Update Calories
      const totalCalories = ItemController.getTotalCalories();
      UIController.updateTotalCalories(totalCalories);

      // Store in local Storage
      StorageController.storeItem(newItem);

      // F

      // Clear iputs
      UIController.clearInputs();
    }
    e.preventDefault();
  };

  // Update item submit
  const itemEditClick = e => {
    if (e.target.classList.contains('edit-item')) {
      // Get element Id (item-0, item-1...)
      const listId = e.target.parentNode.parentNode.id;
      // extract the Id from string exp: item-0 => 0
      const itemId = Number(listId.split('-')[1]);
      //Get Item
      const editItem = ItemController.getItemById(itemId);
      // Set current Item
      ItemController.setCurrentItem(editItem);

      // display item to the form
      UIController.addItemToForm();

      // Disable submit on enter
      document.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          return;
        }
      });
    }
    e.preventDefault();
  };

  // update Item submit
  const itemUpdateSubmit = e => {
    // Get Item inputs
    const input = UIController.getItemInput();

    // Update Item
    const updatedItem = ItemController.updateItem(
      input.name,
      Number(input.calories)
    );

    // Update List Item
    UIController.updatedListItem(updatedItem);

    const totalCalories = ItemController.getTotalCalories();
    UIController.updateTotalCalories(totalCalories);

    // Update local storage
    StorageController.updateLocaleStorage(updatedItem);

    // clear edit State
    UIController.clearEditState();

    e.preventDefault();
  };

  // delete Item
  const deleteItemSubmit = e => {
    const currentItem = ItemController.getCurrentItem();
    //delete Item from data
    ItemController.deleteItem(currentItem);

    // Delete listItem from UI
    UIController.deletelistItem(currentItem);

    const totalCalories = ItemController.getTotalCalories();
    UIController.updateTotalCalories(totalCalories);

    //delete from local storege
    StorageController.deleteFromLocalStorage(currentItem);

    // clear edit State
    UIController.clearEditState();

    e.preventDefault();
  };

  // Clear All items
  const clearAllItemsSubmit = e => {
    // Clear Items
    ItemController.clearAllItems();

    // Remove all items from UI
    UIController.deletelistItems();

    // clear edit State
    UIController.clearEditState();

    const totalCalories = ItemController.getTotalCalories();
    UIController.updateTotalCalories(totalCalories);

    // Clear items from local storage
    StorageController.clearItemsFromLocalStorage();

    // Hide list from the dom
    UIController.hideList();

    e.preventDefault();
  };

  const loadEventListeners = () => {
    const UISelectors = UIController.getSelectors();

    // Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    // Edit Icon click
    document
      .getElementById(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    // Update item submit
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit);

    // Back and clear Edit state
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', UIController.clearEditState);

    // Delte Item
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', deleteItemSubmit);

    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItemsSubmit);
  };

  return {
    // Init App
    init: () => {
      // Initialize edit state /clear edit state
      UIController.clearEditState();

      const items = ItemController.getItems();

      // Check if any items
      if (items.length === 0) {
        UIController.hideList();
      } else {
        // Populate list with items
        UIController.populateItemList(items);
      }

      // Update total calories field
      const totalCalories = ItemController.getTotalCalories();
      UIController.updateTotalCalories(totalCalories);

      // Load Event listeners
      loadEventListeners();
    }
  };
})(ItemController, UIController, StorageController);

AppController.init();
