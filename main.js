let musicData = [];
let musicDataClone = [];
let musicIndex = 0;
const musicCardLimit = 5;
const bodyContainer = document.getElementsByClassName("body-container")[0];
var isLoading = false;

function readJSON(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            musicData = data.Music;
            musicDataClone = musicData;
            FillPage();
        })
        .catch(error => {
            console.error("Failed to fetch JSON data:", error);
        });
}

function loadMusicCards() {
    if (isLoading || musicIndex >= musicData.length) return;

    //isLoading = true;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < musicCardLimit && musicIndex < musicData.length; i++, musicIndex++) {
        const track = musicData[musicIndex];
        const musicCard = document.createElement("div");
        musicCard.className = "music-card";
        musicCard.innerHTML = `
                        <div class="music-thumbnail">
                            <img src="${track.cover}" class="music-img" loading="lazy">
                        </div>
                        <div class="music-info">
                            <span class="music-title">${track.name}</span>
                            <br>
                            <span class="music-author">${track.artist}</span>
                        </div>
                    `;
        musicCard.onclick = () => playMusic(track.name, track.artist, track.cover, track.url);
        fragment.appendChild(musicCard);
    }
    bodyContainer.appendChild(fragment);
    isLoading = false;
}

async function FillPage() {
    while (true) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        // Check if the user is near the bottom (within 10px of the bottom)
        if (scrollHeight - scrollTop - clientHeight <= 10) {
            if (!isLoading && musicIndex < musicData.length) {
                await loadMusicCards(); // Load more cards
            } else {
                break;
            }
        } else {
            break;
        }
    }
}

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    FillPage();
});

function searchMusic() {
    const query = document.getElementById('search-input').value.toLowerCase();
    musicData = musicDataClone.filter(track => {
        return track.name.toLowerCase().includes(query) || track.artist.toLowerCase().includes(query);
    });

    musicIndex = 0;
    bodyContainer.innerHTML = `<i class="fa-solid fa-bars" onclick="document.getElementsByClassName('music-player')[0].classList.remove('hidden');" id="opener" style="display:none;"></i>`;
    FillPage();
}

var openerOpened = false;

function playMusic(MusicTitle, Musician, MusicCover, Music) {
    if (!openerOpened) {
        document.getElementById("opener").setAttribute("style", "");
    }
    const MusicPlayer = document.getElementsByClassName("music-player")[0];
    const Title = MusicPlayer.getElementsByClassName("music-title")[0];
    const Author = MusicPlayer.getElementsByClassName("music-author")[0];
    const Thumbnail = MusicPlayer.getElementsByClassName("music-img")[0];
    const source = MusicPlayer.getElementsByTagName("source")[0];
    const audio = document.getElementById("audio");
    const playBtn = document.getElementById("play-btn");
    const stopBtn = document.getElementById("stop-btn");
    const loopBtn = document.getElementById('loop-btn');
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementsByClassName("music-progress")[0];

    Title.innerHTML = MusicTitle;
    Author.innerHTML = Musician;
    Thumbnail.setAttribute("src", MusicCover);
    audio.setAttribute("src", Music);

    let isDragging = false;

    playBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playBtn.classList.remove("fa-play");
            playBtn.classList.add("fa-pause");
        } else {
            audio.pause();
            playBtn.classList.remove("fa-pause");
            playBtn.classList.add("fa-play");
        }
    });

    loopBtn.addEventListener('click', () => {
        audio.loop = !audio.loop;
        if (audio.loop) {
            loopBtn.style = 'color:black';
        } else {
            loopBtn.style = 'color:white';
        }
    });

    audio.addEventListener('timeupdate', () => {
        if (isDragging || !audio.duration) return;
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
    });

    audio.addEventListener('ended', () => {
        progressBar.style.width = '0%';
        playBtn.classList.remove("fa-pause");
        playBtn.classList.add("fa-play");
    });

    const seekAudio = (event) => {
        const rect = progressContainer.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
        const newTime = percentage * audio.duration;
        audio.pause();
        const currentSrc = audio.src;
        const newSrc = currentSrc.replace(/#t=[^&]*/, '');
        audio.src = newSrc + "#t=" + newTime;
        audio.play();
        progressBar.style.width = `${percentage * 100}%`;
    };

    progressContainer.addEventListener('click', (event) => {
        if (!audio.duration) return;
        seekAudio(event);
    });

    progressContainer.addEventListener('mousedown', (event) => {
        if (!audio.duration) return;
        isDragging = true;
        seekAudio(event);

        const onMouseMove = (moveEvent) => {
            seekAudio(moveEvent);
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    Thumbnail.onload = function() {
        if (audio.paused) {
            audio.play();
            playBtn.classList.remove("fa-play");
            playBtn.classList.add("fa-pause");
        } else {
            audio.pause();
            audio.play();
            playBtn.classList.remove("fa-pause");
            playBtn.classList.add("fa-play");
        }
        document.getElementsByClassName('music-player')[0].classList.remove('hidden');
    }
}

readJSON("music.json");