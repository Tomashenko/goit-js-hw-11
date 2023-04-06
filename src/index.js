import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

const lightbox = new SimpleLightbox('.gallery a',
 {captionDelay: 250});

const API_KEY = '34969330-9a082ccf7abba2fcb5aa8d710';
const BASE_URL = 'https://pixabay.com/api';

let searchQuery = '';
let page = 1;
 
const refs = {
    searchForm: document.querySelector('.search-form'),
    galleryContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
}

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

refs.loadMoreBtn.classList.add('hidden');

async function getImage() {
    try {
      const response = await axios.get(`${BASE_URL}/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
      console.log(response.data);
      const box = response.data;
      page += 1;
     
      return box;
      
    } catch (error) {
       return  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
     }
   }

function onSearch(e) {
    e.preventDefault();
    clearImageConteiner();

    searchQuery = e.currentTarget.elements.searchQuery.value.trim();

    resetPage();

    refs.loadMoreBtn.classList.add('hidden');
    
    getImage().then(hits => {
      
    appendImagesMarkup(hits); 

   refs.loadMoreBtn.classList.remove('hidden');
   lightbox.refresh();
});

}

function onLoadMore() {
    getImage().then(appendImagesMarkup, );
   }

function appendImagesMarkup(box) {

  if(box.hits.length === 0) {
    refs.loadMoreBtn.classList.add('hidden');
  return  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
   };
           
        const cardOfImage = box.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
          return `
            <div class="photo-card">
            <a class="gallery__item" href="${largeImageURL}">
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                <b> Likes </b>${likes}
                </p>
                <p class="info-item">
                <b >Views </b>${views}
                </p>
                <p class="info-item">
                <b >Comments </b>${comments}
                </p>
                <p class="info-item">
                <b >Downloads </b>${downloads}
                </p>
            </div>
          </a></div>`;}).join('');

    refs.galleryContainer.insertAdjacentHTML('beforeend', cardOfImage);

    Notiflix.Notify.info(`Hooray! We found ${box.totalHits} images.`); 

   lightbox.refresh(); 
}

function clearImageConteiner() {
    refs.galleryContainer.innerHTML = '';
}

function resetPage() {
  page = 1;
}



