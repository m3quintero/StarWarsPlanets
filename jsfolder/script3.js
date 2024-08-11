// Code used to obtain the names of all the featured planets
// fetch("https://www.swapi.tech/api/films/6")
// .then(res => res.json())
// .then(data => {
//     planets = data.result.properties.planets
//     var planet_dict = {}
//     for (const item of planets) {
//         fetch(item).then(res => res.json()).then(data => {
//             planet_dict[data.result.properties.name] = data.result.properties.url
//             console.log(planet_dict)
//         })
//     }
//     console.log(planet_dict)
// }).catch(err => console.error(err))

const APIController = (function() {

    // Build private methods
    const _getMovie = async () => {
        try {
            // Fetch the movie data and planets featured
            const result = await fetch("https://www.swapi.tech/api/films/6");

            const data = await result.json();
            const data2 = data.result.properties;

            const planets = {
                "Tatooine": data2.planets[0],
                "Alderaan": data2.planets[1],
                "Dagobah": data2.planets[2],
                "Naboo": data2.planets[3],
                "Coruscant": data2.planets[4],
                "Utapau": data2.planets[5],
                "Mustafar": data2.planets[6],
                "Kashyyyk": data2.planets[7],
                "Polis Massa": data2.planets[8],
                "Mygeeto": data2.planets[9],
                "Felucia": data2.planets[10],
                "Cato Neimoidia": data2.planets[11],
                "Saleucami": data2.planets[12]
            };

            return [data2, planets];
        } catch (error) {
            console.log("There was an error attempting to fetch the movie data.")
        }
    }

    // Fetch the planet data for chosen planet
    const _getPlanet = async (link) => {
        try {
            // Fetch the planet data
            const result = await fetch(link);

            const data = await result.json();
            const data2 = data.result.properties;

            return data2;
        } catch (error) {
            console.log("There was an error attempting to fetch the planet data.")
        }
    }

    // Return public methods
    return {
        getMovie() {
            return _getMovie();
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
        list: 'ul',
        coltop: '#coltop',
        colbottom: '#colbottom',
    };

    return {
        // Method to get input fields
        inputField() {
            return {
                rightcol: document.querySelector(DOMElements.rightcol),
                planetlist: document.querySelector(DOMElements.coltop),
                planetinfo: document.querySelector(DOMElements.colbottom)
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
                <div id="${planet_name}" class="gallery">
                    <div class="desc">${planet_name}</div>
                </div>
            </div>
            `;

            document.querySelector(DOMElements.coltop).insertAdjacentHTML('beforeend', item1);
        },

        // Method to display specific planet data
        createPlanetInfo(planet_name, population, terrain, climate, daylength, yearlength) {
            var item1 = `<li>Population: ${population}</li>`;
            item1+= `<li>Terrain: ${terrain}</li>`;
            item1+= `<li>Climate: ${climate}</li>`;
            item1 += `<li>Rotational Period: ${daylength}</li>`;
            item1+= `<li>Orbital Period: ${yearlength}</li>`;

            const info = 
            `
            <table>
                <tr>
                    <td id="planet_img">
                        <img src="images/${planet_name}.png" alt="The planet ${planet_name}">
                    </td>
                    <td id="planet_facts">
                        <h2>${planet_name}</h3>
                        <ul>${item1}</ul>
                    </td>
                </tr>
            </table>
            `;

            document.querySelector(DOMElements.colbottom).insertAdjacentHTML('beforeend', info)
        },

        // Method to reset planet data
        resetPlanetInfo() {
            this.inputField().planetinfo.innerHTML = "";
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
            fix_control +=1;
        })

        html = "<div class='clearfix'></div>";
        DOMInputs.planetlist.insertAdjacentHTML('beforeend', html);

        // Planet change event listener
        Object.keys(planets).forEach(planet => {
            document.getElementById(planet).addEventListener('click', async (event) => {

                // prevent page reset
                event.preventDefault();

                // Clear planet info displayed
                UIctrl.resetPlanetInfo();

                // Fetch planet facts
                const facts = await APICtrl.getPlanet(planets[planet]);

                // Display planet facts
                UIctrl.createPlanetInfo(facts.name, facts.population, facts.terrain, facts.climate, facts.rotation_period, facts.orbital_period);
            }) 
        })
    }

    return {
        init() {
            console.log('App is starting!');
            loadFilmFacts();
        }
    }

})(UIController, APIController);

APPController.init();