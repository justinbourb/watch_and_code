function isPrototypeOf(proto, obj){
	try{
        // make sure the prototype of obj is found on proto   &&    make sure proto and obj do not have the same keys (which would imply they are both prototypes of something else)
        // second bit of logic does not work for higher order prototypes (that go up more than one level)
        if (typeof(proto[Object.keys(Object.getPrototypeOf(obj))]) !== 'undefined' && Object.keys(proto).toString() !== Object.keys(obj).toString()){
            return true
        }if (Object.getPrototypeOf(proto) === null && Object.getPrototypeOf(obj) !== null){
			      return true
        }
        //check for higher level prototypes: the key of higher level prototype will be callable as a prototype on the obj
        if (typeof(obj[Object.keys(proto).toString()])==="function"){
           return true 
        }else{
            return false
        }
    //if something returns an error, it's not a prototype
    }catch{
		return false
    }
}
