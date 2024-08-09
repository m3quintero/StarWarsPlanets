// Code used to obtain the names of all the featured planets


const APIController = (function() {

    // Build private methods
    const _getMovie = async () => {
        
        // Fetch the movie data and planets featured
        const result = await fetch("https://www.swapi.tech/api/films/5");

        const data = await result.json();
        const data2 = data.result.properties;

        const planets = {
            "Tatooine": data2.planets[0],
            "Naboo": data2.planets[1],
            "Coruscant": data2.planets[2],
            "Kamino": data2.planets[3],
            "Geonosis": data2.planets[4]
        };

        return [data2, planets];
    }

    // Fetch the planet data for each planet that appears in the movie
    const _getPlanets = async (planetlinks) => {
        var allplanets = []

        for (const property in planetlinks) {
            const result = await fetch(planetlinks[property]);

            const data = await result.json();
            const data2 = data.result.properties;
            allplanets.push(data2);
        }
  
        return allplanets;
    }

    const _getPlanet = async (link) => {
        
        // Fetch the planet data
        const result = await fetch(link);

        const data = await result.json();
        const data2 = data.result.properties;

        return data2;
    }

    // Return public methods
    return {
        getMovie() {
            return _getMovie();
        },

        getPlanets(planetlinks) {
            return _getPlanets(planetlinks);
        },

        getPlanet(link) {
            return _getPlanet(link);
        }
    }

})();

const UIController = (function() {

    const DOMElements = {
        header: 'header',
        leftcol: '.left',
        rightcol: '.right',
        list: 'ul'
    }

    return {
        // Method to get input fields
        inputField() {
            return {
                planetlist: document.querySelector(DOMElements.rightcol)
            };
        },

        // Method to add title and column headers
        createHeaders(episode, movie) {
            const markup1 = `<h1>Episode ${episode}: ${movie}</h1>`;
            document.querySelector(DOMElements.header).insertAdjacentHTML('beforeend', markup1);
        },

        // Method to display the film facts
        createFilmFacts(director, producer, released, crawl) {
            var item1 = `<li>Directed by: ${director}</li>`;
            item1 += `<li>Produced by: ${producer}</li>`;
            item1 += `<li>Release date: ${released}</li>`;

            document.querySelector(DOMElements.list).insertAdjacentHTML('beforeend', item1);

            const item2 = "<p style='color: rgb(210,210,210); font-size: 1.05em'>" + crawl + "</p>";
            document.querySelector(DOMElements.leftcol).insertAdjacentHTML('beforeend', item2);
        },

        // Method to display planets in gallery view
        createPlanetList(planet_name) {
            const item1 = 
            `
            <div class="responsive">
                <div class="gallery">
                    <div class="desc">${planet_name}</div>
                </div>
            </div>
            `;

            document.querySelector(DOMElements.rightcol).insertAdjacentHTML('beforeend', item1);
        }
    }
})();

const APPController = (function(UIctrl, APICtrl) {
    // Get input field object reference
    const DOMInputs = UIctrl.inputField();

    // Get film facts on page load
    const loadFilmFacts = async () => {

        // Get film facts
        var movie = await APICtrl.getMovie();

        const filmfacts = movie[0];
        const planets = movie[1];

        // Populate left column with film facts
        UIctrl.createHeaders(filmfacts.episode_id, filmfacts.title);
        UIctrl.createFilmFacts(filmfacts.director, filmfacts.producer, filmfacts.release_date, filmfacts.opening_crawl);

        // Populate right column with planet names
        var fix_control = 1
        Object.keys(planets).forEach(planet => {
            UIctrl.createPlanetList(planet)
            if (fix_control%5 == 0) {
                html = "<div class='clearfix'></div>";
                DOMInputs.planetlist.insertAdjacentHTML('beforeend', html);
            }
            fix_control +=1
        })

        html = "<div class='clearfix'></div>";
        DOMInputs.planetlist.insertAdjacentHTML('beforeend', html);
        
        // Display planet facts on click
    }

    return {
        init() {
            console.log('App is starting!');
            loadFilmFacts();
        }
    }

})(UIController, APIController);

APPController.init();