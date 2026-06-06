import {
    carsDatabase, brandsCountries,
    selectedManufacturers, selectedCarsIds,
    selectedCountries, selectedDecades,
    selectedTypes, selectedClasses,
    strictModeEnabled, setStrictMode
} from './data.js';
import {
    renderManufacturers, renderModels, renderCountries,
    renderDecades, renderTypes, renderClasses,
} from './filters.js';
import { setPointsDisplay } from './points.js';
import { startSpinSequence } from './wheelspin.js';
import { initTheme } from './theme.js';
import { initInstructions } from './instructions.js';

// Referencias DOM
const datasetStatusSpan = document.getElementById('datasetStatus');
const manufacturersDiv = document.getElementById('manufacturersList');
const modelsDiv = document.getElementById('modelsList');
const countriesDiv = document.getElementById('countriesList');
const decadesDiv = document.getElementById('decadesList');
const typesDiv = document.getElementById('typesList');
const classesDiv = document.getElementById('classesList');
const spinButton = document.getElementById('spinButton');
const clearButton = document.getElementById('clearFiltersButton');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const instructionsBtn = document.getElementById('instructionsBtn');
const pointsDisplaySpan = document.getElementById('pointsDisplay');
const strictModeToggle = document.getElementById('strictModeToggle');

// Función de renderizado completo
function fullRender() {
    renderManufacturers(manufacturersDiv, fullRender);
    renderModels(modelsDiv, fullRender);
    renderCountries(countriesDiv);
    renderDecades(decadesDiv);
    renderTypes(typesDiv);
    renderClasses(classesDiv);
}

// Limpiar filtros
function clearAllFilters() {
    if (strictModeEnabled) return;
    selectedManufacturers.clear();
    selectedCarsIds.clear();
    selectedCountries.clear();
    selectedDecades.clear();
    selectedTypes.clear();
    selectedClasses.clear();
    fullRender();
}

// Inicializar puntos
setPointsDisplay(pointsDisplaySpan);

// Eventos
if (clearButton) clearButton.addEventListener('click', clearAllFilters);
spinButton.addEventListener('click', () => startSpinSequence(spinButton));
initTheme(themeToggleBtn);
initInstructions(instructionsBtn);

// Modo estricto
if (strictModeToggle) {
    const savedStrictMode = localStorage.getItem('strictModeEnabled');
    if (savedStrictMode !== null) {
        setStrictMode(savedStrictMode === 'true');
        strictModeToggle.checked = strictModeEnabled;
        fullRender();
    }
    strictModeToggle.addEventListener('change', (e) => {
        setStrictMode(e.target.checked);
        localStorage.setItem('strictModeEnabled', e.target.checked);
        if (strictModeEnabled) {
            selectedManufacturers.clear();
            selectedCarsIds.clear();
            selectedCountries.clear();
            selectedDecades.clear();
            selectedTypes.clear();
        }
        fullRender();
        // Reiniciar resultados visuales
        const ids = ['resultCar', 'resultCountry', 'resultDecade', 'resultStyle', 'resultClass'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = '---';
        });
    });
}

// Carga de datos
let brandsLoaded = false;
let carsLoaded = false;

function checkAllDataLoaded() {
    if (brandsLoaded && carsLoaded) {
        carsDatabase.forEach(car => {
            car.country = brandsCountries[car.make] || 'Unknown';
        });
        datasetStatusSpan.innerText = `${carsDatabase.length} cars loaded.`;
        fullRender();
        selectedManufacturers.clear();
        selectedCarsIds.clear();
        selectedCountries.clear();
        selectedDecades.clear();
        selectedTypes.clear();
        selectedClasses.clear();
        fullRender();
        spinButton.disabled = false;
    }
}

spinButton.disabled = true;

fetch('data/fh6_brands_countries.json')
    .then(response => response.json())
    .then(data => {
        Object.assign(brandsCountries, data);
        brandsLoaded = true;
        checkAllDataLoaded();
    })
    .catch(error => {
        console.error('Error loading brands-countries.json:', error);
        datasetStatusSpan.innerText = '❌ Failed to load brand data.';
        spinButton.disabled = false;
    });

fetch('data/fh6_cars.json')
    .then(response => response.json())
    .then(data => {
        carsDatabase.push(...data);
        carsLoaded = true;
        checkAllDataLoaded();
    })
    .catch(error => {
        console.error('Error loading cars.json:', error);
        datasetStatusSpan.innerText = '❌ Failed to load car data.';
        spinButton.disabled = false;
    });