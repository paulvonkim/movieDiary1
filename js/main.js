const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNjhhODEyNWFjM2JmMmNlOGIzNzE0NWRlNGI3NzZjMiIsIm5iZiI6MTczMzE1NDM2Mi4xOTgwMDAyLCJzdWIiOiI2NzRkZDYzYTA1YWYxMDAxNWZiODQ0OGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.wDJPDhA6FadKoAJxohE13cB9BISD1In84Z0LjenSQtU",
  },
};

const url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";

let carouselMovies;

document.addEventListener("DOMContentLoaded", () => {
  const carouselWrapper = document.getElementById("carousel-wrapper");
  const movieGrid = document.getElementById("movie-grid");

  const showItem = (index) => {
    const carouselItems = carouselWrapper.querySelectorAll(
      "[data-carousel-item]"
    );
    carouselItems.forEach((item, i) => {
      item.classList.toggle("hidden", i !== index);
    });
  };

  let currentIndex = 0;

  document.getElementById("carousel-prev").addEventListener("click", () => {
    currentIndex =
      currentIndex > 0 ? currentIndex - 1 : carouselWrapper.children.length - 1;
    showItem(currentIndex);
  });

  document.getElementById("carousel-next").addEventListener("click", () => {
    currentIndex =
      currentIndex < carouselWrapper.children.length - 1 ? currentIndex + 1 : 0;
    showItem(currentIndex);
  });

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.results) {
        throw new Error("No results found");
      }
      const movies = data.results;
      // Fetch the top 5 movies for the carousel
      carouselMovies = movies.slice(0, 5);
      carouselMovies.forEach((movie) => {
        const carouselElement = document.createElement("div");
        carouselElement.classList.add("hidden", "duration-700", "ease-in-out");
        carouselElement.setAttribute("data-carousel-item", "");
        const carouselImage = document.createElement("img");
        carouselImage.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
        carouselImage.classList.add(
          "absolute",
          "block",
          "w-full",
          "h-full",
          "object-cover",
          "top-0",
          "left-0"
        );
        carouselImage.alt = "...";
        carouselElement.appendChild(carouselImage);
        carouselWrapper.appendChild(carouselElement);
      });

      movies.forEach((movie) => {
        const movieElement = document.createElement("div");
        movieElement.classList.add(
          "bg-[#22252E]",
          "rounded-lg",
          "shadow-lg",
          "overflow-hidden",
          "relative",
          "flex",
          "flex-col",
          "transition",
          "transform",
          "hover:scale-105",
          "hover:shadow-2xl",
          "m-[20px]",
          "mb-[20px]"
        );

        const movieImage = document.createElement("img");
        movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieImage.classList.add("w-full", "h-64", "object-cover");
        movieElement.appendChild(movieImage);

        const movieInfo = document.createElement("div");
        movieInfo.classList.add(
          "p-4",
          "flex-grow",
          "flex",
          "flex-col",
          "justify-between"
        );

        const movieTitle = document.createElement("h3");
        movieTitle.textContent = movie.title;
        movieTitle.classList.add(
          "text-lg",
          "font-semibold",
          "mb-2",
          "text-white"
        );
        movieInfo.appendChild(movieTitle);

        const movieRating = document.createElement("p");
        movieRating.textContent = `Rating: ${movie.vote_average}`;
        movieRating.classList.add("text-white", "mb-2");
        movieInfo.appendChild(movieRating);

        // Fetch movie details to get runtime
        fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`,
          options
        )
          .then((response) => response.json())
          .then((details) => {
            const movieLength = document.createElement("p");
            movieLength.textContent = `Length: ${details.runtime} mins`;
            movieLength.classList.add("text-white", "mb-2");
            movieInfo.appendChild(movieLength);
          });

        movieElement.appendChild(movieInfo);

        const favBtnContainer = document.createElement("div");
        favBtnContainer.classList.add("absolute", "bottom-3", "right-2");

        const favBtn = document.createElement("button");
        favBtn.innerHTML = '<i class="fas fa-heart"></i>';
        favBtn.classList.add("text-white", "hover:text-red-500", "transition");

        // Adding Movies to Favorites
        // Check if the movie is already in favorites
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (favorites.some((fav) => fav.id === movie.id)) {
          favBtn.classList.add("text-red-500");
        }

        // Add or remove from favorites when the button is clicked with event listener
        favBtn.addEventListener("click", () => {
          const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
          if (favBtn.classList.contains("text-red-500")) {
            // Remove from favorites
            const newFavorites = favorites.filter((fav) => fav.id !== movie.id);
            localStorage.setItem("favorites", JSON.stringify(newFavorites));
            favBtn.classList.remove("text-red-500");
            favBtn.classList.add("text-white");
          } else {
            // Add to favorites
            favorites.push(movie);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            favBtn.classList.remove("text-white");
            favBtn.classList.add("text-red-500");
          }
        });

        favBtnContainer.appendChild(favBtn);
        movieElement.appendChild(favBtnContainer);
        movieGrid.appendChild(movieElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching popular movies:", error);
    });
});

// -------------------------------------------------
// To the Top
$(document).ready(function () {
  // Create the Back-to-Top button and its styles dynamically
  var back_to_top_button = [
    '<a href="#top" class="back-to-top" style="',
    "position: fixed; ",
    "bottom: 8px; ",
    "right: 1px; ",
    "padding: 1em; ",
    "z-index: 100; ",
    "color: white; ",
    "text-align: center; ",
    "border-radius: 5px; ",
    "font-family: Arial, sans-serif; ",
    "font-size: 50px; ",
    "text-decoration: none; ",
    "display: none; ",
    '">⇧</a>',
  ].join("");

  // Append the button to the body
  $("body").append(back_to_top_button);

  // Handle the scroll event to toggle visibility
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn().addClass("flash-effect");
    } else {
      $(".back-to-top").fadeOut().removeClass("flash-effect");
    }
  });

  // Smooth scroll to the top when the button is clicked
  $(".back-to-top").click(function () {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      800
    );
    return false;
  });
});
