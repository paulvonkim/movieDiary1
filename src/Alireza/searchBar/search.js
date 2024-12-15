import { fetchMovies } from "./api.js";

export const setupSearch = (form, input, movieGrid) => {
  // Function to handle favorites
  const getFavorites = () =>
    JSON.parse(localStorage.getItem("favorites")) || [];
  const isFavorite = (movieId) =>
    getFavorites().some((fav) => fav.id === movieId);
  const toggleFavorite = (movie, favBtn) => {
    let favorites = getFavorites();

    if (isFavorite(movie.id)) {
      // Remove from favorites
      favorites = favorites.filter((fav) => fav.id !== movie.id);
      favBtn.classList.remove("text-red-500"); // Update the heart color
      favBtn.classList.add("text-gray-400");
    } else {
      // Add to favorites
      favorites.push(movie);
      favBtn.classList.add("text-red-500"); // Update the heart color
      favBtn.classList.remove("text-gray-400");
    }

    // Update localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = input.value.trim();
    if (!query) {
      alert("Please enter a search term!");
      return;
    }

    movieGrid.innerHTML = "<p>Loading...</p>";

    try {
      const data = await fetchMovies(query);

      if (!data.results || data.results.length === 0) {
        movieGrid.innerHTML = "<p>No results found!</p>";
        return;
      }

      movieGrid.innerHTML = "";

      data.results.forEach((movie) => {
        const poster = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://via.placeholder.com/500x750?text=No+Image";

        const movieElement = document.createElement("div");
        movieElement.className =
          "bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col items-center m-4 relative";

        // Add the movie poster and details
        movieElement.innerHTML = `
          <img src="${poster}" alt="${movie.title}" class="w-full h-64 object-cover" />
          <div class="p-4">
            <h3 class="text-lg font-semibold text-white">${movie.title}</h3>
            <p class="text-gray-400">Rating: ${movie.vote_average}</p>
          </div>
        `;

        // Create a small favorite heart button
        const favBtn = document.createElement("button");
        favBtn.className =
          "absolute bottom-2 right-2 text-gray-400 hover:text-red-500 transition text-xl";
        favBtn.innerHTML = `<i class="fas fa-heart"></i>`; // Small heart icon

        // Check if already a favorite
        if (isFavorite(movie.id)) {
          favBtn.classList.add("text-red-500");
        }

        // Add click event to toggle favorite
        favBtn.addEventListener("click", () => toggleFavorite(movie, favBtn));
        movieElement.appendChild(favBtn);

        movieGrid.appendChild(movieElement);
      });
    } catch (error) {
      movieGrid.innerHTML = `<p>An error occurred: ${error.message}</p>`;
    }
  });
};
