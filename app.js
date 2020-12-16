// storage controller

// item controller
const ItemController = (function () {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: [
      // { id: 0, name: 'Steak Dinner', calories: 1000 },
      // { id: 1, name: 'Cake', calories: 600 },
      // { id: 2, name: 'Apple', calories: 500 }
    ],
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
      if (item) {
        item.name = name;
        item.calories = calories;
      }
      return item;
    },
    setCurrentItem: item => {
      data.currentItem = item;
    },
    getCurrentItem: () => {
      return data.currentItem;
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
      document.querySelector(UISelectors.itemList).innerHTML = html;
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
    }
  };
})();

// App controller
const AppController = (function (ItemController, UIController) {
  const itemAddSubmit = e => {
    const input = UIController.getItemInput();

    // Check for name and calories inputs
    if (input.name !== '' && input.calories !== '') {
      // Add new item
      const newItem = ItemController.addItem(input.name, input.calories);
      UIController.addListItem(newItem);

      const totalCalories = ItemController.getTotalCalories();
      UIController.updateTotalCalories(totalCalories);

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

    // clear edit State
    UIController.clearEditState();

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
})(ItemController, UIController);

AppController.init();
