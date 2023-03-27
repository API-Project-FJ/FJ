import { API_KEY } from './api-key.js';

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
});


document.addEventListener("DOMContentLoaded", () => {
    let firstMoviePoster = document.querySelector("#first-movie-poster");
    let secondMoviePoster = document.querySelector("#second-movie-poster");
    let firstMovieTitle = document.querySelector("#first-movie-title");
    let secondMovieTitle = document.querySelector("#second-movie-title");
    let firstMovie = document.querySelector("#first-movie");
    let secondMovie = document.querySelector("#second-movie");
    let score = document.querySelector("#score");
    let highScoreText = document.querySelector("#high-score");
    let scoreCount = 0;
    let movieRating = [];


    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
    };

    async function fetchData(poster, title) {
        const randomMovie = Math.floor(Math.random() * Math.floor(50));
        const randomPage = Math.floor(Math.random() * Math.floor(5) + 1);
        try {
            const response = await fetch(`https://moviesdatabase.p.rapidapi.com/titles?list=most_pop_movies&limit=50&page=${randomPage}`, options)
            const data = await response.json();

            let imdbID = data.results[randomMovie].id
            const ratingResponse = await fetch(`https://moviesdatabase.p.rapidapi.com/titles/${imdbID}/ratings`, options)
            const ratingData = await ratingResponse.json();
            const rating = ratingData.results.averageRating;
            
            console.log(rating,data.results[randomMovie].titleText.text)
            movieRating.push(rating)
            console.log(movieRating)
            console.log(data,"data")
            console.log(data.results[randomMovie].primaryImage.url)
            console.log(data.results[randomMovie].titleText.text)
            
            poster.src = data.results[randomMovie].primaryImage.url;
            title.innerText = data.results[randomMovie].titleText.text;// jackie
            score.innerText = `Score: ${scoreCount}`;
            
            if (title.innerText === "What's Love Got to Do with It?" || data.status === 404 || title.innerText === "The Boy, the Mole, the Fox and the Horse" || title.innerText === "Escape from Alcatraz") {
                fetchData(poster, title)
            }
            else if (firstMoviePoster.src === secondMoviePoster.src) { // fixes bug where the same movie is selected twice
                fetchData(poster, title)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            movieRating = [];
            fetchData(poster, title)
        }
    }
    firstMovie.addEventListener("click", () => {
        let movieClicked = "first"
        checkRating(movieClicked)
    })
    secondMovie.addEventListener("click", () => {
        let movieClicked = "second"
        checkRating(movieClicked)
    })
    function checkRating(movieClicked) {
        if (movieRating[0] > movieRating[1] && movieClicked === "first") {
            scoreCount++
            score.innerText = `Score: ${scoreCount}`;
            console.log("correct answer")
            nextRound()
        } else if (movieRating[0] < movieRating[1] && movieClicked === "second") {
            scoreCount++
            score.innerText = `Score: ${scoreCount}`;
            console.log("correct answer")
            nextRound()
        } else {
            console.log("wrong answer")
            nextRound()
        }

    }
    async function nextRound(){
        movieRating = [];
        setHighScore()
        await fetchData(firstMoviePoster, firstMovieTitle)
        await fetchData(secondMoviePoster, secondMovieTitle)
        
    }
    nextRound()
    

    function setHighScore(){
        let highScore = localStorage.getItem("highScore")
        if (highScore === null){
            localStorage.setItem("highScore", scoreCount)
        }
        else if (highScore < scoreCount){
            localStorage.setItem("highScore", scoreCount)
        }
        highScoreText.innerText = `High Score: ${localStorage.getItem("highScore")}`
    }
    //brb
    
    
})

//
//to do
//hide api key //done
//refactor to use async await //done
// figure out way to get the next 50 movies //done
//re roll if url is null or resource not found //done

//to do later
//store the imdb rating for each movie
//add selectors to both movies
//add event listener to both movies
//compare movies to see which one has the higher rating
//if the selected movie is the same as the one with the higher rating, the user scores points
//if the selected movie is the same as the one with the lower rating, loses the game

//hints
// Date released
// Background info
// Cast
// Director
// Genre
//

//known bugs
//costantine gives 404 error and does not load image + game does not re roll
//Failed to load resource: the server responded with a status of 404 ()
//tess glitch
//movieData array sometimes has 3 items instead of 2 causing incorrect comparsion for ratings