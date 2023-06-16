
const API_URL = 'https://www.colr.org/json/colors/random/';

let currentColorHex = '';
let currentDifficulty = 2;
let score = 0;

const fetchColors = async () => {
    try {
        const response = await fetch(`${API_URL}${currentDifficulty}`);
        const { colors } = await response.json();
        return colors.map(color => `#${color.hex}`);
    } catch (error) {
        console.log(error);
        return [];
    }
};

const resetGame = () => {
    currentColorHex = '';
    currentDifficulty = 2;
    score = 0;
    document.body.style.backgroundColor = 'black';
    document.getElementById('colorHex').textContent = '';
    document.getElementById('answers').innerHTML = '';
    document.getElementById('scoreValue').textContent = '0';
    sessionStorage.removeItem('score');
    startNewGame();
};

document.getElementById('startButton').addEventListener('click', resetGame);


const startNewGame = () => {
    document.body.style.backgroundColor = 'black'; 
    fetchColors()
        .then(colors => {
            currentColorHex = colors[Math.floor(Math.random() * colors.length)];
            displayQuestion();
            displayAnswers(colors);
        })
        .catch(console.log);
};


const displayQuestion = () => {
    let colorHexElement = document.getElementById('colorHex');
    colorHexElement.textContent = currentColorHex;
    colorHexElement.style.color = currentColorHex;
};

const displayAnswers = (colors) => {
    let answersElement = document.getElementById('answers');
    answersElement.innerHTML = '';

    for (let color of colors) {
        let answerElement = document.createElement('div');
        answerElement.className = 'answer';
        answerElement.style.backgroundColor = color;
        answerElement.onclick = () => handleAnswerClick(color);
        answersElement.appendChild(answerElement);
    }
};

const handleAnswerClick = (color) => {
    color === currentColorHex ? handleCorrectAnswer() : handleIncorrectAnswer();
};

const handleCorrectAnswer = () => {
    document.body.style.backgroundColor = currentColorHex;
    displayResultMessage('Brawo! Poprawna odpowiedź.');
    updateScore(1);
    startNewGame();
};

const handleIncorrectAnswer = () => {
    displayResultMessage('Niestety, to nie ten kolor.');
    startNewGame();
};

const displayResultMessage = (message) => {
    let oldMessageElement = document.getElementById('resultMessage');
    if (oldMessageElement) {
        oldMessageElement.remove();
    }

    let resultMessageElement = document.createElement('p');
    resultMessageElement.id = 'resultMessage';
    resultMessageElement.textContent = message;
    resultMessageElement.style.marginTop = '20px';
    document.body.appendChild(resultMessageElement);
};


const updateScore = (points) => {
    score += points;
    displayScore();
    sessionStorage.setItem('score', score);
};

const displayScore = () => {
    let scoreElement = document.getElementById('scoreValue');
    scoreElement.textContent = score;
};

const initializeScore = () => {
    let storedScore = sessionStorage.getItem('score');
    score = storedScore ? parseInt(storedScore) : score;
};

const generateDifficultyLevels = () => {
    let difficultyLevelsElement = document.getElementById('difficultyLevels');
    for (let i = 2; i <= 17; i++) {
        let difficultyLevelElement = document.createElement('div');
        difficultyLevelElement.className = 'difficultyLevel';
        difficultyLevelElement.textContent = i;
        difficultyLevelElement.onclick = () => {
            currentDifficulty = i;
            startNewGame();
        };
        difficultyLevelsElement.appendChild(difficultyLevelElement);
    }
};

document.getElementById('startButton').addEventListener('click', startNewGame);

initializeScore();
generateDifficultyLevels();
startNewGame();
