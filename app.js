import { API_KEY } from "./api-key.js";

localStorage.setItem("scoreCount", 0);

const popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
);

const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
});

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

const movies = [];

let director = "";
let releaseDate = "";
let plot = "";

const requestOptions = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
    },
};

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


const fetchData = async () => {
    const randomMovie = Math.floor(Math.random() * Math.floor(50));
    const randomPage = Math.floor(Math.random() * Math.floor(5) + 1);

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

const getDirectors = (directors) =>
    directors.credits.map((director) => director.name.nameText.text);

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
                const imageResponse = await fetch(imageUrl, { method: 'HEAD' });

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
    releaseDate = new Date(
        titles.releaseDate.day,
        titles.releaseDate.month,
        titles.releaseDate.year
    );

    movies.push({
        plot,
        rating,
        director,
        releaseDate,
    });

    poster.src = titles.primaryImage.url;
    title.innerText = titles.titleText.text;
    scoreText.innerText = `Score: ${scoreCount}`;

    return data;
};


const createHintMessages = (messages) =>
    messages.map((message) => {
        const elem = document.createElement("p");
        elem.innerHTML = message;

        return elem;
    });

const checkInfo = (movieClicked = "firstButton") => {
    let hintMessages = [];
    const index = movieClicked === "firstButton" ? 0 : 1;
    console.log(movies)
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

const checkRating = (movieClicked) => {
  const firstRating = movies[0].rating;
  const secondRating = movies[1].rating;

  if (firstRating > secondRating && movieClicked === "firstMovie") {
    scoreCount++;
    firstMovie.classList.add("correct");
    secondMovie.classList.add("incorrect");
    setTimeout(() => {
      firstMovie.classList.remove("correct");
      secondMovie.classList.remove("incorrect");
      nextRound();
    }, 1000);
  } else if (firstRating < secondRating && movieClicked === "secondMovie") {
    scoreCount++;
    secondMovie.classList.add("correct");
    firstMovie.classList.add("incorrect");
    setTimeout(() => {
      secondMovie.classList.remove("correct");
      firstMovie.classList.remove("incorrect");
      nextRound();
    }, 1000);
  } else {
    endGame();
  }
  localStorage.setItem("scoreCount", scoreCount);
};


const updateHighScore = () => {
    const highScore = parseInt(localStorage.getItem("highScore"), 10);

    if (highScore === null || scoreCount > highScore) {
        localStorage.setItem("highScore", scoreCount);
        highScoreText.innerText = `High Score: ${scoreCount}`;
    } else {
        highScoreText.innerText = `High Score: ${highScore}`
    }
};

const clearData = () => {
    while (movies.length > 0) {
        movies.pop();
    }
};

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

        if (firstMovieData.titles.primaryImage.url !== secondMovieData.titles.primaryImage.url) {
            duplicates = false;
        }
    }
};

function endGame() {
    let highScore = localStorage.getItem("highScore");
    if (highScore === null) {
        localStorage.setItem("highScore", scoreCount);
    } else if (highScore < scoreCount) {
        localStorage.setItem("highScore", scoreCount);
    }

    window.location.href = 'lose.html';
}
//function that makes the selected movie a green glow through css
function makeMovieGlowGreen() {
    secondMovie.classList.add("green-glow");
    setTimeout(() => firstMovie.classList.remove("green-glow"), 1000);
}