import { getImage, resetPage, addPage } from './js/pixabay-api';
import { addLoadStroke, removeLoadStroke } from './js/render-functions';
import errorIcon from './img/error.svg';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export const iziOption = {
  messageColor: '#FAFAFB',
  messageSize: '16px',
  backgroundColor: '#EF4040',
  iconUrl: errorIcon,
  transitionIn: 'bounceInLeft',
  position: 'topRight',
  displayMode: 'replace',
  closeOnClick: true,
};

const box = document.querySelector('.gallery');
const load = document.querySelector('.load');
const addMoreButton = document.querySelector('.add-more-button');
const form = document.querySelector('.form');
const input = document.querySelector('.user-input');

if (!box) console.error('Gallery element not found');
if (!load) console.error('Load element not found');
if (!addMoreButton) console.error('Load more button not found');
if (!form) console.error('Form element not found');
if (!input) console.error('Input element not found');

let searchQuery = '';

if (!form) {
  console.error('Form element not found');
} else {
  form.addEventListener('submit', event => {
  event.preventDefault();
  console.log('Form submitted'); // Додано для перевірки
  searchQuery = input.value.trim();
  if (!searchQuery) {
    iziToast.show({
      ...iziOption,
      message: 'Please enter the search query',
    });
    return;
  }
  box.innerHTML = ''; // Очищаємо галерею
  load.innerHTML = ''; // Очищаємо блок з повідомленнями
  resetPage(); // Скидаємо сторінку до 1
  addLoadStroke(load); // Показуємо текст "Wait, the image is loaded"
  addMoreButton.classList.add('hide'); // Приховуємо кнопку "Load more"
  getImage(searchQuery)
    .then(() => {
      input.value = ''; // Очищаємо поле вводу
      input.focus(); // Фокусуємося на полі вводу
    })
    .catch(error => {
      console.error(error);
      input.value = ''; // Очищаємо поле вводу в разі помилки
      input.focus(); // Фокусуємося на полі вводу
    });
});
}

if (!addMoreButton) {
  console.error('Load more button not found');
} else {
  addMoreButton.addEventListener('click', event => {
    addPage();
    addLoadStroke(load);
    getImage(searchQuery);
  });
}