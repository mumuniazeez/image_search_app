let imageMotherContainer = document.querySelector(".hero")
let imageContainer = document.createElement("div")
imageContainer.className = "wrapper"
// /search/photos

const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");

let clientID = "I7UJNPETzz1J6zV4JP6R9sV4b2yDRfap60HIRXN40hE"

const time = ["popular", "latest"]
const page = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let randomTime = Math.random() * time.length
let randomTimeIndex = ~~randomTime
let randomPage = Math.random() * page.length
let randomPageIndex = ~~randomPage


let randomImageURL = `https://api.unsplash.com/photos/?page=${page[randomPageIndex]}&order_by=${time[randomTimeIndex]}&client_id=${clientID}`

let loadingAnimation = `
    <div class="loading-animation">
        <div class="rotator rotate"></div>
        <div class="loading">
            <h2 class="loading-text">Loading...</h2>
        </div>
    </div>
`

function showError(callBackFn, query) {
    if (query !== "undefined"){
        console.log(query)
        let errorText = `
        <div class="error">
            <h1 class="error-text">Unable to search for "${query}".</h1>
            <button class="try-again-btn" onclick="${callBackFn}">Try again</button>
        </div>
    `
    return errorText
    } else {
        console.log(query)
        let errorText = `
        <div class="error">
            <h1 class="error-text">Unable to get images.</h1>
            <button class="try-again-btn" onclick="${callBackFn}">Try again</button>
        </div>
    ` 
    return errorText
    }
}

async function searchImage(query) {
    imageMotherContainer.innerHTML = loadingAnimation
    let queryImageURL = `https://api.unsplash.com/search/photos/?query=${query}&client_id=${clientID}`
    try {
        const res = await fetch(queryImageURL);
        const data = await res.json();
            showImageOnPage(data)
    } catch (err) {
        setTimeout(() => {
            imageMotherContainer.innerHTML = showError(`searchImage('${query}')`, query)
        }, 3000)    
    }

}


const showImageOnPage = data => {
    console.log(data);
    if (data.results) {
        data = data.results
    }
    let result = ""
        data.forEach(image => {
            if (image.description == null) {
                image.description = image.alt_description
                if (image.alt_description == null) {
                    image.description = "No description."

                }
            }
            result += `
            <div class="container" id="${image.id}">
                <div class="image-container">
                    <img src="${image.urls.small}" alt="${image.description}" loading="lazy" class="image"
                    sizes="(min-width: 1335px) 416px, (min-width: 992px) calc(calc(100vw - 72px) / 3), (min-width: 768px) calc(calc(100vw - 48px) / 2), 100vw"
                    style="height: ${image.height}; width: ${image.width};"
                    >
                </div>
                <div class="image-info">
                    <p class="description">${image.description}</p>
                    <p class="likes">Likes: ${image.likes}</p>
                    <div class="download-btn">
                        <a href="${image.urls.small}" class="download" download="Your awesome image">Download</a>
                    </div>  
                </div>
            </div>
            `
            setTimeout(() => {
                imageContainer.innerHTML = result;
                imageMotherContainer.innerHTML = ""
                imageMotherContainer.append(imageContainer);
            }, 3000)
        });
}


async function getRandomData(url) {
    imageMotherContainer.innerHTML = loadingAnimation
    try {
        const res = await fetch(url);
        const data = await res.json();
        showImageOnPage(data)
    } catch (err) {
        setTimeout(() => {
            imageMotherContainer.innerHTML = showError("getRandomData(randomImageURL)")
        }, 3000)
    }
}

searchBtn.addEventListener("click", () => {
    imageMotherContainer.innerHTML = loadingAnimation
    let query = searchInput.value
    console.log(query)
    searchImage(query)
})

getRandomData(randomImageURL);

searchInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        imageMotherContainer.innerHTML = loadingAnimation
        let query = searchInput.value
        console.log(query)
        searchImage(query)  
    }
})