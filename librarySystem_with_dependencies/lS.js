
 /**
   * Purpose of lS:
   * 1) lS is a library system where you can also enter the dependencies of each library.
   * 2) lS will access the dependencies and make them available to the required library.
   * 3) lS allows creation of dependencies out of order.
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
	let dependenciesNotLoaded = [];
	let updated = [];     
	function checkDependency(array) {
	 //this function will recursively check if a library's dependencies are loaded
	 array.forEach(function(element) {
		if (!store[element]) {
		 dependenciesNotLoaded.push(element);
		}
		try {
		 if(store[element].dependency.length > 0){
			return checkDependency(store[element].dependency)
			}
		} catch {}
	 });

  }
       
  //lS is short for librarySystem
  function lS(name, dependency, callback) {
    //Case 1: creating a library 
    if (arguments.length > 1) {
      //Case 1a: dependency is given as an object
      if (typeof(dependency) === "object" && typeof(callback) === "function") {
        //case 1a1: dependency is provided
        if (dependency.length > 0) {
        store[name] = {name: name, dependency: dependency, callback: callback, 
                  callback_results: undefined};
        return
        //case 1a2: lS is called with an empty array or string for dependency
        } else {
        store[name] = {name: name, dependency: dependency, callback: callback, 
                  callback_results: callback()};
        return
        }
      }
      //Case 1b: dependency is given as an string
      if (typeof(dependency) === "string" && typeof(callback) === "function") {
         //case 1b1: dependency is provided
         if (dependency.length > 0) {
           store[name] = {name: name, dependency: dependency.split(), callback: callback, 
                        callback_results: undefined};
           return
         //case 1b2: lS is called with an empty array or string for dependency
         } else {
           store[name] = {name: name, dependency: dependency, callback: callback, 
                        callback_results: callback()};
           return
         }
      }
      //Case 1c: dependency is not provided, therefore the dependency variable is the function
      if (typeof(dependency) === "function" && callback === undefined) {
        store[name] = {name: name, dependency: undefined, callback: dependency, 
                     callback_results: dependency()};
        return
      } else {
        return `Error: Improper format used.  
                To store: lS('name'[,dependency], function);
                To call : lS('name');`
      }
    //Case 2: return a library
    } else {
      //Case 2a: check if the callback function was run / stored and return results if already run
      if (store[name].callback_results !== undefined) {
       return store[name].callback_results
      } else {
        //check for any missing dependencies
        checkDependency(store[name].dependency);
        //Case 2b: there are dependencies which haven't been loaded, notify the user
        if (dependenciesNotLoaded.length > 0){
         return "Dependencies not loaded: " + dependenciesNotLoaded.toString().replace(',', ', ')
        //Case 2c: all dependencies are loaded
        } else {
          //prepare dependency array for apply.() usage
          store[name].dependency.forEach(function(element) {
            updated.push(store[element].callback_results);
          });
          //store callback results
          store[name].callback_results = store[name].callback.apply(null, updated);
          return store[name].callback_results
        }
      }
    }
  }
  window.lS = lS;
})();
