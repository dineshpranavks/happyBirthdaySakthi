document.addEventListener('DOMContentLoaded', () => {
    // --- Music Player Logic ---
    const music = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');

    // Check for passed timestamp
    const urlParams = new URLSearchParams(window.location.search);
    const musicTime = urlParams.get('musicTime');

    if (musicTime) {
        music.currentTime = parseFloat(musicTime);
        music.play().then(() => {
            updateMusicButtonState(true);
        }).catch(err => console.log("Auto-resume blocked:", err));
    }

    // Toggle Music
    musicBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            updateMusicButtonState(true);
        } else {
            music.pause();
            updateMusicButtonState(false);
        }
    });

    // Make Video Play on Click (if needed, or use controls)
    const video = document.getElementById('birthdayVideo');
    // Optional: Pause music when video plays?
    // Usually nice to keep background music low or pause it.
    // Let's pause background music when video plays.

    if (video) {
        video.addEventListener('play', () => {
            music.pause();
            updateMusicButtonState(false);
        });
    }

    video.addEventListener('pause', () => {
        // Optional: Resume music when video pauses?
        // music.play();
        // updateMusicButtonState(true);
    });

    function updateMusicButtonState(playing) {
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
});
