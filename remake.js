//grab all elements on page for input/output
const numberBtns = document.querySelectorAll(".num")
const operatorBtns = document.querySelectorAll("[data-operator]")
const clearBtn = document.querySelector(".clear")
const deleteBtn = document.querySelector(".delete")
const equalsBtn = document.querySelector("[data-equals]")
const previousOperandText = document.querySelector(".display--container-previous")
const currentOperandText = document.querySelector(".display--container-current")

//create a calculator class which takes the current and previous operands as constructor properties
//this will contain our methods to input numbers and update the display as input is entered, delete a digit,
//clear all digits, get an operator, and complete the computation
class Calculator {
    constructor(previousOperandText, currentOperandText){
        this.previousOperandText = previousOperandText
        this.currentOperandText = currentOperandText
        this.clear()
    }

    //clear all numbers that were entered, smurf on clear button
    clear(){
        this.previousOperand = ''
        this.currentOperand = '0'
        this.operation = undefined
    }

    //delete the last digit entered, smurf on delete button
    delete(){
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
        //console.log(this.currentOperand)
    }

    //append digit to input as user is typing operands in, digit is passed to appendDigit as user types next number
    appendDigit(digit){
        //early return to stop multiple decimal points from being input
        if(digit === '.' && this.currentOperand.includes('.')) return;
        if(this.currentOperand.length >= 13) return;
        this.currentOperand = this.currentOperand.toString() + digit.toString()
        //console.log(this.currentOperand)
        //console.log(digit)
    }

    //confirm operator/operation
    selectOperation(operation){
        //console.log(operation)
        if(operation === '') return;
        if(operation != ''){
            this.compute();
        }

        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    //compute
    compute(){
        let computation;
        let previous = parseFloat(this.previousOperand)
        let current = parseFloat(this.currentOperand)
        //early return for input validation errors
        if(isNaN(previous) || isNaN(current)) return;
        switch(this.operation){
            case '-': computation = previous - current
            break;
            case '+': computation = previous + current
            break;
            case '/': computation = previous / current
            break;
            case '*': computation = previous * current
            break;
            default: return;
        }
        //console.log(computation)
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
    }

    //method to convert result to formatted result ie 1000000 to 1,000,000, 05 to 5
    getDisplayNumber(number){
        const stringNumber = number.toString()
        const intDigits = parseFloat(stringNumber.split(".")[0])
        const decimalDigits = stringNumber.split(".")[1]
        let intDisplay;

        if(isNaN(intDigits)){
            intDisplay = ''
        }else{
            intDisplay = intDigits.toLocaleString("en", {maximumFractionDigits: 0})
        }

        if(decimalDigits != null){
            return intDisplay = `${intDisplay}.${decimalDigits}`
        }else{
            return intDisplay;
        }

    }

    //update display
    updateDisplay(){
        this.currentOperandText.innerText = this.getDisplayNumber(this.currentOperand)
        if(this.operation != null){
            this.previousOperandText.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        }else{
            this.previousOperandText.innerText = ''
        }
        //console.log(this.currentOperand)
    }
}

//instantiate new calculator object, pass it the user's input
const calculator = new Calculator(previousOperandText, currentOperandText)

//console.log(calculator)

//put smurfs on each button to handle clicks for numbers and operators
numberBtns.forEach(button=>button.addEventListener('click',function(e){
    e.preventDefault()
    //console.log(button.innerText) //click handler is working for numbers
    if(calculator.currentOperand.length >= 13) return;
    calculator.appendDigit(button.innerText)
    //call update display method after digit is typed to display updated digits to user
    calculator.updateDisplay()
}))

//clear button handler
clearBtn.addEventListener('click', () => {
    calculator.clear()
    calculator.updateDisplay();
})

//operator buttons handler
operatorBtns.forEach(button => button.addEventListener('click', (e) => {
    //console.log(button.innerText)
    calculator.selectOperation(button.innerText)
    calculator.updateDisplay();
}))

//equals button handler
equalsBtn.addEventListener('click', (e) => {
    calculator.compute()
    calculator.updateDisplay();
})

//delete button handler
deleteBtn.addEventListener('click', (e) => {
    calculator.delete()
    calculator.updateDisplay();
})