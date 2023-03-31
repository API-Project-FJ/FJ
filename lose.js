document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("btn1")
        .addEventListener("click", () => (window.location.href = "index.html"));
    document
        .getElementById("btn2")
        .addEventListener("click", () => (window.location.href = "game.html"));
    const highScore = parseInt(localStorage.getItem("highScore"), 10);
    const scoreCount = parseInt(localStorage.getItem("scoreCount"), 10);

    document.querySelector(
        ".highScoreContainer"
    ).innerText = `High Score: ${highScore}`;
    document.querySelector(".scoreContainer").innerText = `Score: ${scoreCount}`;

    let body = document.body;
    let refresh;

  // Add code from the first block
  const scoreMessages = [
    `Damn! ${scoreCount}, you suck, keep practicing!`,
    `Is that all you got? ${scoreCount}? I'll give you a participation trophy for trying.`,
    
    `Hmm, ${scoreCount}? Not bad, but not exactly winning the game either. Keep going!`,
    `Hmm, ${scoreCount}... I've seen better, but I'm sure you'll bounce back stronger next time!`,
    `Well, ${scoreCount} isn't terrible, but it's not quite unicorn level either. Keep practicing, you'll get there!`,
    `Nice! ${scoreCount}, You scored very high, you're a pro!`,
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

    const scoreMessage = getMessageFromScore(scoreCount);
    const scoreMessageElement = document.querySelector(".scoreMessageContainer");
    scoreMessageElement.innerText = scoreMessage;

    // Duration count in seconds
    const duration = 1000 * 10;
    // Giphy API defaults
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

    const renderGif = (gif) => {
        console.log({ gif });
        body.style.backgroundImage = `url('${gif.data.images.original.url}')`;
    };

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
