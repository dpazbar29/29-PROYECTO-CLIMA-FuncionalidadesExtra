// Selección de elementos DOM
const container = document.querySelector(".container");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const spinner = document.querySelector("#spinner");

// Botón para obtener clima
const obtenerClimaBtn = formulario.querySelector('input[type="submit"]');

// Variables de estado
let mostrarEnFahrenheit = false;

// Listeners
window.addEventListener("load", () => {
    formulario.addEventListener("submit", buscarClima);
    formulario.addEventListener("submit", activarSpinner);
    cargarHistorial();
});

// Crear contenedor para el historial
const historialContainer = document.createElement('div');
historialContainer.classList.add('mt-5', 'text-white', 'bg-gray-800', 'p-4', 'rounded');
historialContainer.innerHTML = '<h3 class="text-2xl">Historial de búsquedas</h3><ul id="historial" class="list-disc pl-5"></ul>';
container.appendChild(historialContainer);

// Cargar historial desde Local Storage
function cargarHistorial() {
    const historialGuardado = JSON.parse(localStorage.getItem('historial')) || [];
    const historial = document.querySelector('#historial');

    historialGuardado.forEach(item => {
        agregarElementoHistorial(item, historial);
    });

    historial.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const [ciudad, pais] = e.target.textContent.split(', ').map(str => str.trim());
            realizarBusquedaDesdeHistorial(ciudad, pais);
        }
    });
}

// Actualizar historial y guardar en Local Storage
function actualizarHistorial(ciudad, pais) {
    const historial = document.querySelector('#historial');
    const nuevoItem = `${ciudad}, ${pais}`;

    agregarElementoHistorial(nuevoItem, historial);

    let historialGuardado = JSON.parse(localStorage.getItem('historial')) || [];
    historialGuardado.push(nuevoItem);

    if (historialGuardado.length > 5) {
        historialGuardado.shift();
    }

    localStorage.setItem('historial', JSON.stringify(historialGuardado));

    if (historial.children.length > 5) {
        historial.removeChild(historial.firstChild);
    }
}

// Agregar un elemento al historial (DOM)
function agregarElementoHistorial(item, historial) {
    const elemento = document.createElement('li');
    elemento.textContent = item;
    historial.appendChild(elemento);
}

// Realizar búsqueda desde el historial
function realizarBusquedaDesdeHistorial(ciudad, pais) {
    formulario.querySelector('#ciudad').value = ciudad;
    formulario.querySelector('#pais').value = pais;
    buscarClima(new Event('submit'));
}

// Función para buscar el clima
function buscarClima(e) {
    e.preventDefault();

    const ciudad = formulario.querySelector("#ciudad").value;
    const pais = formulario.querySelector("#pais").value;

    if (ciudad === "" || pais === "") {
        monstarError("Ambos campos son obligatorios");
        return;
    }

    actualizarHistorial(ciudad, pais);
    consultarAPI(ciudad, pais);
}

// Mostrar error
function monstarError(mensaje) {
    const alertExist = document.querySelector(".bg-red-100");
    if (!alertExist) {
        const alerta = document.createElement("div");
        alerta.classList.add("bg-red-100", "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "max-w-md", "mx-auto", "mt-5", "text-center");
        alerta.innerHTML = `
            <strong class="font-bold">Error:</strong>
            <span class="block">${mensaje}</span>
        `;
        container.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

// Consultar la API de OpenWeather
function consultarAPI(ciudad, pais) {
    const API_Key = "3772a6f00739f6fea4645469c4abda23";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${API_Key}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.cod === "404") {
                monstarError("Ciudad no encontrada");
                return;
            }
            mostrarClima(data);
        });
}

// Mostrar el clima
function mostrarClima(clima) {
    limpiarHTML();

    const { main: { temp, temp_max, temp_min }, wind: { speed }, sys: { country } } = clima;
    const temperatura = mostrarEnFahrenheit ? kelvinToFahrenheit(temp) : kelvinToCentigrados(temp);
    const temperaturaMin = mostrarEnFahrenheit ? kelvinToFahrenheit(temp_min) : kelvinToCentigrados(temp_min);
    const temperaturaMax = mostrarEnFahrenheit ? kelvinToFahrenheit(temp_max) : kelvinToCentigrados(temp_max);

    const actual = document.createElement("p");
    actual.innerHTML = `${clima.name}, ${country} ${temperatura} &#8451;`;
    actual.classList.add("text-6xl");

    const tempMin = document.createElement("p");
    tempMin.innerHTML = `Mínima: ${temperaturaMin} &#8451;`;
    tempMin.classList.add("text-xl");

    const tempMax = document.createElement("p");
    tempMax.innerHTML = `Máxima: ${temperaturaMax} &#8451;`;
    tempMax.classList.add("text-xl");

    const viento = document.createElement("p");
    viento.innerHTML = `Viento: ${speed} m/s`;
    viento.classList.add("text-xl");

    const resultadoDiv = document.createElement("div");
    resultadoDiv.classList.add("text-center", "text-white");

    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMin);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(viento);

    resultado.appendChild(resultadoDiv);
}

// Limpiar HTML previo
function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

// Activar spinner de carga
function activarSpinner(e) {
    e.preventDefault();
    spinner.classList.remove("hidden");

    setTimeout(() => {
        spinner.classList.add("hidden");
    }, 500);
}

// Conversión de temperatura
function kelvinToCentigrados(grados) {
    return parseInt(grados - 273.15);
}

function kelvinToFahrenheit(grados) {
    return parseInt((grados - 273.15) * 9/5 + 32);
}

// Contenedor para los botones en la misma fila
const contenedorBotones = document.createElement('div');
contenedorBotones.classList.add('mt-5', 'flex', 'gap-2'); // Flex para alinear y gap para espacio entre ellos

// Botón de cambio de unidad de temperatura
const botonCambioUnidad = document.createElement('button');
botonCambioUnidad.textContent = 'Cambiar a Fahrenheit';
botonCambioUnidad.classList.add('bg-blue-500', 'text-white', 'p-2', 'rounded', 'flex-1'); // Flex-1 para que ambos botones tengan el mismo tamaño
botonCambioUnidad.addEventListener('click', () => {
    mostrarEnFahrenheit = !mostrarEnFahrenheit;
    botonCambioUnidad.textContent = mostrarEnFahrenheit ? 'Cambiar a Celsius' : 'Cambiar a Fahrenheit';
    if (resultado.firstChild) {
        const ciudad = formulario.querySelector("#ciudad").value;
        const pais = formulario.querySelector("#pais").value;
        consultarAPI(ciudad, pais);
    }
});

// Botón para usar la ubicación del usuario
const botonUbicacion = document.createElement('button');
botonUbicacion.textContent = 'Usar mi ubicación';
botonUbicacion.classList.add('bg-green-500', 'text-white', 'p-2', 'rounded', 'flex-1'); // Flex-1 para que ambos botones tengan el mismo tamaño
botonUbicacion.addEventListener('click', obtenerUbicacion);

// Añadir botones al contenedor
contenedorBotones.appendChild(botonCambioUnidad);
contenedorBotones.appendChild(botonUbicacion);

// Agregar el contenedor de botones al DOM
container.appendChild(contenedorBotones);

function obtenerUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(posicion => {
            const { latitude, longitude } = posicion.coords;
            consultarAPIConCoordenadas(latitude, longitude);
        }, () => {
            monstarError("No se pudo obtener la ubicación");
        });
    } else {
        monstarError("La geolocalización no es soportada por tu navegador");
    }
}

// Consulta a la API por coordenadas
function consultarAPIConCoordenadas(lat, lon) {
    const API_Key = "3772a6f00739f6fea4645469c4abda23";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.cod === "404") {
                monstarError("Ubicación no encontrada");
                return;
            }
            const { name, sys: { country } } = data;
            mostrarClima(data);
            actualizarHistorial(name, country);
        });
}
