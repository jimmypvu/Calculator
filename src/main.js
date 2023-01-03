//grab elements on page
const numberBtns = document.querySelectorAll("[data-num]")
const operatorBtns = document.querySelectorAll("[data-operator]")
const clearBtn = document.querySelector("[data-clear]")
const delBtn = document.querySelector("[data-delete]")
const equalsBtn = document.querySelector("[data-equals]")
const previousOperatorTextElement = document.querySelector(".previous")
const currentOperatorTextElement = document.querySelector(".current")

//calculator class object
class Calculator {
    constructor(previousOperatorTextElement, currentOperatorTextElement){
        this.previousOperatorTextElement = previousOperatorTextElement
        this.currentOperatorTextElement = currentOperatorTextElement
        this.clear()
    }

    //clear all numbers method/function
    clear(){
        this.currentOperand = '0'
        this.previousOperand = ''
        this.operation = undefined
    }

    //delete last digit function
    delete(){
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    //append digit to display when a number is entered
    appendNumber(digit){
        //early return to stop multiple decimal points from being input
        if(digit === '.' && this.currentOperand.includes('.')) return;
        if(this.currentOperand.length >= 13) return;
        this.currentOperand = this.currentOperand.toString() + digit.toString()
    }

    //choose operation function
    selectOperation(operation){
        if(operation === '') return;
        if(operation !== ''){
            this.compute();
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    //compute method
    compute(){
        let computation
        const previous = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
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
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    //method to convert computed value to formated/delimited value ie. 1000000 to 1,000,000
    getDisplayNumber(number){
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split(".")[0])
        const decimalDigits = stringNumber.split(".")[1]
        let integerDisplay
        if(isNaN(integerDigits)){
            integerDisplay = ''
        }else{
            integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0})
        }

        if(decimalDigits != null){
            return `${integerDisplay}.${decimalDigits}`
        }else{
            return integerDisplay
        }
    }

    //update display method
    updateDisplay(){
        this.currentOperatorTextElement.innerText = this.getDisplayNumber(this.currentOperand)
        if(this.operation != null){
            this.previousOperatorTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        }else{
            this.previousOperatorTextElement.innerText = ''
        }
    }
}

const calculator = new Calculator(previousOperatorTextElement, currentOperatorTextElement)

//add a click handler to each number button, append that digit to the current operand, update display
numberBtns.forEach(button =>
    button.addEventListener('click', function(e){
    e.preventDefault()
    if(calculator.currentOperand.length >= 13) return;
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
}))

//add a listener for each operation button, pass the selected operation to the selectOperation method
operatorBtns.forEach(button =>
    button.addEventListener('click', () => {
    calculator.selectOperation(button.innerText)
    calculator.updateDisplay()
}))

//add listener to equals button, run compute function when equals btn is clicked
equalsBtn.addEventListener('click', e => {
    calculator.compute()
    calculator.updateDisplay()
})

//add listener to clear button, run clear all function when clicked
clearBtn.addEventListener('click', e => {
    calculator.clear()
    calculator.updateDisplay()
})

//add listener to delete button, run delete method when clicked
delBtn.addEventListener('click', e => {
    calculator.delete()
    calculator.updateDisplay()
})

