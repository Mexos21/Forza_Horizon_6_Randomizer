// -------------------------------------------------------------
// DATOS GLOBALES Y ESTADO
// -------------------------------------------------------------

// Variables globales (se exportan para que otros módulos las lean y modifiquen)
export let carsDatabase = [];
export let brandsCountries = {};

// Variables para guardar filtros en localStorage
let isInitializing = true;
export function setInitializing(value) { isInitializing = value; }

// Constantes
export const PERFORMANCE_CLASSES = ['D 500', 'C 600', 'B 700', 'A 800', 'S1 900', 'S2 998', 'X 999'];
export const DECADES_LIST = ['1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

// Sets de selección (se modifican desde varios módulos)
export let selectedManufacturers = new Set();
export let selectedCarsIds = new Set();
export let selectedCountries = new Set();
export let selectedDecades = new Set();
export let selectedTypes = new Set();
export let selectedClasses = new Set();

// Modo estricto (con getter y setter para poder actualizar el toggle desde fuera)
export let strictModeEnabled = false;
export function setStrictMode(value) {
    strictModeEnabled = value;
}

// Función auxiliar para calcular década
export function getCarDecade(year) {
    return `${Math.floor(year / 10) * 10}s`;
}

// -------------------------------------------------------------
// MAPAS DE IDs (para exportar/importar filtros)
// -------------------------------------------------------------
export let manufacturerById = {};
export let countryById = {};
export let styleById = {};
export let manufacturerToId = {};
export let countryToId = {};
export let styleToId = {};

export function loadIdMaps(data) {
    manufacturerById = data.manufacturers;
    countryById = data.countries;
    styleById = data.styles;
    // Construir mapas inversos (nombre -> ID)
    manufacturerToId = {};
    Object.entries(manufacturerById).forEach(([id, name]) => { manufacturerToId[name] = id; });
    countryToId = {};
    Object.entries(countryById).forEach(([id, name]) => { countryToId[name] = id; });
    styleToId = {};
    Object.entries(styleById).forEach(([id, name]) => { styleToId[name] = id; });
}

// -------------------------------------------------------------
// GUARDAR Y CARGAR EL ESTADO DE FILTROS (localStorage)
// -------------------------------------------------------------
export function saveFilterState() {
    if (isInitializing) return;

    const state = {
        manufacturers: Array.from(selectedManufacturers),
        carsIds: Array.from(selectedCarsIds),
        countries: Array.from(selectedCountries),
        decades: Array.from(selectedDecades),
        types: Array.from(selectedTypes),
        classes: Array.from(selectedClasses),
        strictMode: strictModeEnabled
    };
    localStorage.setItem('fh6_filters', JSON.stringify(state));
}

export function loadFilterState() {
    const saved = localStorage.getItem('fh6_filters');
    if (!saved) return;
    try {
        const state = JSON.parse(saved);
        // Limpiar y restaurar cada Set
        selectedManufacturers.clear();
        state.manufacturers?.forEach(m => selectedManufacturers.add(m));
        
        selectedCarsIds.clear();
        state.carsIds?.forEach(id => selectedCarsIds.add(id));
        
        selectedCountries.clear();
        state.countries?.forEach(c => selectedCountries.add(c));
        
        selectedDecades.clear();
        state.decades?.forEach(d => selectedDecades.add(d));
        
        selectedTypes.clear();
        state.types?.forEach(t => selectedTypes.add(t));
        
        selectedClasses.clear();
        state.classes?.forEach(c => selectedClasses.add(c));
        
        if (typeof state.strictMode === 'boolean') {
            setStrictMode(state.strictMode);
            const toggle = document.getElementById('strictModeToggle');
            if (toggle) toggle.checked = strictModeEnabled;
        }
    } catch(e) {
        console.error('Error loading filter state:', e);
    }
}