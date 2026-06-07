// -------------------------------------------------------------
// ARCHIVO PRINCIPAL OPTIMIZADO Y CORREGIDO
// -------------------------------------------------------------

import {
    carsDatabase, brandsCountries,
    selectedManufacturers, selectedCarsIds,
    selectedCountries, selectedDecades,
    selectedTypes, selectedClasses,
    strictModeEnabled, setStrictMode,
    loadIdMaps,
    saveFilterState,
    loadFilterState,
    setInitializing
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
import { saveCurrentFilters, showSavedFiltersList, initSavedFilters } from './savedFilters.js';
import { initSearchFilters } from './searchFilters.js'; // <-- Importar buscador

// --- Referencias DOM ---
const dom = {
    datasetStatus: document.getElementById('datasetStatus'),
    manufacturers: document.getElementById('manufacturersList'),
    models: document.getElementById('modelsList'),
    countries: document.getElementById('countriesList'),
    decades: document.getElementById('decadesList'),
    types: document.getElementById('typesList'),
    classes: document.getElementById('classesList'),
    spin: document.getElementById('spinButton'),
    clear: document.getElementById('clearFiltersButton'),
    themeToggle: document.getElementById('themeToggleBtn'),
    instructions: document.getElementById('instructionsBtn'),
    points: document.getElementById('pointsDisplay'),
    strictToggle: document.getElementById('strictModeToggle'),
    saveFilters: document.getElementById('saveFiltersBtn'),
    viewSaved: document.getElementById('viewSavedFiltersBtn'),
    exportCode: document.getElementById('exportCodeBtn'),
    importInput: document.getElementById('importCodeInput'),
    importBtn: document.getElementById('importCodeBtn')
};

// --- Funciones auxiliares ---
const fullRender = () => {
    renderManufacturers(dom.manufacturers, fullRender);
    renderModels(dom.models, fullRender);
    renderCountries(dom.countries);
    renderDecades(dom.decades);
    renderTypes(dom.types);
    renderClasses(dom.classes);
    saveFilterState(); // guarda estado después de cada cambio
    // Reaplicar filtros de búsqueda tras el render
    reapplySearchFilters();
};

// Función para reaplicar los filtros de búsqueda actuales
function reapplySearchFilters() {
    const searchInputs = document.querySelectorAll('.filter-search-input');
    searchInputs.forEach(input => {
        // Disparamos el evento 'input' para que se filtre con el texto actual
        input.dispatchEvent(new Event('input'));
    });
}

const clearAllFilters = () => {
    if (strictModeEnabled) return;
    selectedManufacturers.clear();
    selectedCarsIds.clear();
    selectedCountries.clear();
    selectedDecades.clear();
    selectedTypes.clear();
    selectedClasses.clear();
    fullRender();
};

const resetResultDisplay = () => {
    ['resultCar', 'resultCountry', 'resultDecade', 'resultStyle', 'resultClass'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = '---';
    });
};

// --- Inicializaciones ---
setPointsDisplay(dom.points);
initTheme(dom.themeToggle);
initInstructions(dom.instructions);
initSavedFilters(fullRender);
initSearchFilters(); // Inicializar los buscadores (solo una vez)

// --- Eventos ---
if (dom.clear) dom.clear.addEventListener('click', clearAllFilters);
if (dom.spin) dom.spin.addEventListener('click', () => startSpinSequence(dom.spin));
if (dom.saveFilters) dom.saveFilters.addEventListener('click', saveCurrentFilters);
if (dom.viewSaved) dom.viewSaved.addEventListener('click', showSavedFiltersList);

// Modo estricto
if (dom.strictToggle) {
    const saved = localStorage.getItem('strictModeEnabled');
    if (saved !== null) {
        setStrictMode(saved === 'true');
        dom.strictToggle.checked = strictModeEnabled;
        fullRender();
    }
    dom.strictToggle.addEventListener('change', (e) => {
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
        resetResultDisplay();
    });
}

// --- Carga de datos ---
let brandsLoaded = false, carsLoaded = false, idsLoaded = false;

const checkAllDataLoaded = () => {
    if (brandsLoaded && carsLoaded && idsLoaded) {
        carsDatabase.forEach(car => { car.country = brandsCountries[car.make] || 'Unknown'; });
        dom.datasetStatus.innerText = `${carsDatabase.length} cars loaded.`;
        setInitializing(true);   // evitar guardar durante restauración
        loadFilterState();          // restaura filtros guardados (si existen)
        fullRender();               // renderiza los checkboxes
        setInitializing(false);  // permitir guardar a partir de ahora
        dom.spin.disabled = false;  // habilita botón de ruleta
        // Habilitar controles de export/import
        if (dom.exportCode) dom.exportCode.disabled = false;
        if (dom.importBtn) dom.importBtn.disabled = false;
        if (dom.importInput) dom.importInput.disabled = false;
    }
};

const loadJSON = async (url, handler) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        handler(data);
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
        dom.datasetStatus.innerText = `❌ Failed to load ${url.split('/').pop()}.`;
        if (url.includes('cars')) dom.spin.disabled = false;
    }
};

dom.spin.disabled = true;
if (dom.exportCode) dom.exportCode.disabled = true;
if (dom.importBtn) dom.importBtn.disabled = true;
if (dom.importInput) dom.importInput.disabled = true;

loadJSON('data/fh6_brands_countries.json', data => {
    Object.assign(brandsCountries, data);
    brandsLoaded = true;
    checkAllDataLoaded();
});
loadJSON('data/fh6_cars.json', data => {
    carsDatabase.push(...data);
    carsLoaded = true;
    checkAllDataLoaded();
});
loadJSON('data/ids.json', data => {
    loadIdMaps(data);
    idsLoaded = true;
    checkAllDataLoaded();
});

// --- Exportar / Importar filtros ---
if (dom.exportCode) {
    dom.exportCode.addEventListener('click', () => {
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

if (dom.importBtn && dom.importInput) {
    dom.importBtn.addEventListener('click', async () => {
        const code = dom.importInput.value.trim();
        if (!code) {
            Swal.fire({ title: 'No code', text: 'Please paste a valid filter code.', icon: 'warning', confirmButtonText: 'OK' });
            return;
        }
        try {
            importFiltersFromCode(code);
            fullRender();   // actualiza los checkboxes
            dom.importInput.value = '';
            Swal.fire({ title: 'Filters Imported!', text: 'Your filters have been restored.', icon: 'success', confirmButtonText: 'OK' });
        } catch (error) {
            console.error('Import error:', error);
            Swal.fire({ title: 'Invalid Code', text: 'The code could not be parsed.', icon: 'error', confirmButtonText: 'OK' });
        }
    });
}