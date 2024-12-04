// creating a function that updates the list of known favorites in local storage
function updateFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));

  //legt einen benannten Eintrag an oder ersetzt
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")); //retrieve entry name favorites from local storage localStorage.getItem(favorites);
}

//function to handle movie note updates
function updateMovieNote(movieID, notetext) {
  const favorites = getFavorites(); // Aufrufen einer Funktion
  const movie = favorites[movieID]; //first parameter in the object favorites, retrieve object named in movieID from favorites
  movie.notetext = notetext; //set a property named notetext
  updateFavorites(favorites); //call function updateFavorites with value named favorites
}
