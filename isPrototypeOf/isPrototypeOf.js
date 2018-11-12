function isPrototypeOf(proto, obj){
	try{
        if (typeof(proto[Object.keys(Object.getPrototypeOf(obj))]) !== 'undefined' && Object.keys(Object.getPrototypeOf(proto)).length === 0){
            return true
        }if (Object.getPrototypeOf(proto) === null && Object.getPrototypeOf(obj) !== null){
			return true
        }
		else{
            return false
        }
    }catch{
		return false
    }
}
