
//BUDGET CONTROLLER
var budgetController = (function() {
	//TO DO
	//var x and function add is private
	var x = 23;

	//为什么不定义成 function add(b) {}
	var add = function(a) {
		return x + a;
	}
	//closure
	//publicTest is public
	//budgetController is an object containing the method called publicTest
	return {
		publicTest : function(b) {
			return add(b);
		}
	}

})();


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
		inputBtn : ".add__btn"
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
		//1. get the field input data
		var input = UICtrl.getInput();
		console.log(input);

		//2. add the item to the budget controller

		//3. add the new item to the UI

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
















