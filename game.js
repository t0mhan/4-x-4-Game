
const rowsAndCols = 4;
let gameArray = [];
const gameDirections = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
};
let totalScore = 0;

// get random number
function getRandomValue(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// key press
document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            gameLoop(gameDirections.LEFT);
            break;
        case 38:
            gameArray = transpose(gameArray);
            gameLoop(gameDirections.UP);
            break;
        case 39:
            gameLoop(gameDirections.RIGHT);
            break;
        case 40:
            gameArray = transpose(gameArray);
            gameLoop(gameDirections.DOWN);
            break;
    }
};

/**
 * transpose the array
 * @param {*} arr 
 */
function transpose(arr) {
    return Object.keys(arr[0]).map(function (c) {
        return arr.map(function (r) {
            return r[c];
        });
    });
}

/**
 * gameLoop function
 * @param {*} direction 
 * @param {*} edges 
 */
function gameLoop(direction, edges) {
    for (let i = 0; i < rowsAndCols; i++) {
        if (direction === gameDirections.RIGHT || direction === gameDirections.DOWN) {
            for (let j = rowsAndCols - 1; j >= 0; j--) {
                gameCondition(i, j, direction);
            }
        } else {
            for (let j = 0; j < rowsAndCols; j++) {
                gameCondition(i, j, direction);
            }
        }
    }

    // transpose the array back
    if (direction === gameDirections.UP || direction === gameDirections.DOWN) {
        gameArray = transpose(gameArray);
    }

    // fill edges
    fillEdges(direction);

    // skip draw table if no more moves left
	let isGameFinished = checkGameEnd();
	
    // refresh game
    drawTable(true, isGameFinished);
}

/**
 * function to check game conditions
 * @param {*} i 
 * @param {*} j 
 * @param {*} direction 
 */
function gameCondition(i, j, direction) {
    const condition1 = direction === gameDirections.RIGHT || direction === gameDirections.DOWN ? j - 1 : j + 1;
    const condition2 = direction === gameDirections.RIGHT || direction === gameDirections.DOWN ? j - 2 : j + 2;

    // check two adjacent values
    if (Number(gameArray[i][j]) > 0 && (gameArray[i][j] === gameArray[i][condition1])) {
        gameArray[i][j] = gameArray[i][j] + gameArray[i][condition1];
        gameArray[i][condition1] = '';

        // Slips the value into the free field
        if (!!gameArray[i][condition2]) {
            gameArray[i][condition1] = gameArray[i][condition2];
            gameArray[i][condition2] = '';
		}
		
		// update score
		totalScore += Number(gameArray[i][j]) + Number(gameArray[i][condition1]);
    }
}

/**
 * function to fill egdes
 * @param {*} direction 
 */
function fillEdges(direction) {
    // check if edges are empty
    switch (direction) {
        case gameDirections.RIGHT:
            if (!gameArray[0][0] || !gameArray[3][0]) {
                if (!gameArray[0][0]) {
                    gameArray[0][0] = getRandomValue(1, 2);
                } else if (!gameArray[3][0]) {
                    gameArray[3][0] = getRandomValue(1, 2);
                }
            }
        case gameDirections.LEFT:
            if (!gameArray[0][3] || !gameArray[3][3]) {
                if (!gameArray[0][3]) {
                    gameArray[0][3] = getRandomValue(1, 2);
                } else if (!gameArray[3][3]) {
                    gameArray[3][3] = getRandomValue(1, 2);
                }
            }

        case gameDirections.UP:
            if (!gameArray[3][0] || !gameArray[3][3]) {
                if (!gameArray[3][0]) {
                    gameArray[3][0] = getRandomValue(1, 2);
                } else if (!gameArray[3][3]) {
                    gameArray[3][3] = getRandomValue(1, 2);
                }
            }
        case gameDirections.DOWN:
            if (!gameArray[0][0] || !gameArray[0][3]) {
                if (!gameArray[0][0]) {
                    gameArray[0][0] = getRandomValue(1, 2);
                } else if (!gameArray[0][3]) {
                    gameArray[0][3] = getRandomValue(1, 2);
                }
            }
    }
}

/**
 * Check the game state
 */
function checkGameEnd() {
	let isEnd = true;
    for (let i = 0; i < rowsAndCols; i++) {
        for (let j = 0; j < rowsAndCols; j++) {
			const current = gameArray[i][j],
			cond1 = gameArray[i] && gameArray[i][j-1],
			cond2 = gameArray[i] && gameArray[i][j+1],
			cond4 = gameArray[i+1] && gameArray[i+1][j],
			cond7 = gameArray[i-1] && gameArray[i-1][j];
		
			if (Number(current) > 0) {
				if ((
					(!!cond1 && Number(cond1) > 0 && cond1 === current) ||
					(!!cond2 && Number(cond2) > 0 && cond2 === current) ||
					(!!cond4 && Number(cond4) > 0 && cond4 === current) ||
					(!!cond7 && Number(cond7) > 0 && cond7 === current)
				)) {
					isEnd = false;
					break;
				}
			}   
        }  
	}
	return isEnd;
}

/**
 * function to drwa the table
 * @param {*} refresh 
 * @param {*} isGameEnd 
 */
function drawTable(refresh = null, isGameEnd = false) {
    // get the reference for the body
    var gameBoard = document.getElementById('game-board');
    var gameScore = document.getElementById('game-score');
    var gameEnd = document.getElementById('game-end');

    // creates a <table> element
    var tbl = document.createElement("table");

    // fill data with empty array
    if (!(gameArray && gameArray.length)) {
        for (var i = 0; i < rowsAndCols; i++) {
            gameArray.push([]);
        }
    }

    // creating rows
    for (var r = 0; r < rowsAndCols; r++) {
        const row = document.createElement("tr");

        // create cells in row
        for (let c = 0; c < rowsAndCols; c++) {
            // cell 
            const cell = document.createElement("td");

            // append value to the array
            let cellText;
            if (typeof refresh === 'object') {
                // random number (0, 1, 2)
                let getRandom = getRandomValue(0, 2);

                // append empty or random number between 1 and 2
                getRandom = getRandom === 0 ? '' : getRandom;

                gameArray[r].push(getRandom);
                cellText = document.createTextNode(getRandom);
            } else {
                cellText = document.createTextNode(gameArray[r][c]);
            }

            // fill cell
            cell.appendChild(cellText);

            // append cell to row
            row.appendChild(cell);
        }
        // add the row to the end of the table body
        tbl.appendChild(row); 
    }
    gameBoard.innerHTML = null;
    gameScore.innerHTML = null;
    gameEnd.innerHTML = null;

    // appends <table> into <div1>
    gameBoard.appendChild(tbl); 

	// show game end message
	gameScore.appendChild(document.createTextNode('Total Score: ' + totalScore));
    if(isGameEnd) {
		gameEnd.appendChild(document.createTextNode('There are no more valid moves'));
	}
}
window.onload = drawTable;