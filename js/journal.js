//added DOM

document.addEventListener("DOMContentLoaded", () => {
  const favoritesList = document.getElementById("favorites-list");

  // creating a function that updates the list of known favorites in local storage
  function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || []; //added a code
    //legt einen benannten Eintrag an oder ersetzt
  }

  // Create a movie card
  function createMovieCard(movie) {
    const card = document.createElement("div");
    card.classList.add(
      "bg-gray-800",
      "rounded-lg",
      "shadow-lg",
      "overflow-hidden",
      "relative",
      "flex",
      "flex-col",
      "h-full"
    );
    card.setAttribute("data-movie-id", movie.id);

    const movieImage = document.createElement("img");
    movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    movieImage.alt = movie.title;
    movieImage.classList.add("w-full", "h-64", "object-cover");
    card.appendChild(movieImage);

    const movieInfo = document.createElement("div");
    movieInfo.classList.add("p-4", "flex", "flex-col", "flex-grow");

    const movieTitle = document.createElement("h3");
    movieTitle.textContent = movie.title;
    movieTitle.classList.add("text-lg", "font-semibold", "mb-2", "text-white");
    movieInfo.appendChild(movieTitle);

    const movieRating = document.createElement("p");
    movieRating.textContent = `Rating: ${movie.vote_average}`;
    movieRating.classList.add("text-gray-400", "mb-2");
    movieInfo.appendChild(movieRating);

    // Add favorite button with heart icon
    const favBtn = document.createElement("button");
    favBtn.classList.add(
      "absolute",
      "top-2",
      "right-2",
      "text-gray-400",
      "hover:text-red-500",
      "transition"
    );
    favBtn.innerHTML = `<i class="fas fa-heart"></i>`;
    if (isFavorite(movie.id)) {
      favBtn.classList.add("text-red-500");
    }

    favBtn.addEventListener("click", () => {
      toggleFavorite(movie, favBtn);
    });

    card.appendChild(favBtn);

    // Add note button
    const noteBtn = document.createElement("button");
    noteBtn.classList.add(
      "mt-auto",
      "bg-teal-500",
      "text-white",
      "px-4",
      "py-2",
      "rounded-md",
      "transition",
      "self-start"
    );
    const note = getNoteForMovie(movie.id);
    noteBtn.textContent = note ? "View Note" : "Create Note";
    noteBtn.addEventListener("click", () => {
      createNotePopup(movie.id, noteBtn);
    });

    movieInfo.appendChild(noteBtn);
    card.appendChild(movieInfo);

    favoritesList.appendChild(card);
  }
  //note button color changes

  const CREATE_NOTE_COLOR = "bg-teal-500";
  const VIEW_NOTE_COLOR = "bg-blue-500";

  // Check if a movie is in favorites
  function isFavorite(movieId) {
    const favorites = getFavorites();
    return favorites.some((fav) => fav.id === movieId);
  }

  // Toggle favorite status
  function toggleFavorite(movie, favBtn) {
    let favorites = getFavorites();

    if (isFavorite(movie.id)) {
      // Remove from favorites
      favorites = favorites.filter((fav) => fav.id !== movie.id);
      favBtn.classList.remove("text-red-500"); // Update the heart color
    } else {
      // Add to favorites
      favorites.push(movie);
      favBtn.classList.add("text-red-500"); // Update the heart color
    }

    // Update localStorage immediately
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  // Get note for a movie
  function getNoteForMovie(movieId) {
    const notes = JSON.parse(localStorage.getItem("movieNotes")) || {};
    return notes[movieId];
  }

  // Create a note popup
  function createNotePopup(movieId, noteBtn) {
    const existingNote = getNoteForMovie(movieId);

    const notePopup = document.createElement("div");
    notePopup.classList.add(
      "fixed",
      "top-0",
      "left-0",
      "w-full",
      "h-full",
      "bg-gray-800",
      "bg-opacity-50",
      "flex",
      "justify-center",
      "items-center"
    );
    notePopup.innerHTML = `
          <div class="bg-gray-900 p-6 rounded-lg w-96">
              <h3 class="text-xl font-semibold mb-4">Movie Note</h3>
              <textarea id="note-text" class="w-full h-32 p-2 bg-gray-700 text-white rounded-lg" placeholder="Write a note...">${
                existingNote || ""
              }</textarea>
              <button id="save-note" class="mt-4 bg-teal-500 text-white px-4 py-2 rounded-md">Save Note</button>
              <button id="close-popup" class="mt-2 bg-red-500 text-white px-4 py-2 rounded-md">Close</button>
          </div>
      `;

    document.body.appendChild(notePopup);

    document.getElementById("save-note").addEventListener("click", () => {
      const noteText = document.getElementById("note-text").value;
      saveNoteForMovie(movieId, noteText);

      // Update the note button immediately based on the note
      noteBtn.textContent = noteText.trim() ? "View Note" : "Create Note";

      // Close the note popup
      document.body.removeChild(notePopup);
    });

    document.getElementById("close-popup").addEventListener("click", () => {
      document.body.removeChild(notePopup);
    });
  }

  // Save a note for a movie
  function saveNoteForMovie(movieId, noteText) {
    let notes = JSON.parse(localStorage.getItem("movieNotes")) || {};
    if (noteText.trim() === "") {
      delete notes[movieId]; // Remove the note if it's empty
    } else {
      notes[movieId] = noteText.trim();
    }
    localStorage.setItem("movieNotes", JSON.stringify(notes));
  }

  // Load favorites from localStorage
  const favorites = getFavorites(); // Aufrufen einer Funktion
  favorites.forEach((movie) => createMovieCard(movie));
});
