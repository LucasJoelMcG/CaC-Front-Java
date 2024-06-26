"use strict";
//variables globales necesarias para el funcionamiento de las paginas, id de meme y los memes por pagina
let currentPage = 1;
let lastClickedMemeId = 0;
const memesPerPage = 8;

// funcion para traer los memes de la api
function fetchMemeTemplates(page, searchTerm = '') {
  fetch('https://api.imgflip.com/get_memes')
    .then(response => response.json())
    .then(data => {
      let memes = [];
      //filtro los memes segun la busqueda o los tomo a todos si no hay busqueda
      if (searchTerm!=='') {
        memes = data.data.memes.filter(meme => meme.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      else {
        memes=data.data.memes;
      }
      const memesContainer = document.getElementById('memesContainer');
      // Limpio el contenedor de memes de la pagina
      memesContainer.innerHTML = '';
      // calculo el principio y final de memes a mostrar
      const startIndex = (page - 1) * memesPerPage;
      const endIndex = Math.min(startIndex + memesPerPage, memes.length);
      // creo los elementos para el contenedor de memes
      for (let i = startIndex; i < endIndex; i++) {
        const meme = memes[i];
        const memeTemplate = document.createElement('div');
        memeTemplate.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4');
        memeTemplate.innerHTML = `
          <a href="#"  onclick="setLastMemeId(${meme.id})" data-bs-toggle="modal" data-bs-target="#editModal" data-img-src="${meme.url}" data-template-id="${meme.id}">
            <img src="${meme.url}" class="img-fluid rounded" alt="${meme.name}">
          </a>
        `;
        memesContainer.appendChild(memeTemplate);
      }
      // Cambio el numero de pagina actual
      currentPage = page;
      // Creo los enlaces del paginador
      createPaginationLinks(memes.length);
    })
    .catch(error => console.error('Error al traer los memes:', error));
}

function setLastMemeId (id) {
  lastClickedMemeId=id;
}

// funcion para crear los links del template
function createPaginationLinks(totalMemes) {
  const paginationElements = document.getElementById('paginationElements');
  paginationElements.innerHTML = '';
  // calculo el numero de paginas
  const totalPages = Math.ceil(totalMemes / memesPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('li');
    pageLink.classList.add('page-item');
    if (i === currentPage) {
      pageLink.classList.add('active');
    }
    pageLink.innerHTML = `<a class="page-link" href="#" onclick="fetchMemeTemplates(${i})">${i}</a>`;
    paginationElements.appendChild(pageLink);
  }
}

// funcion para trabajar el modal de edición y creación de memes.
document.getElementById('editModal').addEventListener('show.bs.modal', function (event) {
  const modalTrigger = event.relatedTarget; 
  const memeId = modalTrigger.getAttribute('data-template-id'); 
  const modalImage = this.querySelector('#memeImage'); 
  modalImage.src = modalTrigger.getAttribute('data-img-src'); 

  /* traigo los memes de la api para buscar a cual corresponde el id
  se podría usar una constante de tipo array donde almacenara todos los memes
  pero al ser js vanilla se terminaría exponiendo y no querríamos que eso pase.
  */
  fetch(`https://api.imgflip.com/get_memes`)
    .then(response => response.json())
    .then(data => {
      const memeTemplate = data.data.memes.find(meme => meme.id === memeId);
      const modalForm = this.querySelector('#memeForm'); 
      const formContent = modalForm.querySelector('.form-content'); 
      formContent.innerHTML = ''; 

      // creo los input para las cajas de texto
      for (let i = 0; i < memeTemplate.box_count; i++) {
        const textBoxLabel = document.createElement('label');
        textBoxLabel.setAttribute('for', `textBox${i}`);
        textBoxLabel.textContent = `Texto ${i + 1}:`;
        formContent.appendChild(textBoxLabel);

        const textBoxInput = document.createElement('input');
        textBoxInput.setAttribute('type', 'text');
        textBoxInput.setAttribute('class', 'form-control mb-3');
        textBoxInput.setAttribute('id', `textBox${i}`);
        textBoxInput.setAttribute('name', `textBox${i}`);
        formContent.appendChild(textBoxInput);
      }
    })
    .catch(error => console.error('Error Al traer los memes:', error));
});

// funcion para la creacion de memes
// se necesitaria un backend para no exponer cuestiones no deseadas :)
function createMeme() {
  const memeId = lastClickedMemeId;

  // me traigo los datos de los input
  const memeForm = document.getElementById('memeForm');
  const textInputs = memeForm.querySelectorAll('input[type="text"]');
  const boxes = [];
  textInputs.forEach(input => {
      boxes.push({text: input.value.toUpperCase()});
  });

  const requestBody = {
    template_id: String(memeId),
    boxes,
  }
  // llama a la api para crear el meme
  memeCreation(requestBody).then(data => {
    if (data.success) {
      // Si la creación de meme sale bien, mostrarlo en una nueva pestaña
      const imageUrl = data.data.url;
      window.open(imageUrl, '_blank');
  } else {
      // sino mandarlo por consola
      console.error('Error al crear el meme:', data);
  }
  })
  .catch(error => {
      console.error('Error al crear el meme:', error);
  });
}

function memeCreation(requestBody) {
  const API_URL = atob('aHR0cHM6Ly9wb3J0Zm9saW8tbWFpbGVyLXBzNjYub25yZW5kZXIuY29t');
  return fetch(`${API_URL}/createMeme`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
  })
  .then(response => response.json())
  .catch(error => console.error(error));
}

function inputSearch(value) {
  fetchMemeTemplates(1,value);
}

// Traer los memes cuando se cargue la página
window.addEventListener('load', () => {
  fetchMemeTemplates(1);
});