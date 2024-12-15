export const fetchMovies = async (query) => {
  const API_URL = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    query
  )}&language=en-US&page=1`;

  const options = {
    method: "GET", // Use GET for this endpoint
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTRjMWNmN2ZiMTA0NmY1YTBiNDhjMjg2MmZiZWI0YSIsIm5iZiI6MTczMzE1MzM5NC45NTI5OTk4LCJzdWIiOiI2NzRkZDI3MjQ1NThkYWU0NDkzZGRmMGQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.d5AF86elO4LfJXvkFzC8-wYI17Ow-_MFCJh6FyF5HdE",
    },
  };

  try {
    const response = await fetch(API_URL, options);

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    throw error;
  }
};
