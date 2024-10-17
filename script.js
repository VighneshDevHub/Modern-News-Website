const API_KEY = "98d0ce5182f14c88804690473cd5e3d2";
const headlinesUrl = "https://newsapi.org/v2/top-headlines?";
const searchUrl = "https://newsapi.org/v2/everything?";

window.addEventListener("load", () => {
    fetchNews("Technology");
    document.getElementById("search-button").addEventListener("click", handleSearch);
});


async function fetchNews(query, isSearch = false) {
    let res;
    if (isSearch) {
        res = await fetch(`${searchUrl}q=${encodeURIComponent(query)}&apiKey=${API_KEY}`);
    } else {
        res = await fetch(`${headlinesUrl}category=${query.toLowerCase()}&apiKey=${API_KEY}`);
    }

    const data = await res.json();
    if (data.articles) {
        bindData(data.articles);
    } else {
        console.error("No articles found");
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
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
    newsTitle.innerHTML = `${article.title.slice(0, 60)}...`;
    newsDesc.innerHTML = `${article.description ? article.description.slice(0, 150) : ''}...`;

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function handleSearch() {
    const query = document.getElementById("search-input").value;
    if (query) {
        fetchNews(query, true); 
    }
}

const categories = ["Technology", "Science", "Health", "Sports", "Business"];
const nav = document.querySelector("nav ul");

categories.forEach(category => {
    const li = document.createElement("li");
    li.textContent = category;
    li.onclick = () => fetchNews(category);
    nav.appendChild(li);
});
