// -------------------------------------------------------------
// DATOS GLOBALES Y ESTADO
// -------------------------------------------------------------

// Variables globales (se exportan para que otros módulos las lean y modifiquen)
export let carsDatabase = [];
export let brandsCountries = {};

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