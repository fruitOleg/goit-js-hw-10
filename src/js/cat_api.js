const selectItem = document.querySelector('.breed-select');
const showItem = document.querySelector('.cat-info');
const loadTxt = document.querySelector('.loader');
const errTxt = document.querySelector('.error');

const BASE_URL = 'https://api.thecatapi.com/v1/';
const API_KEY =
  'live_2pxctkIY4qNFvmbxyu6z1EKpsWf80lBER57qNLaD9ln2XYeHBbHtAglxU48bpRhk';

function fetchBreeds() {
  return fetch(`${BASE_URL}breeds?api_key=${API_KEY}`).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
}

selectItem.hidden = true;
loadTxt.hidden = true;
errTxt.hidden = true;

fetchBreeds()
  .then(data => {
    selectItem.hidden = true;
    loadTxt.hidden = false;

    for (const item of data) {
      const itemList = document.createElement('option');
      selectItem.append(itemList);
      itemList.value = item.id;
      itemList.textContent = item.name;
    }

    selectItem.hidden = false;
    loadTxt.hidden = true;
  })
  .catch(() => {
    loadTxt.hidden = true;
    errTxt.hidden = false;
  });

selectItem.addEventListener('change', fetchCatByBreed);

function fetchCatByBreed(breedId) {
  loadTxt.hidden = false;
  showItem.innerHTML = '';

  fetch(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId.target.value}&api_key=${API_KEY}`
  )
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      for (const item of data) {
        item.breeds.map(({ name, description, temperament }) => {
          showItem.innerHTML = `<ul style=list-style:none>
                <li>
                    <img src="${item.url}" height=400px></img>
                    <h3>${name}</h3>
                    <p>${description}</p>
                    <p><b>Temperament:</b> ${temperament}</p>
                </li>
            </ul>`;
        });
      }
      loadTxt.hidden = true;
    })

    .catch(() => {
      loadTxt.hidden = true;
      errTxt.hidden = false;
    });
}
