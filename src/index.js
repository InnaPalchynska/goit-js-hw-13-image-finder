import getRefs from './get-refs.js';
import ImagesApiService from './apiService.js';

import galleryTpl from './gallery.hbs';

import * as PNotify from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';

PNotify.defaultModules.set(PNotifyMobile, {});

const imagesApiService = new ImagesApiService();

const refs = getRefs();
refs.searchForm.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();

  imagesApiService.query = event.currentTarget.query.value;
  if (!imagesApiService.query) {
    return;
  }

  imagesApiService.resetPage();
  refs.cardContainer.innerHTML = '';

  imagesApiService
    .fetchImages()
    .then(images => {
      renderImageCard(images);
      imagesApiService.incrementPage;
      PNotify.success({
        text: `${images.total} matches found.`,
      });
    })
    .catch(onFetchError);
}

function renderImageCard(images) {
  if (images.total === 0) {
    PNotify.error({
      text: 'No matches found. Please enter a more specific query!',
    });
  }

  makeImageCard(images.hits);
}

function onFetchError(error) {
  PNotify.error({
    title: 'Oh No!',
    text: `${error}`,
  });
}

function makeImageCard(images) {
  const imageMarkup = galleryTpl(images);
  refs.cardContainer.insertAdjacentHTML('beforeend', imageMarkup);
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && imagesApiService.query !== '') {
      imagesApiService.fetchImages().then(images => {
        renderImageCard(images);
        console.dir(refs.cardContainer.lastElementChild);
        imagesApiService.incrementPage();
        refs.toScroll.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});

observer.observe(refs.sentinel);
