const url = `https://ubereats-demo-api.now.sh/v1/places`; //url of API

let restCards = document.querySelector("#restaurants-cards");
let searchInput = document.querySelector(".search__input");
let limit = 7;
let offset = 1;
let total = 0;
let restInfo = [];
let loaded = 0;
let btnLoadCards = document.querySelector(".btn-load-cards");

//create start preloaders
for (let i = 0; i < 6; i++) {
  restCards.insertAdjacentHTML("beforeend", getPreloader());
}

makeFetch();

//get places from api
function makeFetch() {
  if (offset == 1) {
    fetch(url + `?offset=${offset}&limit=${limit}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(data => {
        restCards.innerHTML = ""; //delete preloaders
        for (let i = 0; i < data.items.length; i++) {
          restInfo.push(data.items[i]);
        }
        offset += data.items.length;
        limit += data.items.length;
        total = data.total;
        if (offset >= data.total) {
          btnLoadCards.remove();
        }
        addRestCards();
      })
      .catch(err => console.log(err));
  } else {
    //create preloaders
    for (let i = 0; i < total - offset; i++) {
      restCards.insertAdjacentHTML("beforeend", getPreloader());
    }
    fetch(url + `?offset=${offset}&limit=${limit}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(data => {
        let loadImgages = document.querySelectorAll(".loaderImg");
        loadImgages.forEach(img => {
          img.remove();
        });
        for (let i = 0; i < data.items.length; i++) {
          restInfo.push(data.items[i]);
        }
        offset += data.items.length;
        limit += data.items.length;
        if (offset >= data.total) {
          btnLoadCards.remove();
        }
        addRestCards();
      })
      .catch(err => console.log(err));
  }
} //end function makeFetch

//create card structure
function getRestaurantCard(data) {
  return `
      <div class="col-4 col-sm-6 col-md-12">
      <a href="#" class="rest-card">
        <div class="rest-card__img" style="background-image: url(${data.img})">
          <button
            type="button"
            value="liked"
            class="rest-card__img__fav-but"
          ></button>
        </div>
        <h3 class="rest-card__title">${data.title}</h3>
        <div class="rest-card__info">
          ${data.price} • ${data.type}
        </div>
        <div class="rest-card__dur-rate">
          <div class="rest-card__dur-rate__duration">
            30 - 40 Мин.
          </div>
          <div class="rest-card__dur-rate__rate">
            ${data.rating} <img src="./images/Vector.svg" alt="star" /> (${data.reviews})
          </div>
        </div>
      </a>
    </div>
      `;
} //end function getRestaurantCard()

//create preloader
function getPreloader() {
  return `
    <div class="col-4 col-sm-6 col-md-12 loaderImg">
    <div class="rest-card__img">
          <img src="./images/preloader.svg" alt="preload" />
        </div>
    </div>
    `;
} //and function getPreloader()

//add cards to page
function addRestCards() {
  for (loaded; loaded < offset; loaded++) {
    restCards.insertAdjacentHTML(
      "beforeend",
      getRestaurantCard(restInfo[loaded])
    );
  }
} //end function addRestCards

//filter places on page
function keyUpPress() {
  let inputText = searchInput.value.toLowerCase();
  if (inputText !== "") {
    restCards.innerHTML = "";
    restInfo.filter(r => {
      if (r.title.toLowerCase().indexOf(inputText) >= 0) {
        restCards.insertAdjacentHTML("beforeend", getRestaurantCard(r));
      }
    });
  } else {
    restCards.innerHTML = "";
    restInfo.forEach(r => {
      restCards.insertAdjacentHTML("beforeend", getRestaurantCard(r));
    });
  }
} //end function keyUpPress

searchInput.addEventListener("keyup", keyUpPress);
btnLoadCards.addEventListener("click", makeFetch);
