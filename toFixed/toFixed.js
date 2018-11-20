 /**
   * Purpose of isPrototypeOf:
   * 1) set number of decimal places and rounding for floating point numbers 
   * 2) duplicate accounting.js accounting.toFixed() using string manipulation instead integers
   * 
   * Signature:
   * function toFixed(value, precision)
   * 
   * Parameters:
   * value = The value you would like to manipulate.
   * precision = How many decimal places your answer should have.
   * 
   * Return: a formatted String 
   * 
   * Example: toFixed(100,2) //expected result "100.00"
   *
   * Errors: 
   * n/a
   **/

function toFixed(value,precision){
  //variable definitions
	let wholeNumber = value.toString().trim().split('.')[0];
	let decimals = value.toString().trim().split('.')[1];
  let decimalPlaces = 0;
  let returnValue = "";
  function stringToRound(stringToRound, posistionToRound){
    /*create a new string, outputString, by rounding up the last digit of stringToRound
    *using string manipulation via slice and parseInt for adding
    */
    if (stringToRound[posistionToRound-1] === "9"){
      let outputString = (parseInt(stringToRound.slice(posistionToRound-2,posistionToRound-1))+1).toString() 
      outputString = addTrailingZeros(outputString, precision-1);
      return outputString
    }else{
      let outputString = stringToRound.slice(0, posistionToRound-1) + (parseInt(stringToRound.slice(posistionToRound-1,posistionToRound))+1).toString()
      return outputString
    }
  }
  function addTrailingZeros(stringToAdd, precision){
    //this function will add trailing zeros eg(1 precision 2 => 1.00)
   for (let i = 0; i < precision; i++){
       stringToAdd += "0"; 
      } 
    return stringToAdd
  }
  
  //error catching if no decimals provided
  if(decimals !== undefined){
    decimalPlaces = decimals.length;
  }else{
    decimals = "";
  }
	
	//Case 1: precision is greater than zero, manipulate decimals as needed
	if (precision > 0){
    //
    //case 1a: number of decimals provided < precision => add zeros to the end upto precision
    if (decimalPlaces < precision){
      decimals = addTrailingZeros(decimals, precision);
    }
    //case 1b: number of decimals provided is greater than precision => we need rounding!
		if (decimalPlaces > precision){
			if (parseInt(decimals[precision]) >= 5){
        //round up the last digit requested by precision
       decimals = stringToRound(decimals, precision);
      }else{
        //shorten the decimals to = precision
        decimals = decimals.slice(0,precision);
      }
    }
    returnValue = wholeNumber + "." + decimals;
	  return returnValue
    //Case 2: precision is zero, manipulate whole number as needed
  }else{
    //Case 2a: no rounding needed, just return whole number
    if (decimals[0] === undefined || decimals[0] === "" || parseInt(decimals[0]) < 5){
      returnValue = wholeNumber;
      //catch returnValue of "-0" and return "0" instead
      if (returnValue.length === 2 && returnValue[0] === "-" && returnValue[1] === "0"){
       returnValue = "0" 
      }
      return returnValue
    //Case 2b: rounding is required
    }else{
      wholeNumber = stringToRound(wholeNumber, wholeNumber.length);
      returnValue = wholeNumber;
      
      return returnValue
    }
  }
	
}
