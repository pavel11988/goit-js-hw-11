import hitsTpl from './templates/hits.hbs'
import './css/styles.css'
import PixabayApiService from './js/pixabay-service'
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';


const form = document.querySelector('.search-form')
const gallery = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')

const lightbox = new SimpleLightbox('.gallery a', { 
    animationSpeed: 150,
    fadeSpeed: 150,
    captions: true,
    captionsData: 'alt',
});

const pixabayApiService = new PixabayApiService();

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch (event) {
    event.preventDefault();  

    buttonStatus.buttonDisabled();

    pixabayApiService.query = event.currentTarget.elements.searchQuery.value;
    
    if(pixabayApiService.query.trim() === '') return zeroOfResults();

    pixabayApiService.resetPage();

    const resOfFetch = await pixabayApiService.fetchOfQuery();

    clearGallery();

    appendHitsMarkup(resOfFetch);
    
    
}

async function onLoadMore () {
    const resOfFetch = await pixabayApiService.fetchOfQuery();
    await appendHitsMarkup(resOfFetch);
    scroll();

}
 
async function appendHitsMarkup(dataObj) {

    const hits = dataObj.hits;
    const totalHits = dataObj.totalHits;

    if (gallery.innerHTML === '' && hits.length == 0) return zeroOfResults();

    if (gallery.innerHTML !== '' && hits.length == 0) return endOfData();

    if (gallery.innerHTML === '') Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)

    if (hits.length > 39) buttonStatus.buttonEnabled();

    gallery.insertAdjacentHTML('beforeend', hitsTpl(hits));

    lightbox.refresh();
    
}

async function clearGallery () {
    gallery.innerHTML = '';
}

async function zeroOfResults (){
    return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
}

async function endOfData() {
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
}

function scroll () {
    const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
    window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
    });
}


const buttonStatus = {
    async buttonDisabled() {
        loadMoreBtn.classList.add('is-hidden');
    }, 

    async buttonEnabled() {
        loadMoreBtn.classList.remove('is-hidden');
    } 
    
}

