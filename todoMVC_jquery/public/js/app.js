/*global jQuery, Handlebars, Router */
//immediatley invoked function expression
jQuery(function ($) {
	'use strict';

	Handlebars.registerHelper('eq', function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	});

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	var util = {
    //create a random unique id number
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
    //add an s as need to pluralize a word
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},
    //if provided two elements try to get data from local storage
    //else write data to local storage
		store: function (namespace, data) {
			if (arguments.length > 1) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			} else {
				var store = localStorage.getItem(namespace);
				return (store && JSON.parse(store)) || [];
			}
		}
	};

	var App = {
		init: function () {
			this.todos = util.store('todos-jquery');
			this.todoTemplate = Handlebars.compile($('#todo-template').html());
			this.footerTemplate = Handlebars.compile($('#footer-template').html());
			this.bindEvents();
      //upon calling init this.render should be called if todos has any todo items
      //from a previous session
      if (this.todos.length>0){
        this.render();
      };
      //replaced director.js functionality by:
      //1. getting the filter value from window.location.hash inside the render function
      //   so it is always updated each time render is called
      //2. by initially setting the filter to /all with a document.ready call (at end of script)
      //3. adding onClick="renderFooter()" for each link in the footer
      //4. removed filter: this.filter from renderFooter() it is not need by this function
      //5. add function to call render every time a link in footer is cliecked:
      //window.onhashchange=function(){
      //       App.render();
      //       }
      
			// //new Router is a constructor using director.js
      // previous implementation using director.js
			// new Router({
			// 	'/:filter': function (filter) {
			// 		this.filter = window.location.hash.split('#')[1].split("/")[1];
			// 		this.render();
			// 	}.bind(this)
			// }).init('/all');      
		},
		bindEvents: function () {
      // this explanation
      //this.create.bind(this) ==> App.create.bind(this===App)
			$('#new-todo').on('keyup', this.create.bind(this));
			$('#toggle-all').on('change', this.toggleAll.bind(this));
			$('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
			$('#todo-list')
				.on('change', '.toggle', this.toggle.bind(this))
				.on('dblclick', 'label', this.edit.bind(this))
				.on('keyup', '.edit', this.editKeyup.bind(this))
				.on('focusout', '.edit', this.update.bind(this))
				.on('click', '.destroy', this.destroy.bind(this));
		},
		render: function () {
      //determine which "route" or "page" we are on
      //this value determined by renderFooter() links or manually input into url
      this.filter=window.location.hash.split('#')[1].split("/")[1];
      //var todos will determine what is displayed on screen for our filter.
			var todos = this.getFilteredTodos();
      //todo-list innerHTHML gets filled up with handlebar template and todos variable data
			$('#todo-list').html(this.todoTemplate(todos));
			$('#main').toggle(todos.length > 0);
			$('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
      //render correct footer based on filter
			this.renderFooter();
      //focus pointer to new todo element
			$('#new-todo').focus();
      //store todos to local storage
			util.store('todos-jquery', this.todos);
		},
		renderFooter: function () {
			var todoCount = this.todos.length;
			var activeTodoCount = this.getActiveTodos().length;
      
			var template = this.footerTemplate({
				activeTodoCount: activeTodoCount,
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				completedTodos: todoCount - activeTodoCount,
        //filter is not needed here, was:
        //filter: this.filter
        //=> no functionality change when commented out
			});

      //$('#footer')===getElementById("footer")
      //.toggle(todoCount>0) ==> (todoCount>0) returns true or false depending on the length of the todo list
      //.toggle(display) is jquery boolean logic used to display an element or not
      //.html(template) calls the handlebars template
			$('#footer').toggle(todoCount > 0).html(template);
      
			
		},
		toggleAll: function (e) {
			var isChecked = $(e.target).prop('checked');

			this.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});

			this.render();
		},
		getActiveTodos: function () {
			return this.todos.filter(function (todo) {
				return !todo.completed;
			});
		},
		getCompletedTodos: function () {
			return this.todos.filter(function (todo) {
				return todo.completed;
			});
		},
    //shows active, completed or all todos
		getFilteredTodos: function () {
			if (this.filter === 'active') {
				return this.getActiveTodos();
			}

			if (this.filter === 'completed') {
				return this.getCompletedTodos();
			}

			return this.todos;
		},
    //deletes a todo
		destroyCompleted: function () {
			this.todos = this.getActiveTodos();
			this.filter = 'all';
			this.render();
		},
		// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) {
			var id = $(el).closest('li').data('id');
			var todos = this.todos;
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
					return i;
				}
			}
		},
    //create a todo
		create: function (e) {
			var $input = $(e.target);
			var val = $input.val().trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			this.todos.push({
				id: util.uuid(),
				title: val,
				completed: false
			});

			$input.val('');

			this.render();
		},
    //toggle todo items
		toggle: function (e) {
			var i = this.indexFromEl(e.target);
			this.todos[i].completed = !this.todos[i].completed;
			this.render();
		},
    //allows editing of todo item
		edit: function (e) {
			var $input = $(e.target).closest('li').addClass('editing').find('.edit');
			$input.val($input.val()).focus();
		},
    //check if enter or esc is pressed while editing
    //if enter store data, if esc no change
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				$(e.target).data('abort', true).blur();
			}
		},
    //this function edits content of todo item
		update: function (e) {
			var el = e.target;
			var $el = $(el);
			var val = $el.val().trim();

			if (!val) {
				this.destroy(e);
				return;
			}

			if ($el.data('abort')) {
				$el.data('abort', false);
			} else {
				this.todos[this.indexFromEl(el)].title = val;
			}

			this.render();
		},
		destroy: function (e) {
			this.todos.splice(this.indexFromEl(e.target), 1);
			this.render();
		}
	};

	App.init();
  window.onhashchange=function(){
    App.render();
    }
});
//set default window hash to all
$( document ).ready(window.location.hash = "/all");