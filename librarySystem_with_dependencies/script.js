//example requirement:
// librarySystem('name', [], function() {
//   return 'Gordon';
// });

// librarySystem('company', [], function() {
//   return 'Watch and Code';
// });

// librarySystem('workBlurb', ['name', 'company'], function(name, company) {
//   return name + ' works at ' + company;
// });

// librarySystem('workBlurb'); // 'Gordon works at Watch and Code'



//Current thinking
//function results being stored in store[name]=callback();
//I want to store the function instead.... then I can later call it with dependencies
// replace dependency name with store[dependency1], store[dependency2], etc

(function () {
  
  var store = {};
  //lS is short for librarySystem
  function lS(name, dependency, callback){
   if (arguments.length > 1){
    //creating a library       
       //Case 1: dependency is given as an object
      if (typeof(dependency) === "object" && typeof(callback) === "function"){
        let updated = [];
        dependency.forEach(function(element){
        updated.push(store[element]);
        });
        store[name] = callback.apply(this, updated);
        return
      }
       //Case 2: dependency is given as a string and callback function is provided
      if (typeof(dependency) === "string" && typeof(callback) === "function"){
        store[name] = callback(store[dependency]);
        return
      } 
       //Case 3: dependency is not provided, therefore the dependency variable is the function
       if (typeof(dependency) === "function" && callback === undefined){
         store[name] = dependency();
         return
       }else{
         return "Improper format.  Correct format lS('name'[,dependency], function);"
       }
   }else{
     //The Object.keys() method returns an array of a given object's own property names, in the same order as we get with a normal loop.
     var keys = Object.keys(store);
     //The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.
     var index = keys.indexOf(name);
     let  first = store[name];
     let second = store[dependency];
     return store[name]
   }
  }
  
  window.lS = lS;
})();



/**
*Purpose:
*1) pre-fill database (aka store variable in above IIFE) with information
*Improvements:
*1) use local storage istead, though it's not relevant to this challenge
*2) use a real database, though it's not relevant to this challenge
**/

// lS('name', [], function() {
//   return 'Gordon';
// });

// lS('company', [], function() {
//   return 'Watch and Code';
// });

// lS('workBlurb', ['name', 'company'], function(name, company) {
//   return name + ' works at ' + company;
// });

// lS('test', 'name', function(name){
//   return 'test ' + name;
// });
