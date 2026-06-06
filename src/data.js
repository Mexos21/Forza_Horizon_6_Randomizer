export let carsDatabase = [];
export let brandsCountries = {};
export const PERFORMANCE_CLASSES = ['D 500', 'C 600', 'B 700', 'A 800', 'S1 900', 'S2 998', 'X 999'];
export const DECADES_LIST = ['1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

export let selectedManufacturers = new Set();
export let selectedCarsIds = new Set();
export let selectedCountries = new Set();
export let selectedDecades = new Set();
export let selectedTypes = new Set();
export let selectedClasses = new Set();

export let strictModeEnabled = false;
export function setStrictMode(value) {
    strictModeEnabled = value;
}

export function getCarDecade(year) {
    return `${Math.floor(year / 10) * 10}s`;
}