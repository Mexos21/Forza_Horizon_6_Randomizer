// -------------------------------------------------------------
// 1. DATOS GLOBALES
// -------------------------------------------------------------
let carsDatabase = [];            // array de coches (con country y type)
let brandsCountries = {};         // se carga desde fh6_brands_countries.json
const PERFORMANCE_CLASSES = ['D 500', 'C 600', 'B 700', 'A 800', 'S1 900', 'S2 998', 'X 999'];
const DECADES_LIST = ['1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

// -------------------------------------------------------------
// 2. ESTADO DE SELECCIONES (Sets)
// -------------------------------------------------------------
let selectedManufacturers = new Set();
let selectedCarsIds = new Set();
let selectedCountries = new Set();
let selectedDecades = new Set();
let selectedTypes = new Set();
let selectedClasses = new Set();

// -------------------------------------------------------------
// 3. REFERENCIAS DOM
// -------------------------------------------------------------
const datasetStatusSpan = document.getElementById('datasetStatus');
const manufacturersDiv = document.getElementById('manufacturersList');
const modelsDiv = document.getElementById('modelsList');
const countriesDiv = document.getElementById('countriesList');
const decadesDiv = document.getElementById('decadesList');
const typesDiv = document.getElementById('typesList');
const classesDiv = document.getElementById('classesList');
const spinButton = document.getElementById('spinButton');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultCarSpan = document.getElementById('resultCar');
const resultCountrySpan = document.getElementById('resultCountry');
const resultDecadeSpan = document.getElementById('resultDecade');
const resultStyleSpan = document.getElementById('resultStyle');
const resultClassSpan = document.getElementById('resultClass');

// -------------------------------------------------------------
// 4. FUNCIONES AUXILIARES
// -------------------------------------------------------------
function getCarDecade(year) {
  return `${Math.floor(year / 10) * 10}s`;
}

function getUniqueManufacturers() {
  return [...new Set(carsDatabase.map(c => c.make))].sort();
}

function getAvailableCars() {
  if (selectedManufacturers.size === 0) return carsDatabase;
  return carsDatabase.filter(c => selectedManufacturers.has(c.make));
}

function getAvailableCountries() {
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

function getAvailableDecades() {
  if (selectedCarsIds.size > 0) {
    const activeCars = carsDatabase.filter(c => selectedCarsIds.has(c.car_id));
    return [...new Set(activeCars.map(c => getCarDecade(c.year)))].sort();
  }
  return DECADES_LIST;
}

function getAvailableTypes() {
  if (selectedCarsIds.size > 0) {
    const activeCars = carsDatabase.filter(c => selectedCarsIds.has(c.car_id));
    const types = activeCars.map(c => c.type).filter(t => t && t !== '');
    return [...new Set(types)].sort();
  }
  const allTypes = carsDatabase.map(c => c.type).filter(t => t && t !== '');
  return [...new Set(allTypes)].sort();
}

// -------------------------------------------------------------
// 5. RENDERIZADO DE CHECKBOXES
// -------------------------------------------------------------
function renderManufacturers() {
  const manufacturers = getUniqueManufacturers();
  manufacturersDiv.innerHTML = '';
  manufacturers.forEach(brand => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.marginBottom = '2px';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = brand;
    cb.checked = selectedManufacturers.has(brand);
    cb.addEventListener('change', (e) => {
      if (e.target.checked) selectedManufacturers.add(brand);
      else selectedManufacturers.delete(brand);
      selectedCarsIds.clear();
      selectedCountries.clear();
      selectedDecades.clear();
      selectedTypes.clear();
      fullRender();
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(` ${brand}`));
    manufacturersDiv.appendChild(label);
  });
}

function renderModels() {
  const availableCars = getAvailableCars();
  modelsDiv.innerHTML = '';
  if (availableCars.length === 0) {
    modelsDiv.innerHTML = '<span style="color:#a0aec0; font-style:italic;">No cars match selected brands</span>';
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
    cb.addEventListener('change', (e) => {
      if (e.target.checked) selectedCarsIds.add(car.car_id);
      else selectedCarsIds.delete(car.car_id);
      selectedCountries.clear();
      selectedDecades.clear();
      selectedTypes.clear();
      fullRender();
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(` ${car.make} ${car.model} - ${car.year}`));
    modelsDiv.appendChild(label);
  });
}

function renderCountries() {
  const countries = getAvailableCountries();
  countriesDiv.innerHTML = '';
  countries.forEach(country => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.marginBottom = '2px';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = country;
    cb.checked = selectedCountries.has(country);
    cb.addEventListener('change', (e) => {
      if (e.target.checked) selectedCountries.add(country);
      else selectedCountries.delete(country);
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(` ${country}`));
    countriesDiv.appendChild(label);
  });
}

function renderDecades() {
  const decades = getAvailableDecades();
  decadesDiv.innerHTML = '';
  decades.forEach(decade => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.marginBottom = '2px';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = decade;
    cb.checked = selectedDecades.has(decade);
    cb.addEventListener('change', (e) => {
      if (e.target.checked) selectedDecades.add(decade);
      else selectedDecades.delete(decade);
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(` ${decade}`));
    decadesDiv.appendChild(label);
  });
}

function renderTypes() {
  const types = getAvailableTypes();
  typesDiv.innerHTML = '';
  if (types.length === 0) {
    typesDiv.innerHTML = '<span style="color:#a0aec0; font-style:italic;">No car types available (add "type" field to cars)</span>';
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
    cb.addEventListener('change', (e) => {
      if (e.target.checked) selectedTypes.add(type);
      else selectedTypes.delete(type);
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(` ${type}`));
    typesDiv.appendChild(label);
  });
}

function renderClasses() {
  classesDiv.innerHTML = '';
  PERFORMANCE_CLASSES.forEach(pClass => {
    const label = document.createElement('label');
    label.style.display = 'inline-block';
    label.style.marginRight = '15px';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = pClass;
    cb.checked = selectedClasses.has(pClass);
    cb.addEventListener('change', (e) => {
      if (e.target.checked) selectedClasses.add(pClass);
      else selectedClasses.delete(pClass);
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(` ${pClass}`));
    classesDiv.appendChild(label);
  });
}

function fullRender() {
  renderManufacturers();
  renderModels();
  renderCountries();
  renderDecades();
  renderTypes();
  renderClasses();
}

// -------------------------------------------------------------
// 6. LÓGICA DE LA RULETA
// -------------------------------------------------------------
function spinRoulette() {
  let pool = [...carsDatabase];

  if (selectedCarsIds.size > 0) {
    pool = pool.filter(c => selectedCarsIds.has(c.car_id));
  } else {
    if (selectedManufacturers.size > 0) {
      pool = pool.filter(c => selectedManufacturers.has(c.make));
    }
    if (selectedCountries.size > 0) {
      pool = pool.filter(c => selectedCountries.has(c.country));
    }
    if (selectedDecades.size > 0) {
      pool = pool.filter(c => selectedDecades.has(getCarDecade(c.year)));
    }
    if (selectedTypes.size > 0) {
      pool = pool.filter(c => selectedTypes.has(c.type));
    }
  }

  if (pool.length === 0) {
    resultCarSpan.innerText = '❌ No matching cars found for the selected pools';
    resultCountrySpan.innerText = '---';
    resultDecadeSpan.innerText = '---';
    resultStyleSpan.innerText = '---';
    resultClassSpan.innerText = '---';
    return;
  }

  const pickedCar = pool[Math.floor(Math.random() * pool.length)];
  const realCountry = pickedCar.country;
  const realDecade = getCarDecade(pickedCar.year);
  const realType = pickedCar.type || 'Unknown';

  let chosenClass = '';
  if (selectedClasses.size > 0) {
    const classArray = Array.from(selectedClasses);
    chosenClass = classArray[Math.floor(Math.random() * classArray.length)];
  } else {
    chosenClass = PERFORMANCE_CLASSES[Math.floor(Math.random() * PERFORMANCE_CLASSES.length)];
  }

  const showCarModel = (selectedCarsIds.size > 0) || (Math.random() > 0.5);
  const showCountry = (selectedCountries.size > 0) || (Math.random() > 0.5);
  const showDecade = (selectedDecades.size > 0) || (Math.random() > 0.5);
  const showType = (selectedTypes.size > 0) || (Math.random() > 0.5);

  if (showCarModel) {
    resultCarSpan.innerText = `${pickedCar.make} ${pickedCar.model}`;
  } else {
    if (selectedManufacturers.size > 0) {
      const brandsText = Array.from(selectedManufacturers).join('/');
      resultCarSpan.innerText = `Any ${brandsText}! 🏎️`;
    } else {
      resultCarSpan.innerText = 'Any Car! 🏎️';
    }
  }

  resultCountrySpan.innerText = showCountry ? realCountry : 'Any Country 🌍';
  resultDecadeSpan.innerText = showDecade ? realDecade : 'Any Era ⏳';
  resultStyleSpan.innerText = showType ? realType : 'Any Style 🏷️';
  resultClassSpan.innerText = chosenClass;
}

function startSpinSequence() {
  loadingOverlay.style.display = 'flex';
  spinButton.disabled = true;
  setTimeout(() => {
    spinRoulette();
    loadingOverlay.style.display = 'none';
    spinButton.disabled = false;
  }, 500);
}

// -------------------------------------------------------------
// 7. CARGA DE LOS DOS JSON (con los nombres CORRECTOS)
// -------------------------------------------------------------
let brandsLoaded = false;
let carsLoaded = false;

function checkAllDataLoaded() {
  if (brandsLoaded && carsLoaded) {
    // Asignar país a cada coche usando el mapa
    carsDatabase.forEach(car => {
      car.country = brandsCountries[car.make] || 'Unknown';
    });
    datasetStatusSpan.innerText = `${carsDatabase.length} cars loaded.`;
    fullRender();
    // Limpiar selecciones iniciales
    selectedManufacturers.clear();
    selectedCarsIds.clear();
    selectedCountries.clear();
    selectedDecades.clear();
    selectedTypes.clear();
    selectedClasses.clear();
    fullRender(); // para poner todos los checkboxes sin marcar
  }
}

// Cargar fh6_brands_countries.json
fetch('fh6_brands_countries.json')
  .then(response => response.json())
  .then(data => {
    brandsCountries = data;
    brandsLoaded = true;
    checkAllDataLoaded();
  })
  .catch(error => {
    console.error('Error loading brands-countries.json:', error);
    datasetStatusSpan.innerText = '❌ Failed to load brand data.';
  });

// Cargar fh6_cars.json
fetch('fh6_cars.json')
  .then(response => response.json())
  .then(data => {
    carsDatabase = data;
    carsLoaded = true;
    checkAllDataLoaded();
  })
  .catch(error => {
    console.error('Error loading cars.json:', error);
    datasetStatusSpan.innerText = '❌ Failed to load car data.';
  });


// -------------------------------------------------------------
// 8. FUNCIÓN PARA LIMPIAR FILTROS
// -------------------------------------------------------------
function clearAllFilters() {
    // Limpiar todos los Sets de selección
    selectedManufacturers.clear();
    selectedCarsIds.clear();
    selectedCountries.clear();
    selectedDecades.clear();
    selectedTypes.clear();
    selectedClasses.clear();
    
    // Re-renderizar todos los checkboxes (esto los desmarca)
    fullRender();
    
    // Opcional: también puedes resetear el resultado si lo prefieres
    resultCarSpan.innerText = '---';
    resultCountrySpan.innerText = '---';
    resultDecadeSpan.innerText = '---';
    resultStyleSpan.innerText = '---';
    resultClassSpan.innerText = '---';
}

// Añadir el evento click al botón de limpiar
const clearButton = document.getElementById('clearFiltersButton');
if (clearButton) {
    clearButton.addEventListener('click', clearAllFilters);
}


// Evento del botón
spinButton.addEventListener('click', startSpinSequence);