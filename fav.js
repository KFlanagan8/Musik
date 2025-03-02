//------------BACK BUTTON---------------------------------------------------------
const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", () => {
  window.location.href = "music.html";
});
//------------LOAD SONG---------------------------------------------------------
function loadFavorites() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let container = document.getElementById("favorites");
  container.innerHTML = "";

  favorites.forEach((song, index) => {
    let songElement = document.createElement("div");
    songElement.classList.add("favorite-item");
    songElement.innerHTML = `
            <img src="${song.image}" alt="${song.name}" class="fav-img">
            <div class="fav-info">
                <p><strong>${song.name}</strong></p>
                <p>${song.artist}</p>
            </div>
            <div id="favBtns">
            <div class="play-btn" onclick="playFavoriteSong('${song.url}', '${song.name}', '${song.artist}', '${song.image}')">
                <i class="fa fa-play-circle fa-3x"></i>
            </div>
            <div id="trash" onclick="removeSongFromList(${index})">
            <i class="fa-solid fa-trash"></i>
            </div>
            </div>
        `;
    container.appendChild(songElement);
  });
}

document.addEventListener("DOMContentLoaded", loadFavorites);
document.addEventListener("favoritesUpdated", loadFavorites);
//------------PLAY SONG---------------------------------------------------------
function playFavoriteSong(url, name, artist, image) {
  let song = {
    previewUrl: url,
    trackName: name,
    artistName: artist,
    artworkUrl100: image,
  };

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  let formattedFavorites = favorites.map((fav) => ({
    previewUrl: fav.url,
    trackName: fav.name,
    artistName: fav.artist,
    artworkUrl100: fav.image,
  }));

  localStorage.setItem("selectedSong", JSON.stringify(song));
  localStorage.setItem("favoriteQueue", JSON.stringify(formattedFavorites));

  let randomColor = getRandomColor();
  localStorage.setItem("bgColor", randomColor);

  window.location.href = "music.html";
}
//-----------REMOVE SONG--------------------------------------

function removeSongFromList(index) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (index >= 0 && index < favorites.length) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
  } else {
    console.log("Invalid Index: ", index);
  }

  alert("Song has been deleted.");
}
//-----------COLOR--------------------------------------
function getRandomColor() {
  let r = Math.floor(Math.random() * 256); // Red (0-255)
  let g = Math.floor(Math.random() * 256); // Green (0-255)
  let b = Math.floor(Math.random() * 256); // Blue (0-255)

  return `rgb(${r}, ${g}, ${b})`;
}
