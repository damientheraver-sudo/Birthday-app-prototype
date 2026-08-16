// Divine Birthday Experience - Main JavaScript
/* =========================================================
   DIVINE BIRTHDAY EXPERIENCE
   MAIN APPLICATION JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   APP STATE
========================================================= */

const AppState = {

    currentScreen: "intro",

    musicPlaying: false,

    musicDrawerOpen: false,

    surpriseOpen: false,

    currentTrack: 0,

    tracks: [],

    audio: null,

    initialized: false

};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function showScreen(screenId) {

    const target = $(`#${screenId}`);

    if (!target) {
        console.warn(`Screen "${screenId}" was not found.`);
        return;
    }

    $$(".screen").forEach(screen => {

        screen.classList.remove("active");

    });

    target.classList.add("active");

    AppState.currentScreen = screenId;

    updateMobileNavigation(screenId);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function updateMobileNavigation(screenId) {

    $$(".mobile-nav-item").forEach(button => {

        const target = button.dataset.screen;

        button.classList.toggle(
            "active",
            target === screenId
        );

    });

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function setupNavigation() {

    /* Buttons with data-screen */

    $$("[data-screen]").forEach(element => {

        element.addEventListener("click", () => {

            const target = element.dataset.screen;

            if (!target) return;

            showScreen(target);

        });

    });


    /* Back buttons */

    $$(".back-button").forEach(button => {

        button.addEventListener("click", () => {

            showScreen("home");

        });

    });


    /* Intro button */

    const enterButton =
        $("#enterExperience");

    if (enterButton) {

        enterButton.addEventListener("click", () => {

            showScreen("home");

        });

    }


    /* Feature cards */

    $$(".feature-card").forEach(card => {

        card.addEventListener("click", () => {

            const target =
                card.dataset.screen;

            if (target) {

                showScreen(target);

            }

        });

    });

}


/* =========================================================
   INTRO
========================================================= */

function setupIntro() {

    const intro =
        $("#intro");

    if (!intro) return;

    setTimeout(() => {

        intro.classList.add("ready");

    }, 150);

}


/* =========================================================
   STAR FIELD
========================================================= */

function createStars() {

    const container =
        $(".stars");

    if (!container) return;

    const amount =
        window.innerWidth < 600
            ? 35
            : 70;

    container.innerHTML = "";

    for (let i = 0; i < amount; i++) {

        const star =
            document.createElement("span");

        star.className = "star";

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;

        const size =
            Math.random() * 2 + 1;

        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;

        star.style.animationDelay =
            `${Math.random() * 5}s`;

        star.style.animationDuration =
            `${3 + Math.random() * 5}s`;

        container.appendChild(star);

    }

}


/* =========================================================
   MUSIC SYSTEM
========================================================= */

function initializeAudio() {

    AppState.tracks = 

[


    {
        title: "Our Song",
        artist: "Divine ♡",
        src: "assets/music/song-01.mp3"
    },

    {
        title: "Song Two",
        artist: "For My Angel",
        src: "assets/music/song-02.mp3"
    },

    {
        title: "Song Three",
        artist: "For Divine",
        src: "assets/music/song-03.mp3"
    },

    {
        title: "Song Four",
        artist: "Our Memories",
        src: "assets/music/song-04.mp3"
    },

    {
        title: "Song Five",
        artist: "My Angel ♡",
        src: "assets/music/song-05.mp3"
    },

    {
        title: "Song Six",
        artist: "For You",
        src: "assets/music/song-06.mp3"
    },

    {
        title: "Song Seven",
        artist: "Daven ♡",
        src: "assets/music/song-07.mp3"
    },

    {
        title: "Song Eight",
        artist: "Birthday Girl",
        src: "assets/music/song-08.mp3"
    }
];

    if (AppState.tracks.length === 0) {

        console.warn("No music tracks found.");

        return;

    }

    AppState.audio = new Audio();

    AppState.audio.preload = "auto";

    AppState.audio.volume = 0.8;

    loadTrack(0);

    setupAudioEvents();

    console.log("Audio system initialized.");

}


/* =========================================================
   LOAD TRACK
========================================================= */

function loadTrack(index) {

    if (!AppState.audio) {

        console.warn("Audio element does not exist.");

        return;

    }

    const track = AppState.tracks[index];

    if (!track) {

        console.warn("Track does not exist:", index);

        return;

    }

    AppState.currentTrack = index;

    AppState.audio.src = track.src;

    AppState.audio.load();

    updateMusicUI(track);

    console.log(
        "Loaded track:",
        track.title,
        track.src
    );

}


/* =========================================================
   UPDATE MUSIC UI
========================================================= */

function updateMusicUI(track) {

    const titleElements = $$(
        "[data-track-title]"
    );

    const artistElements = $$(
        "[data-track-artist]"
    );

    titleElements.forEach(element => {

        element.textContent =
            track.title;

    });

    artistElements.forEach(element => {

        element.textContent =
            track.artist;

    });

}


/* =========================================================
   AUDIO EVENTS
========================================================= */

function setupAudioEvents() {

    if (!AppState.audio) return;

    AppState.audio.addEventListener(
        "timeupdate",
        updateProgress
    );

    AppState.audio.addEventListener(
        "loadedmetadata",
        () => {

            updateDuration();

        }
    );

    AppState.audio.addEventListener(
        "ended",
        () => {

            playNextTrack();

        }
    );

}


/* =========================================================
   PLAY / PAUSE
========================================================= */

function toggleMusic() {

    if (!AppState.audio) {

        console.error("Audio has not been initialized.");

        return;

    }

    if (AppState.audio.paused) {

        AppState.audio
            .play()
            .then(() => {

                AppState.musicPlaying = true;

                updatePlayButtons();

                showMiniPlayer();

                console.log("Music playing.");

            })
            .catch(error => {

                console.error(
                    "Audio playback failed:",
                    error
                );

            });

    } else {

        AppState.audio.pause();

        AppState.musicPlaying = false;

        updatePlayButtons();

        console.log("Music paused.");

    }

}


/* =========================================================
   PLAY NEXT
========================================================= */

function playNextTrack() {

    if (
        !AppState.tracks.length
    ) return;

    let next =
        AppState.currentTrack + 1;

    if (
        next >=
        AppState.tracks.length
    ) {

        next = 0;

    }

    loadTrack(next);

    if (AppState.audio) {

        AppState.audio
            .play()
            .then(() => {

                AppState.musicPlaying =
                    true;

                updatePlayButtons();

            });

    }

}


/* =========================================================
   PLAY PREVIOUS
========================================================= */

function playPreviousTrack() {

    if (
        !AppState.tracks.length
    ) return;

    let previous =
        AppState.currentTrack - 1;

    if (previous < 0) {

        previous =
            AppState.tracks.length - 1;

    }

    loadTrack(previous);

    if (AppState.audio) {

        AppState.audio
            .play()
            .then(() => {

                AppState.musicPlaying =
                    true;

                updatePlayButtons();

            });

    }

}


/* =========================================================
   PLAY BUTTONS
========================================================= */

function updatePlayButtons() {

    const buttons =
        $$("[data-play-button]");

    buttons.forEach(button => {

        button.textContent =
            AppState.musicPlaying
                ? "Ⅱ"
                : "▶";

    });

}


/* =========================================================
   MUSIC CONTROLS
========================================================= */

function setupMusicControls() {

    $$("[data-play-button]")
        .forEach(button => {

            button.addEventListener(
                "click",
                toggleMusic
            );

        });


    $$("[data-next-track]")
        .forEach(button => {

            button.addEventListener(
                "click",
                playNextTrack
            );

        });


    $$("[data-prev-track]")
        .forEach(button => {

            button.addEventListener(
                "click",
                playPreviousTrack
            );

        });


    const progress =
        $(".progress-track");

    if (progress) {

        progress.addEventListener(
            "click",
            seekAudio
        );

    }

}


/* =========================================================
   PROGRESS BAR
========================================================= */

function updateProgress() {

    if (!AppState.audio) return;

    const duration =
        AppState.audio.duration;

    const current =
        AppState.audio.currentTime;

    if (!duration) return;

    const percentage =
        (current / duration) * 100;

    const bar =
        $(".progress-bar");

    if (bar) {

        bar.style.width =
            `${percentage}%`;

    }

    const currentTime =
        $(".current-time");

    if (currentTime) {

        currentTime.textContent =
            formatTime(current);

    }

}


/* =========================================================
   DURATION
========================================================= */

function updateDuration() {

    if (!AppState.audio) return;

    const duration =
        $(".duration");

    if (!duration) return;

    duration.textContent =
        formatTime(
            AppState.audio.duration
        );

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "0:00";

    }

    const minutes =
        Math.floor(seconds / 60);

    const remaining =
        Math.floor(seconds % 60);

    return `${minutes}:${String(
        remaining
    ).padStart(2, "0")}`;

}


/* =========================================================
   SEEK
========================================================= */

function seekAudio(event) {

    if (!AppState.audio) return;

    if (
        !Number.isFinite(
            AppState.audio.duration
        )
    ) return;

    const rect =
        event.currentTarget
            .getBoundingClientRect();

    const position =
        (event.clientX - rect.left)
        / rect.width;

    AppState.audio.currentTime =
        position *
        AppState.audio.duration;

}


/* =========================================================
   MUSIC DRAWER
========================================================= */

function openMusicDrawer() {

    const drawer =
        $(".music-drawer");

    const backdrop =
        $(".drawer-backdrop");

    if (!drawer) return;

    drawer.classList.add("active");

    if (backdrop) {

        backdrop.classList.add("active");

    }

    AppState.musicDrawerOpen =
        true;

}


function closeMusicDrawer() {

    const drawer =
        $(".music-drawer");

    const backdrop =
        $(".drawer-backdrop");

    if (!drawer) return;

    drawer.classList.remove("active");

    if (backdrop) {

        backdrop.classList.remove(
            "active"
        );

    }

    AppState.musicDrawerOpen =
        false;

}


function setupMusicDrawer() {

    const openButtons =
        $$("[data-open-music]");

    const closeButtons =
        $$("[data-close-music]");

    openButtons.forEach(button => {

        button.addEventListener(
            "click",
            openMusicDrawer
        );

    });

    closeButtons.forEach(button => {

        button.addEventListener(
            "click",
            closeMusicDrawer
        );

    });

    const backdrop =
        $(".drawer-backdrop");

    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeMusicDrawer
        );

    }

}


/* =========================================================
   MINI PLAYER
========================================================= */

function showMiniPlayer() {

    const player =
        $(".mini-player");

    if (!player) return;

    player.classList.add("visible");

}


function hideMiniPlayer() {

    const player =
        $(".mini-player");

    if (!player) return;

    player.classList.remove(
        "visible"
    );

}


/* =========================================================
   MUSIC UNAVAILABLE MESSAGE
========================================================= */

function showMusicUnavailable() {

    const drawer =
        $(".music-drawer");

    if (!drawer) return;

    openMusicDrawer();

}


/* =========================================================
   SURPRISE SYSTEM
========================================================= */

function setupSurprise() {

    const buttons =
        $$("[data-surprise]");

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            openSurprise
        );

    });


    const closeButton =
        $("[data-close-surprise]");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeSurprise
        );

    }

}


/* =========================================================
   OPEN SURPRISE
========================================================= */

function openSurprise() {

    const overlay =
        $(".surprise-overlay");

    if (!overlay) return;

    overlay.classList.add("active");

    AppState.surpriseOpen =
        true;

    createSurpriseParticles();

}


/* =========================================================
   CLOSE SURPRISE
========================================================= */

function closeSurprise() {

    const overlay =
        $(".surprise-overlay");

    if (!overlay) return;

    overlay.classList.remove(
        "active"
    );

    AppState.surpriseOpen =
        false;

}


/* =========================================================
   SURPRISE PARTICLES
========================================================= */

function createSurpriseParticles() {

    const container =
        $(".surprise-particles");

    if (!container) return;

    container.innerHTML = "";

    const amount =
        window.innerWidth < 600
            ? 35
            : 70;

    for (let i = 0; i < amount; i++) {

        const particle =
            document.createElement("span");

        particle.className =
            "surprise-particle";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${70 + Math.random() * 30}%`;

        particle.style.setProperty(
            "--duration",
            `${4 + Math.random() * 6}s`
        );

        particle.style.setProperty(
            "--drift",
            `${-120 + Math.random() * 240}px`
        );

        particle.style.animationDelay =
            `${Math.random() * 4}s`;

        container.appendChild(
            particle
        );

    }

}


/* =========================================================
   ESCAPE KEY
========================================================= */

function setupKeyboardControls() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                if (
                    AppState.surpriseOpen
                ) {

                    closeSurprise();

                }

                if (
                    AppState.musicDrawerOpen
                ) {

                    closeMusicDrawer();

                }

            }

            if (
                event.code === "Space" &&
                event.target === document.body
            ) {

                event.preventDefault();

                toggleMusic();

            }

        }
    );

}


/* =========================================================
   HOVER TILT
========================================================= */

function setupCardEffects() {

    const cards =
        $$(".feature-card");

    cards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                if (
                    window.innerWidth < 800
                ) return;

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    (y - centerY)
                    / centerY
                    * -2;

                const rotateY =
                    (x - centerX)
                    / centerX
                    * 2;

                card.style.transform =
                    `perspective(800px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-5px)`;

            }
        );

        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";

            }
        );

    });

}


/* =========================================================
   IMAGE PLACEHOLDERS
========================================================= */

function setupImageFallbacks() {

    $$("img").forEach(image => {

        image.addEventListener(
            "error",
            () => {

                image.style.display =
                    "none";

            }
        );

    });

}


/* =========================================================
   PAGE VISIBILITY
========================================================= */

function setupVisibilityHandling() {

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden &&
                AppState.audio &&
                !AppState.audio.paused
            ) {

                /*
                    We intentionally don't
                    pause music automatically.
                */

            }

        }
    );

}


/* =========================================================
   INITIALIZE APP
========================================================= */

function initializeApp() {

    if (AppState.initialized) return;

    AppState.initialized =
        true;

    createStars();

    setupNavigation();

    setupIntro();

    setupMusicControls();

    setupMusicDrawer();

    setupSurprise();

    setupKeyboardControls();

    setupCardEffects();

    setupImageFallbacks();

    setupVisibilityHandling();

    initializeAudio();
initializeMemoryGallery(); 
initializeSurprise();
    updatePlayButtons();

    showScreen("home");
    updateMobileNavigation(
        AppState.currentScreen
    );

    console.log(
        "✨ Divine Birthday Experience initialized."
    );

}


/* =========================================================
   DOM READY
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}
/* =========================================================
   MEMORY GALLERY
========================================================= */

function initializeMemoryGallery() {

    const cards =
        document.querySelectorAll(".memory-card");

    const viewer =
        document.getElementById("memoryViewer");

    const viewerImage =
        document.getElementById("memoryViewerImage");

    const viewerTitle =
        document.getElementById("memoryViewerTitle");

    const viewerNumber =
        document.getElementById("memoryViewerNumber");

    const closeButton =
        document.getElementById("memoryViewerClose");

    const previousButton =
        document.getElementById("memoryViewerPrev");

    const nextButton =
        document.getElementById("memoryViewerNext");


    if (
        !cards.length ||
        !viewer ||
        !viewerImage
    ) {

        return;

    }


    const memories =
        Array.from(cards).map(card => {

            const image =
                card.querySelector("img");

            const title =
                card.querySelector(".memory-info h3");

            const number =
                card.querySelector(".memory-info span");


            return {

                src:
                    image?.src || "",

                alt:
                    image?.alt || "Memory",

                title:
                    title?.textContent ||
                    "A beautiful memory",

                number:
                    number?.textContent ||
                    "MEMORY"

            };

        });


    let currentIndex = 0;


    function openMemory(index) {

        currentIndex =
            (index + memories.length) %
            memories.length;

        const memory =
            memories[currentIndex];


        viewerImage.src =
            memory.src;

        viewerImage.alt =
            memory.alt;

        viewerTitle.textContent =
            memory.title;

        viewerNumber.textContent =
            memory.number;


        viewer.classList.add("active");

        document.body.style.overflow =
            "hidden";

    }


    function closeMemory() {

        viewer.classList.remove("active");

        document.body.style.overflow =
            "";

    }


    function nextMemory() {

        openMemory(
            currentIndex + 1
        );

    }


    function previousMemory() {

        openMemory(
            currentIndex - 1
        );

    }


    cards.forEach((card, index) => {

        card.addEventListener(
            "click",
            () => openMemory(index)
        );

    });


    closeButton.addEventListener(
        "click",
        closeMemory
    );


    nextButton.addEventListener(
        "click",
        nextMemory
    );


    previousButton.addEventListener(
        "click",
        previousMemory
    );


    viewer.addEventListener(
        "click",
        event => {

            if (
                event.target === viewer
            ) {

                closeMemory();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                !viewer.classList.contains("active")
            ) {

                return;

            }


            if (
                event.key === "Escape"
            ) {

                closeMemory();

            }


            if (
                event.key === "ArrowRight"
            ) {

                nextMemory();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                previousMemory();

            }

        }
    );

}

/* =========================================================
   BIRTHDAY APP — MUSIC PLAYER
   ---------------------------------------------------------
   Features:
   • 8-song playlist
   • assets/music/ paths
   • Automatic playlist rendering
   • Play / pause
   • Previous / next
   • 10-second rewind / forward
   • Progress bar
   • Track duration
   • Automatic next song
   • Autoplay attempt on startup
   • Fallback autoplay after first user interaction
   • Defensive error handling
   • No duplicate initialization
========================================================= */


/* =========================================================
   MUSIC CONFIGURATION
========================================================= */

const MUSIC_TRACKS = [

    {
        title: "Our Song",
        artist: "Divine ♡",
        file: "song-01.mp3"
    },

    {
        title: "Song Two",
        artist: "For My Angel",
        file: "song-02.mp3"
    },

    {
        title: "Song Three",
        artist: "For Divine",
        file: "song-03.mp3"
    },

    {
        title: "Song Four",
        artist: "Our Memories",
        file: "song-04.mp3"
    },

    {
        title: "Song Five",
        artist: "My Angel ♡",
        file: "song-05.mp3"
    },

    {
        title: "Song Six",
        artist: "For You",
        file: "song-06.mp3"
    },

    {
        title: "Song Seven",
        artist: "Daven ♡",
        file: "song-07.mp3"
    },

    {
        title: "Song Eight",
        artist: "Birthday Girl",
        file: "song-08.mp3"
    }

];


/* =========================================================
   MUSIC STATE
========================================================= */

const BirthdayMusic = {

    audio: null,

    currentIndex: 0,

    initialized: false,

    autoplayAttempted: false,

    fallbackListenersAdded: false

};


/* =========================================================
   HELPER — FIND ELEMENT
========================================================= */

function musicElement(...ids) {

    for (const id of ids) {

        const element =
            document.getElementById(id);

        if (element) {

            return element;

        }

    }

    return null;

}


/* =========================================================
   HELPER — FORMAT TIME
========================================================= */

function formatMusicTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(seconds / 60);


    const remaining =
        Math.floor(seconds % 60);


    return (
        minutes +
        ":" +
        String(remaining).padStart(2, "0")
    );

}


/* =========================================================
   GET AUDIO ELEMENT
========================================================= */

function getBirthdayAudio() {

    /*
       First try the audio element already created
       by the existing app audio system.
    */

    if (
        typeof AppState !== "undefined" &&
        AppState.audio
    ) {

        return AppState.audio;

    }


    /*
       Otherwise look for an existing audio element.
    */

    let audio =
        document.getElementById("audioPlayer");


    if (!audio) {

        audio =
            document.querySelector(
                "audio"
            );

    }


    /*
       If there is no audio element at all,
       create one safely.
    */

    if (!audio) {

        audio =
            document.createElement(
                "audio"
            );

        audio.id =
            "audioPlayer";

        audio.preload =
            "auto";

        audio.setAttribute(
            "playsinline",
            ""
        );

        document.body.appendChild(
            audio
        );

    }


    /*
       Keep AppState synchronized if it exists.
    */

    if (
        typeof AppState !== "undefined"
    ) {

        AppState.audio =
            audio;

    }


    return audio;

}


/* =========================================================
   GET CURRENT TRACK
========================================================= */

function getCurrentBirthdayTrack() {

    return MUSIC_TRACKS[
        BirthdayMusic.currentIndex
    ];

}


/* =========================================================
   UPDATE TRACK INFORMATION
========================================================= */

function updateMusicInformation() {

    const track =
        getCurrentBirthdayTrack();


    if (!track) {

        return;

    }


    const title =
        musicElement(
            "musicTitle",
            "currentSongTitle",
            "songTitle"
        );


    const artist =
        musicElement(
            "musicArtist",
            "currentSongArtist",
            "songArtist"
        );


    if (title) {

        title.textContent =
            track.title;

    }


    if (artist) {

        artist.textContent =
            track.artist;

    }

}


/* =========================================================
   RENDER PLAYLIST
========================================================= */

function renderBirthdayPlaylist() {

    const container =
        musicElement(
            "playlistContainer",
            "musicPlaylist",
            "playlist"
        );


    if (!container) {

        console.warn(
            "Music Player: Playlist container not found."
        );

        return false;

    }


    /*
       Clear the container before rebuilding it.
    */

    container.innerHTML = "";


    MUSIC_TRACKS.forEach(
        (track, index) => {

            const item =
                document.createElement(
                    "button"
                );


            item.type =
                "button";


            item.className =
                "playlist-track";


            item.dataset.track =
                index;


            if (
                index ===
                BirthdayMusic.currentIndex
            ) {

                item.classList.add(
                    "active"
                );

            }


            item.innerHTML = `

                <span class="playlist-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <span class="playlist-track-icon">
                    ♫
                </span>

                <span class="playlist-track-info">

                    <strong>
                        ${track.title}
                    </strong>

                    <small>
                        ${track.artist}
                    </small>

                </span>

                <span class="playlist-play">
                    ▶
                </span>

            `;


            item.addEventListener(
                "click",
                () => {

                    loadBirthdayTrack(
                        index,
                        true
                    );

                }
            );


            container.appendChild(
                item
            );

        }
    );


    const count =
        musicElement(
            "trackCount",
            "songCount"
        );


    if (count) {

        count.textContent =
            `${MUSIC_TRACKS.length} SONGS`;

    }


    return true;

}


/* =========================================================
   UPDATE ACTIVE PLAYLIST ITEM
========================================================= */

function updateActiveMusicTrack() {

    const items =
        document.querySelectorAll(
            ".playlist-track"
        );


    items.forEach(
        (item, index) => {

            item.classList.toggle(
                "active",
                index ===
                BirthdayMusic.currentIndex
            );

        }
    );

}


/* =========================================================
   LOAD TRACK
========================================================= */

function loadBirthdayTrack(
    index,
    autoplay = false
) {

    const audio =
        BirthdayMusic.audio;


    if (!audio) {

        console.warn(
            "Music Player: Audio element unavailable."
        );

        return false;

    }


    if (
        !MUSIC_TRACKS[index]
    ) {

        console.warn(
            "Music Player: Invalid track index:",
            index
        );

        return false;

    }


    const track =
        MUSIC_TRACKS[index];


    BirthdayMusic.currentIndex =
        index;


    /*
       Build the path safely.
    */

    const source =
        "assets/music/" +
        track.file;


    /*
       Stop the previous track before loading
       the new one.
    */

    audio.pause();


    /*
       Remove the previous source.
    */

    audio.removeAttribute(
        "src"
    );


    audio.load();


    /*
       Assign new source.
    */

    audio.src =
        source;


    /*
       Browser-friendly attributes.
    */

    audio.preload =
        "auto";

    audio.setAttribute(
        "playsinline",
        ""
    );


    audio.load();


    updateMusicInformation();

    updateActiveMusicTrack();

    updateMusicInterface();


    /*
       Try to play if requested.
    */

    if (autoplay) {

        playBirthdayMusic();

    }


    return true;

}


/* =========================================================
   PLAY MUSIC
========================================================= */

function playBirthdayMusic() {

    const audio =
        BirthdayMusic.audio;


    if (!audio) {

        return;

    }


    const playPromise =
        audio.play();


    /*
       play() returns a Promise in modern browsers.
    */

    if (
        playPromise &&
        typeof playPromise.then ===
        "function"
    ) {

        playPromise

            .then(() => {

                updateMusicInterface();

            })

            .catch(error => {

                /*
                   This is usually caused by browser
                   autoplay restrictions.
                */

                console.info(
                    "Music autoplay was blocked. Waiting for user interaction.",
                    error
                );


                installAutoplayFallback();

            });

    }

}


/* =========================================================
   PAUSE MUSIC
========================================================= */

function pauseBirthdayMusic() {

    if (
        !BirthdayMusic.audio
    ) {

        return;

    }


    BirthdayMusic.audio.pause();

    updateMusicInterface();

}


/* =========================================================
   TOGGLE PLAYBACK
========================================================= */

function toggleBirthdayMusic() {

    const audio =
        BirthdayMusic.audio;


    if (!audio) {

        return;

    }


    if (audio.paused) {

        playBirthdayMusic();

    } else {

        pauseBirthdayMusic();

    }

}


/* =========================================================
   NEXT SONG
========================================================= */

function nextBirthdaySong(
    autoplay = true
) {

    let nextIndex =
        BirthdayMusic.currentIndex + 1;


    if (
        nextIndex >=
        MUSIC_TRACKS.length
    ) {

        nextIndex = 0;

    }


    loadBirthdayTrack(
        nextIndex,
        autoplay
    );

}


/* =========================================================
   PREVIOUS SONG
========================================================= */

function previousBirthdaySong() {

    const audio =
        BirthdayMusic.audio;


    /*
       If we're more than five seconds into the song,
       pressing previous simply restarts the current song.
    */

    if (
        audio &&
        audio.currentTime > 5
    ) {

        audio.currentTime =
            0;

        return;

    }


    let previousIndex =
        BirthdayMusic.currentIndex - 1;


    if (
        previousIndex < 0
    ) {

        previousIndex =
            MUSIC_TRACKS.length - 1;

    }


    loadBirthdayTrack(
        previousIndex,
        true
    );

}


/* =========================================================
   UPDATE PROGRESS
========================================================= */

function updateMusicProgress() {

    const audio =
        BirthdayMusic.audio;


    if (!audio) {

        return;

    }


    const current =
        musicElement(
            "currentTime",
            "musicCurrentTime"
        );


    const duration =
        musicElement(
            "duration",
            "musicDuration"
        );


    const progress =
        musicElement(
            "progressBar",
            "musicProgress"
        );


    if (current) {

        current.textContent =
            formatMusicTime(
                audio.currentTime
            );

    }


    if (duration) {

        duration.textContent =
            formatMusicTime(
                audio.duration
            );

    }


    if (
        progress &&
        Number.isFinite(
            audio.duration
        ) &&
        audio.duration > 0
    ) {

        const percentage =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        progress.style.width =
            percentage + "%";

    }

}


/* =========================================================
   UPDATE PLAY BUTTON / PLAYER STATE
========================================================= */

function updateMusicInterface() {

    const audio =
        BirthdayMusic.audio;


    if (!audio) {

        return;

    }


    const playButton =
        musicElement(
            "mainPlayButton",
            "musicPlayButton",
            "playButton"
        );


    if (playButton) {

        playButton.textContent =
            audio.paused
                ? "▶"
                : "Ⅱ";

    }


    const player =
        document.querySelector(
            ".music-player-card"
        );


    if (player) {

        player.classList.toggle(
            "is-playing",
            !audio.paused
        );

    }


    updateMusicProgress();

}


/* =========================================================
   SEEK THROUGH PROGRESS BAR
========================================================= */

function seekBirthdayMusic(
    event
) {

    const audio =
        BirthdayMusic.audio;


    if (
        !audio ||
        !Number.isFinite(
            audio.duration
        ) ||
        audio.duration <= 0
    ) {

        return;

    }


    const progressContainer =
        event.currentTarget;


    const rect =
        progressContainer
            .getBoundingClientRect();


    const clickPosition =
        (
            event.clientX -
            rect.left
        ) /
        rect.width;


    const safePosition =
        Math.max(
            0,
            Math.min(
                1,
                clickPosition
            )
        );


    audio.currentTime =
        safePosition *
        audio.duration;

}


/* =========================================================
   REWIND 10 SECONDS
========================================================= */

function rewindBirthdayMusic() {

    const audio =
        BirthdayMusic.audio;


    if (!audio) {

        return;

    }


    audio.currentTime =
        Math.max(
            0,
            audio.currentTime - 10
        );

}


/* =========================================================
   FORWARD 10 SECONDS
========================================================= */

function forwardBirthdayMusic() {

    const audio =
        BirthdayMusic.audio;


    if (!audio) {

        return;

    }


    const duration =
        Number.isFinite(
            audio.duration
        )
            ? audio.duration
            : Infinity;


    audio.currentTime =
        Math.min(
            duration,
            audio.currentTime + 10
        );

}


/* =========================================================
   AUTOPLAY FALLBACK
========================================================= */

function installAutoplayFallback() {

    if (
        BirthdayMusic.fallbackListenersAdded
    ) {

        return;

    }


    BirthdayMusic.fallbackListenersAdded =
        true;


    const startMusic =
        () => {

            if (
                BirthdayMusic.audio &&
                BirthdayMusic.audio.paused
            ) {

                playBirthdayMusic();

            }


            removeFallbackListeners();

        };


    const removeFallbackListeners =
        () => {

            document.removeEventListener(
                "click",
                startMusic
            );

            document.removeEventListener(
                "touchstart",
                startMusic
            );

            document.removeEventListener(
                "keydown",
                startMusic
            );

            document.removeEventListener(
                "pointerdown",
                startMusic
            );

        };


    document.addEventListener(
        "click",
        startMusic,
        {
            once: true
        }
    );


    document.addEventListener(
        "touchstart",
        startMusic,
        {
            once: true
        }
    );


    document.addEventListener(
        "keydown",
        startMusic,
        {
            once: true
        }
    );


    document.addEventListener(
        "pointerdown",
        startMusic,
        {
            once: true
        }
    );

}


/* =========================================================
   INITIALIZE MUSIC PLAYER
========================================================= */

function initializeBirthdayMusic() {

    /*
       Prevent duplicate initialization.
    */

    if (
        BirthdayMusic.initialized
    ) {

        return true;

    }


    /*
       Make sure the DOM exists.
    */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeBirthdayMusic,
            {
                once: true
            }
        );

        return true;

    }


    /*
       Get/create audio element.
    */

    const audio =
        getBirthdayAudio();


    if (!audio) {

        console.warn(
            "Music Player: Could not create/find audio element."
        );

        return false;

    }


    BirthdayMusic.audio =
        audio;


    BirthdayMusic.initialized =
        true;


    /*
       Configure audio.
    */

    audio.preload =
        "auto";

    audio.setAttribute(
        "playsinline",
        ""
    );


    /*
       Render playlist immediately.
    */

    renderBirthdayPlaylist();


    /*
       Load first song.
    */

    loadBirthdayTrack(
        0,
        false
    );


    /* -----------------------------------------------------
       PLAY BUTTON
    ----------------------------------------------------- */

    const playButton =
        musicElement(
            "mainPlayButton",
            "musicPlayButton",
            "playButton"
        );


    if (playButton) {

        playButton.addEventListener(
            "click",
            toggleBirthdayMusic
        );

    }


    /* -----------------------------------------------------
       PREVIOUS
    ----------------------------------------------------- */

    const previousButton =
        musicElement(
            "previousTrack",
            "previousButton",
            "musicPrevious"
        );


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            previousBirthdaySong
        );

    }


    /* -----------------------------------------------------
       NEXT
    ----------------------------------------------------- */

    const nextButton =
        musicElement(
            "nextTrack",
            "nextButton",
            "musicNext"
        );


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                nextBirthdaySong(
                    true
                );

            }
        );

    }


    /* -----------------------------------------------------
       REWIND
    ----------------------------------------------------- */

    const rewindButton =
        musicElement(
            "rewindTrack",
            "rewindButton",
            "musicRewind"
        );


    if (rewindButton) {

        rewindButton.addEventListener(
            "click",
            rewindBirthdayMusic
        );

    }


    /* -----------------------------------------------------
       FORWARD
    ----------------------------------------------------- */

    const forwardButton =
        musicElement(
            "forwardTrack",
            "forwardButton",
            "musicForward"
        );


    if (forwardButton) {

        forwardButton.addEventListener(
            "click",
            forwardBirthdayMusic
        );

    }


    /* -----------------------------------------------------
       PROGRESS BAR
    ----------------------------------------------------- */

    const progressContainer =
        musicElement(
            "progressTrack",
            "musicProgressTrack",
            "progressContainer"
        );


    if (progressContainer) {

        progressContainer.addEventListener(
            "click",
            seekBirthdayMusic
        );

    }


    /* -----------------------------------------------------
       AUDIO EVENTS
    ----------------------------------------------------- */

    audio.addEventListener(
        "timeupdate",
        updateMusicProgress
    );


    audio.addEventListener(
        "loadedmetadata",
        updateMusicInterface
    );


    audio.addEventListener(
        "durationchange",
        updateMusicInterface
    );


    audio.addEventListener(
        "play",
        updateMusicInterface
    );


    audio.addEventListener(
        "pause",
        updateMusicInterface
    );


    /* -----------------------------------------------------
       AUTOMATIC NEXT SONG
    ----------------------------------------------------- */

    audio.addEventListener(
        "ended",
        () => {

            nextBirthdaySong(
                true
            );

        }
    );


    /* -----------------------------------------------------
       AUDIO ERROR HANDLING
    ----------------------------------------------------- */

    audio.addEventListener(
        "error",
        () => {

            console.error(
                "Music Player: Unable to load:",
                getCurrentBirthdayTrack()
            );

            updateMusicInterface();

        }
    );


    /*
       Finally update the interface.
    */

    updateMusicInformation();

    updateMusicInterface();


    /*
       Try autoplay.

       The browser may reject this because the page
       hasn't received a user interaction yet.
    */

    BirthdayMusic.autoplayAttempted =
        true;


    playBirthdayMusic();


    return true;

}


/* =========================================================
   START MUSIC PLAYER
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeBirthdayMusic,
        {
            once: true
        }
    );

} else {

    initializeBirthdayMusic();

}

/* =========================================================
   CINEMATIC SURPRISE REVEAL
========================================================= */

function initializeSurprise() {

    const openButton =
        document.getElementById("openSurprise");

    const replayButton =
        document.getElementById("replaySurprise");

    const intro =
        document.getElementById("surpriseIntro");

    const reveal =
        document.getElementById("surpriseReveal");

    const page =
        document.querySelector(".surprise-page");

    const particleContainer =
        document.getElementById("revealParticles");


    if (
        !openButton ||
        !replayButton ||
        !intro ||
        !reveal ||
        !page
    ) {

        return;

    }


    function createParticles() {

        if (!particleContainer) {
            return;
        }


        particleContainer.innerHTML = "";


        const symbols = [
            "♡",
            "✦",
            "✧",
            "·"
        ];


        for (
            let i = 0;
            i < 28;
            i++
        ) {

            const particle =
                document.createElement("span");


            particle.className =
                "reveal-particle";


            particle.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            particle.style.left =
                Math.random() * 100 + "%";


            particle.style.setProperty(
                "--duration",
                (4 + Math.random() * 5) + "s"
            );


            particle.style.setProperty(
                "--delay",
                Math.random() * 1.5 + "s"
            );


            particle.style.setProperty(
                "--drift",
                ((Math.random() - .5) * 180) + "px"
            );


            particle.style.fontSize =
                (8 + Math.random() * 14) + "px";


            particleContainer.appendChild(
                particle
            );

        }

    }


    function openReveal() {

        page.classList.add(
            "revealing"
        );


        intro.classList.add(
            "hidden"
        );


        createParticles();


        setTimeout(() => {

            reveal.classList.add(
                "active"
            );

        }, 650);


        setTimeout(() => {

            page.classList.remove(
                "revealing"
            );

        }, 1500);

    }


    function replayReveal() {

        reveal.classList.remove(
            "active"
        );


        if (particleContainer) {

            particleContainer.innerHTML =
                "";

        }


        setTimeout(() => {

            intro.classList.remove(
                "hidden"
            );

        }, 500);

    }


    openButton.addEventListener(
        "click",
        openReveal
    );


    replayButton.addEventListener(
        "click",
        replayReveal
    );

}