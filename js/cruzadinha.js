// Definição das palavras e suas posições

const words = [
    { word: "CONEJO", clue: "Coelho", row: 3, col: 0, direction: "across" },
    { word: "CABALLO", clue: "Cavalo", row: 3, col: 0, direction: "down" },
    { word: "PEZ", clue: "Peixe", row: 1, col: 4, direction: "across" },
    { word: "PAJARO", clue: "Pássaro", row: 2, col: 4, direction: "down" },
    { word: "PERRO", clue: "Cachorro", row: 2, col: 7, direction: "across" },
    { word: "ELEFANTE", clue: "Elefante", row: 0, col: 8, direction: "down" },
    { word: "RATON", clue: "Rato", row: 5, col: 4, direction: "across" },
    { word: "TORTUGA", clue: "Tartaruga", row: 5, col: 6, direction: "down" },
    { word: "LEON", clue: "Leão", row: 8, col: 0, direction: "across" },
    { word: "MONO", clue: "Macaco", row: 7, col: 2, direction: "down" },
    { word: "GATO", clue: "Gato", row: 10, col: 6, direction: "across" },
    { word: "VACA", clue: "Vaca", row: 11, col: 5, direction: "across" }
  ];

// Dimensões da grade
const gridSize = 12;

// Inicialização das variáveis
let currentWordIndex = null;
let score = 100;
let completedWords = 0;

// Criar a grade da cruzadinha
function createCrossword() {
    const crossword = document.getElementById('crossword');
    crossword.innerHTML = '';
    
    // Criar uma matriz para representar a grade
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(null));
    
    // Preencher a grade com as palavras
    words.forEach((wordData, wordIndex) => {
        const { word, row, col, direction } = wordData;
        
        for (let i = 0; i < word.length; i++) {
            const r = direction === "across" ? row : row + i;
            const c = direction === "across" ? col + i : col;
            
            if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
                if (!grid[r][c]) {
                    grid[r][c] = {
                        letter: word[i],
                        wordIndices: [wordIndex]
                    };
                } else {
                    grid[r][c].wordIndices.push(wordIndex);
                }
            }
        }
    });
    
    // Renderizar a grade
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cell = document.createElement('div');
            cell.className = grid[r][c] ? 'cell active' : 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            if (grid[r][c]) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'letter';
                input.addEventListener('input', (e) => handleInput(e, r, c));
                input.addEventListener('keydown', (e) => handleKeyDown(e, r, c));
                input.addEventListener('focus', () => handleCellFocus(r, c));
                cell.appendChild(input);
                
                // Adicionar números para as palavras
                let addedNumber = false;
                words.forEach((wordData, index) => {
                    if ((wordData.row === r && wordData.col === c)) {
                        if (!addedNumber) {
                            const numberSpan = document.createElement('span');
                            numberSpan.className = 'number';
                            numberSpan.textContent = index + 1;
                            cell.appendChild(numberSpan);
                            addedNumber = true;
                        }
                    }
                });
            }
            
            crossword.appendChild(cell);
        }
    }
    
    updateClues();
}

// Atualizar a lista de pistas
function updateClues() {
    const clueList = document.getElementById('clueList');
    clueList.innerHTML = '';
    
    words.forEach((wordData, index) => {
        const clueItem = document.createElement('li');
        clueItem.className = 'clue-item';
        clueItem.textContent = `${index + 1}. ${wordData.clue} (${wordData.direction === "across" ? "→" : "↓"})`;
        clueItem.dataset.index = index;
        clueItem.addEventListener('click', () => highlightWord(index));
        clueList.appendChild(clueItem);
    });
}

// Destacar uma palavra selecionada
function highlightWord(index) {
    // Remover destaque anterior
    document.querySelectorAll('.cell.highlight').forEach(cell => {
        cell.classList.remove('highlight');
    });
    
    document.querySelectorAll('.clue-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    // Definir a palavra atual
    currentWordIndex = index;
    const wordData = words[index];
    
    // Destacar a palavra
    const { word, row, col, direction } = wordData;
    for (let i = 0; i < word.length; i++) {
        const r = direction === "across" ? row : row + i;
        const c = direction === "across" ? col + i : col;
        
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
            cell.classList.add('highlight');
        }
    }
    
    // Destacar a pista
    const clueItem = document.querySelector(`.clue-item[data-index="${index}"]`);
    if (clueItem) {
        clueItem.classList.add('active');
    }
    
    // Focar na primeira célula vazia da palavra
    focusFirstEmptyCell(wordData);
    
    // Mostrar dica visual
    showImageHint(wordData.word.toLowerCase());
}

// Focar na primeira célula vazia da palavra
function focusFirstEmptyCell(wordData) {
    const { word, row, col, direction } = wordData;
    
    for (let i = 0; i < word.length; i++) {
        const r = direction === "across" ? row : row + i;
        const c = direction === "across" ? col + i : col;
        
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
            const input = cell.querySelector('input');
            if (input && !input.value) {
                input.focus();
                return;
            }
        }
    }
    
    // Se todas as células estão preenchidas, focar na primeira
    const firstCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (firstCell) {
        const input = firstCell.querySelector('input');
        if (input) {
            input.focus();
        }
    }
}

// Manipular entrada de texto
function handleInput(e, row, col) {
    const value = e.target.value.toUpperCase();
    e.target.value = value;
    
    if (value) {
        // Mover para a próxima célula
        if (currentWordIndex !== null) {
            const wordData = words[currentWordIndex];
            const { direction } = wordData;
            
            if (direction === "across") {
                const nextCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col + 1}"]`);
                if (nextCell) {
                    const input = nextCell.querySelector('input');
                    if (input) {
                        input.focus();
                    }
                }
            } else {
                const nextCell = document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col}"]`);
                if (nextCell) {
                    const input = nextCell.querySelector('input');
                    if (input) {
                        input.focus();
                    }
                }
            }
        }
        
        // Verificar se a palavra foi completada
        checkWordCompletion();
    }
}

// Manipular pressionar tecla
function handleKeyDown(e, row, col) {
    if (e.key === "Backspace" && !e.target.value) {
        // Mover para a célula anterior
        if (currentWordIndex !== null) {
            const wordData = words[currentWordIndex];
            const { direction } = wordData;
            
            if (direction === "across") {
                const prevCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col - 1}"]`);
                if (prevCell) {
                    const input = prevCell.querySelector('input');
                    if (input) {
                        input.focus();
                        e.preventDefault();
                    }
                }
            } else {
                const prevCell = document.querySelector(`.cell[data-row="${row - 1}"][data-col="${col}"]`);
                if (prevCell) {
                    const input = prevCell.querySelector('input');
                    if (input) {
                        input.focus();
                        e.preventDefault();
                    }
                }
            }
        }
    } else if (e.key === "ArrowRight") {
        const nextCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col + 1}"]`);
        if (nextCell) {
            const input = nextCell.querySelector('input');
            if (input) {
                input.focus();
                e.preventDefault();
            }
        }
    } else if (e.key === "ArrowLeft") {
        const prevCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col - 1}"]`);
        if (prevCell) {
            const input = prevCell.querySelector('input');
            if (input) {
                input.focus();
                e.preventDefault();
            }
        }
    } else if (e.key === "ArrowUp") {
        const upCell = document.querySelector(`.cell[data-row="${row - 1}"][data-col="${col}"]`);
        if (upCell) {
            const input = upCell.querySelector('input');
            if (input) {
                input.focus();
                e.preventDefault();
            }
        }
    } else if (e.key === "ArrowDown") {
        const downCell = document.querySelector(`.cell[data-row="${row + 1}"][data-col="${col}"]`);
        if (downCell) {
            const input = downCell.querySelector('input');
            if (input) {
                input.focus();
                e.preventDefault();
            }
        }
    }
}

// Manipular foco em uma célula
function handleCellFocus(row, col) {
    // Encontrar a qual palavra pertence a célula
    let foundWordIndex = null;
    
    for (let i = 0; i < words.length; i++) {
        const wordData = words[i];
        const { word, row: wordRow, col: wordCol, direction } = wordData;
        
        for (let j = 0; j < word.length; j++) {
            const r = direction === "across" ? wordRow : wordRow + j;
            const c = direction === "across" ? wordCol + j : wordCol;
            
            if (r === row && c === col) {
                foundWordIndex = i;
                break;
            }
        }
        
        if (foundWordIndex !== null) {
            break;
        }
    }
    
    if (foundWordIndex !== null && foundWordIndex !== currentWordIndex) {
        highlightWord(foundWordIndex);
    }
}

// Verificar se uma palavra foi completada
function checkWordCompletion() {
    if (currentWordIndex === null) return;
    
    const wordData = words[currentWordIndex];
    const { word, row, col, direction } = wordData;
    let enteredWord = "";
    
    for (let i = 0; i < word.length; i++) {
        const r = direction === "across" ? row : row + i;
        const c = direction === "across" ? col + i : col;
        
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
            const input = cell.querySelector('input');
            if (input && input.value) {
                enteredWord += input.value;
            } else {
                return; // Palavra incompleta
            }
        }
    }
    
    if (enteredWord === word) {
        markWordAsCompleted(currentWordIndex);
    }
}

// Marcar uma palavra como completada
function markWordAsCompleted(index) {
    const clueItem = document.querySelector(`.clue-item[data-index="${index}"]`);
    if (clueItem && !clueItem.classList.contains('completed')) {
        clueItem.classList.add('completed');
        completedWords++;
        
        // Marcar células como corretas
        const wordData = words[index];
        const { word, row, col, direction } = wordData;
        
        for (let i = 0; i < word.length; i++) {
            const r = direction === "across" ? row : row + i;
            const c = direction === "across" ? col + i : col;
            
            const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
            if (cell) {
                cell.classList.add('correct');
            }
        }
        
        // Verificar se todas as palavras foram completadas
        if (completedWords === words.length) {
            showMessage("¡Felicidades! Has completado la cruza.", "success");
        }
    }
}

// Verificar toda a cruzadinha
function checkCrossword() {
    let allCorrect = true;
    
    words.forEach((wordData, index) => {
        const { word, row, col, direction } = wordData;
        let enteredWord = "";
        
        for (let i = 0; i < word.length; i++) {
            const r = direction === "across" ? row : row + i;
            const c = direction === "across" ? col + i : col;
            
            const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
            if (cell) {
                const input = cell.querySelector('input');
                if (input && input.value) {
                    enteredWord += input.value;
                } else {
                    enteredWord += " ";
                }
            }
        }
        
        if (enteredWord === word) {
            markWordAsCompleted(index);
        } else {
            allCorrect = false;
        }
    });
    
    if (!allCorrect) {
        showMessage("Há algumas palavras incorretas ou incompletas.", "error");
    }
}

// Fornecer uma dica (revelar uma letra)
function provideHint() {
    if (currentWordIndex === null) {
        showMessage("Selecione uma palavra primeiro!", "error");
        return;
    }
    
    const wordData = words[currentWordIndex];
    const { word, row, col, direction } = wordData;
    
    // Encontrar a primeira célula vazia
    for (let i = 0; i < word.length; i++) {
        const r = direction === "across" ? row : row + i;
        const c = direction === "across" ? col + i : col;
        
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
            const input = cell.querySelector('input');
            if (input && !input.value) {
                input.value = word[i];
                input.dispatchEvent(new Event('input'));
                
                // Reduzir a pontuação
                score = Math.max(0, score - 5);
                updateScore();
                return;
            }
        }
    }
    
    showMessage("Esta palavra já está completa!", "error");
}

// Mostrar uma mensagem
function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
    
    // Limpar mensagem após alguns segundos
    setTimeout(() => {
        message.className = 'message';
    }, 3000);
}

// Reiniciar o jogo
function resetGame() {
    document.querySelectorAll('.cell input').forEach(input => {
        input.value = '';
    });
    
    document.querySelectorAll('.cell.correct').forEach(cell => {
        cell.classList.remove('correct');
    });
    
    document.querySelectorAll('.clue-item.completed').forEach(item => {
        item.classList.remove('completed');
    });
    
    score = 100;
    completedWords = 0;
    currentWordIndex = null;
    
    updateScore();
    showMessage("Jogo reiniciado!", "success");
}

// Atualizar a pontuação
function updateScore() {
    document.getElementById('score').textContent = `Pontuação: ${score}`;
}

// Mostrar dica visual
function showImageHint(word) {
    const imageHint = document.getElementById('imageHint');
    // Usar placeholder para imagens
    imageHint.src = `/api/placeholder/150/150`;
    imageHint.alt = `Imagem de ${word}`;
    imageHint.style.display = 'block';
}

// Inicializar o jogo
function init() {
    createCrossword();
    
    document.getElementById('hintBtn').addEventListener('click', provideHint);
    document.getElementById('checkBtn').addEventListener('click', checkCrossword);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    
    // Destacar a primeira palavra para começar
    highlightWord(0);
}

// Iniciar quando a página carregar
window.addEventListener('load', init);