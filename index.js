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

  let randomPage = Math.floor(Math.random() * Math.floor(15) + 1);

  async function setImageSrc(poster, imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        poster.src = imageUrl;
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = imageUrl;
    });
  }

  async function fetchThenSetStartPosters() {
    try {
      const response = await fetch(`https://moviesdatabase.p.rapidapi.com/titles?list=most_pop_movies&limit=50&page=${randomPage}`, options);
      const data = await response.json();

      for (const poster of arrOfStartPosters) {
        let success = false;
        let attempts = 0;

        while (!success && attempts < data.results.length) {
          let randomPosterNum = Math.floor(Math.random() * Math.floor(50));
          const imageUrl = data.results[randomPosterNum].primaryImage.url;

          if (imageUrl) {
            success = await setImageSrc(poster, imageUrl);
          }

          attempts++;
        }



        if (!success) {
          console.log("Unable to set an image for the poster");
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  fetchThenSetStartPosters();
});