document.addEventListener("DOMContentLoaded", () => {
  // Attach event listener to "btn1" to redirect to "index.html"
  document
    .getElementById("btn1")
    .addEventListener("click", () => (window.location.href = "index.html"));

  // Attach event listener to "btn2" to redirect to "game.html"
  document
    .getElementById("btn2")
    .addEventListener("click", () => (window.location.href = "game.html"));
  const highScore = parseInt(localStorage.getItem("highScore"), 10);
  const scoreCount = parseInt(localStorage.getItem("scoreCount"), 10);

  // Retrieve data from localStorage and display high score and score count
  document.querySelector(
    ".highScoreContainer"
  ).innerText = `High Score: ${highScore}`;
  document.querySelector(".scoreContainer").innerText = `Score: ${scoreCount}`;

  let body = document.body;
  let refresh;

  // Define an array of messages and a function to return a message based on the score
  const scoreMessages = [
    `Damn! ${scoreCount}, you suck, keep practicing!`,
    `Is that all you got? ${scoreCount}? I'll give you a participation trophy for trying.`,
    `Hmm, ${scoreCount}? Not bad, but not exactly winning the game either. Keep going!`,
    `Hmm, ${scoreCount}... I've seen better, but I'm sure you'll bounce back stronger next time!`,
    `Well, ${scoreCount} isn't terrible, but it's not quite unicorn level either. Keep practicing, you'll get there!`,
  ];

  const getMessageFromScore = (score) => {
    if (score < 2) {
      return scoreMessages[0];
    } else if (score < 5) {
      return scoreMessages[1];
    } else if (score < 10) {
      return scoreMessages[2];
    } else if (score < 15) {
      return scoreMessages[3];
    } else {
      return scoreMessages[4];
    }
  };

  // Display a message based on the score
  const scoreMessage = getMessageFromScore(scoreCount);
  const scoreMessageElement = document.querySelector(".scoreMessageContainer");
  scoreMessageElement.innerText = scoreMessage;

  // Duration count in seconds
  const duration = 1000 * 10;

  // Set defaults for Giphy API and create URL to fetch a random GIF
  const giphy = {
    baseURL: "https://api.giphy.com/v1/gifs/",
    apiKey: "0UTRbFtkMxAplrohufYco5IY74U8hOes",
    tag: "fail",
    type: "random",
    rating: "pg-13",
  };

  let giphyURL = encodeURI(
    giphy.baseURL +
      giphy.type +
      "?api_key=" +
      giphy.apiKey +
      "&tag=" +
      giphy.tag +
      "&rating=" +
      giphy.rating
  );

  // Set the background image of the body to a random GIF from the Giphy API
  const renderGif = (gif) => {
    console.log({ gif });
    body.style.backgroundImage = `url('${gif.data.images.original.url}')`;
  };

  // Fetch a new GIF from the Giphy API and render it on the page
  const newGif = async () => {
    try {
      const req = await fetch(giphyURL);
      const res = await req.json();

      renderGif(res);
    } catch (err) {
      console.log(err);
    }
  };

  newGif();
});
