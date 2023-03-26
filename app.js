document.addEventListener("DOMContentLoaded",()=>{

    //on load fetch movie data
    fetch("https://api.themoviedb.org/3/movie/2?api_key=1025d8bf81d519a9ad57e875dc63ff51&language=en-US")
    .then(response => response.json())
    .then(data => {
        console.log(data)
       
    })


    

})