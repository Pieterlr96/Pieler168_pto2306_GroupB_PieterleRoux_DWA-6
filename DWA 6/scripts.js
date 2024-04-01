import { BOOKS_PER_PAGE, authors, genres, books } from './data.js'

//range counter
const range = books.length
if (!books || !Array.isArray(books)) {
    throw new Error('Source required')
}
if (!range || range.length < 2) {
    throw new Error('Range must be an array with two numbers')
}let page = 1;

// Day night mode
const settings = document.querySelector('[data-header-settings]')
const settingsForm = document.querySelector('[data-settings-form]')
const settingsTheme = document.querySelector("[data-settings-theme]")
const settingsOverlay = document.querySelector("[data-settings-overlay]")
const settingsCancel = document.querySelector('[data-settings-cancel]')


const modes =  {
    day: ["255, 255, 255", "10, 10, 20"],
    night: ["10, 10, 20", "255, 255, 255"],
  }

  if (window.matchMedia) {
    // Set theme to 'day' for light preference
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      settingsTheme.value = "day"
    }
    // Set theme to 'night' for dark preference
     else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      settingsTheme.value = "night" 
    }
  } else {
    // Set a default theme ('day')
    settingsTheme.value = "day" 
  }
  
  //User selects day or night mode
    settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const formSubmit = new FormData(event.target);
    const submit = Object.fromEntries(formSubmit);
  
    document.documentElement.style.setProperty(
      "--color-light",
      modes[submit.theme][0]
    )
    document.documentElement.style.setProperty(
      "--color-dark",
      modes[submit.theme][1]
    )
  
    settingsOverlay.close();
  })

  //Open settings Theme
  settings.addEventListener('click', function() {
    settingsTheme.focus();
    settingsOverlay.showModal();
  })

  //close settings
  settingsCancel.addEventListener('click', function() {
    settingsOverlay.close();
    settingsForm.reset();
  });
  
const dataListItems = document.querySelector('[data-list-items]')
const dataSearchGenres = document.querySelector('[data-search-genres]')
const dataSearchAuthors = document.querySelector('[data-search-authors]')
const dataListActive = document.querySelector('[data-list-active]')

//creates book display range
const fragmentBooks = document.createDocumentFragment()
const bookList = books.slice(0, 36)
bookList.forEach(({ author: authorId, id, image, title }) => {
    const extractedList = document.createElement("button")
    extractedList.classList.add("preview")
    extractedList.setAttribute("data-preview", id);

    //HTML display info
    extractedList.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[authorId]}</div>
        </div> `

    fragmentBooks.appendChild(extractedList);
});
dataListItems.appendChild(fragmentBooks);

//preview function
function loadPreview(preview) {
    const { author: authorId, id, image, title } = preview;
  
    const showMore = document.createElement("button")
    showMore.classList = "preview";
    showMore.setAttribute("data-preview", id)
  
    showMore.innerHTML = /* html */ `
    <img class="preview__image" src="${image}"/>
    <div class="preview__info">
    <h3 class="preview__title">${title}</h3>
    <div class="preview__author">${authors[authorId]}</div> `
    return showMore;
  }
// ShowMore button
const dataListButton = document.querySelector("[data-list-button]")
dataListButton.innerHTML =/*HTML*/`
<span>Load More</span>
<span class = 'rest of books'>
(${books.length - page * BOOKS_PER_PAGE > 0
    ? books.length - page * BOOKS_PER_PAGE
    : 0}</span>
`
dataListButton.addEventListener("click", () => {
    // Define Range
    const beginning = (page - 1) * BOOKS_PER_PAGE
    const end = beginning + BOOKS_PER_PAGE
    const AddBooks = books.slice(beginning, end)

    const addFragment = document.createDocumentFragment()
    for ( let i = 0; i<AddBooks.length; i++) {
    const loadMore = AddBooks[i]
    const preview = loadPreview(loadMore)
    addFragment.appendChild(preview)
    }

    dataListItems.appendChild(addFragment)
  const otherBooks = books.length - page * BOOKS_PER_PAGE;
  listButton.innerHTML = /* HTML */ `
    <span>Show more</span>
    <span class="list__remaining"> (${otherBooks > 0 ? otherBooks : 0})</span>
  `
  page = page + 1
  listButton.disabled = otherBooks === 0 })

//Search button
const dataHeaderSearch = document.querySelector("[data-header-search]")
const dataSearchOverlay = document.querySelector("[data-search-overlay]")
const dataSearchCancel = document.querySelector("[data-search-cancel]")
const dataSearchTitle = document.querySelector("[data-search-title]")
const dataSearchForm = document.querySelector("[data-search-form]")
// opens search bars
dataHeaderSearch.addEventListener('click', function() {
dataSearchOverlay.showModal()
dataSearchTitle.focus()
})
dataSearchCancel.addEventListener('click', function(){
    dataSearchOverlay.close()
    dataSearchForm.reset()
})
dataSearchForm.addEventListener("submit", (event) => {
    //user selects seach criteria searchbar, click on "search" to retrive data
    event.preventDefault();
    const dataListMessage = document.querySelector("[data-list-message]")
  
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];
    const booksSearch = books;
  
    for (let i = 0; i < booksSearch.length; i++) {
      const book = booksSearch[i]
  
      let titleSearch = filters.title.trim() !== "" && book.title.toLowerCase().includes(filters.title.toLowerCase());
      let authorSearch = filters.author !== "any" && book.author.includes(filters.author);
      let genreSearch = filters.genre !== "any" && book.genres.includes(filters.genre);
            
      if (titleSearch  || authorSearch ||genreSearch) {
        result.push(book);
      }
    }
  
    if (result.length > 0) {
      dataListMessage.classList.remove("list__message_show");
      dataListButton.disabled = true
      dataListItems.innerHTML = ""
  
      const searchFragment = document.createDocumentFragment();
      //returns search results
      for (let i = 0; i < result.length; i++) {
        const book = result[i];
        const bookPreview = loadPreview(book)
        searchFragment.appendChild(bookPreview)
      }
      dataListItems.appendChild(searchFragment)
    } else {
      dataListMessage.classList.add("list__message_show") 
      listButton.disabled = true
      listItems.innerHTML = ""
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
    dataSearchOverlay.close()
    dataSearchForm.reset()
  });


//Genres 
const genresFragment = document.createDocumentFragment()
const genreSelectDefault = document.createElement('option')
genreSelectDefault.value = 'genre' 

// Set default display text as 'Genre'
genreSelectDefault.textContent = 'Genre'
genresFragment.appendChild(genreSelectDefault)

// Iterate through the genres and create options for each genre
Object.entries(genres).forEach(([id, name]) => {
    const genreSelect = document.createElement('option')
    genreSelect.value = id
    genreSelect.textContent = name
    genresFragment.appendChild(genreSelect)
});

// Append the genres to the HTML element
dataSearchGenres.appendChild(genresFragment)

//Authors 
const authorsFragment = document.createDocumentFragment()
const authorSelectDefault = document.createElement('option')
authorSelectDefault.value = 'author'

// Set default display text as 'Authors' 
authorSelectDefault.textContent = 'Authors' 
authorsFragment.appendChild(authorSelectDefault)

// Iterate through the authors and create options for each author
Object.entries(authors).forEach(([id, name]) => {
    const authorSelect = document.createElement('option')
    authorSelect.value = id;
    authorSelect.textContent = name;
    authorsFragment.appendChild(authorSelect)
});

// Append the authors to the HTML element
dataSearchAuthors.appendChild(authorsFragment)

//summary preview
const dataListImage = document.querySelector("[data-list-image]")
const dataListTitle = document.querySelector("[data-list-title]")
const dataListBlur = document.querySelector("[data-list-blur]")
const dataListSubtitle = document.querySelector("[data-list-subtitle]")
const dataListDescription = document.querySelector("[data-list-description]")
const dataListClose = document.querySelector("[data-list-close]")

dataListItems.addEventListener("click", (event) => {
  const pathArray = Array.from(event.path || event.composedPath())
  let active = null;

  for (let i = 0; i < pathArray.length; i++) {
    const node = pathArray[i]
    if (active) {
      break;
    }
    const previewIdNum = node?.dataset?.preview;

    for (let i = 0; i < books.length; i++) {
      const singleBook = books[i]
      if (singleBook.id === previewIdNum) {
        active = singleBook;
        break
      }}}

  if (!active) {return;}
  dataListImage.src = active.image
  dataListActive.open = true
  dataListTitle.textContent = active.title
  dataListBlur.src = active.image
  

  dataListSubtitle.textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
  dataListDescription.textContent = active.description
});
dataListClose.addEventListener("click", function() {
  dataListActive.close()
});
