import '../css/style.scss';
import '../css/reset.css';

const startMenu = document.getElementById('startMenu');
const gameContainer = document.getElementById('game');
const startButtons = document.querySelectorAll('input[data-action="startGame"');
const gameGrid = document.getElementById('gameGrid');
const turnIndicator = document.getElementById('turnIndicator');
const gameEndModal = document.getElementById('gameEndModal');

const xPlayer = document.getElementById('x-player');
const oPlayer = document.getElementById('o-player');
const xScore = document.getElementById('x-score');
const oScore = document.getElementById('o-score');

const ties = document.getElementById('ties');

let roundWin = false;

let player1;

const matchingPatterns = {
    1: [
        [2, 3],
        [4, 7],
        [5, 9]
    ],

    2: [
        [1, 3],
        [5, 8]
    ],

    3: [
        [1, 2],
        [6, 9],
        [5, 7]
    ],

    4: [
        [1, 7],
        [5, 6]
    ],

    5: [
        [1, 9],
        [2, 8],
        [3, 7],
        [4, 6]
    ],

    6: [
        [3, 9],
        [4, 5]
    ],

    7: [
        [1, 4],
        [3, 5],
        [8, 9]
    ],

    8: [
        [2, 5],
        [7, 9]
    ],

    9: [
        [1, 5],
        [3, 6],
        [7, 8]
    ]
}

let turn;

startButtons.forEach(startButton => {
    startButton.addEventListener('click', () => {
        const checked = document.querySelector('input[type="radio"].symbols:checked');

        player1 = checked.dataset.symbol;
        turn = checked.dataset.symbol;

        initGame();
    })
})

const initGame = () => {
    startMenu.style.display = 'none';
    gameContainer.style.display = 'flex';
    turnIndicator.setAttribute('src', turn === "X" ? "/assets/img/symbolX-inactive.svg" : "/assets/img/symbolO-inactive.svg");

    if (turn === "X") {
        xPlayer.textContent = "(P1)";
        oPlayer.textContent = "(P2)";
    } else if (turn === "O") {
        oPlayer.textContent = "(P1)";
        xPlayer.textContent = "(P2)";
    }


    for (let i = 1; i <= 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add(`cell`);
        cell.setAttribute('data-cellId', i)
        gameGrid.appendChild(cell);

        cell.addEventListener('click', () => {
            if(!roundWin) {
                addSymbol(cell);
                nextTie(cell);
            }
        })
    }

    document.getElementById('restartButton').addEventListener('click', restartGame)
}

const nextTie = (cell) => {
    if (checkWinCondition(parseInt(cell.getAttribute('data-cellId')))) return

    if (turn === "X") turn = "O"
    else turn = "X"
}

const addSymbol = (cell) => {
    if (cell.hasChildNodes()) return;

    if (turn === "X") {
        cell.innerHTML = '<img src="/assets/img/symbolX.svg" alt="X">';
        turnIndicator.setAttribute('src', "/assets/img/symbolO-inactive.svg");
    } else if (turn === "O") {
        cell.innerHTML = '<img src="/assets/img/symbolO.svg" alt="O">';
        turnIndicator.setAttribute('src', "/assets/img/symbolX-inactive.svg");
    }

    return
}

const checkWinCondition = (clickedCellId) => {

    const clickedCellImg = document.querySelector(`.cell[data-cellId="${clickedCellId}"] > img`);

    let isAWin = false;

    for (const pattern of matchingPatterns[clickedCellId]) {

        let matchingPattern = true;
        let matchingCells = [];

        for(const cellId of pattern) {
            const patternCell = document.querySelector(`.cell[data-cellId="${cellId}"]`)

            if (patternCell.hasChildNodes()) {
                if (patternCell.querySelector('img').getAttribute('src') !== clickedCellImg.getAttribute('src')) {
                    matchingPattern = false;
                }
            } else matchingPattern = false;

            if(matchingPattern) {
                matchingCells = [...pattern, clickedCellId];
            }
        }

        if (matchingPattern) {
            isAWin = true;
            roundWin = true;

            console.log(matchingCells)

            matchingCells.forEach(matchingCell => {
                const cell = document.querySelector(`.cell[data-cellId="${matchingCell}"]`)

                if(turn === "X") {
                    cell.classList.add('winning-cell-x');

                    cell.querySelector('img').src = "/assets/img/symbolX-active.svg";
                } else if(turn === "O") {
                    cell.classList.add('winning-cell-o');

                    cell.querySelector('img').src = "/assets/img/symbolO-active.svg";
                }
            })

            break;
        }
    }

    if (isAWin) {
        gameEndModal.style.display = 'flex';

        document.getElementById('winner-h1').classList.remove('ocean');
        document.getElementById('winner-h1').classList.remove("orange");

        if(turn === "X") document.getElementById('winner-h1').classList.add("ocean");
        else document.getElementById('winner-h1').classList.add("orange");
        document.getElementById('winner-img').src = turn === "X" ? "/assets/img/symbolX.svg" : "/assets/img/symbolO.svg";
        document.getElementById('winner').textContent = player1 === turn ? "1" : "2";
        document.getElementById('gameWin').style.display = "flex";
        document.getElementById('gameWin').style.animation = "animation: modalSlide 1000ms linear ease-in-out;";
        document.getElementById('tie').style.display = "none";

        if (turn === "X") xScore.textContent++
        else oScore.textContent++

        document.getElementById('exitBtn').addEventListener('click', () => {
            document.getElementById('gameEndModal').style.display = 'none';
        })
        document.getElementById('playAgainBtn').addEventListener('click', restartGame)

        return true;
    }

    if (Array.from(document.querySelectorAll('.cell')).every(cell => cell.hasChildNodes())) {

        gameEndModal.style.display = 'flex';

        document.getElementById('gameWin').style.display = "none";
        document.getElementById('tie').style.display = "flex";
        document.getElementById('tie').style.animation = "animation: modalIncome 1500ms linear;";

        document.getElementById('exitBtn').addEventListener('click', () => {
            document.getElementById('gameEndModal').style.display = 'none';
        })
        document.getElementById('playAgainBtn').addEventListener('click', restartGame)

        ties.textContent++
    }

    return false
}

const restartGame = () => {
    roundWin = false;
    gameGrid.innerHTML = ``;

    for (let i = 1; i <= 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add(`cell`);
        cell.setAttribute('data-cellId', i)
        gameGrid.appendChild(cell);

        cell.addEventListener('click', () => {
            addSymbol(cell);
            nextTie(cell);
        })
    }

    document.getElementById('gameEndModal').style.display = 'none';

}