// Function for finding index of a character from an array.
Array.prototype.reIndexOf = function (character) {
    if (this.length !== 0) {
        for (let i in this) {
            if (this[i].toString().match(character)) {
                return parseInt(i);
            }
        }
    }
    return -1;
};

/**
 * when everything is loaded then the calculator
 * animate class is added to the calculator
 * which starts the calculator creation animation.
 */ 
window.addEventListener("load", function () {
    $("#calculator").addClass("animate");
});

// Main function.
$(document).ready(function () {
    let gridGap = parseInt($("#calculator").css("grid-gap"), 10);
    let heightGridGaps = 5;
    let widthGridGaps = 3;
    let calculatorHeight = 6.5;
    let calculatorWidth = 4;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let keyLength;


    // Dynamically setting the calculator dimensions relative to viewport dimensions.
    if (width / calculatorWidth > height / calculatorHeight) {
        keyLength = Math.floor((Math.floor(height * 0.8) - heightGridGaps * gridGap) / calculatorHeight);
    } else {
        keyLength = Math.floor((Math.floor(width * 0.8) - widthGridGaps * gridGap) / calculatorWidth);
    }
    $("#calculator").css({"height": Math.ceil(keyLength * calculatorHeight + heightGridGaps * gridGap), "width": Math.ceil(keyLength * calculatorWidth + widthGridGaps * gridGap), "font-size": keyLength * 0.5 + "px"});
    $("#backspace span:first-of-type").css({"width": keyLength * 0.5 + "px", "height": keyLength * 0.5 + "px"});
    $("#screen span").css("font-size", keyLength + "px");

    setCalculatorEventsUp(keyLength);
});

function setCalculatorEventsUp(keyLength) {
    /**
     * When the calculator creation animation is ended,
     * then the click and keyboard event handlers are attached 
     * and use of the calculator becomes available.
     */
    $("#screen span:nth-of-type(1)")[0].addEventListener('transitionend', function () {
        $(".button").bind("click", function () {
            keyPressed($(this).attr("id"), keyLength);
        });

        $(document).on("keydown", function(event) {
            let key = event.which || event.keyCode;
            switch(key) {
                case 48:
                    keyPressed("zero", keyLength);
                    break;
                case 49:
                    keyPressed("one", keyLength);
                    break;
                case 50:
                    keyPressed("two", keyLength);
                    break;
                case 51:
                    keyPressed("three", keyLength);
                    break;
                case 52:
                    keyPressed("four", keyLength);
                    break;
                case 53:
                    keyPressed("five", keyLength);
                    break;
                case 54:
                    keyPressed("six", keyLength);
                    break;
                case 55:
                    keyPressed("seven", keyLength);
                    break;
                case 56:
                    keyPressed("eight", keyLength);
                    break;
                case 57:
                    keyPressed("nine", keyLength);
                    break;
                case 8:
                    keyPressed("backspace", keyLength);
                    break;
            }
        }).on("keypress", function(event) {
            let key = event.which || event.keyCode;
            switch(key) {
                case 99:
                    keyPressed("clear", keyLength);
                    break;
                case 47:
                    keyPressed("divide", keyLength);
                    break;
                case 42:
                    keyPressed("multiply", keyLength);
                    break;
                case 45:
                    keyPressed("minus", keyLength);
                    break;
                case 43:
                    keyPressed("plus", keyLength);
                    break;
                case 13:
                    keyPressed("equal", keyLength);
                    break;
                case 46:
                    keyPressed("comma", keyLength);
                    break;
                case 37:
                    keyPressed("percent", keyLength);
                    break;
            }
        });
    });
};

/**
 * Global variables for the calculator and its memory.
 */ 
const numberCodes = {"zero": "0", "one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9"};
const operatorCodes = {"divide": "/", "multiply": "*", "minus": "-", "plus": "+", "equal": "="};
let operator = null;

let numberArray = [];
let operatorArray = [];

/** 
 * This is the brain of the calculator, when a key is clicked on
 * or pressed on the keyboard a signal comes here and it's decided,
 * what will be done relative to calculator current state.
 */
function keyPressed(keyId, keyLength) {
    let currentlyOnScreen = $("#screen span:first-of-type")[0].innerHTML;

    if (numberCodes[keyId] !== undefined && (currentlyOnScreen.length < 16 || operator !== null)) {
        if ((parseFloat(currentlyOnScreen) !== 0 || /[.]/.test(currentlyOnScreen)) && operator !== "=") {
            if (operator !== null) {
                currentlyOnScreen = numberCodes[keyId];
                arrangeScreenFontSize(currentlyOnScreen, keyLength);
                $("#screen span:first-of-type")[0].innerHTML = numberCodes[keyId];
                operator = null;
            } else {
                currentlyOnScreen += numberCodes[keyId];
                arrangeScreenFontSize(currentlyOnScreen, keyLength);
                $("#screen span:first-of-type")[0].innerHTML += numberCodes[keyId];
            }
        } else if (operator !== "=") {
            if (/[.]/.test(currentlyOnScreen)) {
                currentlyOnScreen += numberCodes[keyId];
            } else {
                currentlyOnScreen = numberCodes[keyId];
            }
            arrangeScreenFontSize(currentlyOnScreen, keyLength);
            $("#screen span:first-of-type")[0].innerHTML = numberCodes[keyId];
        }
    } else if (operatorCodes[keyId] !== undefined) {
        if (operatorCodes[keyId] !== "=") {
            if (operator === "=") {
                operatorArray.push(operatorCodes[keyId]);
                operator = operatorCodes[keyId];
            } else if (numberArray.length === 0 && operatorCodes[keyId] === "-" && currentlyOnScreen === "0") {
                currentlyOnScreen = operatorCodes[keyId];
                arrangeScreenFontSize(currentlyOnScreen, keyLength);
                $("#screen span:first-of-type")[0].innerHTML = currentlyOnScreen;
            } else if (currentlyOnScreen[0] !== "-" || currentlyOnScreen.length > 1) {
                if (operator === null) {
                    numberArray.push(currentlyOnScreen);
                    operatorArray.push(operatorCodes[keyId]);
                    operator = operatorCodes[keyId];
                } else {
                    operatorArray[operatorArray.length - 1] = operatorCodes[keyId];
                    operator = operatorCodes[keyId];
                }
            }
        } else {
            numberArray.push(currentlyOnScreen);
            currentlyOnScreen = operate();
            
            if (/[e]/.test(currentlyOnScreen)) {
                numberArray = [scientificToDecimal(currentlyOnScreen)];
            } else {
                numberArray = [currentlyOnScreen];
            }
            operatorArray = [];
            operator = operatorCodes[keyId];

            arrangeScreenFontSize(currentlyOnScreen, keyLength);
            $("#screen span:first-of-type")[0].innerHTML = currentlyOnScreen;
        }
    } else if (keyId === "comma") {
        if (!/[.]/.test(currentlyOnScreen)) {
            if (parseInt(currentlyOnScreen) !== 0) {
                if (operator === null) {
                    currentlyOnScreen += ".";
                    arrangeScreenFontSize(currentlyOnScreen, keyLength);
                } else if (operator !== "=") {
                    currentlyOnScreen = "0.";
                    operator = null;
                    arrangeScreenFontSize(currentlyOnScreen, keyLength);
                }
                $("#screen span:first-of-type")[0].innerHTML = currentlyOnScreen;
            } else {
                currentlyOnScreen += ".";
                arrangeScreenFontSize(currentlyOnScreen, keyLength);
                $("#screen span:first-of-type")[0].innerHTML = currentlyOnScreen;
            }
        } else if (/[.]/.test(currentlyOnScreen) && operator !== null && operator !== "=") {
            currentlyOnScreen = "0.";
            arrangeScreenFontSize(currentlyOnScreen, keyLength);
            $("#screen span:first-of-type")[0].innerHTML = currentlyOnScreen;
            operator = null;
        }
    } else if (keyId === "clear") {
        numberArray = [];
        operatorArray = [];
        currentlyOnScreen = "0";
        operator = null;
        arrangeScreenFontSize(currentlyOnScreen, keyLength);
        $("#screen span:first-of-type")[0].innerHTML = currentlyOnScreen;

        currentlyOnScreen = "0";
        operator = null;
        arrangeScreenFontSize(currentlyOnScreen, keyLength);
        $("#screen span:first-of-type")[0].innerHTML = currentlyOnScreen;
    } else if (keyId === "negate" && parseFloat(currentlyOnScreen) !== 0 && (operator === null || operator === "=")) {
        let currentlyOnScreenBuffer = currentlyOnScreen;

        if (currentlyOnScreen[0] === "-") {
            currentlyOnScreen = currentlyOnScreen.substr(1);
        } else {
            currentlyOnScreen = "-" + currentlyOnScreen;
        }
        console.log((numberArray.length === 1) + " hola " + typeof(currentlyOnScreenBuffer) + " -- " + typeof(numberArray[0]));
        if (numberArray.length === 1 && parseFloat(currentlyOnScreenBuffer) === parseFloat(numberArray[0])) {
            numberArray[0] = currentlyOnScreen;
        }

        arrangeScreenFontSize(currentlyOnScreen, keyLength);
        $("#screen span:first-of-type")[0].innerHTML = currentlyOnScreen;
    } else if (keyId === "percent" && parseFloat(currentlyOnScreen) !== 0) {
        currentlyOnScreen = parseFloat(currentlyOnScreen) / 100;
        if (operator === "=") {
            numberArray[numberArray.length - 1] = currentlyOnScreen;
        }
        arrangeScreenFontSize(currentlyOnScreen, keyLength);
        $("#screen span:first-of-type")[0].innerHTML = currentlyOnScreen;
    } else if (keyId === "backspace") {
        if ((currentlyOnScreen.length > 0 || parseFloat(currentlyOnScreen) > 0) && operator === null) {
            if (currentlyOnScreen.length > 1) {
                currentlyOnScreen = currentlyOnScreen.substr(0, currentlyOnScreen.length - 1);
            } else {
                if (operatorArray.length > 0) {
                    operatorArray.pop();
                    operator = "=";
                    currentlyOnScreen = numberArray[numberArray.length - 1];
                } else {
                    currentlyOnScreen = "0";
                }
            }
            arrangeScreenFontSize(currentlyOnScreen, keyLength);
            $("#screen span:first-of-type")[0].innerHTML = currentlyOnScreen;
        }
    }

    console.log(numberArray);
    console.log(operatorArray);
};

/**
 * When the equal sign is pressed or clicked then the operation value gets calculated.
 * The numbers are stored in a number array and operation operators in a separate array.
 * First the multiply and divide operations are done and after that plus and minus operations.
 * The function iterates through operator array and whenever it finds a multiply or divide sign
 * it takes from the number array two variables, one from the same index as itself and second
 * one from its index + 1 spot. Then does the operation and inserts it to the number array in
 * the spot with index as itself and deletes spot from the number array its index + 1 and then
 * deletes itself from the operator array. And this goes on till the end when operator array
 * is empty and number array is left only one value which is the value of the full operation. 
 */
function operate() {
    numberArray = numberArray.map(Number);

   let index = operatorArray.reIndexOf(/[*\/]/);
    while (index !== -1) {
        if (operatorArray[index] === "*") {
            numberArray[index] = multiply(numberArray[index], numberArray[index + 1]);
            numberArray.splice(index + 1, 1);
        } else {
            numberArray[index] = divide(numberArray[index], numberArray[index + 1]);
            numberArray.splice(index + 1, 1);
        }
        
        operatorArray.splice(index, 1);
        index = operatorArray.reIndexOf(/[*\/]/);
    }

    index = operatorArray.reIndexOf(/[+\-]/);
    while (index !== -1) {
        if (operatorArray[index] === "+") {
            numberArray[index] = add(numberArray[index], numberArray[index + 1]);
            numberArray.splice(index + 1, 1);
        } else {
            numberArray[index] = subtract(numberArray[index], numberArray[index + 1]);
            numberArray.splice(index + 1, 1);
        }
        
        operatorArray.splice(index, 1);
        index = operatorArray.reIndexOf(/[+\-]/);
    }

    return numberArray[0].toString();
};

function add(a, b) {
    return a + b;
};

function subtract(a, b) {
    return a - b;
};

function multiply(a, b) {
    return a * b;
};

function divide(a, b) {
    return a / b;
};

/**
 * When last equation result became big enough or small for JavaScript to
 * display it as exponential and user decides to continue with that number 
 * as a first number of the next calculation, then this function is used
 * to convert it to decimal again.
 */
function scientificToDecimal(number) {
    let numberHasSign = number.startsWith("-") || number.startsWith("+");
    let sign = numberHasSign ? number[0] : "";
    number = numberHasSign ? number.replace(sign, "") : number;
  
    //if the number is in scientific notation remove it
    if (/\d+\.?\d*e[\+\-]*\d+/i.test(number)) {
      let zero = '0';
      let parts = String(number).toLowerCase().split('e'); //split into coefficient and exponent
      let e = parts.pop();//store the exponential part
      let l = Math.abs(e); //get the number of zeros
      let sign = e / l;
      let coefficient_array = parts[0].split('.');
  
      if (sign === -1) {
        coefficient_array[0] = Math.abs(coefficient_array[0]);
        number = zero + '.' + new Array(l).join(zero) + coefficient_array.join('');
      } else {
        let dec = coefficient_array[1];
        if (dec) l = l - dec.length;
        number = coefficient_array.join('') + new Array(l + 1).join(zero);
      }
    }
    
    return sign + number;
};


// This function is used for changing the font size of the screen relative to its content change.
function arrangeScreenFontSize(currentlyOnScreen, keyLength) {
    $("#ruler")[0].innerHTML = currentlyOnScreen;
    let screenWidth = $("#screen")[0].offsetWidth;
    let fontSize = parseInt($("#screen span:first-of-type").css("font-size"));

    if ($("#ruler")[0].offsetWidth > screenWidth) {
        fontSize -= 0.1;
        $("#ruler").css("fontSize", fontSize + "px");
        while ($("#ruler")[0].offsetWidth > screenWidth) {
            fontSize -= 0.1;
            $("#ruler").css("fontSize", fontSize + "px");
        }
        $("#screen span:first-of-type").css("fontSize", fontSize + "px");
    } else if (fontSize < keyLength) {
        while ($("#ruler")[0].offsetWidth < screenWidth && fontSize < keyLength) {
            fontSize += 0.1;
            $("#ruler").css("fontSize", fontSize + "px");
        }

        if (fontSize === keyLength) {
            $("#screen span:first-of-type").css("fontSize", fontSize + "px");
        } else {
            fontSize -= 0.1;
            $("#screen span:first-of-type").css("fontSize", fontSize + "px");
        }
    }
};