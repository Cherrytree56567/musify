const musicQuotes = [
    "Without music, life would be a mistake. – Friedrich Nietzsche",
    "Music is the universal language of mankind. – Henry Wadsworth Longfellow",
    "One good thing about music, when it hits you, you feel no pain. – Bob Marley",
    "Music can change the world because it can change people. – Bono",
    "Where words fail, music speaks. – Hans Christian Andersen",
    "Music gives a soul to the universe, wings to the mind, flight to the imagination, and life to everything. – Plato",
    "Music is the strongest form of magic. – Marilyn Manson"
];

function changeMusicQuote() {
    const randomIndex = Math.floor(Math.random() * musicQuotes.length);
    const quoteElement = document.getElementById('quote');
    if (quoteElement) {
        quoteElement.textContent = musicQuotes[randomIndex];
    } else {
        console.warn("Element with id 'quote' not found.");
    }
}

changeMusicQuote();
setInterval(changeMusicQuote, 5000);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementsByClassName("topnav")[0].classList.remove("hidden");
    document.getElementsByClassName("body-container")[0].classList.remove("hidden");
    document.getElementsByClassName("load-page")[0].classList.add("hidden");
});