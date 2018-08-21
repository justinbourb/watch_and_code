/* If you're feeling fancy you can add interactivity
    to your site with Javascript */
//working through version 6


//todoList contains the logic and data of the todoList
var todoList = {
//adds todo to todo list and completed boolean
    addTodo: function(todoText){
    this.todos.push({
      todoText: todoText,
      completed: false
    });
    this.displayTodos();
  },
//changes todo at position provided by user
  changeTodo: function(position, todoText){
    this.todos[position].todoText = todoText;
    this.displayTodos();
  },
//deletes todo
  deleteTodo: function(position){
    this.todos.splice(position,1);
    this.displayTodos();
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

    this.displayTodos();


  },//toggles completed property of todo list item
  toggleCompleted: function(position){
     var todo= this.todos[position];
    todo.completed = !todo.completed;
    this.displayTodos();
  }
};

var handlers ={
  displayTodos: function(){
    todoList.displayTodos();
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
    //check if value was input, does not add to todo list blank values
    if(addTodoTextInput.value){
      todoList.addTodo(addTodoTextInput.value);
      changeBorderColor();
    }
    addTodoTextInput.value='';
    changeBackgroundImage();

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
};
