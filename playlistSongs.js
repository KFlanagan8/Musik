let playlists = JSON.parse(localStorage.getItem("playlists")) || {};

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const playlistName = urlParams.get("playlist");

  if (!playlistName) {
    document.getElementById("songList").innerHTML =
      "<p>PLAYLIST NOT FOUND.</p>";
    return;
  }

  document.getElementById(
    "playlistTitle"
  ).textContent = `PLAYLIST: ${playlistName}`;

  let songs = playlists[playlistName] || [];

  let songListContainer = document.getElementById("songList");
  songListContainer.innerHTML = "";

  const backButton = document.getElementById("backToPlaylists");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "list.html";
    });
  }
  if (songs.length === 0) {
    songListContainer.innerHTML = "<p>No Songs In This Playlist.</p>";
    return;
  }

  loadPlaylists(playlistName);
});
//------------HELPER FUNCTIONS--------------------------------------------

function removeSongFromPlaylist(playlistName, index) {
  let playlists = JSON.parse(localStorage.getItem("playlists")) || {};

  if (!playlists[playlistName]) return;

  if (confirm("Are you sure you want to delete song from playlist?")) {
    playlists[playlistName].splice(index, 1);

    localStorage.setItem("playlists", JSON.stringify(playlists)) || {};

    loadPlaylists(playlistName);
  }
}

function loadPlaylists(playlistName) {
  let songListContainer = document.getElementById("songList");
  songListContainer.innerHTML = "";

  let playlists = JSON.parse(localStorage.getItem("playlists")) || {};
  let songs = playlists[playlistName] || [];

  if (songs.length === 0) {
    songListContainer.innerHTML = "<p>NO SONGS IN THIS PLAYLIST.</p>";
    return;
  }
  songs.forEach((song, index) => {
    let songElement = document.createElement("div");
    songElement.classList.add("playlist-item");
    songElement.innerHTML = `
    <img src="${song.image}" alt="${song.name}" class="playlist-img">
    <div class="playlist-info">
        <p><strong>${song.name}</strong></p>
        <p>${song.artist}</p>
    </div>
    <div id="playlistBtns">
      <div class="play-btn" onclick="playSongFromList('${song.url}', '${song.name}', '${song.artist}', '${song.image}', '${playlistName}')">
          <i class="fa fa-play-circle fa-3x"></i>
      </div>
      <div id="trashCan" onclick="removeSongFromPlaylist('${playlistName}', ${index})">
        <i class="fa fa-trash"></i>
      </div>
    </div>
  `;

    songListContainer.appendChild(songElement);
  });
}

function playSongFromList(url, name, artist, image, playlistName) {
  let song = {
    previewUrl: url,
    trackName: name,
    artistName: artist,
    artworkUrl100: image,
  };

  let playlists = JSON.parse(localStorage.getItem("playlists")) || {};

  let songsInPlaylist = playlists[playlistName] || [];

  let formattedSongs = songsInPlaylist.map((songOnList) => ({
    previewUrl: songOnList.url,
    trackName: songOnList.name,
    artistName: songOnList.artist,
    artworkUrl100: songOnList.image,
  }));

  localStorage.setItem("playlistSong", JSON.stringify(song));
  localStorage.setItem("playlistQueue", JSON.stringify(formattedSongs));

  window.location.href = "music.html";
}
