// @ts-check

//Importo datos del json
const API_CIUDADES_URL = './ciudades.json/lista-ciudades.json'
import {Ciudad, Paradas} from './class/ciudades.js'
//variable vacia a rellenar con datos de json/api fetch
/** @type {Ciudad[]} */
let ciudades = []
// Asigno en el DOM los eventos cargados 
document.addEventListener('DOMContentLoaded', onDomContentLoaded) 

//Eventos
function onDomContentLoaded() {
    //Asocio elementos del DOM por su ID a variables
    //boton buscar
    const searchButton = document.getElementById('searchButton');
    //caja usuario pone nombre ciudad
    const searchInput = document.getElementById('searchInput');
    //el propio formulario completo de busqueda
    const searchForm = document.getElementById('searchForm');

    //Procesar datos de json/API
    processCiudadesData()
    //Evitar refresh boton enter
    searchForm?.addEventListener('submit', blockEnterButton)
    //Autocompletar input del usuario
    searchInput?.addEventListener('input', searchProposal)
    //Buscador de la app (coincidencia input con base datos)
    searchButton?.addEventListener('click', searchButtonOnClick)
}


// METODOS que están recogidos en el Listener

//funcion para leer datos del json/API
async function getCiudadesData () {
    /** @type {Ciudad[]} */
    const ciudadesData = await fetch (API_CIUDADES_URL)
    .then ((response) => {
        if (!response.ok) {
            showError(response.status)
        }
        return response.json();
    })
    return ciudadesData
}
//funcion para obtener datos del json/API
async function pushCiudadesData() {
    const datosCiudades = await getCiudadesData()
    ciudades = datosCiudades
    
}

//funcion para bloquear el boton enter teclado
/**
 * @param {SubmitEvent} e
 */
function blockEnterButton(e) {
    e.preventDefault();
}

//funcion propuesta autocompletar inputSearch usuario
function searchProposal() {
    const searchInput = document.getElementById('searchInput')
    const nameBuscado = getInputValue(searchInput)?.toLowerCase()
    const sugerencias = ciudades.filter(ciudad =>
    ciudad.name.toLowerCase().startsWith(nameBuscado))
    const datalist = document.getElementById('ciudades')
    if(datalist) {
        datalist.innerHTML = '' // Limpiar opciones anteriores
    }  
    sugerencias.forEach(ciudad => {
        const option = document.createElement('option')
        option.value = `${ciudad.name} (${ciudad.country})`
        datalist?.appendChild(option);
    })
}

//funcion buscadora, main funcion para buscar coincidencias de ciudades
/**
 * @param {MouseEvent} e
 */
//esta funcion recoge todo lo que sucede al apretar boton buscar
function searchButtonOnClick(e) {
    //limpiamos resultados busqueda anterior
    const resultadosList = document.querySelector('.paradas-interesantes')
    if (resultadosList) {
        resultadosList.innerHTML = ''
    }
    const searchInput = document.getElementById('searchInput')
        //aseguramos que el input pase a minúscula
        //a la vez que pasamos el valor sarch input(del usuario) por la funcion que obtiene su value
        const nameBuscado = getInputValue(searchInput)?.toLowerCase()
        //condición para que input y info de json coincidan(buscador)
        const ciudadEncontrada = ciudades.find((/** @type {{ name: string; }} */ ciudad) => ciudad.name.toLowerCase() === nameBuscado) 
           if (ciudadEncontrada) {
           const nameEncontrado = ciudadEncontrada
           //funcion que imprime nombre ciudad buscada
           addTitle(nameEncontrado)
           //funcion que imprime lista monumentos ciudad buscada
           addParadasList(ciudadEncontrada)
           console.log("La ciudad encontrada es:", nameEncontrado)
        } else {
            notFound(nameBuscado)
            console.log('Ciudad no encontrada')
    }
    searchInput?.setAttribute('value', " ")
}
//C.R.U.D

//funcion para obtener el value del elemento concreto
/**
 * @param {HTMLElement | null} inputElement
 * @returns {string} 
 */
function getInputValue(inputElement) {
    if (inputElement) {
      return /** @type {HTMLInputElement} */(inputElement).value
    } else {
      return ''
    }
  }

//Crear el título con el nombre de la ciudad encontrada
/**
 * @param {{ name: string; }} nameEncontrado
 */
function addTitle(nameEncontrado) {
    const titleList = document.getElementById('tituloCiudad')
    if (titleList) {
      titleList.innerText = nameEncontrado.name;
    } else {
      console.error('Elemento con ID "tituloCiudad" no encontrado.')
    }
}

//Crear la lista con los puntos de visita a la lista
/**
 * @param {{ paradas: any; }} ciudadEncontrada
 */
function addParadasList(ciudadEncontrada){
    const LISTADO = document.getElementsByClassName('paradas-interesantes')[0]
    const paradas = ciudadEncontrada.paradas
    
    paradas.forEach (( /** @type {{ nombre_parada: string; imagen: string; descripcion: string; categoria: string; }} */ parada) => {
    //Crear elemntos en DOM para almacenar la info
    const newParadasItem = document.createElement('li')
    const newFigureParadas = document.createElement('figure')
    const newImgParadas = document.createElement('img')
    const newNameParadas = document.createElement('h2')
    const newDescriptionParadas = document.createElement('p')
    const newCategoriaParadas = document.createElement('h3')
    

    //Asociar cada elemento DOM con info de json
    //Asociar cada elemento hijo con su padre
    newParadasItem.appendChild(newFigureParadas)
    newImgParadas.src = parada.imagen
    newFigureParadas.appendChild(newImgParadas)
    newNameParadas.innerText = parada.nombre_parada
    newParadasItem.appendChild(newNameParadas)
    newDescriptionParadas.innerText = parada.descripcion
    newParadasItem.appendChild(newDescriptionParadas)
    newCategoriaParadas.innerText = parada.categoria
    newParadasItem.appendChild(newCategoriaParadas)
    //almacenado todo a la OL del html
    LISTADO.appendChild(newParadasItem)
    })
}

//Crear texto ciudad no encontrada
/**
 * @param {string} nameBuscado
 */
function notFound(nameBuscado) {
    const ciudadSinInfo = document.getElementById('tituloCiudad')

    if (ciudadSinInfo) {
        ciudadSinInfo.innerText = 'No hay ruta para ' + nameBuscado.toUpperCase()
    } else {
        console.error('Elemento con ID "tituloCiudad" no encontrado.')
    }
}

//funcion para activar las funciones que obtienen datos del json/API y los añaden el el DOM
function processCiudadesData() {
    getCiudadesData()
    pushCiudadesData()
}

/**
 * @param {number} status
 */
//funcion que muestra error en caso de no obtener datos del API
function showError(status) {
    throw new Error("Function not implemented.")
}
