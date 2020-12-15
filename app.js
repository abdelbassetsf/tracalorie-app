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
    }
  };
})();

// UI controller
const UIController = (function () {
  // Selectors
  const UISelectors = {
    itemList: 'item-list',
    addBtn: '.add-btn',
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
    clearInputs: () => {
      document.getElementById(UISelectors.itemNameInput).value = '';
      document.getElementById(UISelectors.itemCaloriesInput).value = '';
    }
  };
})();

// App controller
const AppController = (function (ItemController, UIController) {
  const loadEventListeners = () => {
    const UISelectors = UIController.getSelectors();

    const itemAddSubmit = e => {
      const input = UIController.getItemInput();
      e.preventDefault();

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
    };

    // Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);
  };
  return {
    // Init App
    init: () => {
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
