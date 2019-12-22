console.log("Script Loaded!")


// Assign UI and stuff.
var mainInputBox = document.querySelector('#mainInput');
var wordDisplay = document.querySelector('#wordDisplay');
var correctlyTypedDisplay = document.querySelector('#correctlyTypedPortion');
var wronglyTypedDisplay = document.querySelector('#wronglyTypedPortion');
var completeWordHint = document.querySelector('#completeWord');
var beginGameButton = document.querySelector('#beginGame');
var scoreText = document.querySelector('#scoreText');
var livesText = document.querySelector('#livesText');

// Player UI Elements
var playerNameText = document.querySelector('#playerName');
var playerLevelText = document.querySelector('#playerLevel');
var playerHealthBar = document.querySelector('#playerHealthBar');
var playerHPText = document.querySelector('#playerHP');
var playerMaxHPText = document.querySelector('#playerMaxHP');

// Enemy UI Elements
var enemyNameText = document.querySelector('#enemyName');
var enemyLevelText = document.querySelector('#enemyLevel');
var enemyHealthBar = document.querySelector('#enemyHealthBar');
var enemyHPText = document.querySelector('#enemyHP');
var enemyMaxHPText = document.querySelector('#enemyMaxHP');

// Global variables
var playerName = "Bob";
var playerLevel = 1;
var playerMaxHP = 5; 
var playerHP = 5;
var gameOver = true;
var score = 0;
var mistakeMade = false
var wordsPerBox = 3;

// Variables for the current word challenge to type.
var activeWord;
var correctlyTypedPortion = "";
var wronglyTypedPortion = "";
var remainingToTypePortion = "";

// Enemy details
var activeEnemyName = "Bad Guy";
var activeEnemyLevel = 15;
var enemyHP = 5;
var enemyMaxHP = 5;
var enemyDamage = 1;


// Checks the input box against the word/phrase.
var checkWordMatched = function (event) {
    var inputValue = this.value;

    // Check word partially matches what has been typed in so far.
    if (inputValue === activeWord.slice(0, inputValue.length)) {
        remainingToTypePortion = activeWord.slice(inputValue.length);
        correctlyTypedPortion = inputValue;
        mistakeMade = false;
        wronglyTypedPortion = "";
        updateWordDisplay();
    } else {
        // console.log(inputValue + " typo!");
        this.value = inputValue.slice(0, inputValue.length - 1);
        wrongLetterTyped();
    }

    if (!inputValue) {
        remainingToTypePortion = activeWord;
    }


    // if the input equals the full active phrase.
    if (inputValue === activeWord) {
        console.log("word matched!");
        this.value = "";
        score++; //TODO: "damage" the enemy.
        updateScore();
        chooseNewWords();
    }
};


// One function updates the word display to the player.
var updateWordDisplay = function () {
    correctlyTypedDisplay.textContent = correctlyTypedPortion;
    wordDisplay.textContent = remainingToTypePortion;
    wronglyTypedDisplay.textContent = wronglyTypedPortion;
    completeWordHint.textContent = activeWord;
}


// Choose new words according to the difficulty.
var chooseNewWords = function () {
    activeWord = "";
    mainInputBox.value = "";
    for (let i = 0; i < wordsPerBox; i++) {
        var newWordIndex = Math.floor(Math.random() * wordDictionary.length);
        activeWord += wordDictionary[newWordIndex] + " ";
    }
    activeWord = activeWord.trim();
    correctlyTypedPortion = "";
    remainingToTypePortion = activeWord;
    updateHP();
    updateWordDisplay();
}

// Clear words typed and displayed.
var clearWords = function () {
    activeWord = "";
    correctlyTypedPortion = "";
    remainingToTypePortion = "";
    wronglyTypedPortion = "";
    updateWordDisplay();
}

// If an incorrect letter is typed. Only applies a penalty for the first mistake.
// Subequent consecutive mistakes don't incur an extra penalty.
var wrongLetterTyped = function () {
    if (!mistakeMade) {
        playerHP -= enemyDamage; // TODO: Have some small randomisation
        mistakeMade = true;
        console.log("HP left " + playerHP + " / " + playerMaxHP);
        wronglyTypedPortion = remainingToTypePortion[0];
        remainingToTypePortion = remainingToTypePortion.slice(1);
        updateHP();
    }
    updateWordDisplay();
    checkGameOver();
}


var checkGameOver = function () {
    updateScore();
    if (playerHP <= 0) {
        console.log('game over')
        gameOver = true;
        mainInputBox.setAttribute('disabled', true);
    }
}

// End the game if the player loses all lives.
var beginGame = function () {
    console.log('clicked');
    if (gameOver) {
        score = 0;
        playerHP = 5;
        console.log('game begin');
        mainInputBox.removeAttribute('disabled');
        wronglyTypedPortion = "";
        wronglyTypedDisplay.textContent = wronglyTypedPortion;
        chooseNewWords();
        updateScore();
        mainInputBox.focus();
    }
}

// Update the scores.
var updateScore = function () {
    scoreText.textContent = score;
    livesText.textContent = playerHP;
}

var updateHP = function () {
    playerHPText.textContent = playerHP;
    playerMaxHPText.textContent = playerMaxHP;
    var healthPercentage = Math.floor((playerHP / playerMaxHP) * 100);
    playerHealthBar.style.width = healthPercentage + "%"
}

// Add event listeners to everything, has to be below the function declarations.
mainInputBox.addEventListener('keyup', checkWordMatched);
beginGameButton.addEventListener('click', beginGame);

// chooseNewWords();
// updateScore();

// Assign names and levels to player:
playerNameText.textContent = playerName;
playerLevelText.textContent = "Level " + playerLevel;
enemyNameText.textContent = activeEnemyName;
enemyLevelText.textContent = "Level " + activeEnemyLevel;


// Disable the input box if the game is not running.
mainInputBox.setAttribute('disabled', true);