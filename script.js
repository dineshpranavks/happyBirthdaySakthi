document.addEventListener('DOMContentLoaded', () => {

    // --- Music Player Logic ---
    const musicBtn = document.getElementById('musicToggle');
    const music = document.getElementById('bgMusic');
    // const icon = musicBtn.querySelector('i'); // Might not exist
    // const text = musicBtn.querySelector('span'); // Might not exist
    let isPlaying = false;

    // --- Check for passed timestamp ---
    const urlParams = new URLSearchParams(window.location.search);
    const musicTime = urlParams.get('musicTime');

    if (musicTime) {
        music.currentTime = parseFloat(musicTime);
        music.play().then(() => {
            isPlaying = true;
            updateMusicButtonState(true);
        }).catch(err => console.log("Auto-resume blocked:", err));
    }

    if (musicBtn) {
        const icon = musicBtn.querySelector('i');
        const text = musicBtn.querySelector('span');

        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                music.pause();
                isPlaying = false;
                updateMusicButtonState(false);
            } else {
                music.play();
                isPlaying = true;
                updateMusicButtonState(true);
            }
        });
    }

    function updateMusicButtonState(playing) {
        if (!musicBtn) return;
        const icon = musicBtn.querySelector('i');
        const text = musicBtn.querySelector('span');

        if (playing) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            text.textContent = "Pause Song";
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            text.textContent = "Play Song";
        }
    }



    // --- Surprise Redirect Logic ---
    const redirectBtn = document.getElementById('redirectBtn');

    if (redirectBtn) {
        redirectBtn.addEventListener('click', () => {
            const currentTime = music.currentTime;
            window.location.href = `video.html?musicTime=${currentTime}`;
        });
    }

    // (Old letter logic kept if elements still exist, but button ID changed)
    const letterSection = document.getElementById('letter');
    const heroSection = document.getElementById('hero');
    // const openBtn = document.getElementById('openLetterBtn'); // Removed ID from HTML

    /* 
    openBtn.addEventListener('click', () => {
        fireConfetti();
        heroSection.style.display = 'none';
        letterSection.classList.remove('hidden');
        letterSection.style.display = 'block';
        letterSection.scrollIntoView({ behavior: 'smooth' });
    });

    window.closeLetter = () => {
        letterSection.style.display = 'none';
        heroSection.style.display = 'block';
    };
    */

    // --- Puzzle Game Logic ---
    const puzzleContainer = document.getElementById('puzzle-container');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const imageUrl = 'images/images (30).jpeg'; // Using the user's uploaded image
    const gridSize = 3;
    let tiles = [];

    // Initialize Puzzle
    function initPuzzle() {
        puzzleContainer.innerHTML = '';
        tiles = [];

        // Create 8 tiles + 1 empty
        for (let i = 0; i < gridSize * gridSize; i++) {
            const tile = document.createElement('div');
            tile.classList.add('puzzle-piece');

            if (i === gridSize * gridSize - 1) {
                // The last one is empty
                tile.classList.add('empty-piece');
                tile.id = 'empty';
            } else {
                // Set background image position
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                tile.style.backgroundImage = `url('${imageUrl}')`;
                tile.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
                tile.dataset.index = i; // Original correct index

                // Add number
                const number = document.createElement('span');
                number.classList.add('tile-number');
                number.innerText = i + 1;
                tile.appendChild(number);
            }

            tiles.push(tile);
        }

        shuffleTiles();
        renderTiles();
    }

    function renderTiles() {
        puzzleContainer.innerHTML = '';
        tiles.forEach((tile, index) => {
            tile.onclick = () => moveTile(index);
            puzzleContainer.appendChild(tile);
        });
    }

    function shuffleTiles() {
        // Simple shuffle: Randomly swap empty tile with neighbors
        let emptyIndex = tiles.length - 1;
        for (let i = 0; i < 100; i++) {
            const neighbors = getNeighbors(emptyIndex);
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            swap(emptyIndex, randomNeighbor);
            emptyIndex = randomNeighbor;
        }
    }

    function getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        if (row > 0) neighbors.push(index - gridSize); // Top
        if (row < gridSize - 1) neighbors.push(index + gridSize); // Bottom
        if (col > 0) neighbors.push(index - 1); // Left
        if (col < gridSize - 1) neighbors.push(index + 1); // Right

        return neighbors;
    }

    function moveTile(index) {
        const emptyIndex = tiles.findIndex(t => t.id === 'empty');
        const neighbors = getNeighbors(emptyIndex);

        if (neighbors.includes(index)) {
            swap(index, emptyIndex);
            renderTiles();
            checkWin();
        }
    }

    function swap(i, j) {
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    function checkWin() {
        let isSolved = true;
        tiles.forEach((tile, index) => {
            if (tile.id !== 'empty' && parseInt(tile.dataset.index) !== index) {
                isSolved = false;
            }
        });

        if (isSolved) {
            setTimeout(() => {
                fireConfetti();
                // Optionally show the full image in the empty slot
                const emptyTile = document.getElementById('empty');
                emptyTile.classList.remove('empty-piece');
                emptyTile.style.backgroundImage = `url('${imageUrl}')`;
                emptyTile.style.backgroundPosition = `-${(gridSize - 1) * 100}px -${(gridSize - 1) * 100}px`;
                //alert("🎉 YAY! You solved it Pookie! 🎉");
            }, 300);
        }
    }

    shuffleBtn.addEventListener('click', () => {
        initPuzzle();
    });

    // Start the game
    initPuzzle();

    // --- Confetti Effect ---
    function fireConfetti() {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
});
