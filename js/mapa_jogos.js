document.addEventListener('DOMContentLoaded', () => {
    const playerNameSpan = document.getElementById('player-name');
    const logoutButton = document.getElementById('logout-button');

    // 1. Recupera o nome do jogador do localStorage e exibe
    const playerName = localStorage.getItem('player'); 
    if (playerName) {
        playerNameSpan.textContent = playerName;
    } else {
        window.location.href = '../index.html';
    }

    // 2. Adiciona funcionalidade ao botão de "Sair"
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('player'); 
            window.location.href = '../index.html'; 
        });
    }
});