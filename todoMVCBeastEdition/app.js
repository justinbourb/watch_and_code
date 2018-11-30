/*global jQuery, Handlebars, Router */
//immediatley invoked function expression
// jQuery(function ($) {

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
		bindEvents: function () {
      // this explanation
      //this.create.bind(this) ==> App.create.bind(this===App)
			//$('#new-todo').on('keyup', this.create.bind(this));
      //$('#toggle-all').on('change', this.toggleAll.bind(this));
			//$('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
			// $('#todo-list')
			// 	.on('change', '.toggle', this.toggle.bind(this))
				//.on('dblclick', 'label', this.edit.bind(this))
				//.on('keyup', '.edit', this.editKeyup.bind(this));
				//.on('focusout', '.edit', this.update.bind(this));
				//.on('click', '.destroy', this.destroy.bind(this));
      document.getElementById('new-todo').addEventListener('keyup', this.create.bind(this));
      document.getElementById('toggle-all').addEventListener('change', this.toggleAll.bind(this));
      /**below is an example of event delegation.  Since clear-completed does not always exist
      *we attach the event listener to the body of the html and check if
      *event.target.id === clear-completed
      **/
      document.querySelector('body').addEventListener('click', function(event) {
        if (event.target.id === 'clear-completed') {
          App.destroyCompleted();
        };
        if (event.target.className === 'destroy') {
          App.destroy(event);
        };
      });
      document.querySelector('body').addEventListener('focusout', function(event) {
        if (event.target.className === 'edit') {
          App.update(event);
        };
      });
      document.querySelector('body').addEventListener('keyup', function(event) {
        if (event.target.className === 'edit') {
          App.editKeyup(event);
        };
      });
      document.querySelector('body').addEventListener('dblclick', function(event) {
        if (event.target.nodeName === 'LABEL') {
          App.edit(event);
        };
      });
      document.querySelector('body').addEventListener('change', function(event) {
        if (event.target.className === 'toggle') {
          App.toggle(event);
        };
      });
		},
    //create a todo
		create: function (e) {
			//var $input = $(e.target);
      var input = document.getElementById('new-todo');
			//var val = $input.val().trim();
      var val = input.value.trim();

			if (e.which !== ENTER_KEY || !val) {
				return;
			}

			this.todos.push({
				id: util.uuid(),
				title: val,
				completed: false
			});

			//$input.val('');
      input.value = '';
      this.storeTodos();
			this.render();
		},
		destroy: function (e) {
			this.todos.splice(this.indexFromEl(e.target), 1);
      this.storeTodos();
			this.render();
		},
    //deletes a todo
		destroyCompleted: function () {
			this.todos = this.getActiveTodos();
			this.filter = 'all';
      this.storeTodos();
			this.render();
		},
    //allows editing of todo item
		edit: function (e) {
			//var $input = $(e.target).closest('li').addClass('editing').find('.edit');
      /**finds the element clicked (e.target) and finds the closest Li element and adds a class of editing to this li
      * there is an editing css rule which sets the li to invisible
      * which allows access to the underlying input field (class of edit)
      **/
      var input = e.target.closest('li').classList.add('editing');
      //focus on editing text area
      //$input.val($input.val()).focus();
			e.target.closest('li').querySelector('.edit').focus();
      
		},
    /**Jquery version:
    *check if enter or esc is pressed while editing
    *if enter then store data
    *if esc then set e.target to ('abort', true)
    *this is then handled by the update function which will not update the field
    **/
    
    /**javascript version:
    *check if enter or esc is pressed while editing
    *if enter then store data
    *if esc then set e.target.dataset.abort to 'abort'
    *this is then handled by the update function which will not update the field
    **/
    
		editKeyup: function (e) {
			if (e.which === ENTER_KEY) {
				e.target.blur();
			}

			if (e.which === ESCAPE_KEY) {
				//$(e.target).data('abort', true).blur();
        e.target.dataset.abort = 'abort';
        e.target.blur();
			}
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
	
    	// accepts an element from inside the `.item` div and
		// returns the corresponding index in the `todos` array
		indexFromEl: function (el) {
      /**notes for input.toggle button
      *when clicking input toggle, el = input.toggle in jquery
      *this equates to dom element <input>, class = "toggle" 
      *closest li is a parent of toggle element, find this li's data-id

      */
			//var id = $(el).closest('li').data('id');
      var id = el.closest('li').getAttribute('data-id');
			var todos = this.todos;
			var i = todos.length;

			while (i--) {
				if (todos[i].id === id) {
					return i;
				}
			}
		},
    init: function () {
			this.todos = util.store('todos-jquery');
			// this.todoTemplate = Handlebars.compile($('#todo-template').html());
			// this.footerTemplate = Handlebars.compile($('#footer-template').html());
      this.todoTemplate = Handlebars.compile(document.getElementById('todo-template').innerHTML);
			this.footerTemplate = Handlebars.compile(document.getElementById('footer-template').innerHTML);
			this.bindEvents();
      window.location.hash="/all";
      //upon calling init this.render should be called if todos has any todo items
      //from a previous session
      if (this.todos.length) {
        this.render();
      };
    
		},
    render: function () {
      //determine which "route" or "page" we are on
      //this value determined by renderFooter() links or manually input into url
      this.filter=window.location.hash.split('#')[1].split("/")[1];
      //var todos will determine what is displayed on screen for our filter.
			var todos = this.getFilteredTodos();
      //todo-list innerHTHML gets filled up with handlebar template and todos variable data
			//$('#todo-list').html(this.todoTemplate(todos));
      document.getElementById('todo-list').innerHTML = this.todoTemplate(todos);
			// $('#main').toggle(todos.length > 0);
      if (todos.length > 0) {
        document.getElementById('main').style.display = "block";
      }else{
       document.getElementById('main').style.display = "none"; 
      };
      
      /**Jquery logic breakdown:
      *$('#toggle-all') === document.getElementById('toggle-all')
      *.prop('checked' === name of the property to set
      *this.getActiveTodos().length === 0); === a boolean true/false check which updates the state
      *of the toggle all property.  Which works both when toggle all button is clicked
      *and when the user clicks the individual checkboxes
      **/
			//$('#toggle-all').prop('checked', this.getActiveTodos().length === 0);
      
      document.getElementById('toggle-all').checked = (this.getActiveTodos().length === 0);
      //render correct footer based on filter
			this.renderFooter();
      //focus pointer to new todo element
			//$('#new-todo').focus();
      document.getElementById('new-todo').focus();
		},
		renderFooter: function () {
			var todoCount = this.todos.length;
			var activeTodoCount = this.getActiveTodos().length;
      
			var template = this.footerTemplate({
				activeTodoCount: activeTodoCount,
				activeTodoWord: util.pluralize(activeTodoCount, 'item'),
				completedTodos: todoCount - activeTodoCount,
			});

      //$('#footer')===getElementById("footer")
      //.toggle(todoCount>0) ==> (todoCount>0) returns true or false depending on the length of the todo list
      //.toggle(display) is jquery boolean logic used to display an element or not
      //.html(template) calls the handlebars template
			//$('#footer').toggle(todoCount > 0).html(template);
      
      if (todoCount > 0) {
        document.getElementById('footer').innerHTML=template;
        document.getElementById('footer').style.display = "block";
      } else {
       document.getElementById('footer').style.display = "none"; 
      };
      
			
		},
    storeTodos: function() {
      util.store('todos-jquery', this.todos);
    },
      //toggle todo items
		toggle: function (e) {
			var i = this.indexFromEl(e.target);
			this.todos[i].completed = !this.todos[i].completed;
      this.storeTodos();
			this.render();
		},
		toggleAll: function (e) {
			// var isChecked = $(e.target).prop('checked');
      var isChecked = e.target.checked;


			this.todos.forEach(function (todo) {
				todo.completed = isChecked;
			});
      this.storeTodos();
			this.render();
		},
    
    //this function edits content of todo item
		update: function (e) {
			var el = e.target;
			// var $el = $(el);
			// var val = $el.val().trim();
      var val = el.value.trim();

			if (!val) {
				this.destroy(e);
				return;
			}

			/*if ($el.data('abort')) {
				$el.data('abort', false);
        */
      //If el.dataset.abort === 'abort' then switch to proceed and do not store the data.
      if (el.dataset.abort === 'abort') {
        el.dataset.abort = 'proceed';
			} else {
				this.todos[this.indexFromEl(el)].title = val;
			}
      this.storeTodos();
			this.render();
		}
	};

	App.init();
  window.onhashchange=function(){
    App.render();
    }
//});
//set default window hash to all
//$( document ).ready(window.location.hash = "/all");
