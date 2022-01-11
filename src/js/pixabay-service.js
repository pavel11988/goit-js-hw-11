export default class PixabayApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchOfQuery() {
        const axios = require('axios').default;
    
        const options = {
            method: 'get',
            url: 'https://pixabay.com/api/',
            params: {
                key: '25183091-c830d5bb3408c075d70b274d4',
                q: this.searchQuery,
                image_type: 'photo',
                per_page: 40,
                page: this.page,
                orientation: 'horizontal',
                safesearch: true,
            },
          };
      
        const serchResult = await axios(options);

        this.incrementPage();
        
        return serchResult.data;

    }

    incrementPage() {
        this.page += 1;
    }

    resetPage () {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery){
        this.searchQuery = newQuery;
    }
}