
//BUDGET CONTROLLER
//This controller keeps tracking of all the incomes and expenses
//and also the budget itself and later also the percentages.
var budgetController = (function() {
	
	//use function constructor to create 
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	//this data structure is private and only accessible in this module
	var data = {
		allItems : {
			exp : [],
			inc : []
		},
		totals : {
			exp : 0,
			inc : 0
		}
	}

	//How to avoid conflicts in our data structure
	//how and why to pass data from one module to another

	//create a public method in this module to allow other module add new item into our database
	return {
		addItem : function(type, des, val) {
			var newItem, ID;

			//ID = last ID + 1
			//create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			}  else {
				ID = 0;
			}

			//create new item based on 'inc' or 'exp' type
			if (type === "inc") {
				newItem = new Income(ID, des, val);
			} else if (type === "exp") {
				newItem = new Expense(ID, des, val);
			}

			//push it into our datastructure
			data.allItems[type].push(newItem);

			//Return the new item so other mudules can publicly access it 
			return newItem;
		},

		test : function() {
			console.log(data);
		}

	};


})();


//A technique for adding big chunks of HTML into the DOM
//How to replace parts of strings
//How to do DOM manipulation using the insertAdjacentHTML method

//UI CONTROLLER
var UIController = (function() {
	//TO DO
	//to get data from input
	//if we want to write a public function get data to be used in other modules
	//we have to set it as the return function of thie IIFE

	//to make it convenient if we change our class name later at html
	//what we need to change in app.js is here only
	var DOMStrings = {
		intputType : ".add__type",
		inputDescription : ".add__description",
		inputValue : ".add__value",
		inputBtn : ".add__btn",
		incomeContainer : ".income__list",
		expenseContainer : ".expenses__list"
	}
	return {
		getInput : function() {
			return {
				//return these three properties
				type : document.querySelector(DOMStrings.intputType).value,
				description : document.querySelector(DOMStrings.inputDescription).value,
				value : document.querySelector(DOMStrings.inputValue).value
			}

		},

		addListItem : function(obj, type) {
			var html, newHtml, element;
			//1.create HTML string with place holder text
			if (type === "inc") {
				element = DOMStrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === "exp") {
				element = DOMStrings.expenseContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//2. replace the place holder text with some actual data
			newHtml = html.replace("%id%", obj.id);
			newHtml = newHtml.replace("%description%", obj.description);
			newHtml = newHtml.replace("%value%", obj.value);
			//3. Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
		},

		getDOMStrings : function() {
			return DOMStrings;
		}
	};
})();


//GLOBAL APP CONTROLLER
//This is the place our controller tell other modules what to do!
var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {

		var DOM = UICtrl.getDOMStrings();

		document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

		document.addEventListener("keypress", function(event) {
			//Enter : keycode = 13
			//event is a object to dicate what key we press
			//console.log(event);
			//some old browsers does not use keyCode
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	}

	var ctrlAddItem = function() {
		var input, newItem
		//1. get the field input data
		input = UICtrl.getInput();

		//2. add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		//3. add the new item to the UI
		UICtrl.addListItem(newItem, input.type);

		//4. calculate the budget and display the budget
	}

	//we need a public int function so return in the IIFE
	return {
		init : function() {
			console.log("Application has started!");
			setupEventListeners();
		}
	}

})(budgetController, UIController);

//the only code written outside the modules
controller.init();
















