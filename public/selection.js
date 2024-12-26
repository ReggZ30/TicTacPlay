function selectSymbol(symbol) {
    localStorage.setItem('playerSymbol', symbol);
    document.querySelectorAll('.symbol-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === symbol) {
            btn.classList.add('selected');
        }
    });
}

function startGame() {
    const symbol = localStorage.getItem('playerSymbol') || 'X';
    const difficulty = document.getElementById('difficulty').value;
    
    // Simpan pilihan simbol dan level ke localStorage
    localStorage.setItem('difficulty', difficulty);

    // Reset game sebelumnya
    localStorage.removeItem('ticTacToeBoard');  
    localStorage.removeItem('gameActive');      
    
    console.log('Pengaturan permainan disimpan:', {
        playerSymbol: symbol,
        difficulty
    });

    // Pindah ke halaman permainan
    window.location.href = 'game.html';
}
