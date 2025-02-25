import { markup } from './render-functions';
import { removeLoadStroke } from './render-functions';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { iziOption } from '../main';

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
  console.log('Page reset to 1'); // Додано для перевірки
}

export function addPage() {
  page += 1;
}

function endOfList(daddyElement, message = "We're sorry, but you've reached the end of search results.") {
  removeLoadStroke(daddyElement);
  iziToast.show({
    ...iziOption,
    message: message,
  });
  if (addMoreButton) {
    addMoreButton.classList.add('hide');
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
    const { data } = await axios.get(URL);

    if (data.hits.length === 0) {
      endOfList(load, "Sorry, there are no images matching your search query. Please try again!");
      return; 
    }

    markup(data); // Викликаємо markup, який містить removeLoadStroke

if (data.totalHits < page * perPage) {
  // Досягли кінця колекції – отримуємо останній елемент галереї
  const gallery = document.querySelector('.gallery');
  const lastImage = gallery ? gallery.lastElementChild : null;
  if (lastImage) {
    const rect = lastImage.getBoundingClientRect();
    if (rect.bottom <= window.innerHeight) {
      // Остання картинка вже видима – показуємо сповіщення відразу
      endOfList(load);
    } else {
      // Остання картинка не видима – додаємо обробник прокрутки
      const onScroll = () => {
        const lastRect = lastImage.getBoundingClientRect();
        if (lastRect.bottom <= window.innerHeight) {
          endOfList(load);
          window.removeEventListener('scroll', onScroll);
        }
      };
      window.addEventListener('scroll', onScroll);
    }
  }
  return;
}

if (page >= 2) {
  setTimeout(() => {
    const gallery = document.querySelector('.gallery');
    if (gallery && gallery.firstElementChild) {
      const card = gallery.firstElementChild;
      const { height: cardHeight } = card.getBoundingClientRect();
      // Отримуємо значення gap, якщо воно задане
      const gap = parseInt(window.getComputedStyle(gallery).gap) || 0;
      window.scrollBy({
        top: cardHeight * 2 + gap,
        behavior: 'smooth',
      });
    }
  }, 300); // затримка у 300 мс для оновлення розмітки
}


  } catch (error) {
  box.innerHTML = '';
  load.innerHTML = '';
  removeLoadStroke(load); // Приховуємо індикатор завантаження
  addMoreButton.classList.add('hide'); // Приховуємо кнопку "Load more"
  iziToast.show({
    ...iziOption,
    message: `Sorry, an error happened. Try again. Error: ${error.message}`,
  });
  return;
}

}