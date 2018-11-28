 /**
   * Purpose of lS:
   * 1) lS is a library system where you can also enter the dependencies of each library.
   * 2) lS will access the dependencies and make them available to the required library.
   * 
   * Signature:
   * lS(name, [dependency,] callback) // to store a library
   * lS(name) // to call a library
   *
   * Parameters:
   * name = The name of your library. Provided as a string.
   * dependency = The name(s) of your library's depencendcy(ies). Provided as a string for one value
   *  or an array for multiple values.
   * callback = The callback function to run for each library.
   * 
   * Return: the library callback results
   * 
   * Example: 
   * librarySystem('dependency', [], function() {
   *   return 'loaded dependency';
   * });
   *
   * librarySystem('app', ['dependency'], function(dependency) {
   *   return 'app with ' + dependency;
   * });
   *
   * librarySystem('app'); // 'app with loaded dependency'
   *
   * Errors: 
   * Returns an error message when called incorrectly or dependecies are not loaded yet.
   **/


(function () {
  
  let store = {};
  let updated = [];
 
  //lS is short for librarySystem
  function lS(name, dependency, callback) {
   if (arguments.length > 1) {
    
    //creating a library       
       //Case 1: dependency is given as an object
      if (typeof(dependency) === "object" && typeof(callback) === "function") {
        dependency.forEach(function(element) {
          updated.push(store[element]);
        });
        store[name] = callback.apply(this, updated);
        return
      }
    
       //Case 2: dependency is given as a string and callback function is provided
      if (typeof(dependency) === "string" && typeof(callback) === "function") {
        store[name] = callback(store[dependency]);
        return
      } 
    
       //Case 3: dependency is not provided, therefore the dependency variable is the function
       if (typeof(dependency) === "function" && callback === undefined) {
         store[name] = dependency();
         return
       } else {
         return "Improper format.  Correct format lS('name'[,dependency], function);"
       }
   } else {
     return store[name]
   }
  }
  window.lS = lS;
})();
