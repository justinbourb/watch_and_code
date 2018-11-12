(function () {
  
  var store = {};
  //lS is short for librarySystem
  function lS(name, dependency, callback){
    //creating a library 
   if (arguments.length > 1){
      //Case 1: dependency is given as an object
      if (typeof(dependency) === "object" && typeof(callback) === "function"){
        //case 1: dependency is provided
        if (dependency.length > 0){
        store[name] = {name: name, dependency: dependency, callback: callback, 
                       callback_results: undefined}
        return
        //case 2: lS is called with an empty array or string for dependency
        }else{
        store[name] = {name: name, dependency: dependency, callback: callback, 
                       callback_results: callback()}
        return
        }
          
      }
      //Case 2: dependency is given as an string
      if (typeof(dependency) === "string" && typeof(callback) === "function"){
        //case 1: dependency is provided
        if (dependency.length > 0){
        store[name] = {name: name, dependency: dependency.split(), callback: callback, 
                       callback_results: undefined}
        return
        //case 2: lS is called with an empty array or string for dependency
        }else{
        store[name] = {name: name, dependency: dependency, callback: callback, 
                       callback_results: callback()}
        return
        }
          
      }
       //Case 3: dependency is not provided, therefore the dependency variable is the function
       if (typeof(dependency) === "function" && callback === undefined){
         store[name] = {name: name, dependency: undefined, callback: dependency, 
                       callback_results: dependency()}
         return
       }else{
         return `Error: Improper format used.  
        To store: lS('name'[,dependency], function);
        To call : lS('name');`
              
       }
   }else{
     //return a library
     //check if the callback function was run / stored
     if (store[name].callback_results !== undefined){
       return store[name].callback_results
     }else{
      var dependenciesNotLoaded = [];
       
      function checkDependency(array){
        array.forEach(function(element){
          if(!store[element]){
            dependenciesNotLoaded.push(element);
              }
          try{
              if(store[element].dependency.length > 0){
                  return checkDependency(store[element].dependency)
              }
              }catch{}
          });

      }
      checkDependency(store[name].dependency);
      //case 1: there are dependencies which haven't been loaded, notify the user
      if (dependenciesNotLoaded.length > 0){
       return "Dependencies not loaded: " + dependenciesNotLoaded.toString().replace(',', ', ') 
      //case 2: all dependencies are loaded
      }else{
        //prepare dependency array for apply.() usage
        let updated = [];
        store[name].dependency.forEach(function(element){
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
