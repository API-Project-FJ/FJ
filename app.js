document.addEventListener("DOMContentLoaded",()=>{
    let movieData = [];

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ea9884afb2msh82587699b006427p15b16ejsn74808ecc0952',
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
    };
    
    fetch('https://moviesdatabase.p.rapidapi.com/titles/tt0903747/', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
    

})