// -------------------------------------------------------------
// ARCHIVO PRINCIPAL: INICIALIZACIÓN, EVENTOS, FETCH Y RENDERIZADO GLOBAL
// -------------------------------------------------------------

import {
    carsDatabase, brandsCountries,
    selectedManufacturers, selectedCarsIds,
    selectedCountries, selectedDecades,
    selectedTypes, selectedClasses,
    strictModeEnabled, setStrictMode,
    loadIdMaps
} from './data.js';

import {
    renderManufacturers, renderModels, renderCountries,
    renderDecades, renderTypes, renderClasses,
} from './filters.js';

import { setPointsDisplay } from './points.js';
import { startSpinSequence } from './wheelspin.js';
import { initTheme } from './theme.js';
import { initInstructions } from './instructions.js';
import { exportFiltersToCode, importFiltersFromCode } from './exportFilters.js';

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

// ------------------- CARGA DE DATOS JSON -------------------
let brandsLoaded = false;
let carsLoaded = false;
let idsLoaded = false;

function checkAllDataLoaded() {
    if (brandsLoaded && carsLoaded && idsLoaded) {
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

        // Habilitar controles de import/export después de cargar mapas
        const exportBtn = document.getElementById('exportCodeBtn');
        const importInput = document.getElementById('importCodeInput');
        const importBtn = document.getElementById('importCodeBtn');
        if (exportBtn) exportBtn.disabled = false;
        if (importBtn) importBtn.disabled = false;
        if (importInput) importInput.disabled = false;
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

// Cargar ids.json (mapas de IDs para exportar/importar)
fetch('data/ids.json')
    .then(response => response.json())
    .then(data => {
        loadIdMaps(data);
        idsLoaded = true;
        checkAllDataLoaded();
    })
    .catch(error => {
        console.error('Error loading ids.json:', error);
        idsLoaded = true; // para no bloquear, pero mostrar advertencia
        checkAllDataLoaded();
    });

// ------------------- EXPORTAR / IMPORTAR FILTROS -------------------
const exportBtn = document.getElementById('exportCodeBtn');
const importInput = document.getElementById('importCodeInput');
const importBtn = document.getElementById('importCodeBtn');

// Inicialmente deshabilitados hasta que los mapas estén listos
if (exportBtn) exportBtn.disabled = true;
if (importBtn) importBtn.disabled = true;
if (importInput) importInput.disabled = true;

if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        const code = exportFiltersToCode();
        navigator.clipboard.writeText(code);
        Swal.fire({
            title: 'Code Copied!',
            text: code || '(empty filters)',
            icon: 'success',
            confirmButtonText: 'OK',
            background: '#1e1e2f',
            color: '#fff',
            confirmButtonColor: '#28a745'
        });
    });
}

if (importBtn && importInput) {
    importBtn.addEventListener('click', () => {
        const code = importInput.value.trim();
        if (code) {
            try {
                importFiltersFromCode(code);
                fullRender(); // forzar actualización de checkboxes
                importInput.value = '';
                Swal.fire({
                    title: 'Filters Imported!',
                    text: 'Your filters have been restored.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    background: '#1e1e2f',
                    color: '#fff',
                    confirmButtonColor: '#28a745'
                });
            } catch (error) {
                console.error('Import error:', error);
                Swal.fire({
                    title: 'Invalid Code',
                    text: 'The code could not be parsed. Please check it and try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    background: '#1e1e2f',
                    color: '#fff',
                    confirmButtonColor: '#dc3545'
                });
            }
        } else {
            Swal.fire({
                title: 'No code',
                text: 'Please paste a valid filter code.',
                icon: 'warning',
                confirmButtonText: 'OK',
                background: '#1e1e2f',
                color: '#fff',
                confirmButtonColor: '#f97316'
            });
        }
    });
}