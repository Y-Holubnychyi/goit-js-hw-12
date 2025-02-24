import { markup } from './render-functions';
import { removeLoadStroke } from './render-functions';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { iziOption } from '../main'; // Імпорт iziOption з main.js

const box = document.querySelector('.gallery');
const load = document.querySelector('.load');
const addMoreButton = document.querySelector('.add-more-button');

if (!box || !load || !addMoreButton) {
  console.error('One or more elements not found');
}

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
  if (!daddyElement.querySelector('.loading-text')) {
    daddyElement.insertAdjacentHTML('beforeend', `<p class="loading-text">${message}</p>`);
  }
  if (addMoreButton) {
    addMoreButton.classList.add('hide'); // Приховуємо кнопку "Load more"
    console.log('Load more button hidden'); // Додано для перевірки
  } else {
    console.error('Load more button not found'); // Додано для перевірки
  }
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
    console.log('Fetching images from Pixabay...'); // Додано для перевірки
    const { data } = await axios.get(URL);
    console.log('Data received from Pixabay:', data); // Додано для перевірки

    if (data.hits.length === 0) {
      console.log('No images found for the query:', input); // Додано для перевірки
      endOfList(load, "Sorry, there are no images matching your search query. Please try again!");
      return; // Виходимо з функції
    }

    console.log('Images found:', data.hits.length); // Додано для перевірки
    markup(data); // Викликаємо markup, який містить removeLoadStroke

    if (data.totalHits < page * perPage) {
      console.log('End of search results reached'); // Додано для перевірки
      endOfList(load);
      return; // Виходимо з функції
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
    console.error('Error fetching images from Pixabay:', error); // Додано для перевірки
    box.innerHTML = '';
    load.innerHTML = '';
    removeLoadStroke(load); // Приховуємо текст "Wait, the image is loaded" у разі помилки
    iziToast.show({
      ...iziOption,
      message: `Sorry, an error happened. Try again. Error: ${error.message}`,
    });
    return; // Виходимо з функції
  }
}