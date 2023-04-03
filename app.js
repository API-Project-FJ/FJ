const incorrectSound = new Audio("images/incorrect.mp3");
const correctSound = new Audio("images/correct.mp3");


//The code imports an API key from a separate file
import { API_KEY } from "./api-key.js";

//The code sets an initial score count of 0 in local storage
localStorage.setItem("scoreCount", 0);

//The code defines variables for various elements on the page, such as movie posters and titles, buttons, and score containers
const firstMoviePoster = document.getElementById("first-movie-poster");
const secondMoviePoster = document.getElementById("second-movie-poster");
const firstMovieTitle = document.getElementById("first-movie-title");
const secondMovieTitle = document.getElementById("second-movie-title");
const firstMovie = document.getElementById("first-movie");
const secondMovie = document.getElementById("second-movie");
const scoreText = document.querySelector(".scoreContainer");
const highScoreText = document.querySelector(".highScoreContainer");
const buttonOne = document.querySelector(".buttonOne");
const buttonTwo = document.querySelector(".buttonTwo");
let scoreCount = parseInt(localStorage.getItem("scoreCount"), 10);
let movieRating = [];

//The code adds event listeners to elements on the page to handle user interactions
//The event listeners call the checkRating() function when a movie poster is clicked and checkInfo() function when an info button is clicked
//The nextRound() function is called to start the game by fetching data for two new movies and updating the UI accordingly
document.addEventListener("DOMContentLoaded", () => {
  firstMoviePoster.addEventListener("click", () => {
    checkRating("firstMovie");
  });

  secondMoviePoster.addEventListener("click", () => {
    checkRating("secondMovie");
  });

  buttonOne.addEventListener("click", () => {
    checkInfo("firstButton");
  });

  buttonTwo.addEventListener("click", () => {
    checkInfo("secondButton");
  });

  nextRound();
});

//The code defines variables for the movie data fetched from the API, such as director, release date, and plot
const movies = [];

let director = "";
let releaseDate = "";
let plot = "";

// Defines an object named `requestOptions` with two properties: `method` and `headers`
// Specifies that the request is a GET request
// Specifies headers for the RapidAPI Movies Database API.
// The API key needed to make requests to the API.
// The domain name of the API endpoint.
const requestOptions = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
  },
};

//The code defines a fetchMovies() function that fetches movie data from an API.
const fetchMovies = async (page) => {
  const moviesUrl = `https://moviesdatabase.p.rapidapi.com/titles?list=most_pop_movies&limit=50&page=${page}`;

  try {
    const req = await fetch(moviesUrl, requestOptions);
    const response = await req.json();

    return response;
  } catch (err) {
    console.error(err);
  }
};

//The code defines a fetchData() function that fetches data for a random movie using fetchMovies(), and then fetches additional data for that movie, such as ratings and creators.
const fetchData = async () => {
  const randomMovie = Math.floor(Math.random() * Math.floor(50));
  const randomPage = Math.floor(Math.random() * Math.floor(10) + 1);

  try {
    const moviesResponse = await fetchMovies(randomPage);
    const id = moviesResponse.results[randomMovie].id;

    const titlesUrl = `https://moviesdatabase.p.rapidapi.com/titles/${id}?info=base_info`;
    const creatorsUrl = `https://moviesdatabase.p.rapidapi.com/titles/${id}?info=creators_directors_writers`;
    const ratingsUrl = `https://moviesdatabase.p.rapidapi.com/titles/${id}/ratings`;

    const [titles, creators, ratings] = await Promise.all([
      (await fetch(titlesUrl, requestOptions)).json(),
      (await fetch(creatorsUrl, requestOptions)).json(),
      (await fetch(ratingsUrl, requestOptions)).json(),
    ]);

    return {
      id,
      titles: titles.results,
      creators: creators.results,
      ratings: ratings.results,
    };
  } catch (err) {
    console.error(err);
  }
};

//The code defines a getDirectors() function that extracts director information from the fetched data.
const getDirectors = (directors) =>
  directors.credits.map((director) => director.name.nameText.text);

//The code defines a setData() function that fetches data for a single movie, updates the movie poster and title on the page, and stores the movie data in an array.
const setData = async (poster, title) => {
  let data;
  let isImageAccessible = false;

  while (!isImageAccessible) {
    try {
      data = await fetchData();
      const { titles, creators, ratings } = data;

      const imageUrl = titles.primaryImage.url;

      if (imageUrl !== null) {
        // Check if the image is accessible (status 200)
        const imageResponse = await fetch(imageUrl, { method: "HEAD" });

        if (imageResponse.status === 200) {
          isImageAccessible = true;
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const { titles, creators, ratings } = data;

  const rating = ratings.averageRating;
  director = getDirectors(creators.directors[0])[0];
  plot = titles.plot.plotText.plainText;
  

  movies.push({
    plot,
    rating,
    director,
    
  });

  poster.src = titles.primaryImage.url;
  title.innerText = titles.titleText.text;
  scoreText.innerText = `Score: ${scoreCount}`;

  return data;
};

//The code defines a createHintMessages() function that creates hint messages to be displayed in a modal.
const createHintMessages = (messages) =>
  messages.map((message) => {
    const elem = document.createElement("p");
    elem.innerHTML = message;

    return elem;
  });

//The code defines a checkInfo() function that displays a modal with hint messages when a movie's info button is clicked.
const checkInfo = (movieClicked = "firstButton") => {
  let hintMessages = [];
  const index = movieClicked === "firstButton" ? 0 : 1;
  console.log(movies);
  hintMessages = [
    `The director of this movie is ${movies[index].director}.`,
    `Here's some background info on this movie: ${movies[index].plot}.`,
  ];

  const hintMessage = createHintMessages(hintMessages);
  const modalBody = document.querySelector(".modal-body");
  console.log(modalBody);
  if (modalBody) {
    modalBody.replaceChildren(...hintMessage);
  }
};

//The code defines a checkRating() function that compares the ratings of two movies and updates the score accordingly.
const checkRating = (movieClicked) => {
  const firstRating = movies[0].rating;
  const secondRating = movies[1].rating;

  if (firstRating > secondRating && movieClicked === "firstMovie") {
    scoreCount++;
    correctSound.play();
    firstMovie.classList.add("correct");
    secondMovie.classList.add("incorrect");
    setTimeout(() => {
      firstMovie.classList.remove("correct");
      secondMovie.classList.remove("incorrect");
      nextRound();
    }, 1000);
  } else if (firstRating < secondRating && movieClicked === "secondMovie") {
    scoreCount++;
    correctSound.play();
    secondMovie.classList.add("correct");
    firstMovie.classList.add("incorrect");
    setTimeout(() => {
      secondMovie.classList.remove("correct");
      firstMovie.classList.remove("incorrect");
      nextRound();
    }, 1000);
  } else {
    incorrectSound.play();
    endGame();
  }
  localStorage.setItem("scoreCount", scoreCount);
};

//The code defines an updateHighScore() function that updates the high score in local storage.
const updateHighScore = () => {
  const highScore = parseInt(localStorage.getItem("highScore"), 10);

  if (highScore === null || scoreCount > highScore) {
    localStorage.setItem("highScore", scoreCount);
    highScoreText.innerText = `High Score: ${scoreCount}`;
  } else {
    highScoreText.innerText = `High Score: ${highScore}`;
  }
};

//The code defines a clearData() function that removes all movie data from the array.
const clearData = () => {
  while (movies.length > 0) {
    movies.pop();
  }
};

//The code defines a nextRound() function that clears the movie data, updates the high score, fetches data for two new movies, and checks for duplicates.
const nextRound = async () => {
  clearData();
  updateHighScore();

  let firstMovieData, secondMovieData;
  let duplicates = true;

  while (duplicates) {
    await setData(firstMoviePoster, firstMovieTitle).then((data) => {
      firstMovieData = data;
    });

    await setData(secondMoviePoster, secondMovieTitle).then((data) => {
      secondMovieData = data;
    });

    if (
      firstMovieData.titles.primaryImage.url !==
      secondMovieData.titles.primaryImage.url
    ) {
      duplicates = false;
    }
  }
};

//The code defines an endGame() function that updates the high score and redirects the user to a "lose" page.
function endGame() {
  let highScore = localStorage.getItem("highScore");
  if (highScore === null) {
    localStorage.setItem("highScore", scoreCount);
  } else if (highScore < scoreCount) {
    localStorage.setItem("highScore", scoreCount);
  }

  incorrectSound.play();
  window.location.href = "lose.html";
}
