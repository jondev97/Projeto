const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');

const profession = [
    'abogada', 'abogada2', 'ama_de_casa', 'ama_de_casa2', 'basurero', 'basurero2',
    'bombero', 'bombero2', 'camarero', 'camarero2', 'carnicero', 'carnicero2',
    'cartero', 'cartero2', 'cocinero', 'cocinero2', 'farmaceutico', 'farmaceutico2',
    'fontanero', 'fontanero2', 'frutero', 'frutero2', 'maestra', 'maestra2',
    'medica', 'medica2', 'panadero', 'panadero2', 'peluquera', 'peluquera2',
    'pescador', 'pescador2', 'policia', 'policia2', 'veterinaria', 'veterinaria2'
];

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

let firstCard = '';
let secondCard = '';
let lockBoard = false;

const checkEndGame = () => {
    const disabledCards = document.querySelectorAll('.disabled-card');

    if (disabledCards.length === 36) {
        clearInterval(this.loop);
        alert(`Parabéns, ${spanPlayer.innerHTML}! Seu tempo foi: ${timer.innerHTML}`)
    }
}

const checkCards = () => {
    const firstCardName = firstCard.getAttribute('data-profession');
    const secondCardName = secondCard.getAttribute('data-profession');
    
    if (firstCardName.concat('2') === secondCardName || secondCardName.concat('2') === firstCardName) {
        firstCard.firstChild.classList.add('disabled-card');
        secondCard.firstChild.classList.add('disabled-card');
        
        firstCard = '';
        secondCard = '';
        
        checkEndGame ();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('reveal-card');
            secondCard.classList.remove('reveal-card');
           
            firstCard = '';
            secondCard = '';
           
            lockBoard = false;
        }, 1000);
    }
};

const revealCard = ({ target }) => {
    if (lockBoard || target.parentNode.classList.contains('reveal-card')) {
        return;
    }
    
    target.parentNode.classList.add('reveal-card');
    
    if (!firstCard) {
        firstCard = target.parentNode;
    } else {
        secondCard = target.parentNode;
        checkCards();
    }
};

const createCard = (profession) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');
    
    front.style.backgroundImage = `url('/imagens/img_jogo_memoria/${profession}.png')`;
    card.setAttribute('data-profession', profession);
    
    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener('click', revealCard);
    
    return card;
};

const loadGame = () => {
    const shuffledArray = profession.sort(() => Math.random() - 0.5);
    shuffledArray.forEach((profession) => {
        const card = createCard(profession);
        grid.appendChild(card);
    });
};

const startTimer = () => {
    let seconds = 0;
    let minutes = 0;

    this.loop = setInterval(() => {
        seconds++;

        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        // Formatação para garantir que sempre tenha dois dígitos
        const formattedTime = 
            (minutes < 10 ? "0" + minutes : minutes) + ":" + 
            (seconds < 10 ? "0" + seconds : seconds);
        
        timer.innerHTML = formattedTime;

    }, 1000);
};

window.onload = () => {
    spanPlayer.innerHTML = localStorage.getItem('player');
    startTimer();
    loadGame();
}

