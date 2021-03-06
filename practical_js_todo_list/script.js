/* If you're feeling fancy you can add interactivity
    to your site with Javascript */
//working through version 9?


//todoList contains the logic and data of the todoList
var todoList = {
//adds todo to todo list and completed boolean
    addTodo: function(todoText){
    if(todoText){
      this.todos.push({
        todoText: todoText,
        completed: false
      });
    }
    views.displayTodos();
  },
//changes todo at position provided by user
  changeTodo: function(position, todoText){
    if(this.todos[position]){
    this.todos[position].todoText = todoText;
    }
    views.displayTodos();
  },
//deletes todo
  deleteTodo: function(position){
    var itemsToSplice = [];
    //first we find which items to remove(splice)
    for (var i=0; i<this.todos.length; i++){
     if (this.todos[i].completed===true){
      itemsToSplice.push(this.todos[i].todoText);
      }
    }
    //next we splice the results of itemsToSplice;
    for (var i=0; i<itemsToSplice.length; i++){
      var indexToSplice = todoList.todos.findIndex(x => x.todoText===itemsToSplice[i]);
      this.todos.splice(indexToSplice,1);
    };
    views.displayTodos();
  },
//todo list
  todos:[],

//toggles completed property for all values in todo
  toggleAll:function(){
    var totalTodos = this.todos.length;
    var completedTodos=0;
    //count number of completed and incomplete todos
    for (var i=0; i<totalTodos; i++){
     if (this.todos[i].completed===true){
      completedTodos++;
     }
    }
    //Case 1: make everything true if everything is false
    if (completedTodos===totalTodos){
     for (var i=0;i<totalTodos;i++){
       this.todos[i].completed=false;
     }
    }else{
    //Case 2: make everything false if everything is true
     for (var i=0;i<totalTodos;i++){
       this.todos[i].completed=true;
     }
    }

    views.displayTodos();


  },//toggles completed property of todo list item
  toggleCompleted: function(position){
    //this function will set todoList.todos[i].compeleted based on the status of the todo list checkboxes
    for(var i=0;i<todoList.todos.length;i++){
      var isCheckboxChecked = document.getElementById("liCheckbox"+i).checked;
      if (isCheckboxChecked){
        todoList.todos[i].completed=true;
      }
      else{
        todoList.todos[i].completed=false;
      };
    };
  }
};

var handlers ={
    addTodo: function(){
    //note: index.html has javascript so this is called on click and enter keyup
    var addTodoTextInput = document.getElementById('addTodoTextInput');
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value='';
    changeBackgroundImage();
    changeBorderColor();


  },changeTodo: function(){
    //note: index.html has javascript so this is called on click and enter keyup
      var changeTodoPositionInput = document.getElementById('changeTodoPositionInput');
      var changeTodoTextInput = document.getElementById('changeTodoTextInput');
      todoList.changeTodo(changeTodoPositionInput.valueAsNumber,changeTodoTextInput.value);
      changeTodoPositionInput.value='';
      changeTodoTextInput.value='';
      changeBackgroundImage();
      changeBorderColor();
    
  },deleteTodo:function(){
      todoList.deleteTodo();
      changeBackgroundImage();
      changeBorderColor();
    
  },
  toggleAll: function(){
    todoList.toggleAll();
    changeBackgroundImage();
    changeBorderColor();
  },toggleCompleted:function(){
    todoList.toggleCompleted();
    changeBackgroundImage();
    changeBorderColor();
    views.toggleDelete();
  }};


var views={
//display Todos by creating <li> items for each todo
  displayTodos: function(){
    //not sure why this wasn't working without calling setTimeout??  But it works like this.
    setTimeout(function(){
      if (todoList.todos.length>0){
        document.getElementById("toggleAllButton").style.visibility = "visible";
        }else{
          document.getElementById("toggleAllButton").style.visibility = "hidden";
      }},0);
    var todoLiCounter = 0;
    var todosUl = document.querySelector('ul');
    //reset innerHTML to '' to prevent duplicate entries showing up
    todosUl.innerHTML='';
    if (todoList.todos.length===0){
      //displays 'Your todo list is empty.' in ul element
      var todosLi = document.createElement('li');
      todosLi.setAttribute("id", "li0");
      todosLi.textContent = "Your todo list is empty.";
      todosUl.appendChild(todosLi);
      //make sure delete & toggleAll buttons are showing correctly each time DisplayTodos() is called
      this.toggleDelete();
      document.getElementById("toggleAllButton").style.visiblity = "hidden";
      return
    }
    
    
    for (var i=0; i<todoList.todos.length; i++){
    //create checkboxes to go with Li elements with unique id
    var todosLiCheckbox = document.createElement("input"); 
      todosLiCheckbox.setAttribute("type", "checkbox");
      todosLiCheckbox.setAttribute("id", "liCheckbox"+i);
      todosLiCheckbox.setAttribute("onclick","handlers.toggleCompleted()");
    //create labels for checkboxes
    var label = document.createElement("label");
      label.setAttribute("for", "liCheckbox" + i);
      label.innerHTML = todoList.todos[i].todoText;
      
    //create a unqiue ID for each li element for css styling reasons
      var todosLi = document.createElement('li');
      todosLi.setAttribute("id", "li"+i);
      //append both to UL element
      todosLi.appendChild(todosLiCheckbox);
      todosLi.appendChild(label);
      todosUl.appendChild(todosLi);
      document.getElementById("liCheckbox"+i).checked=todoList.todos[i].completed;
      todoLiCounter++;
    }
    //make sure delete and toggleAll buttons are showing correctly each time DisplayTodos() is called
    
    this.toggleDelete();
    
  },toggleDelete:function(){
    //this function will show the delete button if a "liCheckbox" is clicked
    var checkboxesClicked = 0;
    for (var i=0; i<todoList.todos.length; i++){
      if (document.getElementById('liCheckbox'+i).checked == true) {
          checkboxesClicked++;
      }};
      // else {
      //     document.getElementById("deleteButton").style.visibility = "hidden";
      // };
    if (checkboxesClicked>1){ 
      document.getElementById("deleteButton").style.visibility = "visible";
      document.getElementById("deleteButton").innerHTML="Delete Selected";
    };
    if (checkboxesClicked===1){ 
      document.getElementById("deleteButton").style.visibility = "visible";
      document.getElementById("deleteButton").innerHTML="Delete";
    };
    if (checkboxesClicked===0){
     document.getElementById("deleteButton").style.visibility = "hidden" 
    };
  }
  
  
  
};


//functionality - new cat image in background every function call (lol)
function changeBackgroundImage() {
    var images_array=['https://cdn.glitch.com/bd95dd45-4969-4a27-bb99-f39e5440171f%2Fcat.jpg?1534705250842','https://cdn.glitch.com/bd95dd45-4969-4a27-bb99-f39e5440171f%2Fcat5.png?1534720340080','https://cdn.glitch.com/bd95dd45-4969-4a27-bb99-f39e5440171f%2Fcat1.jpg?1534720340208','https://cdn.glitch.com/bd95dd45-4969-4a27-bb99-f39e5440171f%2Fcat2.jpg?1534720340360','https://cdn.glitch.com/bd95dd45-4969-4a27-bb99-f39e5440171f%2Fcat3.jpg?1534720340667','https://cdn.glitch.com/bd95dd45-4969-4a27-bb99-f39e5440171f%2Fcat4.png?1534720340898'];
    //Math.floor(Math.random() * (max - min)) + min;
    var random_number=Math.floor(Math.random() * (images_array.length - 0)) + 0;

    document.body.style.backgroundImage = "url("+images_array[random_number]+")";
    document.body.style.backgroundSize="cover";
};


//functionality - change id="todoList" border every function call (lol)
function changeBorderColor(){
  //randomColor formula copied from https://stackoverflow.com/a/40618761
  var randomColor = "#"+((1<<24)*Math.random()|0).toString(16);
  document.getElementById("todoList").style.borderColor=randomColor;
  document.getElementById("todoList").style.visibility="visible";
  var numberofLiElements = document.getElementById("todoList").getElementsByTagName("li").length;
  //also adds a random border color for each Li element
  for (var i = 0; i <numberofLiElements; i++){
    randomColor = "#"+((1<<24)*Math.random()|0).toString(16);
    var uniqueId="li"+i;
    document.getElementById(uniqueId).style.borderColor=randomColor;
  };
  document.querySelector("li").style.visibility="visible";
};

