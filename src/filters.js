import {
    carsDatabase, brandsCountries,
    selectedManufacturers, selectedCarsIds,
    selectedCountries, selectedDecades,
    selectedTypes, selectedClasses,
    PERFORMANCE_CLASSES, DECADES_LIST,
    getCarDecade, strictModeEnabled
} from './data.js';

export function getUniqueManufacturers() {
    return [...new Set(carsDatabase.map(c => c.make))].sort();
}

export function getAvailableCars() {
    if (strictModeEnabled) return carsDatabase;
    if (selectedManufacturers.size === 0) return carsDatabase;
    return carsDatabase.filter(c => selectedManufacturers.has(c.make));
}

export function getAvailableCountries() {
    if (strictModeEnabled) return [...new Set(carsDatabase.map(c => c.country))].sort();
    if (selectedCarsIds.size > 0) {
        const activeCars = carsDatabase.filter(c => selectedCarsIds.has(c.car_id));
        return [...new Set(activeCars.map(c => c.country))].sort();
    }
    if (selectedManufacturers.size > 0) {
        const brands = Array.from(selectedManufacturers);
        const countries = brands.map(b => brandsCountries[b] || 'Unknown');
        return [...new Set(countries)].sort();
    }
    return [...new Set(carsDatabase.map(c => c.country))].sort();
}

export function getAvailableDecades() {
    if (strictModeEnabled) return DECADES_LIST;
    if (selectedCarsIds.size > 0) {
        const activeCars = carsDatabase.filter(c => selectedCarsIds.has(c.car_id));
        return [...new Set(activeCars.map(c => getCarDecade(c.year)))].sort();
    }
    return DECADES_LIST;
}

export function getAvailableTypes() {
    if (strictModeEnabled) {
        const allTypes = carsDatabase.map(c => c.type).filter(t => t && t !== '');
        return [...new Set(allTypes)].sort();
    }
    if (selectedCarsIds.size > 0) {
        const activeCars = carsDatabase.filter(c => selectedCarsIds.has(c.car_id));
        const types = activeCars.map(c => c.type).filter(t => t && t !== '');
        return [...new Set(types)].sort();
    }
    const allTypes = carsDatabase.map(c => c.type).filter(t => t && t !== '');
    return [...new Set(allTypes)].sort();
}

export function renderManufacturers(container, onUpdateCallback) {
    const manufacturers = getUniqueManufacturers();
    container.innerHTML = '';
    manufacturers.forEach(brand => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '2px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = brand;
        cb.checked = selectedManufacturers.has(brand);
        cb.disabled = strictModeEnabled;
        cb.addEventListener('change', (e) => {
            if (e.target.checked) selectedManufacturers.add(brand);
            else selectedManufacturers.delete(brand);
            selectedCarsIds.clear();
            selectedCountries.clear();
            selectedDecades.clear();
            selectedTypes.clear();
            if (onUpdateCallback) onUpdateCallback();
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(` ${brand}`));
        container.appendChild(label);
    });
}

export function renderModels(container, onUpdateCallback) {
    const availableCars = getAvailableCars();
    container.innerHTML = '';
    if (availableCars.length === 0) {
        container.innerHTML = '<span style="color:#a0aec0; font-style:italic;">No cars match selected brands</span>';
        return;
    }
    availableCars.forEach(car => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '2px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = car.car_id;
        cb.checked = selectedCarsIds.has(car.car_id);
        cb.disabled = strictModeEnabled;
        cb.addEventListener('change', (e) => {
            if (e.target.checked) selectedCarsIds.add(car.car_id);
            else selectedCarsIds.delete(car.car_id);
            selectedCountries.clear();
            selectedDecades.clear();
            selectedTypes.clear();
            if (onUpdateCallback) onUpdateCallback();
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(` ${car.make} ${car.model} - ${car.year}`));
        container.appendChild(label);
    });
}

export function renderCountries(container) {
    const countries = getAvailableCountries();
    container.innerHTML = '';
    countries.forEach(country => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '2px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = country;
        cb.checked = selectedCountries.has(country);
        cb.disabled = strictModeEnabled;
        cb.addEventListener('change', (e) => {
            if (e.target.checked) selectedCountries.add(country);
            else selectedCountries.delete(country);
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(` ${country}`));
        container.appendChild(label);
    });
}

export function renderDecades(container) {
    const decades = getAvailableDecades();
    container.innerHTML = '';
    decades.forEach(decade => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '2px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = decade;
        cb.checked = selectedDecades.has(decade);
        cb.disabled = strictModeEnabled;
        cb.addEventListener('change', (e) => {
            if (e.target.checked) selectedDecades.add(decade);
            else selectedDecades.delete(decade);
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(` ${decade}`));
        container.appendChild(label);
    });
}

export function renderTypes(container) {
    const types = getAvailableTypes();
    container.innerHTML = '';
    if (types.length === 0) {
        container.innerHTML = '<span style="color:#a0aec0; font-style:italic;">No car types available</span>';
        return;
    }
    types.forEach(type => {
        const label = document.createElement('label');
        label.style.display = 'inline-block';
        label.style.marginRight = '15px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = type;
        cb.checked = selectedTypes.has(type);
        cb.disabled = strictModeEnabled;
        cb.addEventListener('change', (e) => {
            if (e.target.checked) selectedTypes.add(type);
            else selectedTypes.delete(type);
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(` ${type}`));
        container.appendChild(label);
    });
}

export function renderClasses(container) {
    container.innerHTML = '';
    PERFORMANCE_CLASSES.forEach(pClass => {
        const label = document.createElement('label');
        label.style.display = 'inline-block';
        label.style.marginRight = '15px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = pClass;
        cb.checked = selectedClasses.has(pClass);
        cb.disabled = false;
        cb.addEventListener('change', (e) => {
            if (e.target.checked) selectedClasses.add(pClass);
            else selectedClasses.delete(pClass);
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(` ${pClass}`));
        container.appendChild(label);
    });
}