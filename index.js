import { API_KEY } from './api-key.js';

document.addEventListener("DOMContentLoaded", () => {
  let arrOfStartPosters = document.querySelectorAll(".start-poster");

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    }
  };
  
  let randomPage = Math.floor(Math.random() * Math.floor(5) + 1);
  async function fetchThenSetStartPosters() {

    try {

      const response = await fetch(`https://moviesdatabase.p.rapidapi.com/titles?list=most_pop_movies&limit=50&page=${randomPage}`, options)
      const data = await response.json();
      console.log(data)
      arrOfStartPosters.forEach(poster => poster.src = data.results[Math.floor(Math.random() * Math.floor(50))].primaryImage.url)


    }
    catch (error) {
      console.error('Error fetching data:', error);
      fetchThenSetStartPosters()
    }
  }

  fetchThenSetStartPosters();

  //   function setStartPosters() {

  //   }
  //   setStartPosters();
});