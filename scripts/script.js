let imageMotherContainer = document.querySelector(".hero")
let imageContainer = document.createElement("div");
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
let url = `https://api.unsplash.com/photos/?page=${page[randomPageIndex]}&order_by=${time[randomTimeIndex]}&client_id=${clientID}`




let loadingAnimation = `
    <div class="loading-animation">
        <div class="rotator rotate"></div>
        <div class="loading">
            <h2 class="loading-text">Loading...</h2>
        </div>
    </div>
`

function showError(callBackFn, query) {
    if (query){
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



const showImageOnPage = (data, query) => {
    let searchText = ""
    let result = ""
    let img;
    if (data.results) {
        data = data.results
        searchText = `
        <h1>Showing result for "${query}"</h1>
        `
    }
    data.forEach(image => {
        if (image.description == null) {
            image.description = image.alt_description
            if (image.alt_description == null) {
                image.description = "No description."
                
            }
        }
        console.log(image);
        result += `
            <div class="container" id="${image.id}">
                <div class="image-container">
                    <img src="${image.urls.small}" alt="${image.description}" class="image">
                </div>
                <div class="image-info">
                    <p class="description">${image.description}</p>
                    <p class="likes">Likes: ${image.likes}</p>
                    <div class="download-btn">
                        <button class="download" download="Your awesome image" onclick='downloadImage("${image.urls.full}")'>Download Full</button>
                        <button class="download" download="Your awesome image" onclick='downloadImage("${image.urls.regular}")'>Download Regular</button>
                        <button class="download" download="Your awesome image" onclick='downloadImage("${image.urls.small}")'>Download Small</button>
                    </div>
                </div>
            </div>
        `
    });
    setTimeout(() => {
        imageContainer.innerHTML = result;
        imageMotherContainer.innerHTML = ""
        imageMotherContainer.innerHTML = searchText;
        imageMotherContainer.append(imageContainer);
    }, 3000);
}
    
async function getRandomData(url = "") {
    imageMotherContainer.innerHTML = loadingAnimation
    try {
        const res = await fetch(url);
        const data = await res.json();
        showImageOnPage(data)
    } catch (err) {
        setTimeout(() => {
            imageMotherContainer.innerHTML = showError("getRandomData(url)")
        }, 2000);
    }
}
async function searchImage(query) {
    imageMotherContainer.innerHTML = loadingAnimation;
    let queryImageURL = `https://api.unsplash.com/search/photos/?query=${query}&client_id=${clientID}`
    try {
        const res = await fetch(queryImageURL);
        const data = await res.json();
            showImageOnPage(data, query)
    } catch (err) {
        setTimeout(() => {
            console.log(err);
            imageMotherContainer.innerHTML = showError(`searchImage('${query}')`, query)
        }, 2000)    
    }

}

    
searchBtn.addEventListener("click", () => {
    imageMotherContainer.innerHTML = loadingAnimation
    let query = searchInput.value;
    console.log(query)
    searchImage(query)
})
searchInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        imageMotherContainer.innerHTML = loadingAnimation
        let query = searchInput.value
        console.log(query)
        searchImage(query)
    }
})
getRandomData(url);

function downloadImage(url) {
    const canvas = document.createElement("canvas");
    const a = document.createElement("a");
    const img = document.createElement("img");
    const ctx = canvas.getContext("2d");
    img.src = url;
    console.log(img.width);

    img.addEventListener("load", (e) => {
        e.preventDefault();
        img.crossOrigin = "anonymous";
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        a.href = canvas.toDataURL("image/jpeg");
        a.download = new Date().getTime();
        a.click();
    })
}