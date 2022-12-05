const darkThemeBtn = document.querySelector(".dark-theme-btn")
const lightThemeBtn = document.querySelector(".light-theme-btn")
const bodyEl = document.querySelector("body")

darkThemeBtn.addEventListener("click", () => {
    localStorage.setItem("darkTheme", true)
    toggleDarkTheme();
})
lightThemeBtn.addEventListener("click", () => {
    localStorage.removeItem("darkTheme")
    toggleLightTheme();
})

const toggleLightTheme = () => {
    bodyEl.setAttribute("data-theme", "light");
    darkThemeBtn.style.display = "block"
    lightThemeBtn.style.display = "none"

}
const toggleDarkTheme = () => {
    bodyEl.setAttribute("data-theme", "dark");
    darkThemeBtn.style.display = "none"
    lightThemeBtn.style.display = "block"
}
const toggleSavedTheme = () => {
    let darkTheme = localStorage.getItem("darkTheme");
    darkTheme ? toggleDarkTheme() : toggleLightTheme()
}

toggleSavedTheme();