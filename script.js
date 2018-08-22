/* If you're feeling fancy you can add interactivity
    to your site with Javascript */
//working through version 6


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
    if(this.todos[position]){
    this.todos.splice(position,1);
    }
    views.displayTodos();
  },
//displays Todos (to console)
  displayTodos: function(){
    if (this.todos.length===0){
      //console.log('Your todo list is empty.')
      document.getElementById("todoList").innerHTML = "<p>"+"Your todo list is empty."+"</p>";
      return
    }
    for (var i=0; i<this.todos.length;i++){
      if (this.todos[i].completed){
        //console.log("(X)",this.todos[i].todoText);
        document.getElementById("todoList").innerHTML = "<p>"+"(X) "+this.todos[i].todoText+"</p>";
      }
      else{
      //console.log("( )",this.todos[i].todoText)
        document.getElementById("todoList").innerHTML = "<p>"+"( ) "+this.todos[i].todoText+"</p>";
      }
    }
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
    if(this.todos[position]){
    var todo= this.todos[position];
    todo.completed = !todo.completed;
    }
    views.displayTodos();
  }
};

var handlers ={
  displayTodos: function(){
    views.displayTodos();
    changeBackgroundImage();
    changeBorderColor();
  },
  toggleAll: function(){
    todoList.toggleAll();
    changeBackgroundImage();
    changeBorderColor();
  },
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
      var deleteTodoPositionInput = document.getElementById('deleteTodoPositionInput');
      todoList.deleteTodo(deleteTodoPositionInput.valueAsNumber);
      deleteTodoPositionInput.value='';
      changeBackgroundImage();
      changeBorderColor();
    
  },toggleCompleted:function(){
      var toggleCompletedPositionInput = document.getElementById('toggleCompletedPositionInput');
      todoList.toggleCompleted(toggleCompletedPositionInput.valueAsNumber);
      toggleCompletedPositionInput.value='';
      changeBackgroundImage();
      changeBorderColor();

  }};


var views={
//display Todos by creating <li> items for each todo
  displayTodos: function(){
    var todosUl = document.querySelector('ul');
    //reset innerHTML to '' to prevent duplicate entries showing up
    todosUl.innerHTML='';
    if (todoList.todos.length===0){
      //console.log('Your todo list is empty.')
      var todosLi = document.createElement('li');
      todosLi.textContent = "Your todo list is empty.";
      todosUl.appendChild(todosLi);
      return
    }
    for (var i=0; i<todoList.todos.length; i++){
      var todosLi = document.createElement('li');
      todosLi.textContent = todoList.todos[i].todoText;
      todosUl.appendChild(todosLi);
    }
  },
  
  
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
  document.querySelector("li").style.borderColor=randomColor;
  document.querySelector("li").style.visibility="visible";
};

//when creating li elements I need to make a counter and create unqiue id's for each element
// example: id="li1", id="li2", id="li3"
//then when in changeBorderColor() I need to apply the styling to every li
// right now it is only styling the first element
// goal, each li has a different color border - it will look wild when they all change at once
// because why not?

// document.getElementById("ul_o").getElementsByTagName("li").length
//var TextElements = document.getElementsByName("ptext1");

// for (var i = 0, max = TextElements.length; i < max; i++) {
//     TextElements[i].style.display = "none";
// }