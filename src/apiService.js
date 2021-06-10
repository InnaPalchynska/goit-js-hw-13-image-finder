const BASE_URL = 'https://pixabay.com/api';
// const API_KEY = '21988009-297d867560bf729bce41e20bb';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      q: this.searchQuery,
      page: this.page,
      per_page: 12,
      key: '21988009-297d867560bf729bce41e20bb',
    });

    return fetch(`${BASE_URL}/?${searchParams}`).then(response =>
      response.json(),
    );
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
