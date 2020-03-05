let restCards = document.querySelector("#restaurants-cards");
for (let i = 0; i < 6; i++) {
  restCards.insertAdjacentHTML("beforeend", getPreloader());
}
let searchInput = document.querySelector(".search__input");
let limit = 7;
let offset = 1;
let total = 0;
let restInfo = [];
let loaded = 0;
searchInput.addEventListener("keyup", function() {
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
});

makeFetch();
let btnLoadCards = document.querySelector(".btn-load-cards");
btnLoadCards.addEventListener("click", makeFetch);

function makeFetch() {
  if (offset == 1) {
    fetch(
      `https://ubereats-demo-api.now.sh/v1/places?offset=${offset}&limit=${limit}`
    )
      .then(res => res.json())
      .then(data => {
        restCards.innerHTML = "";
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
    for (let i = 0; i < total - offset; i++) {
      restCards.insertAdjacentHTML("beforeend", getPreloader());
    }
    fetch(
      `http://ubereats-demo-api.herokuapp.com/v1/places?offset=${offset}&limit=${limit}`
    )
      .then(res => res.json())
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
}

function getRestaurantCard(data) {
  return `
      <div class="col-4">
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
}

function getPreloader() {
  return `
    <div class="col-4 loaderImg">
    <div class="rest-card__img">
          <img src="./images/preloader.svg" alt="preload" />
        </div>
    </div>
    `;
}

function addRestCards() {
  for (loaded; loaded < offset; loaded++) {
    restCards.insertAdjacentHTML(
      "beforeend",
      getRestaurantCard(restInfo[loaded])
    );
  }
}
