import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import errorIcon from '../img/error.svg';

const box = document.querySelector('.gallery');
const load = document.querySelector('.load');
const addMoreButton = document.querySelector('.add-more-button');
const iziOption = {
  messageColor: '#FAFAFB',
  messageSize: '16px',
  backgroundColor: '#EF4040',
  iconUrl: errorIcon,
  transitionIn: 'bounceInLeft',
  position: 'topRight',
  displayMode: 'replace',
  closeOnClick: true,
};

export function addLoadStroke(daddyElement) {
  if (!daddyElement) {
    console.error('Parent element not found');
    return;
  }

  console.log('Adding load stroke...'); // Додано для перевірки

  // Додаємо надпис та індикатор завантаження
  daddyElement.insertAdjacentHTML(
    'beforeend',
    '<p class="loading-text">Wait, the image is loaded</p><span class="loader"></span>'
  );
  addMoreButton.classList.add('hide'); // Приховуємо кнопку "Load more"
}

export function removeLoadStroke(daddyElement) {
  if (!daddyElement) {
    console.error('Parent element not found');
    return;
  }

  console.log('Removing load stroke...'); // Додано для перевірки

  // Видаляємо надпис та індикатор завантаження
  const textElement = daddyElement.querySelector('.loading-text');
  const loaderElement = daddyElement.querySelector('.loader');

  if (textElement) textElement.remove();
  if (loaderElement) loaderElement.remove();

  addMoreButton.classList.remove('hide'); // Показуємо кнопку "Load more"
}

export function markup(data) {
  if (!box) {
    console.error('Gallery element not found');
    return;
  }

  console.log('Rendering images...'); // Додано для перевірки

  const { hits } = data;

  if (hits.length === 0) {
    console.log('No hits found in data'); // Додано для перевірки
    iziToast.show({
      ...iziOption,
      message: 'Sorry, there are no images matching your search query. Please, try again!',
    });
    box.innerHTML = '';
    removeLoadStroke(load); // Приховуємо надпис, якщо результатів немає
    return;
  }

  const markup = hits
    .map(
      image =>
        `<li class='gallery__item'>
        <a class='gallery__link' href="${image.largeImageURL}">
        <img class='gallery__img' src="${image.webformatURL}" alt="${image.tags}" />
          <div class="grid">
            <p>Likes</p>
            <p>Views</p>
            <p>Comment</p>
            <p>Downloads</p>
            <span>${image.likes}</span>
            <span>${image.views}</span>
            <span>${image.comments}</span>
            <span>${image.downloads}</span>
          </div>
        </a>
      </li>`
    )
    .join(' ');

  box.insertAdjacentHTML('beforeend', markup); // Додаємо зображення до галереї
  console.log('Images rendered successfully'); // Додано для перевірки
  removeLoadStroke(load); // Приховуємо надпис після додавання зображень

  // Ініціалізація SimpleLightbox
  const galleryLinks = document.querySelectorAll('.gallery a');
  if (galleryLinks.length > 0) {
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    lightbox.refresh();
  }
}