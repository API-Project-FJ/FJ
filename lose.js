document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn1").addEventListener('click', () => window.location.href = 'index.html');
    document.getElementById("btn2").addEventListener('click', () => window.location.href = 'game.html');
    const highScore = parseInt(localStorage.getItem("highScore"), 10);
    const scoreCount = parseInt(localStorage.getItem("scoreCount"), 10);

    document.querySelector(".highScoreContainer").innerText = `High Score: ${highScore}`;
    document.querySelector(".scoreContainer").innerText = `Score: ${scoreCount}`;

    let body = document.body;
    let refresh;


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
        }
        catch (err) {
            console.log(err);
        }
    };

    newGif();
});
