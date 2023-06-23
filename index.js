const html = document.querySelector("html");
const addButton = document.querySelector("#addButton");
const grayVeil = document.createElement("div");
const bookList = document.querySelector("#bookList");

books = [];
//book object constructor
function Book(name, read, score) {
	this.name = name;
	this.read = read;
	this.score = score;
	this.display = document.createElement("div");
	this.editButton = undefined;
}

showFirstButton();

function showFirstButton() {
	addButton.innerText = "Add your first book";
	addButton.setAttribute("id", "firstAddButton");
}

//When + is clicked
addButton.addEventListener("click", function () {
	enterEditMenu("new");
});
//a book addition menu pops up
function enterEditMenu(stateOfBook, clickedBookNum) {
	grayVeil.setAttribute("id", "grayVeil");
	html.appendChild(grayVeil); //Gray background
	grayVeil.innerHTML = `
    <form id="addMenu">
        <div class="block">
            <label for="bookName">Name:</label>
            <input type="text" id="bookName" name="bookName" maxlength="42" />
        </div>

        <div id="review">
            <div id=readCheckArea>
                <label for="readCheck">Read:</label>
                <input type="checkbox" id="readCheck" name="readCheck" />
            </div>

            <div id="chooseScore">
                <label for="score">Score:</label>
                <select id="score" name="scores" id="lang">
					<option value="-">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                 </select>
                <span>/5</span>
            </div>
        </div>

        <div class="block" id="uploadCover">
            <label for="bookCover">Upload cover:</label>
            <input type="file" id="bookCover" name="bookCover" />
        </div>

        <div id="cancelApply">
            <button type="button" id="deleteButton">Delete book</button>
            <button type="button" id="cancelButton">Cancel</button>
            <button type="button" id="applyButton">Apply</button>
        </div>
    </form>`; //Type of the submit button set to button to not reset page, should be submit if working with a server
	addButtonsFunctionality(stateOfBook, clickedBookNum);

	easeIn(grayVeil);
	addMenu = document.querySelector("#addMenu");
	popUp(addMenu);

	if (stateOfBook === "existing") {
		showExistingNames(clickedBookNum);
	}
}
function showExistingNames(clickedBookNum) {
	nameField = document.querySelector("#bookName");
	nameField.setAttribute("value", books[clickedBookNum].name);
	if (books[clickedBookNum].read === "yes") {
		readCheck = document.querySelector("#readCheck");
		readCheck.setAttribute("checked", "");
	}
	for (let i = 1; i <= 5; i++) {
		let score = document.querySelector(`option[value="${i}"]`);
		if (score.value === books[clickedBookNum].score) {
			score.setAttribute("selected", "selected");
		} else {
			score = document.querySelector(`option[value="-"]`);
			score.setAttribute("selected", "selected");
		}
	}
}

function addButtonsFunctionality(stateOfBook, clickedBookNum) {
	const cancelButton = document.querySelector("#cancelButton");
	cancelButton.addEventListener("click", removeMenu);
	document.addEventListener("keydown", function exitMenu(event) {
		if (event.key == "Escape") {
			//Checks if the menu is appended
			if (grayVeil.parentNode !== null) {
				removeMenu();
			}
		}
	});

	const applyButton = document.querySelector("#applyButton");
	if (stateOfBook === "new") {
		applyButton.addEventListener("click", addNewBook);
	} else if (stateOfBook === "existing") {
		//Updates the book object based on what is displayed in the DOM
		applyButton.addEventListener("click", function editBookData() {
			books[clickedBookNum].name = document.querySelector("#bookName").value;
			books[clickedBookNum].score = document.querySelector("#score").value;
			if (document.querySelector("#readCheck").checked === true) {
				books[clickedBookNum].read = "yes";
			} else {
				books[clickedBookNum].read = "no";
			}
		});
	}
	applyButton.addEventListener("click", removeMenu); //Also gets rid of the menu

	const deleteButton = document.querySelector("#deleteButton");
	if (stateOfBook === "existing") {
		deleteButton.addEventListener("click", function deleteBook() {
			bookList.removeChild(books[clickedBookNum].display); //Removes from array
			delete books[clickedBookNum]; //Removes from DOM
		});
		deleteButton.addEventListener("click", removeMenu); //Also gets rid of the menu
	} else if (stateOfBook === "new") {
		deleteButton.classList.toggle("hideElement");
	}
}

function removeMenu() {
	html.removeChild(grayVeil);
}

function addNewBook() {
	bookList.removeChild(addButton); //Temporarily gets rid of + button to not render in front of it

	if (document.querySelector("#readCheck").checked === true) {
		books[books.length] = new Book(
			document.querySelector("#bookName").value,
			"yes",
			document.querySelector("#score").value
		);
	} else {
		books[books.length] = new Book(
			document.querySelector("#bookName").value,
			"no",
			document.querySelector("#score").value
		);
	}
	book = books[books.length - 1]; //Book being currently added at the end of the array
	book.display.classList.toggle("book");
	book.display.setAttribute("id", `${books.length - 1}`); //id corresponds to array position
	bookList.append(book.display);

	bookList.appendChild(addButton);

	book.display.addEventListener("mouseover", function displayBookInfo() {
		let clickedBookNum = this.id;
		this.innerHTML = `
        <div class="grayOut">
            <span class="nameDisplay">${books[clickedBookNum].name}</span>
            <span class="readDisplay">Read: ${books[clickedBookNum].read}</span>
            <span class="scoreDisplay">Score: ${books[clickedBookNum].score}</span>
            <button class="editButton">Edit</button>
        </div>`;
		let grayOut = document.querySelector(".grayOut");
		changeBg(grayOut);
	});
	//Allows to click the book to edit
	book.display.addEventListener("click", function () {
		let clickedBookNum = this.id;
		enterEditMenu("existing", clickedBookNum);
	});
	book.display.addEventListener("mouseout", function () {
		let overlayForDeletion = document.querySelector(".grayOut");
		this.removeChild(overlayForDeletion);
	});

	changeAddButton();
}

function changeAddButton() {
	if (books.length !== 0) {
		addButton.setAttribute("id", "addButton");
		addButton.innerText = "+";
	}
}

//Animations

function easeIn(element) {
	element.style.opacity = "0";
	setTimeout(function () {
		element.style.opacity = "1";
	}, 10);
}
function popUp(element) {
	element.style.transform = "translate(0, 100vh)";
	setTimeout(function () {
		element.style.transform = "none";
	}, 10);
}
function changeBg(element) {
	element.style.backgroundColor = "rgba(0,0,0,0)";
	setTimeout(function () {
		element.style.backgroundColor = "var(--grayOutMore)";
	}, 10);
}
