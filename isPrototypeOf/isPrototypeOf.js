 /**
   * Purpose of isPrototypeOf:
   * 1) recreate functionality of Object.prototype.isPrototypeOf()
   * 
   * Signature:
   * isPrototypeOf(proto, obj)
   *
   * Parameters:
   * proto = The suspected prototype of obj
	 * obj = the obj we want to detect it's prototype
   * 
   * Return: true if proto is the prototype of obj or false if not
   * 
   * Example: 
	 *	let canine = {
   * 		bark: function() {
   * 			console.log('bark');
   *		}
	 *	};
	 *
	 * let dog = Object.create(canine);
	 * canine.isPrototypeOf(dog);  // native function returns true
	 * isPrototypeOf(canine, dog); // isPrototypeof() function does the same
	 *
   * Errors: 
   * A TypeError is thrown if prototypeObj is undefined or null.
   **/


function isPrototypeOf(proto, obj) {
	try {
	//checkArrayOfKeys allows us to loop of an array of keys if the prototype has multiple keys
      	function checkArrayOfKeys(objToCheck, arr) {
            for (let i = 0; i < arr.length; i++) {
                if (typeof(objToCheck[arr[i]]) == "function")
                    return true
            }
            return false
        }
        // make sure the prototype of obj is found on proto   &&    make sure proto and obj do not have the same keys (which would imply they are both prototypes of something else)
        // second bit of logic does not work for higher order prototypes (that go up more than one level)
        if (typeof(proto[Object.keys(Object.getPrototypeOf(obj))]) !== 'undefined' && Object.keys(proto).toString() !== Object.keys(obj).toString()) {
            return true
        }
	if (Object.getPrototypeOf(proto) === null && Object.getPrototypeOf(obj) !== null) {
	    return true
        }
        //check for higher level prototypes: the key of higher level prototype will be callable as a prototype on the obj
        if (Object.keys(proto).length > 0) {
          return checkArrayOfKeys(obj, Object.keys(proto)) 
        } else {
          return false
        }
    //if something returns an error, it's not a prototype
  } catch {
		return new TypeError('Cannot read property isPropertyOf of null or undefined');
    }
}
