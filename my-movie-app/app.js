const allMoviesContainer = document.querySelector('.all-movies');
const movieType = document.querySelector('.heading-genre');
const action = document.querySelector('.action');
const adventure = document.querySelector('.adventure');
const animation = document.querySelector('.animation');
const comedy = document.querySelector('.comedy');
const crime = document.querySelector('.crime');
const drama = document.querySelector('.drama');
const family = document.querySelector('.family');
const fantasy = document.querySelector('.fantasy');
const history = document.querySelector('.history');
const music = document.querySelector('.music');
const romance = document.querySelector('.romance');
const sci_fi = document.querySelector('.sci_fi');
const thriller = document.querySelector('.thriller');
const horror = document.querySelector('.horror');
const input = document.querySelector('.input');
const searchBtn = document.querySelector('.search')

let apiBaseURL = 'http://api.themoviedb.org/3/';
let apiKey = "78fa2d811289ca009782fd5c4a9d8b7e";
let imageBaseUrl = 'https://image.tmdb.org/t/p/';
const nowPlayingURL = apiBaseURL + 'movie/now_playing?api_key=' + apiKey;

document.addEventListener("DOMContentLoaded", getAllMovies);

async function getAllMovies() {
    try {
        let response = await fetch(nowPlayingURL);
        let nowPlayingData = await response.json();
        let allMovies = nowPlayingData.results;
        let nowPlaying = allMovies.map(movie => {
            return movie;
        })
        return nowPlaying;
    }
    catch (error) {
        console.log(error);
    }
}

function loadNowPlaying() {
    getAllMovies().then(allMovie => {
        displayNowPlaying(allMovie);
    });
}

async function getDataForThisMovie(thisMovieUrl) {
    try {
        let response = await fetch(thisMovieUrl);
        let movieData = await response.json();
        return movieData;
    } catch (error) {
        console.log(error);
    }
}

let k = 0;
function populateMovies(movies) {
    let div = document.createElement('div');
    div.setAttribute('class', 'col my-2 one-movie');
    div.innerHTML = `
            <!-- Button trigger modal -->
            <button type="button" class="btn movie-btn" data-bs-toggle="modal" data-bs-target="#movieModal${k}" data-whatever="@${k}">
                <img class="movie-image" src="${movies.poster}" alt="${movies.title}">
            </button>
            <!-- Modal -->
            <div class="modal fade" id="movieModal${k}" tabindex="-1" aria-labelledby="movieModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content col-sm-12">
                        <div class="modal-body">
                            <div class="container">
                                <div class="row">
                                    <div class="col">
                                        <div class="modalMovieImage">
                                            <a href="${movies.youtubeLink}">
                                                <img class="movie-image" src="${movies.poster}"
                                                    alt="${movies.poster}">
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="movie-details">
                                            <h2 class="movie-name">${movies.title}
                                            </h2>
                                            <br>
                                            <div class="trailer-link">
                                                <a href="${movies.youtubeLink}"><i
                                                        class="fa-solid fa-play"></i><span>Play
                                                        Trailer</span></a>
                                            </div>
                                            <br>
                                            <div class="releaseDate">
                                                <span class="fw-bold release-date">Release Date:
                                                    ${movies.releaseDate}</span>
                                            </div>
                                            <br>
                                            <div class="overview">
                                                ${movies.overview}
                                            </div>
                                            <br>
                                            <div class="rating fw-bold">Rating: ${movies.voteAverage}/10</div>
                                            <br>
                                            <div class="btn btn-outline-primary btn-sm my-2">8:30AM</div>
                                            <div class="btn btn-outline-primary btn-sm my-2">10:30AM</div>
                                            <div class="btn btn-outline-primary btn-sm my-2">12:30PM</div>
                                            <div class="btn btn-outline-primary btn-sm my-2">2:30PM</div>
                                            <div class="btn btn-outline-primary btn-sm my-2">4:30PM</div>
                                            <div class="btn btn-outline-primary btn-sm my-2">6:30PM</div>
                                            <div class="btn btn-outline-primary btn-sm my-2">8:30PM</div>
                                            <div class="btn btn-outline-primary btn-sm my-2">10:30PM</div>
                                            <div class="btn btn-outline-primary btn-sm my-2">11:00PM</div>
                                            <div class="btn btn-outline-primary btn-sm my-2">12:30AM</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    k++;
    allMoviesContainer.appendChild(div);
}

function displayNowPlaying(allMovie) {
    allMovie.map(movies => {
        const movieId = movies.id;
        var thisMovieUrl = apiBaseURL + 'movie/' + movieId + '/videos?api_key=' + apiKey
        let response = getDataForThisMovie(thisMovieUrl);
        response.then(movie => {
            let poster = imageBaseUrl + 'w300' + movies.poster_path;
            let title = movies.original_title;
            let releaseDate = movies.release_date;
            let overview = movies.overview;
            let voteAverage = movies.vote_average;
            let youtubeKey = movie.results[0].key;
            let youtubeLink = 'https://www.youtube.com/watch?v=' + youtubeKey;
            let moviesObj = { poster, title, releaseDate, overview, voteAverage, youtubeLink };
            populateMovies(moviesObj);
        })
    })
}

loadNowPlaying();

// getting the movies by their genres
action.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'action'
    getMoviesByGenre(28);
});
adventure.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'adventure'
    getMoviesByGenre(12);
});
animation.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'animation'
    getMoviesByGenre(16);
});
comedy.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'comedy'
    getMoviesByGenre(35);
});
crime.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'crime'
    getMoviesByGenre(18);
});
drama.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'drama'
    getMoviesByGenre(28);
});
family.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'family'
    getMoviesByGenre(10751);
});
fantasy.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'fantasy'
    getMoviesByGenre(14);
});
history.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'history'
    getMoviesByGenre(36);
});
horror.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'horror'
    getMoviesByGenre(27);
});
music.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'music'
    getMoviesByGenre(10402);
});
romance.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'romance'
    getMoviesByGenre(10749);
});
sci_fi.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'Science Fiction'
    getMoviesByGenre(878);
});
thriller.addEventListener("click", () => {
    allMoviesContainer.innerHTML = '';
    movieType.textContent = 'thriller'
    getMoviesByGenre(53);
});

function getMoviesByGenre(genre_id) {
    const getMoviesByGenreURL = apiBaseURL + 'genre/' + genre_id + '/movies?api_key=' + apiKey + '&language=en-US&include_adult=false&sort_by=created_at.asc';
    //fetching from genre url
    async function getGenreMovie() {
        try {
            let response = await fetch(getMoviesByGenreURL);
            let movieData = response.json();
            return movieData;
        } catch (error) {
            console.log(error);
        }

    }
    getGenreMovie().then(data => {
        let k = 0;
        let movieResult = data.results;
        movieResult.map(movies => {
            const movieId = movies.id;
            let thisMovieUrl = apiBaseURL + 'movie/' + movieId + '/videos?api_key=' + apiKey;
            //get data for this movie url
            getDataForThisMovie(thisMovieUrl).then(movie => {
                let poster = imageBaseUrl + 'w300' + movies.poster_path;
                let title = movies.original_title;
                let releaseDate = movies.release_date;
                let overview = movies.overview;
                let voteAverage = movies.vote_average;
                let youtubeKey = movie.results[0].key;
                let youtubeLink = 'https://www.youtube.com/watch?v=' + youtubeKey;
                let moviesObj = { poster, title, releaseDate, overview, voteAverage, youtubeLink };
                populateMovies(moviesObj);
            })
        });
    });
};

//Search Functionality
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let inputVal = input.value;
    allMoviesContainer.innerHTML = '';
    getTheSearchMovie(inputVal);
});

function getTheSearchMovie(inputVal) {
    const searchMovieURL = apiBaseURL + 'search/movie?api_key=' + apiKey + '&language=en-US&page=1&include_adult=false&query=' + inputVal;
    async function getSearchUrls() {
        let response = await fetch(searchMovieURL);
        let data = await response.json();
        return data.results;
    }

    getSearchUrls().then(data => {
        data.map(movies => {
            const movieId = movies.id;
            let thisMovieUrl = apiBaseURL + 'movie/' + movieId + '/videos?api_key=' + apiKey;
            getDataForThisMovie(thisMovieUrl).then(movie => {
                let poster = imageBaseUrl + 'w300' + movies.poster_path;
                let title = movies.original_title;
                let releaseDate = movies.release_date;
                let overview = movies.overview;
                let voteAverage = movies.vote_average;
                let youtubeKey = movie.results[0].key;
                let youtubeLink = 'https://www.youtube.com/watch?v=' + youtubeKey;
                let moviesObj = { poster, title, releaseDate, overview, voteAverage, youtubeLink };
                populateMovies(moviesObj);
            })
        })
    })
}
