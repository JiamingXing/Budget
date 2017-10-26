
//BUDGET CONTROLLER
//This controller keeps tracking of all the incomes and expenses
//and also the budget itself and later also the percentages.
var budgetController = (function() {
	
	//use function constructor to create 
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPecentage = function() {
		return this.percentage;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
	}

	//this data structure is private and only accessible in this module
	var data = {
		allItems : {
			exp : [],
			inc : []
		},
		totals : {
			exp : 0,
			inc : 0
		},
		budget : 0,
		percentage : -1
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

		deleteItem : function(type, id) {
			var ids, index;
			ids = data.allItems[type].map(function(cur) {
				return cur.id;
			});
			index = ids.indexOf(id);
			//remove the exact index element in the array using splice
			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget : function() {
			//calculate the sum of incomes and expenses
			calculateTotal("exp");
			calculateTotal("inc");

			//calculate the budget : income - expense
			data.budget = data.totals.inc - data.totals.exp;
			//calculate the percentage of income we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}

		},

		calculatePercentages : function() {
			data.allItems.exp.forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},

		getPercentages : function() {
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPecentage();
			});
			return allPerc;
		},

		getBudget : function() {
			return {
				budget : data.budget,
				totalInc : data.totals.inc,
				totalExp : data.totals.exp,
				percentage : data.percentage
			};
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
		expenseContainer : ".expenses__list",
		budgetLabel : ".budget__value",
		incomeLabel : ".budget__income--value",
		expensesLabel : ".budget__expenses--value",
		percentageLabel : ".budget__expenses--percentage",
		container : ".container",
		expensesPercLabel : ".item__percentage",
		dateLabel : ".budget__title--month"
	}

	var formatNumber = function(num, type) {
		var numSplit, int, dec, sign;
		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split(".");
		int = numSplit[0];
		if (int.length > 3) {
			int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, int.length);
		}
		dec = numSplit[1];
		return (type === "exp" ? sign = "-" : sign = "+") + " " + int +  "." + dec;
	};

	return {
		getInput : function() {
			return {
				//return these three properties
				type : document.querySelector(DOMStrings.intputType).value,
				description : document.querySelector(DOMStrings.inputDescription).value,
				value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
			}

		},

		addListItem : function(obj, type) {
			var html, newHtml, element;
			//1.create HTML string with place holder text
			if (type === "inc") {
				element = DOMStrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === "exp") {
				element = DOMStrings.expenseContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//2. replace the place holder text with some actual data
			newHtml = html.replace("%id%", obj.id);
			newHtml = newHtml.replace("%description%", obj.description);
			newHtml = newHtml.replace("%value%", formatNumber(obj.value));
			//3. Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
		},

		deleteListItem : function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},

		clearFields : function() {
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue);
			//we can not use fields.slice() directly cause fields is not array
			fieldsArr = Array.prototype.slice.call(fields);
			fieldsArr.forEach(function(cur, i, arr) {
				cur.value = "";
			});

			fieldsArr[0].focus();
		},

		displayBudget : function(obj) {
			var tyep;
			obj.budget > 0 ? type = "inc" : type = "exp";
			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, "inc");
			document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, "exp");
			if (obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = "---";
			}
		},

		displayPercentages : function(percentages) {
			//node list
			var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

			var nodeListForEach = function(list, callback) {
				for (var i = 0; i < list.length; i++) {
					callback(list[i], i);
				}
			};

			nodeListForEach(fields, function(current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + "%";
				} else {
					current.textContent = "---";
				}
			});
		},

		displayMonth : function() {
			var now, months, year, month;
			now = new Date();
			year = now.getFullYear();
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			month = now.getMonth();
			document.querySelector(DOMStrings.dateLabel).textContent = months[month] + " " + year;
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

		document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);
	};

	var updateBudget = function() {

		//1. calculate the budget
		budgetCtrl.calculateBudget();
		//2. return the budget
		var budget = budgetCtrl.getBudget();
		//3. Display the budget
		UICtrl.displayBudget(budget);
	};

	var updatePercentages = function() {
		//1. calculate the percentage
		budgetCtrl.calculatePercentages();
		//2. read percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();
		//3. update the UI
		UICtrl.displayPercentages(percentages);
	};

	//event handler press 
	var ctrlAddItem = function() {
		var input, newItem
		//1. get the field input data
		input = UICtrl.getInput();

		//add input prevention
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			//2. add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//3. add the new item to the UI
			UICtrl.addListItem(newItem, input.type);

			//4.clear the fields
			UICtrl.clearFields();

			//5.calculate and update budget
			updateBudget();

			//6.calculate and update percentages
			updatePercentages();
		} else {
			UICtrl.clearFields();
		}
	};

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if (itemID) {
			splitID = itemID.split("-");
			type = splitID[0];
			ID = Number(splitID[1]);

			//1. delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);
			//2. delete the item from the UI
			UICtrl.deleteListItem(itemID);
			//3. update and show the new budget
			updateBudget();
			//4. calculate and update percentages
			updatePercentages();
		}
	};

	//we need a public int function so return in the IIFE
	return {
		init : function() {
			console.log("Application has started!");
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget : 0,
				totalInc : 0,
				totalExp : 0,
				percentage : -1
			});
			setupEventListeners();
		}
	}

})(budgetController, UIController);

//the only code written outside the modules
controller.init();
















