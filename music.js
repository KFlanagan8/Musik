const body = document.getElementById("body");
const audio = document.getElementById("audio-player");
const playingSong = document.getElementById("track-name");
const artist = document.getElementById("track-artist");
const songArt = document.getElementById("track-art");
const playPauseBtn = document.getElementById("playButton");
const backBtn = document.getElementById("prev-track");
const forwardBtn = document.getElementById("next-track");
const title = document.getElementById("now-playing");
const plusBtn = document.getElementById("addSong");
const shuffleBtn = document.getElementById("shuffle");

const currTime = document.getElementById("current-time");
const totalTime = document.getElementById("total-duration");
const seekSlider = document.getElementById("seek-slider");
const volumeSlider = document.getElementById("volume-slider");

const searchResults = document.getElementById("searchResults");
const searchBar = document.getElementById("searchBar");
const searchBtn = document.getElementById("searchBtn");

//----------------------------------------------------------------------
let updateSeekBar;
let updateTotalTime;
let updateInterval;

let songList = [];
let currentIndex = 0;

let playedSongs = [];
let allSongs = [];
//------------FOR PHONE USERS----------------------------------------------------------
playPauseBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  playBtn();
});

//------------PLAY BUTTON----------------------------------------------------------
function playBtn() {
  if (!audio.src) {
    getRandomSong();
    return;
  }
  if (audio.paused) {
    audio.play();
    console.log("playing");

    playPauseBtn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
    intervals();
  } else {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
    clearInterval(updateInterval);
  }
}

document.addEventListener("keydown", function (event) {
  const activeElement = document.activeElement;

  if (event.key === " ") {
    if (
      activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA"
    ) {
      return;
    }

    event.preventDefault();

    playBtn();
  }
});
//------------NEXT BUTTONS------------------------------------------------------------------
function nextSong() {
  if (currentIndex < songList.length - 1) {
    currentIndex++;
  } else {
    getRandomSong();
    return;
  }

  loadSong(songList[currentIndex]);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") {
    nextSong();
  }
});
//------------------------------------------------------------------------------------------
let song = songList[currentIndex];
//------------PREV BUTTONS------------------------------------------------------------------

function prevSong() {
  if (currentIndex > 0) {
    currentIndex--;
    loadSong(songList[currentIndex]);
  } else {
    alert("No previous song available");
    return;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    prevSong();
  }
});
//----------LOAD SONG FUNCTION----------------------------------------
function loadSong(song) {
  if (!song) return;

  let newIndex = songList.findIndex((s) => s.previewUrl === song.previewUrl);
  if (newIndex !== -1) {
    currentIndex = newIndex;
  }

  if (audio.src !== song.previewUrl) {
    audio.pause();
    audio.src = song.previewUrl;
    audio.load();
  }

  playingSong.innerHTML = song.trackName;
  artist.innerHTML = song.artistName;
  songArt.innerHTML = `<img src="${song.artworkUrl100}" alt="${song.trackName}" id="album-art">`;
  title.innerHTML = "Now Playing: ";

  audio.onloadedmetadata = () => {
    seekSlider.max = audio.duration;
    totalTime.textContent = formatTime(audio.duration);
    audio.play();
    playPauseBtn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
    isLoading = false;
  };

  randomBackgroundColor();
  //----------AUTO PLAY FEATURE------------------------------------------------------------
  audio.onended = () => {
    if (currentIndex < songList.length - 1) {
      currentIndex++;
      loadSong(songList[currentIndex]);
    } else {
      getRandomSong();
      audio.currTime = 0;
    }
  };
}
//----------API GETTER------------------------------------------------------------
async function getRandomSong(query) {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        query
      )}&media=music&limit=1000&genre=18`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );
    const data = await response.json();

    if (data.results.length > 0) {
      const randomIdx = Math.floor(Math.random() * data.results.length);
      const song = data.results[randomIdx];

      songList.push(song);
      currentIndex = songList.length - 1;
      intervals();

      loadSong(song);
    } else {
      console.error("No song found.");
    }
  } catch (error) {
    console.error("Error fetching song:", error);
  }
}
//-----------SEARCH FEATURES--------------------------
async function searchSongs(query) {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        query
      )}&media=music&limit=1000&genre=18`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );
    const data = await response.json();

    if (data.results.length > 0) {
      displaySearchResults(data.results);
    } else {
      alert("Must Enter A Song!");
    }
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

function displaySearchResults(results) {
  const resultsContainer = searchResults;
  resultsContainer.innerHTML = "";

  if (results.length === 0) {
    resultsContainer.style.display = "none";
    return;
  }

  results.forEach((song, index) => {
    const songItem = document.createElement("div");
    songItem.classList.add("search-item");
    songItem.innerHTML = `
      <img src="${song.artworkUrl100}" alt="${song.trackName}" />
      <div class="song-info">
        <p><strong>${song.trackName}</strong></p>
        <p>${song.artistName}</p>
      </div>
      <div class="play-btn" onclick="loadSongFromSearch(${index})">
        <i class="fa fa-play-circle fa-3x"></i>
      </div>
     
    `;
    resultsContainer.appendChild(songItem);
  });
  resultsContainer.style.display = "flex";
  window.seachResults = results;
}

function loadSongFromSearch(index) {
  const song = window.seachResults[index];
  if (song) {
    loadSong(song);
    hideSearchResults();
  }

  songList.push(song);
  currentIndex = songList.length - 1;

  playPauseBtn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
  intervals();
}

function handleSearch() {
  const query = searchBar.value.trim();
  if (query) {
    searchSongs(query);
  } else {
    alert("Please enter a search term!");
  }
}
//------SEARCH EVENT LISTENERS--------------------
// Search by clicking the search button
searchBtn.addEventListener("click", function () {
  const query = searchBar.value.trim();
  if (query) {
    searchSongs(query);
  }
});
// Search by hitting Enter key
searchBar.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const query = searchBar.value.trim();
    if (query) {
      searchSongs(query);
    } else {
      alert("Please enter a search term!");
    }
  }
});

searchBtn.addEventListener("touchstart", function (event) {
  handleSearch();
});

searchBtn.addEventListener("click", handleSearch);

//--------HIDING SEARCH RESULTS--------------------------
function hideSearchResults() {
  const resultsContainer = searchResults;
  resultsContainer.innerHTML = "";
  resultsContainer.style.display = "none";
}

document.addEventListener("click", function (event) {
  if (
    searchResults.style.display === "flex" &&
    !searchResults.contains(event.target) &&
    event.target !== searchBar &&
    event.target !== searchBtn
  ) {
    hideSearchResults();
  }
});
//----------FAVORITES FUNCS------------------------------------------------------------
function addToFavorites(song) {
  if (!song || !song.id) {
    alert("Must have song picked to add to favorites!");
    return;
  }
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.some((fav) => fav.id === song.id)) {
    favorites.push(song);
    alert("added to favorites");
    localStorage.setItem("favorites", JSON.stringify(favorites));
    document.dispatchEvent(new Event("favoritesUpdated"));
  } else {
    alert("Song is already in favorites.  ");
  }
}

//----------PLAY FAVORITE SONG------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  let savedSong = localStorage.getItem("selectedSong");
  let savedFavorites = localStorage.getItem("favoriteQueue");

  if (savedSong) {
    let song = JSON.parse(savedSong);
    let favoriteSongs = savedFavorites ? JSON.parse(savedFavorites) : [];

    favoriteSongs.forEach((favSong) => {
      let formattedSong = {
        previewUrl: favSong.previewUrl || favSong.url,
        trackName: favSong.trackName || favSong.name,
        artistName: favSong.artistName || favSong.artist,
        artworkUrl100: favSong.artworkUrl100 || favSong.image,
      };

      let exists = songList.some((s) => s.previewUrl === favSong.previewUrl);
      if (!exists) {
        songList.push(formattedSong);
      }
    });

    let selectedIndex = songList.findIndex(
      (s) => s.previewUrl === song.previewUrl
    );

    if (selectedIndex === -1) {
      songList.push(song);
      currentIndex = songList.length - 1;
    } else {
      currentIndex = selectedIndex;
    }

    intervals();

    loadSong(song);

    localStorage.removeItem("selectedSong");
    localStorage.removeItem("favoriteQueue");

    favoritesAutoPlay();
  }
});

function favoritesAutoPlay() {
  let audioPlayer = audio;

  audioPlayer.onended = function () {
    console.log(
      "Song ended. Current index before increment:",
      currentIndex,
      "Song list length:",
      songList.length
    );

    currentIndex++;

    if (currentIndex >= songList.length) {
      alert("No more favorites on the list. Will now play random songs.");
      console.log("Switching to random songs.");
      getRandomSong();
      return;
    }

    // Otherwise, move to the next song
    console.log("After increment: Current index:", currentIndex);
    loadSong(songList[currentIndex]);
    audioPlayer.onended = arguments.callee;
  };
}
//---------------------------------------------------------------------------------
function getCurrentSong() {
  return {
    id: audio.src,
    name: playingSong.innerText,
    artist: artist.innerText,
    image: songArt.querySelector("img")?.src || "",
    url: audio.src,
  };
}
//----------PLAYLIST FUNCS------------------------------------------------------------
function addToPlaylist(song) {
  if (!song || !song.id) {
    alert("Must have song picked to add to playlist.");
    return;
  }

  let playlists = JSON.parse(localStorage.getItem("playlists")) || {};
  let playlistName = prompt("Enter playlist name to add song to: ");

  if (!playlistName) return;

  if (!playlists[playlistName]) {
    playlists[playlistName] = [];
  }

  if (!playlists[playlistName].some((s) => s.id === song.id)) {
    playlists[playlistName].push(song);
    localStorage.setItem("playlists", JSON.stringify(playlists));
    alert(`"${song.name}" added to ${playlistName}!`);

    document.dispatchEvent(new Event("playlistUpdated"));
  } else {
    alert("Song Already In Playlist.");
  }
}

//----------PLAY PLAYLIST SONG------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  let savedPlaylistSong = localStorage.getItem("playlistSong");
  let playlistQueue = localStorage.getItem("playlistQueue");

  if (savedPlaylistSong) {
    let songFromList = JSON.parse(savedPlaylistSong);
    let playlistSong = savedPlaylistSong ? JSON.parse(playlistQueue) : [];

    playlistSong.forEach((listSong) => {
      let formattedPlaylistSong = {
        previewUrl: listSong.previewUrl || listSong.url,
        trackName: listSong.trackName || listSong.name,
        artistName: listSong.artistName || listSong.artist,
        artworkUrl100: listSong.artworkUrl100 || listSong.image,
      };

      let exists = songList.some((s) => s.previewUrl === listSong.previewUrl);
      if (!exists) {
        songList.push(formattedPlaylistSong);
      }
    });

    let selectedIndex = playlistSong.findIndex(
      (s) => s.previewUrl === songFromList.previewUrl
    );

    if (selectedIndex === -1) {
      playlistSong.push(songFromList);
      currentIndex = songList.length - 1;
    } else {
      currentIndex = selectedIndex;
    }

    intervals();

    loadSong(songFromList);

    localStorage.removeItem("playlistSong");
    localStorage.removeItem("playlistQueue");

    playlistAutoPlay();
  }
});

function playlistAutoPlay() {
  let audioPlayer = audio;

  audioPlayer.onended = function () {
    console.log(
      "Song ended. Current index before increment:",
      currentIndex,
      "Song list length:",
      songList.length
    );

    currentIndex++;

    if (currentIndex >= songList.length) {
      alert("No more songs on the playlist. Will now play random songs.");
      console.log("Switching to random songs.");
      getRandomSong();
      return;
    }

    // Otherwise, move to the next song
    console.log("After increment: Current index:", currentIndex);
    loadSong(songList[currentIndex]);
    audioPlayer.onended = arguments.callee;
  };
}
//----------SEEK/TIME BARS------------------------------------------------------------
function formatTime(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

function updateSeek() {
  seekSlider.value = audio.currentTime;
  currTime.textContent = formatTime(audio.currentTime);
}

function updateTime() {
  let remainingTime = audio.duration - audio.currentTime;
  totalTime.textContent = formatTime(remainingTime);
}

seekSlider.oninput = function () {
  audio.currentTime = seekSlider.value;
  currTime.textContent = formatTime(audio.currentTime);
  updateSeek();
};

function intervals() {
  updateInterval = setInterval(() => {
    updateSeek();
    updateTime();
  }, 100);
}
//---------------VOLUME-------------------------------------------------------
function volume() {
  audio.volume = volumeSlider.value / 100;

  volumeSlider.addEventListener("input", function () {
    audio.volume = this.value / 100;
  });
}

//------------BACKGROUND COLOR EFFECTS------------------------------------------------------------------------
function randomBackgroundColor() {
  let r = Math.floor(Math.random() * 256); // Red (0-255)
  let g = Math.floor(Math.random() * 256); // Green (0-255)
  let b = Math.floor(Math.random() * 256); // Blue (0-255)
  document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const bgColor = localStorage.getItem("bgColor");

    if (bgColor) {
      document.body.style.transition = "background-color 2s ease-in-out";
      document.body.style.backgroundColor = bgColor;
    }
  }, 100);
});

let isShuffle = false;
let originalSongList = [...songList];

function shuffleSongs() {
  if (!isShuffle) {
    isShuffle = true;
    shuffleBtn.style.color = "lightBlue";

    for (let i = songList.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [songList[i], songList[j]] = [songList[j], songList[i]];
    }
  } else {
    isShuffle = false;
    shuffleBtn.style.color = "black";
    songList = originalSongList;
  }
}
