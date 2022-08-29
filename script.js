//Checks movile
mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
const isMobile = mobileCheck()

// Variables
// los elementos del body
let board = document.getElementById("board");
let titleObj

// las variables de uso
let arrButtons = []; // Todos los botones, luego los botones sin minas
let adjacents = []; // guarda los casileros aledaños a uno
let button;
let buttonTemp;
let buttonSize = 32;

//variables relacionadas al estado del tablero
let firstButtonClicked = false

let xInit;
let x;
let y;
let width;

//variables relacionadas a las minas
let amountMines; // Cantidad de minas
let minesRatio;
let mineCount = 0; // guarda cuantas bombas aledañas tiene un boton

let time = 0;
let timeX;


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
		this.titleGenerate();
	}

	// Setea la zona del encabezado
	titleGenerate() {
		this.title.style.width = board.style.width
		this.mines.textContent = amountMines
		this.face.textContent = "🙂"
		this.timer.textContent = `${time.toString().padStart(4, '0')}`
		this.titleInit = true
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
	timerStart()
	button.value = "reserved"//evita que al boton clickeado se le asigne una bomba
	setMines()
	setValues()
}

// Coloca las minas aleatoriamente en el tablero
function setMines() {
	let i = 0;
	while (i < amountMines) {
		let location = Math.floor(Math.random()*arrButtons.length)
		if (arrButtons[location].element.value != "💣" && arrButtons[location].element.value != "reserved") {
			arrButtons[location].element.value = "💣"
			i++
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
	board.innerHTML = ''
	firstButtonClicked = false	
	x = checkSize()
	board.style.columnCount = x
	board.style.width = `${(x*buttonSize)}px`
	amountMines = Math.floor(x * y / minesRatio)
	arrButtons = []
	for (let i = 0; i < y; i++) {
		for (let j = 0; j < x; j++) {
			new Button (i, j);
		}
	}
}

//lo hace "responsive"
function checkSize() {
	width = x * (buttonSize + 1)
	if (!(isMobile)) {
		if(width > window.innerWidth) {
			x--
			checkSize()
		}
		if((width + buttonSize) < window.innerWidth && x < xInit) {
			x++
			checkSize()
		}
	} else if(isMobile) {
		if(width > screen.width) {
			x--
			checkSize()
		}
		if((width + 2*buttonSize) < screen.width) {
			x++
			checkSize()
		}
	}
	return x
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
	boardGenerate()
	titleObj = {}
	titleObj = new Title
	timeStop()
}

// funciones que manejan el timer
function timerStart() {
	timeX = setInterval(function () {
		time++
		titleObj.timer.textContent = `${time.toString().padStart(4, '0')}`}
	, 1000)
}
function timeStop() {
 	clearInterval(timeX)
}

// funcion que setea el prompt para crear un custom
function setCustom() {
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
function showInstructions() {
	alert("Un click sobre la casilla revela su contenido. El numero revelado indica la cantidad de bombas aledañas a la casilla. Si clickeas en una bomba pierdes. Un click sostenido sobre una casilla sin revelar, la marca como una bomba. Un click sostenido sobre una casilla revelada, revela las aledañas que no esten marcadas como bombas.")
}

// selecciona la dificultad
function setDificulty(dificultyLevel) {
	switch (dificultyLevel) {
		case "easy":
			xInit = 16
			y = 10
			minesRatio = 5.2
			break;
		case "normal":
			xInit = 20
			y = 12
			minesRatio = 4.8
			break;
		case "hard":
			xInit = 24
			y = 14
			minesRatio = 4.4
			break;
		case "custom":
			titleObj.setCustom()
			break;
	}
	x = xInit
}

function setEvents() {
	document.getElementById("easy").addEventListener("click", function() {setDificulty("easy"); return reset()})
	document.getElementById("normal").addEventListener("click", function() {setDificulty("normal"); return reset()})
	document.getElementById("hard").addEventListener("click", function() {setDificulty("hard"); return reset()})
	document.getElementById("custom").addEventListener("click", function() {setDificulty("custom"); return reset()})
	titleObj.face.addEventListener("click", function() {reset()})
	titleObj.instructions.addEventListener("click", function() {titleObj.showInstructions()})
	window.onresize = function() {reset()}
}


// Ejecución

setDificulty("normal")
boardGenerate()
titleObj = new Title
setEvents()