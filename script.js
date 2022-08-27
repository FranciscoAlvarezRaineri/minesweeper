// Variables
// los elementos del body
let board = document.getElementById("board");


// las variables de uso
let arrButtons = []; // Todos los botones, luego los botones sin minas
let adjacents = []; // guarda los casileros aledaños a uno
let button;
let buttonTemp;
let buttonSize = 32;

//variables relacionadas al estado del tablero
let firstButtonClicked = false

let x;
let y;
let width;

//variables relacionadas a las minas
let amountMines; // Cantidad de minas y tamaño del tablero
let minesRatio;
let mineCount = 0; // guarda cuantas bombas aledañas tiene un boton
let tempAmountMines = amountMines;


// Fuciones

// Crea el título
class Title {
	constructor() {
		this.title = document.getElementById("title");
		this.titleInit = false;
		this.mines = document.getElementById("mines");
		this.dificulty = document.getElementById("dificulty");
		this.face = document.getElementById("face");
		this.instructions = document.getElementById("instructions");
		this.timer = document.getElementById("timer");
		this.time = 0;
		this.timeX;
		this.titleGenerate();
	}

	// Setea la zona del encabezado
	titleGenerate() {
		this.title.style.width = board.style.width
		this.mines.textContent = amountMines
		this.face.textContent = "🙂"
		this.timer.textContent = `${this.time.toString().padStart(4, '0')}`
		this.titleInit = true
	}
	
	// funciones que manejan el timer
	timerStart(time) {
		this.timeX = setInterval(function () {
			time++
			this.timer.textContent = `${time.toString().padStart(4, '0')}`}
		, 1000)
	}
	timeStop() {
	 	clearInterval(this.timeX)
	}

	// selecciona la dificultad
	setDificulty(dificultyLevel) {
		switch (dificultyLevel) {
			case "easy":
				x = 16
				y = 10
				minesRatio = 5.2
				break;
			case "normal":
				x = 20
				y = 12
				minesRatio = 4.8
				break;
			case "hard":
				x = 24
				y = 14
				minesRatio = 4.4
				break;
			case "custom":
				titleObj.setCustom()
				break;
		}
		return reset()
	}

	// funcion que setea el prompt para crear un custom
	setCustom() {
		x = window.prompt("Casillas horizontales", 20)
		y = window.prompt("Casillas verticales", 12)
		minesRatio = window.prompt("Cantidad de bombas en un ratio. Ej: 4 equivale a 1 mina cada 4 casillas", 4)
		if (minesRatio <= 2) {
			alert(`Son demasiadas minas, sería imposible, Elige otros valores.`)
			return setCustom()
		}
		if (minesRatio > 8) {
			alert(`No son suficientes minas, sería demasiado fácil, Elige otros valores.`)
			return setCustom()
		}
	}

	// alerta sobre las instrucciones
	showInstructions() {
		alert("Un click sobre la casilla revela su contenido. El numero revelado indica la cantidad de bombas aledañas a la casilla. Si clickeas en una bomba pierdes. Un click sostenido sobre una casilla sin revelar, la marca como una bomba. Un click sostenido sobre una casilla revelada, revela las aledañas que no esten marcadas como bombas.")
	}

}

// Crea los casilleros
class Button {
	constructor(y, x) {
		//Guarda sus valores iniciales
		this.positionX = x 
		this.positionY = y
		this.flagged = false //indica si fue flageado o no
		this.revealed = false //indica si fue revelado o no
		this.clicked = false //indica si fue clicekado o no
		this.isHeld = false //indica si esta siendo sostenido o no
		this.wasHeld = false //indica si fue sostenido o no
		//crea el elemento boton, sus valores iniciales y lo agrega al tablero
		this.element = document.createElement("button")
		this.element.style.height = `${buttonSize}px`
		this.element.style.width = `${buttonSize}px`
		this.element.classList.add("square") 
		this.element.id = `${y.toString().padStart(2, '0')}${x.toString().padStart(2, '0')}`
		this.element.value = 0;
		this.setClick(this)
		board.appendChild(this.element)
		//agrega al boton a la lista de botones
		arrButtons.push(this)
	}
	//inicializa la acción al hacer click o hold
	setClick(button) {
		// Controla el hold
		button.element.addEventListener("mousedown", () => {
			button.holdClickStart()
		})		
		button.element.addEventListener("touchstart", () => {
			button.holdClickStart()
		})
		button.element.addEventListener("mouseup", () => {
			button.holdClickEnd()
		})	
		button.element.addEventListener("touchend", () => {
			button.holdClickStart()
		})
		// Controla el click
		button.element.addEventListener("click", () => {
			if (!(firstButtonClicked)) {
				startGame(button.element)
			}
			if (!(this.clicked) && !(this.wasHeld)) {
				singleClickButton(button)
			}
			this.wasHeld = false
		})
	}
	//funcionalidad hold
	holdClickStart() {
		this.isHeld = true
		face.textContent = "😯"
		this.activeHold = setTimeout(() => {
			if(this.isHeld) {
				this.wasHeld = true
				holdClickButton(this)
			}
		}, 200)
	}
	holdClickEnd(){
		this.isHeld = false
		face.textContent = "🙂"
		clearTimeout(this.activeHold)
	}

}



// Inicializa el juego cuando se hace click en un cuadrado
function startGame(button) {
	firstButtonClicked = true //setea la variable para que no vuelva a correr esta funcion
	titleObj.timerStart(titleObj.time)
	button.value = "reserved"//evita que al boton clickeado se le asigne una bomba
	setMines()
	setValues()
}

// Coloca las minas aleatoriamente en el tablero
function setMines() {
	for (let i = 0; i < amountMines; i++) {
		let location = Math.floor(Math.random()*arrButtons.length)
		if (arrButtons[location].element.value != "💣" && arrButtons[location].element.value != "reserved") {
			arrButtons[location].element.value = "💣"
		}
	}
}

// Asigna valores a los casilleros en relación a la cantidad de casilleros aledaños que tienen minas
function setValues() {
	arrButtons.forEach(button => {
		mineCount = 0
		if (button.element.value != "💣") {
			findAdjacents(button).forEach(adjacent => {
				if (adjacent.element.value === "💣") {
					mineCount++
				}
				button.element.value = mineCount
			})
		}
		
	})
}

// devuelve un array con los casilleros aledaños al ingresado por argumento. Si fuera a refactorizar, empezaría por aca...
function findAdjacents(button) {
	adjacents = []
	for (let i = -1; i <= 1; i++) {
	tempPositionY = button.positionY + i
		if (tempPositionY >= 0 && tempPositionY < y) {
			for (let j = -1; j <= 1; j++) {
				tempPositionX = button.positionX + j
				if (tempPositionX >= 0 && tempPositionX < x) {
					addButton(tempPositionX, tempPositionY)
				}
			}
		}
	}
	function addButton(tempPositionX, tempPositionY) {
		if (tempPositionY != button.positionY || tempPositionX != button.positionX) {
			buttonTemp = selectButtonFromId(`${tempPositionY.toString().padStart(2, '0')}${tempPositionX.toString().padStart(2, '0')}`)
			if (!(buttonTemp.revealed)) {
				adjacents.push(buttonTemp)
			}
		}
	}
	// devuelve el botton al ingresar su id
	function selectButtonFromId(buttonId) {
		return (arrButtons.filter(button => {return button.element.id === buttonId}))[0]
	}
	return adjacents
}

// funcion del click, setea clicked, revela el valor, y si no quedan bottones sin bombas por revelar, gano.
function singleClickButton(button) {
	button.clicked = true
	revealValue(button)
}

// funcion del hold, si el boton fue revelado, revela los aledaños; si no, lo flagea.
function holdClickButton(button) {
	if(button.revealed) {
		return revealAdjacents(button)
	} else {
		return flagToggle(button)
	}
}

// funcion que togglea la bandera.
function flagToggle(button) {
	if(!(button.flagged)) {
		button.element.textContent = "🚩"
		button.flagged = true
		mines.textContent = parseInt(mines.textContent) - 1
	} else {
		button.element.textContent = ""
		button.flagged = false
		mines.textContent = parseInt(mines.textContent) + 1
	}

}

// función que revela el valor de la casilla, a menos que este flageada. Si es una bomba, endGame, si es 0, revela todas las casillas aledañas.
function revealValue(button) {
	if (!(button.flagged)) {
		button.revealed = true
		button.element.textContent = button.element.value
		button.element.style.backgroundColor = "transparent"
		if (button.element.value === "💣") {
			return endGame()
		}
		if (button.element.value === "0") {
			button.element.textContent = ""
			revealAdjacents(button)
		}
	}
	if((arrButtons.filter(button => {return button.revealed === false})).length - amountMines === 0) {
		return endWon()
	}
}

// funcion que ejecuta reveal sobre el return de aledañas del botton que entre por variable.
function revealAdjacents(button) {
	findAdjacents(button).forEach(button => {
		revealValue(button)
	})
}

//reveal sin cascade que se ejecuta al perder
function endGameReveal(button) {
	if (!(button.flagged)) {
		button.revealed = true
		button.element.textContent = button.element.value
		button.element.style.backgroundColor = "transparent"
	}
	if (button.element.value === "0") {
		button.element.textContent = ""
	}
}

// Inicializa el tablero, creando los botones 
function boardGenerate() {
	arrButtons = []
	board.innerHTML = ''
	firstButtonClicked = false	
	board.style.columnCount = x
	board.style.width = `${(x*buttonSize)}px`
	amountMines = Math.floor(x * y / minesRatio)
	tempAmountMines = amountMines
	for (let i = 0; i < y; i++) {
		for (let j = 0; j < x; j++) {
			new Button (i, j);
		}
	}
	checkSize()
}

//lo hace "responsive"
function checkSize() {
	width = x*(buttonSize+1)
	if(width > window.innerWidth || width > screen.width) {
		x--
		return reset()
	}
}



// we are on the end game now
function endGame() {
	face.textContent = "🤯"
	arrButtons.forEach(button => endGameReveal(button))
	alert("¡Había una bomba en ese casillero! Vuelve a intentarlo.")
	reset()
}

// there's only one way
function endWon() {
	face.textContent = "😎"
	alert("¡Ganaste! Puedes probar una dificultad más alta.")
	reset()
}

// reset general del juego
function reset(){
	titleObj.timeStop()
	boardGenerate()
	titleObj = {}
	titleObj = new Title
}


// Ejecución

x = 20
y = 12
minesRatio = 4.8
boardGenerate()
let titleObj = new Title
document.getElementById("easy").addEventListener("click", function() {titleObj.setDificulty("easy")})
document.getElementById("normal").addEventListener("click", function() {titleObj.setDificulty("normal")})
document.getElementById("hard").addEventListener("click", function() {titleObj.setDificulty("hard")})
document.getElementById("custom").addEventListener("click", function() {titleObj.setDificulty("custom")})
titleObj.face.addEventListener("click", function() {reset()})
titleObj.instructions.addEventListener("click", function() {titleObj.showInstructions()})
window.onresize = function() {checkSize()}