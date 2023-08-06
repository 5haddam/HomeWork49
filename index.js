const API_KEY = 'AIzaSyDEdKL9cXaxcz1rBpHphnMnWcLESDAcme8';

function search() {
  const input = document.querySelector('.search');
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchResult = input.value.replaceAll(' ', '+');
    if (!!searchResult.trim()) {
      render(searchResult);
      console.log(searchResult);
    }
  });
}

function render(query) {  
  const paginationButton = document.createElement('button');
  const error = document.createElement('p');
  
  const buttonDiv = document.querySelector('.button-pagination-div');
  const main = document.querySelector('.main');

  main.innerText = '';
  buttonDiv.innerText = '';
  error.innerText = 'Books not found';

  error.classList.add('error');
  
  paginationButton.addEventListener('click', loadData);
  
  let startIndex = 0; // 735
  
  let isLoading = false;
  
  loadData();
  
  async function fetchData() {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=40&startIndex=${startIndex}`)
      .then(response => {
        console.log(response);
        return response.json()})
      .then(data => {
        if (data?.items) {
          data.items.length < 40 ? removePagination() : null;
          return data;
        }
        main.append(error);
      })
      .catch(error => {
        console.error(error);
      });
  }
  
  async function loadData() {
    if (isLoading) return;
    isLoading = true;
  
    const data = await Promise.all([
      await fetchData()
    ]);
  
    startIndex += 40;
  
    isLoading = false;
    if (data[0]) {
      renderBooks(data);
      renderPaginationButton();
    }
  }
  
  function renderBooks(data) {
    console.log(data);
    data[0].items.forEach(book => { main.append(renderBook(book)) });
  }
  
  function renderPaginationButton() {
    paginationButton.innerText = 'Load More';
    buttonDiv.append(paginationButton);
  }
  
  function renderBook(bookData) {
    console.log(bookData);
    const infoLink = document.createElement('a');
    const book = document.createElement('div');
    const img = document.createElement('img');
    const title = document.createElement('p');
    const authors = document.createElement('p');
  
    const icon = bookData.volumeInfo?.imageLinks?.thumbnail
      || bookData.volumeInfo?.imageLinks?.smallThumbnail
      || 'https://books.google.com.ua/googlebooks/images/no_cover_thumb.gif';
  
    infoLink.href = bookData.volumeInfo?.infoLink;
    img.src = icon;
    img.width = 128;
    img.height = 180;
    title.innerText = bookData.volumeInfo?.title || '';
    authors.innerText = bookData.volumeInfo?.authors || '';
  
    book.classList.add('book');
    authors.classList.add('authors');
    
    book.append(img, title, authors);
    infoLink.append(book);
  
    return infoLink;
  }
  
  function removePagination() {
    paginationButton.removeEventListener('click', loadData);
  }
}

// render();

search();