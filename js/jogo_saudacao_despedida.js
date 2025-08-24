const questions = [
    { phrase: "_____, ¿cómo estás?", answer: "Hola" },
    { phrase: "Buenos días, señor. ____?", answer: "¿Cómo está usted?" },
    { phrase: "Fue un placer verte, _____.", answer: "Adiós" },
    { phrase: "_____, nos vemos mañana!", answer: "Hasta luego" },
    { phrase: "_____ noches, que descanses.", answer: "Buenas" },
    { phrase: "_____ tardes, ¿cómo te fue en el trabajo?", answer: "Buenas tardes" },
    { phrase: "Me tengo que ir, _____.", answer: "Nos vemos" },
    { phrase: "Ya es tarde, me voy a casa, _____.", answer: "Chau" },
    { phrase: "Fue un gusto hablar contigo, _____.", answer: "Hasta mañana" },
    { phrase: "_____ días, ¿cómo amaneciste hoy?", answer: "Buenos días" }
];

const allOptions = [
    "Hola", "¿Cómo está usted?", "Adiós", "Hasta luego", "Buenas", "Buenas tardes", "Nos vemos", "Chau", "Hasta mañana", "Buenos días"
];

const gameContainer = document.getElementById("game");
const optionsContainer = document.querySelector(".options-container");
let draggedOption = null;

// Criar as opções arrastáveis
function createOptions() {
    allOptions.sort(() => Math.random() - 0.5);
    optionsContainer.innerHTML = '';
    allOptions.forEach(optionText => {
        const span = document.createElement("span");
        span.classList.add("option");
        span.textContent = optionText;
        span.setAttribute("draggable", true);
        span.setAttribute("data-value", optionText); // Guarda o valor para verificação
        optionsContainer.appendChild(span);

        // Eventos de arrastar
        span.addEventListener("dragstart", (e) => {
            draggedOption = e.target;
            e.target.classList.add("dragging");
            e.dataTransfer.setData("text/plain", e.target.getAttribute("data-value"));
        });

        span.addEventListener("dragend", (e) => {
            e.target.classList.remove("dragging");
        });
    });
}

// Criar as perguntas com as zonas de soltar
function createQuestions() {
    gameContainer.innerHTML = '';
    questions.forEach((q, index) => {
        const div = document.createElement("div");
        div.classList.add("question");
        
        // Substitui "_____" pela zona de soltar
        const phraseParts = q.phrase.split("_____");
        
        const phraseHTML = document.createElement("span");
        phraseHTML.innerHTML = `<strong>${index + 1}.</strong> ${phraseParts[0]}`;
        
        const dropZone = document.createElement("span");
        dropZone.classList.add("drop-zone");
        dropZone.setAttribute("data-answer", q.answer); // Guarda a resposta correta
        dropZone.textContent = "(Solte aqui)";

        const phraseHTML2 = document.createElement("span");
        phraseHTML2.innerHTML = `${phraseParts[1] || ''}`;

        div.appendChild(phraseHTML);
        div.appendChild(dropZone);
        div.appendChild(phraseHTML2);
        
        gameContainer.appendChild(div);
        
        // Eventos de soltar
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault(); // Necessário para permitir o drop
            e.target.classList.add("hovered");
        });

        dropZone.addEventListener("dragleave", (e) => {
            e.target.classList.remove("hovered");
        });

        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData("text/plain");
            const dropZone = e.target;
            
            // Se já tem um item, retorna ele para as opções
            if (dropZone.querySelector('.option')) {
                optionsContainer.appendChild(dropZone.querySelector('.option'));
            }

            // Move a opção arrastada para a drop zone
            dropZone.innerHTML = '';
            dropZone.classList.remove("hovered");
            dropZone.classList.add("filled");
            dropZone.appendChild(draggedOption);

            // Reseta a variável
            draggedOption = null;
        });
    });
}

// Inicializa o jogo
createQuestions();
createOptions();

function checkAnswers() {
    let correctCount = 0;
    let score = 0;
    
    questions.forEach((q, index) => {
        const dropZone = document.querySelector(`#game .question:nth-child(${index + 1}) .drop-zone`);
        const droppedOption = dropZone.querySelector('.option');
        
        dropZone.classList.remove("correct-zone", "incorrect-zone");
        if (droppedOption) {
            droppedOption.classList.remove("correct-option", "incorrect-option");
            const userAnswer = droppedOption.getAttribute("data-value").trim();
            
            if (userAnswer.toLowerCase() === q.answer.toLowerCase()) {
                dropZone.classList.add("correct-zone");
                droppedOption.classList.add("correct-option");
                correctCount++;
                score += 10;
            } else {
                dropZone.classList.add("incorrect-zone");
                droppedOption.classList.add("incorrect-option");
            }
        }
    });

    const resultElement = document.getElementById("result");
    const scoreElement = document.getElementById("score");
    
    resultElement.innerText = `Você acertou ${correctCount} de ${questions.length} perguntas!`;
    scoreElement.innerText = `Sua pontuação: ${score} pontos!`;
    
    if (correctCount >= 7) {
        scoreElement.classList.add("celebration");
        setTimeout(() => {
            scoreElement.classList.remove("celebration");
        }, 1000);
    }
}

window.checkAnswers = checkAnswers;