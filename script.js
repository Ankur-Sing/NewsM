const API_KEY = "cc4a327c7f54450696769fe9f70be27a";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

function toggleNotes() {
    const notesSidebar = document.getElementById("notes-sidebar");
    notesSidebar.classList.toggle("open");
}

const saveNoteButton = document.getElementById("save-note-button");
const noteInput = document.getElementById("note-input");
const notesList = document.getElementById("notes-list");

saveNoteButton.addEventListener("click", () => {
    const noteText = noteInput.value.trim();
    if (noteText) {
        const noteElement = document.createElement("div");
        noteElement.className = "note";

        const noteContent = document.createElement("span");
        noteContent.textContent = noteText;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-note-button";
        deleteButton.innerHTML = "&times;";
        deleteButton.addEventListener("click", () => {
            notesList.removeChild(noteElement);
        });

        noteElement.appendChild(noteContent);
        noteElement.appendChild(deleteButton);
        notesList.appendChild(noteElement);

        noteInput.value = "";
    }
});
