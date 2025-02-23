import { markup } from './render-functions';
import { removeLoadStroke } from './render-functions';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { iziOption } from '../main'; // Імпорт iziOption з main.js

const box = document.querySelector('.gallery');
const load = document.querySelector('.load');
const addMoreButton = document.querySelector('.add-more-button');

let page = 1;
let perPage = 40;

export function resetPage() {
  page = 1;
}

export function addPage() {
  page += 1;
}

function endOfList(daddyElement, message = "We're sorry, but you've reached the end of search results.") {
  removeLoadStroke(daddyElement);
  daddyElement.insertAdjacentHTML('beforeend', `<p class="loading-text">${message}</p>`);
  addMoreButton.classList.add('hide');
}

export async function getImage(input) {
  const API_KEY = '48886586-526a4503d93c04f110b2b35b6';
  const query = encodeURIComponent(input);
  const urlParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: perPage,
  });
  const URL = `https://pixabay.com/api/?${urlParams}`;

  try {
    const { data } = await axios.get(URL);
console.log('Data received:', data); // Додано для перевірки
    if (data.hits.length === 0) {
      endOfList(load, "Sorry, there are no images matching your search query. Please try again!");
      removeLoadStroke(load);
      return;
    }

    markup(data);

    if (data.totalHits < page * perPage) {
      endOfList(load);
      return;
    }

    if (page >= 2) {
      const list = document.querySelector('.gallery__item');
      if (list) {
        const rect = list.getBoundingClientRect();
        window.scrollBy({
          top: rect.height * 2,
          behavior: 'smooth',
        });
      }
    }
  } catch (error) {
    console.error(error);
    box.innerHTML = '';
    load.innerHTML = '';
    iziToast.show({
      ...iziOption,
      message: `Sorry, an error happened. Try again. Error: ${error.message}`,
    });
    return;
  }
}
