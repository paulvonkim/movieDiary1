// creating a function that updates the list of known favorites in local storage
function updateFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));

  //legt einen benannten Eintrag an oder ersetzt
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")); //retrieve entry name favorites from local storage localStorage.getItem(favorites);
}

function getFavoriteById(favorites, id) {
  return favorites.find((movie) => movie !== null && movie.id === id); //find looks for first entry in an array of favorites that corresponds to a certain criteria
}

function removeFavoriteById(id) {
  //look at entries of favorites and search the first entry that corresponds my criteria and return index or posision in an array
  //criteria is movie.id === id
  const favorites = getFavorites(); // Aufrufen einer Funktion
  const index = favorites.findIndex(
    (movie) => movie !== null && movie.id === id
  );
  favorites.splice(index, 1);
  updateFavorites(favorites);
}

//function to handle movie note updates
function updateMovieNoteById(id, notetext) {
  const favorites = getFavorites(); // Aufrufen einer Funktion
  const movie = getFavoriteById(favorites, id); //first parameter in the object favorites, retrieve object named in movieID from favorites
  movie.notetext = notetext; //set a property named notetext
  updateFavorites(favorites); //call function updateFavorites with value named favorites
}
