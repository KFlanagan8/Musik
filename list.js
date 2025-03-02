let container = document.getElementById("playlistList");
let backToMusicPlayer = document.getElementById("link");
let playlistContainer = document.getElementById("playlistContainer");
let playlists = JSON.parse(localStorage.getItem("playlists")) || {};

//===========BACK BUTTON======================================================
backToMusicPlayer.addEventListener("click", () => {
  window.location.href = "music.html";
});
//=================================================================

function loadPlaylistNames() {
  container.innerHTML = "";

  let playlists = JSON.parse(localStorage.getItem("playlists")) || {};

  if (Object.keys(playlists).length === 0) {
    container.innerHTML = "<p>No playlists available.</p>";
    return;
  }

  Object.keys(playlists).forEach((playlistName) => {
    let playListElement = document.createElement("button");
    playListElement.classList.add("playlist-name");

    playListElement.innerHTML = `
    <div id="nameOfPlaylist">
       <p>${playlistName}</p>
    </div>
    <div class="trash">
      <i class="fa fa-trash"></i>
    </div>
    `;

    playListElement.addEventListener("click", () => {
      window.location.href = `playlistSongs.html?playlist=${encodeURIComponent(
        playlistName
      )}`;
    });

    container.appendChild(playListElement);

    let trashButton = playListElement.querySelector(".trash");
    trashButton.addEventListener("click", (event) => {
      event.stopPropagation();
      removePlaylist(playlistName);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  playlists = JSON.parse(localStorage.getItem("playlists")) || {};
  console.log("Loaded playlists:", playlists);
  loadPlaylistNames();
});

function loadPlaylists(playlistName) {
  let playlists = JSON.parse(localStorage.getItem("playlists")) || {};

  playlistContainer.innerHTML = "";

  playlists[playlistName].forEach((song, index) => {
    let songElement = document.createElement("div");
    songElement.classList.add("playlist-item");

    playlistContainer.appendChild(songElement);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPlaylistNames();
  let playlists = JSON.parse(localStorage.getItem("playlists")) || {};
  let firstPlaylist = Object.keys(playlists)[0];
  if (firstPlaylist) {
    loadPlaylists(firstPlaylist);
  }
});

document.addEventListener("playlistsUpdated", () => {
  loadPlaylistNames();
});
//===========CREATE/ADD PLAYLIST======================================================
function addToPlaylist(playlistName, song) {
  let playlists = JSON.parse(localStorage.getItem("playlists")) || {};

  if (!playlists[playlistName]) {
    playlists[playlistName] = [];
  }

  playlists[playlistName].push(song);
  localStorage.setItem("playlists", JSON.stringify(playlists));

  playlistContainer.innerHTML = "";
  loadPlaylists(playlistName);
}

function createPlaylist() {
  let playlistName = prompt("Enter new playlist name: ");
  if (playlistName) {
    let playlists = JSON.parse(localStorage.getItem("playlists")) || [];

    if (typeof playlists !== "object" || Array.isArray(playlists)) {
      console.error("Fixing corrupted playlists format...");
      playlists = {};
    }

    if (!playlists[playlistName]) {
      playlists[playlistName] = [];
      localStorage.setItem("playlists", JSON.stringify(playlists));
      loadPlaylistNames();
    } else {
      alert("Playlist Already Exists!");
    }
  }
}

function savePlaylists() {
  if (typeof playlists !== "object" || Array.isArray(playlists)) {
    playlists = {};
  }

  console.log("Saving Playlists:", playlists);
  localStorage.setItem("playlists", JSON.stringify(playlists));
  console.log("Saved Playlists:", localStorage.getItem("playlists"));
}

function selectPlaylistForSong(songName, artist, url, image) {}

//===========REMOVE SONG======================================================

function removeSongFromList(playlistName, index) {
  if (playlists[playlistName]) {
    playlists[playlistName].splice(index, 1);
    localStorage.setItem("playlists", JSON.stringify(playlists));
    loadPlaylists(playlistName);
  }
}

function removePlaylist(playlistName) {
  if (
    confirm(`Are you sure you want to delete the playlist "${playlistName}"?`)
  ) {
    localStorage.setItem("playlists", JSON.stringify(playlists)); // Update storage=
    delete playlists[playlistName]; // Remove the playlist
    savePlaylists();
    loadPlaylistNames(); // Refresh the UI
  }
}
//===========REMOVE SONG======================================================
