//ORDER OF FUNCTIONS
//deposit some mooney
//collect number of lines
//colect the bet amount
//spin the slot machine
//check if the user won
//credit the amount
//play again


// Importing the necessary module for user input
const prompt = require("prompt-sync")();

// Constants representing the number of rows and columns in the slot machine
const ROWS = 3;
const COLS = 3;

// Configuration for the number of occurrences of each symbol in the slot machine
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

// Configuration for the values of each symbol in the slot machine
const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

// Function to handle the deposit process
const deposit = () => {
    while (true) {
        const depositAmt = prompt("Enter the deposit amount: ");
        // Check if the input can be converted to a valid number
        const numberDepositAmt = parseFloat(depositAmt);

        // Check if the deposit amount is valid (greater than 0)
        if (isNaN(numberDepositAmt) || numberDepositAmt <= 0) {
            console.log("Invalid deposit amount, try again");
        } else {
            return numberDepositAmt;
        }
    }
};

// Function to get the number of lines the player wants to bet on
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter number of lines to bet on (1-3): ");
        // Check if the input can be converted to a valid number
        const numberOfLines = parseFloat(lines);

        // Check if the number of lines is within the valid range (1 to 3)
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Number of lines should be between 1 and 3, try again");
        } else {
            return numberOfLines;
        }
    }
};

// Function to get the bet amount per line from the player
const getBet = (balance, lines) => {
    while (true) {
        const betAmt = prompt("Enter amount to bet on each line: ");
        // Check if the input can be converted to a valid number
        const bet = parseFloat(betAmt);

        // Check if the bet amount is valid (greater than 0 and not exceeding the available balance per line)
        if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
            console.log("Invalid bet amount, try again");
        } else {
            return bet;
        }
    }
};

// Function to spin the slot machine and generate random reels
const spin = () => {
    // Prepare an array with all the symbols based on their occurrences
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        // Add each symbol to the 'symbols' array the number of times specified by its count
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    // Generate random reels with symbols
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        // Initialize an empty array for each column (reel) of the slot machine
        reels.push([]);
        
        // Create a copy of the 'symbols' array for each reel, so that we can manipulate it
        const reelSymbols = [...symbols];
        
        for (let j = 0; j < ROWS; j++) {
            // Generate a random index within the range of available symbols in the current reel
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            
            // Get the symbol at the random index
            const selectedSymbol = reelSymbols[randomIndex];
            
            // Add the selected symbol to the current column (reel) of the slot machine
            reels[i].push(selectedSymbol);
            
            // Remove the selected symbol from the 'reelSymbols' array to prevent duplicates in the same reel
            reelSymbols.splice(randomIndex, 1);
        }
    }

    // Return the generated reels
    return reels;
};

// Function to transpose the reels (swap rows and columns) of the slot machine
const transpose = (reels) => {
    // Initialize an empty array to store the transposed rows
    const rows = [];
    
    // Loop through each row of the original reels (columns of the transposed reels)
    for (let i = 0; i < ROWS; i++) {
        // Initialize an empty array for each transposed row
        rows.push([]);
        
        // Loop through each column of the original reels (rows of the transposed reels)
        for (let j = 0; j < COLS; j++) {
            // Add the element from the original reels (reels[j][i]) to the current transposed row
            rows[i].push(reels[j][i]);
        }
    }
    
    // Return the transposed rows, which represent the new state of the slot machine after transposition
    return rows;
};

// Function to print the rows of the slot machine
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";

        // Loop through each symbol in the row and create a string representation of the row
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;

            // Add a separator " | " between symbols, except for the last symbol in the row
            if (i !== row.length - 1) {
                rowString += " | ";
            }
        }

        // Print the formatted row string
        console.log(rowString);
    }
};

// Function to calculate the player's winnings based on the bet amount and the symbols on the rows
// Function to calculate the player's winnings based on the slot machine's state
const getWinnings = (rows, betAmt, lines) => {
    let winnings = 0;

    // Loop through each row (line) to check for winning combinations
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row]; // Get the symbols in the current row

        let allSame = true; // Variable to check if all symbols in the row are the same
        for (const symbol of symbols) {
            // Check if the current symbol is different from the first symbol in the row
            if (symbol !== symbols[0]) {
                allSame = false; // If any symbol is different, set 'allSame' to false and break the loop
                break;
            }
        }

        if (allSame) {
            // If all symbols in the row are the same, calculate the winnings for that line
            winnings += betAmt * SYMBOLS_VALUES[symbols[0]]; // Multiply the bet amount by the value of the winning symbol
        }
    }

    return winnings; // Return the total winnings for all winning lines
};


// Function to handle the deposit process when the player runs out of money
const depositAgain = (currentBalance) => {
    const depositChoice = prompt("Do you want to deposit more money (yes/no)? ");

    if (depositChoice.toLowerCase() === "yes") {
        const depositAmount = deposit();
        return currentBalance + depositAmount;
    }

    return 0; // User chose not to deposit again
};
// ... (existing code)

// The whole game in general
const game = () => {
    // Initialize the player's balance by calling the deposit function
    let balance = deposit();

    while (true) {
        // Display the player's current balance before each round
        console.log("You have a balance of $" + balance);

        // Get the number of lines the player wants to bet on
        const numberOfLines = getNumberOfLines();

        // Get the bet amount per line from the player
        const betAmt = getBet(balance, numberOfLines);

        // Deduct the total bet amount from the player's balance
        balance -= betAmt * numberOfLines;

        // Spin the slot machine and get the resulting reels
        const reels = spin();
        const rows = transpose(reels);

        // Display the slot machine's result
        printRows(rows);

        // Calculate the player's winnings and add it to their balance
        const winnings = getWinnings(rows, betAmt, numberOfLines);
        balance += winnings;

        // Display the amount won
        console.log("You won $" + winnings);

        // Check if the player has run out of money
        if (balance <= 0) {
            console.log("You have run out of money.");

            // Ask the user if they want to deposit again
            balance = depositAgain(balance);

            // If the user chooses not to deposit again, end the game loop
            if (balance <= 0) {
                console.log("Thank you for playing. Goodbye!");
                break;
            }
        }

        // Ask the player if they want to play again
        const playAgain = prompt("Do you want to play again (y/n)? ");

        // If the player chooses not to play again, display farewell message and end the game loop
        if (playAgain.toLowerCase() !== "y") {
            console.log();
            console.log("You left with $" + balance);
            console.log("Thanks for playing, see you soon");
            console.log();
            break;
        }
    }
};

// Start the game by calling the game function
game();
