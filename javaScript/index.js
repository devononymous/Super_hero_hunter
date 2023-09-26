// console.log('hello')
// const md5 = require('md5');
// import md5 from 'md5';

var searchBar = document.getElementById("search-bar");
var searchResults = document.getElementById("search-results");


// cursor pointer mover
var main = document.querySelector('#main')
var crsr = document.querySelector('.cursor')

main.addEventListener('mousemove', function (dets) {
    console.log(dets.clientX)
    crsr.style.left = dets.x + 'px'
    crsr.style.top = dets.y + 'px'

})



// apply the addEvent listern on searchBar input
searchBar.addEventListener('input', function () {
    return searchSuperHeros(searchBar.value)
})

// API calling
async function searchSuperHeros(searchHeroValue) {
    if (searchHeroValue.length == 0) {
        // console.log("Enter the input")
        return searchResults.innerHTML = ``;
    }

    // get data from super hero hunter API 
    let publicKey = '8cea85f8007ae5aca9c5018fdb1cb49b'
    let privateKey = '10c48a525dd303951707f74f0d10a861800a6aa3'

    let apiUrl = 'https://gateway.marvel.com:443/v1/public/characters'
    // let apiUrl = 'http://gateway.marvel.com/v1/public/characters'

    let ts = new Date().getTime();
    // let ts = 1695484960408
    console.log(ts)
    let hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
    console.log(hash)
    // let hash ="864fb64ad75830a3b94730ca60723d62"
    // await fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchHeroValue}&apikey=8cea85f8007ae5aca9c5018fdb1cb49b&hash=864fb64ad75830a3b94730ca60723d62&ts=1695484960408`)
    //Converting the data into JSON format
    //     .then(res => res.json()) 
    //     .then(data => showSuperHeroResults(data.data.results))
    let url = `${apiUrl}?nameStartsWith=${searchHeroValue}&apikey=${publicKey}&hash=${hash}&ts=${ts}`;
    // console.log(url)
    try {
        let response = await fetch(url)
        // console.log(response)
        let data = await response.json();
        // console.log(data);
        showSuperHeroResults(data.data.results)
    }
    catch (error) {
        console.error('Error in fatching data:', error);
    }



}


// SearchedHero is the array of objects which matches the string entered in the searched bar
function showSuperHeroResults(searchHero) {
    console.log('heros', searchHero)
    // IDs of the character which are added in the favourites 
    let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
    if (favouritesCharacterIDs == null) {
        // If we did't got the favouritesCharacterIDs then we iniitalize it with empty map
        favouritesCharacterIDs = new Map();
    }
    else if (favouritesCharacterIDs != null) {
        // If the we got the favouritesCharacterIDs in localStorage then parsing it and converting it to map
        favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
    }
    searchResults.innerHTML = ``;
    let count = 1;
    for (let key in searchHero) {
        if (count <= searchHero.length) {
            // find sing hero form the api objects
            let hero = searchHero[key];
            // console.log('finding key',hero)
            // append all hero in the ul list

            searchResults.innerHTML += `
                     <li class="flex-row single-search-result">
                    <div class="flex-row img-info">
                         <img src="${hero.thumbnail.path + '/portrait_medium.' + hero.thumbnail.extension}" alt="">
                         <div class="hero-info">
                              <a class="character-info" href="./moreInfo.html">
                                   <span class="hero-name">${hero.name}</span>
                              </a>
                         </div>
                    </div>
                    <div class="flex-col buttons">
                         <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
                         <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${hero.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove Favourites" : "<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add Favourites</button>"}
                    </div>
                    <div style="display:none;">
                         <span>${hero.name}</span>
                         <span>${hero.description}</span>
                         <span>${hero.comics.available}</span>
                         <span>${hero.series.available}</span>
                         <span>${hero.stories.available}</span>
                         <span>${hero.thumbnail.path + '/portrait_uncanny.' + hero.thumbnail.extension}</span>
                         <span>${hero.id}</span>
                         <span>${hero.thumbnail.path + '/landscape_incredible.' + hero.thumbnail.extension}</span>
                         <span>${hero.thumbnail.path + '/standard_fantastic.' + hero.thumbnail.extension}</span>
                    </div>
               </li>
            `


        }
        count++



    }
    // adding the property after click favourites and informetion
    events();


}

// function for adding button and about info
function events() {
    let addFavouriteButton = document.querySelectorAll('.add-to-fav-btn');
    addFavouriteButton.forEach((btn) => {
        btn.addEventListener('click', addToFavourites)

    })
    let aboutCharacterInfo = document.querySelectorAll(".character-info");
    aboutCharacterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage))



    // some style image mouse mover
    var heroImg = document.querySelectorAll('.img-info')
    heroImg.forEach(function (val) {
        // console.log(val);
        console.log(val.childNodes[1]);

        val.addEventListener('mouseenter', function () {
            // val.style.backgroundColor="red"
            // val.style.opacity = 1
            val.childNodes[1].style.opacity = 1
            crsr.style.display = "none"

        })
        val.addEventListener('mouseleave', function () {
            // console.log('hey')
            // val.style.backgroundColor = "transparent"

            // elem1Img.style.opacity = 0

            val.childNodes[1].style.left = 0 + 'px'
            crsr.style.display = "block"

        })
        let x = val.getBoundingClientRect()
        console.log(x.left)
        let a = x.left
        val.addEventListener('mousemove', function (dets) {
            console.log(dets.clientX)
            val.childNodes[1].style.left = dets.clientX - a + 'px'
        })

    })




}

// Function invoked when "Add to Favourites" button or "Remvove from favourites" button is click appropriate inner conntent change action is taken accoring to the button clicked
function addToFavourites() {
    // If add to favourites button is cliked then
    if (this.innerHTML == '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add Favourites') {
        // let creat a new objects relevent of has hero and push it info addFavourite Array
        let heroInfo = {
            name: this.parentElement.parentElement.children[2].children[0].innerHTML,
            description: this.parentElement.parentElement.children[2].children[1].innerHTML,
            comics: this.parentElement.parentElement.children[2].children[2].innerHTML,
            series: this.parentElement.parentElement.children[2].children[3].innerHTML,
            stories: this.parentElement.parentElement.children[2].children[4].innerHTML,
            portraitImage: this.parentElement.parentElement.children[2].children[5].innerHTML,
            id: this.parentElement.parentElement.children[2].children[6].innerHTML,
            landscapeImage: this.parentElement.parentElement.children[2].children[7].innerHTML,
            squareImage: this.parentElement.parentElement.children[2].children[8].innerHTML
        }

        // getting the favourites array which stores objects of character 
        let favouritesArray = localStorage.getItem("favouriteCharacters");

        // If favouritesArray is null (for the first time favourites array is null)
        if (favouritesArray == null) {
            // favourites array is null so we create a new array
            favouritesArray = [];
        } else {
            // if it is not null then we parse so that it becomes an array 
            favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
        }
        // favouritesCharacterIDs is taken from localStorage for adding ID of the character which is added in favourites
        let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

        if (favouritesCharacterIDs == null) {
            // If we did't got the favouritesCharacterIDs then we iniitalize it with empty map
            favouritesCharacterIDs = new Map();
        } else {
            // getting the map as object from localStorage and pasrsing it and then converting into map 
            favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));

        }
        // again setting the new favouritesCharacterIDs array to localStorage
        favouritesCharacterIDs.set(heroInfo.id, true);
        // console.log(favouritesCharacterIDs)

        // adding the above created heroInfo object to favouritesArray
        favouritesArray.push(heroInfo);

        // Storing the new favouritesCharactersID map to localStorage after converting to string
        localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
        // Setting the new favouritesCharacters array which now has the new character 
        localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));

        // Convering the "Add to Favourites" button to "Remove from Favourites"
        this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove Favourites';

        // Displaying the "Added to Favourites" toast to DOM
        document.querySelector(".fav-toast").setAttribute("data-visiblity", "show");
        // Deleting the "Added to Favourites" toast from DOM after 1 seconds
        setTimeout(function () {
            document.querySelector(".fav-toast").setAttribute("data-visiblity", "hide");
        }, 1000);

    }

    // For removing the character form favourites array
    else {

        // storing the id of character in a variable 
        let idOfCharacterToBeRemoveFromFavourites = this.parentElement.parentElement.children[2].children[6].innerHTML;

        // getting the favourites array from localStorage for removing the character object which is to be removed
        let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));

        // getting the favaourites character ids array for deleting the character id from favouritesCharacterIDs also
        let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));

        // will contain the characters which should be present after the deletion of the character to be removed 
        let newFavouritesArray = [];

        // deleting the character from map using delete function where id of character acts as key
        favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);

        // creating the new array which does not include the deleted character
        // iterating each element of array
        favouritesArray.forEach((favourite) => {
            // if the id of the character doesn't matches the favourite (i.e a favourite character) then we append it in newFavourites array 
            if (idOfCharacterToBeRemoveFromFavourites != favourite.id) {
                newFavouritesArray.push(favourite);
            }
        });

        // console.log(newFavouritesArray)

        // Updating the new array in localStorage
        localStorage.setItem("favouriteCharacters", JSON.stringify(newFavouritesArray));
        localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));


        // Convering the "Remove from Favourites" button to "Add to Favourites" 
        this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add Favourites';

        // Displaying the "Remove from Favourites" toast to DOM
        document.querySelector(".remove-toast").setAttribute("data-visiblity", "show");
        // Deleting the "Remove from Favourites" toast from DOM after 1 seconds
        setTimeout(function () {
            document.querySelector(".remove-toast").setAttribute("data-visiblity", "hide");
        }, 1000);

    }
}

// Function which stores the info object of character in local storeage use can see the info
function addInfoInLocalStorage() {

    // This function basically stores the data of character in localStorage.
    // When user clicks on the info button and when the info page is opened that page fetches the heroInfo and display the data  
    let heroInfo = {
        name: this.parentElement.parentElement.parentElement.children[2].children[0].innerHTML,
        description: this.parentElement.parentElement.parentElement.children[2].children[1].innerHTML,
        comics: this.parentElement.parentElement.parentElement.children[2].children[2].innerHTML,
        series: this.parentElement.parentElement.parentElement.children[2].children[3].innerHTML,
        stories: this.parentElement.parentElement.parentElement.children[2].children[4].innerHTML,
        portraitImage: this.parentElement.parentElement.parentElement.children[2].children[5].innerHTML,
        id: this.parentElement.parentElement.parentElement.children[2].children[6].innerHTML,
        landscapeImage: this.parentElement.parentElement.parentElement.children[2].children[7].innerHTML,
        squareImage: this.parentElement.parentElement.parentElement.children[2].children[8].innerHTML
    }

    localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}

// theme background change
// Selection of theme button
let themeButton = document.getElementById("theme-btn");

themeButton.addEventListener("click", themeChanger);

// IIFE fuction which checks the localStorage and applies the presviously set theme
(function () {
    let currentTheme = localStorage.getItem("theme");
    if (currentTheme == null) {
        root.setAttribute("color-scheme", "light");
        themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
        localStorage.setItem("theme", "light");
        return;
    }

    switch (currentTheme) {
        case "light":
            root.setAttribute("color-scheme", "light");
            themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
            break;
        case "dark":
            root.setAttribute("color-scheme", "dark");
            themeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
            themeButton.childNodes[0].style.color = "black";
            break;
    }
})();

// function for handeling theme button changes
function themeChanger() {
    let root = document.getElementById("root");
    if (root.getAttribute("color-scheme") == "light") {
        root.setAttribute("color-scheme", "dark");
        themeButton.innerHTML = `<i class="fa-solid fa-sun"></i>`;
        themeButton.childNodes[0].style.color = "black";
        localStorage.setItem("theme", "dark");
    }
    else if (root.getAttribute("color-scheme") == "dark") {
        root.setAttribute("color-scheme", "light");
        themeButton.innerHTML = `<i class="fa-solid fa-moon"></i>`;
        themeButton.childNodes[0].style.color = "white";
        localStorage.setItem("theme", "light");
    }


}



