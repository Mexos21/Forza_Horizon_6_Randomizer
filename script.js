// -------------------------------------------------------------
// 1. DATOS GLOBALES
// -------------------------------------------------------------
let carsDatabase = [];
let brandsCountries = {};
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

// Modo estricto
let strictModeEnabled = false;
const strictModeToggle = document.getElementById('strictModeToggle');

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
  if (strictModeEnabled) return carsDatabase;
  if (selectedManufacturers.size === 0) return carsDatabase;
  return carsDatabase.filter(c => selectedManufacturers.has(c.make));
}

function getAvailableCountries() {
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

function getAvailableDecades() {
  if (strictModeEnabled) return DECADES_LIST;
  if (selectedCarsIds.size > 0) {
    const activeCars = carsDatabase.filter(c => selectedCarsIds.has(c.car_id));
    return [...new Set(activeCars.map(c => getCarDecade(c.year)))].sort();
  }
  return DECADES_LIST;
}

function getAvailableTypes() {
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

// -------------------------------------------------------------
// 5. RENDERIZADO DE CHECKBOXES (con disabled en modo estricto)
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
    cb.disabled = strictModeEnabled;
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
    cb.disabled = strictModeEnabled;
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
    cb.disabled = strictModeEnabled;
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
    cb.disabled = strictModeEnabled;
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
    typesDiv.innerHTML = '<span style="color:#a0aec0; font-style:italic;">No car types available</span>';
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
    cb.disabled = false; // Siempre habilitadas
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
// 6. LÓGICA DE GENERACIÓN DEL DESAFÍO
// -------------------------------------------------------------
function generateRandomChallenge() {
  let pool = [...carsDatabase];

  if (!strictModeEnabled) {
    if (selectedCarsIds.size > 0) {
      pool = pool.filter(c => selectedCarsIds.has(c.car_id));
    } else {
      if (selectedManufacturers.size > 0) pool = pool.filter(c => selectedManufacturers.has(c.make));
      if (selectedCountries.size > 0) pool = pool.filter(c => selectedCountries.has(c.country));
      if (selectedDecades.size > 0) pool = pool.filter(c => selectedDecades.has(getCarDecade(c.year)));
      if (selectedTypes.size > 0) pool = pool.filter(c => selectedTypes.has(c.type));
    }
  }

  if (pool.length === 0) return null;

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

  let showCarModel = false;
  let showCountry = false;
  let showDecade = false;
  let showType = false;

  if (strictModeEnabled) {
    showCarModel = true;
    showCountry = true;
    showDecade = true;
    showType = true;
  } else {
    showCarModel = false;
    showCountry = (selectedCountries.size > 0) || (Math.random() > 0.2);
    showDecade = (selectedDecades.size > 0) || (Math.random() > 0.2);
    showType = (selectedTypes.size > 0) || (Math.random() > 0.2);
  }

  let carText = '';
  if (showCarModel) {
    carText = `${pickedCar.make} ${pickedCar.model}`;
  } else {
    if (selectedManufacturers.size > 0) {
      const brandsText = Array.from(selectedManufacturers).join('/');
      carText = `Any ${brandsText}! 🏎️`;
    } else {
      carText = 'Any Car! 🏎️';
    }
  }

  const countryText = showCountry ? realCountry : 'Any Country 🌍';
  const decadeText = showDecade ? realDecade : 'Any Era ⏳';
  const styleText = showType ? realType : 'Any Style 🏷️';
  const classText = chosenClass;

  return { carText, countryText, decadeText, styleText, classText };
}

// -------------------------------------------------------------
// HELPER: Obtener fabricante del texto del coche
// -------------------------------------------------------------
function getManufacturerFromCarText(carText) {
  if (carText.includes('Any Car')) return 'Any';
  if (carText.includes('Any ') && !carText.includes('Any Car')) {
    const match = carText.match(/Any (.+?)!/);
    if (match) return match[1];
    return 'Any';
  }
  const firstSpace = carText.indexOf(' ');
  if (firstSpace > 0) return carText.substring(0, firstSpace);
  return carText;
}

// -------------------------------------------------------------
// RULETA DENTRO DE SWEETALERT2 (con botones desactivados y efecto "casi se queda")
// -------------------------------------------------------------
let spinInProgress = false;

function startSpinSequence() {
  if (spinInProgress) return;
  spinInProgress = true;
  spinButton.disabled = true;

  const intervals = [20, 20, 25, 30, 35, 45, 55, 70, 90, 120, 160, 220, 300, 400];
  let step = 0;

  function randomFrom(arr) {
    if (!arr.length) return '???';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getPools() {
    const availableCars = getAvailableCars();
    const availableCountries = getAvailableCountries();
    const availableDecades = getAvailableDecades();
    const availableStyles = getAvailableTypes();
    const availableClasses = selectedClasses.size > 0 ? Array.from(selectedClasses) : PERFORMANCE_CLASSES;
    return { availableCars, availableCountries, availableDecades, availableStyles, availableClasses };
  }

  function updateModalContent() {
    const pools = getPools();
    let carText = '', countryText = '', decadeText = '', styleText = '', classText = '';

    if (strictModeEnabled) {
      if (pools.availableCars.length) {
        const randomCar = randomFrom(pools.availableCars);
        carText = `${randomCar.make} ${randomCar.model}`;
      } else carText = '???';
      if (pools.availableCountries.length) countryText = randomFrom(pools.availableCountries);
      if (pools.availableDecades.length) decadeText = randomFrom(pools.availableDecades);
      if (pools.availableStyles.length) styleText = randomFrom(pools.availableStyles);
      if (pools.availableClasses.length) classText = randomFrom(pools.availableClasses);
    } else {
      if (selectedManufacturers.size > 0) {
        const brandsText = Array.from(selectedManufacturers).join('/');
        carText = `Any ${brandsText}! 🏎️`;
      } else {
        carText = 'Any Car! 🏎️';
      }
      if (pools.availableCountries.length) countryText = randomFrom(pools.availableCountries);
      if (pools.availableDecades.length) decadeText = randomFrom(pools.availableDecades);
      if (pools.availableStyles.length) styleText = randomFrom(pools.availableStyles);
      if (pools.availableClasses.length) classText = randomFrom(pools.availableClasses);
    }

    const carSpan = document.getElementById('swalCar');
    const countrySpan = document.getElementById('swalCountry');
    const decadeSpan = document.getElementById('swalDecade');
    const styleSpan = document.getElementById('swalStyle');
    const classSpan = document.getElementById('swalClass');
    if (carSpan) carSpan.innerText = carText;
    if (countrySpan) countrySpan.innerText = countryText;
    if (decadeSpan) decadeSpan.innerText = decadeText;
    if (styleSpan) styleSpan.innerText = styleText;
    if (classSpan) classSpan.innerText = classText;
  }

  // Abrir modal con botones desactivados
  Swal.fire({
    title: '🎲 WHEELSPIN 🎲',
    html: `
      <div style="text-align: center;">
        <p><strong>🚗 Car:</strong> <span id="swalCar">🌀</span></p>
        <p><strong>🌍 Country:</strong> <span id="swalCountry">🌀</span></p>
        <p><strong>📅 Decade:</strong> <span id="swalDecade">🌀</span></p>
        <p><strong>🏎️ Style:</strong> <span id="swalStyle">🌀</span></p>
        <p><strong>⚙️ Class:</strong> <span id="swalClass">🌀</span></p>
      </div>
    `,
    icon: 'info',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: strictModeEnabled ? '✅ I used the exact car (+15)' : '✅ I completed the challenge (+5)',
    cancelButtonText: '❌ Pass (0)',
    confirmButtonDisabled: true,
    cancelButtonDisabled: true,
    allowOutsideClick: false,
    background: '#1e1e2f',
    color: '#fff',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#dc3545'
  }).then((result) => {
    if (result.isConfirmed) {
      const exactPoints = strictModeEnabled ? 15 : 5;
      addPoints(exactPoints);
      Swal.fire({
        title: `+${exactPoints} points!`,
        text: strictModeEnabled ? 'Great job using the exact car!' : 'Well done!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('No points added', 'Maybe next time!', 'error');
    }
    spinInProgress = false;
    spinButton.disabled = false;
  }).catch(() => {
    spinInProgress = false;
    spinButton.disabled = false;
  });

  function animate() {
    updateModalContent();
    if (step < intervals.length - 1) {
      step++;
      setTimeout(animate, intervals[step]);
    } else {
      setTimeout(() => {
        updateModalContent(); // último "falso" salto
        setTimeout(() => {
          const challenge = generateRandomChallenge();
          if (!challenge) {
            Swal.close();
            Swal.fire({
              title: '❌ No Results',
              text: 'No matching cars found. Try different filters.',
              icon: 'error',
              confirmButtonText: 'OK'
            }).then(() => {
              spinInProgress = false;
              spinButton.disabled = false;
            });
            return;
          }
          const { carText, countryText, decadeText, styleText, classText } = challenge;
          const manufacturer = getManufacturerFromCarText(carText);
          Swal.update({
            title: strictModeEnabled ? '🎯 Strict Challenge!' : '🎉 Challenge Generated!',
            html: `
              <div style="text-align: center;">
                <p><strong>🏭 Manufacturer:</strong> ${manufacturer}</p>
                <p><strong>🚗 Car:</strong> ${carText}</p>
                <p><strong>🌍 Country:</strong> ${countryText}</p>
                <p><strong>📅 Decade:</strong> ${decadeText}</p>
                <p><strong>🏎️ Style:</strong> ${styleText}</p>
                <p><strong>⚙️ Class:</strong> ${classText}</p>
              </div>
            `,
            confirmButtonDisabled: false,
            cancelButtonDisabled: false
          });
        }, 150);
      }, 200);
    }
  }

  setTimeout(animate, intervals[0]);
}

// -------------------------------------------------------------
// 7. CARGA DE LOS DOS JSON
// -------------------------------------------------------------
let brandsLoaded = false;
let carsLoaded = false;

function checkAllDataLoaded() {
  if (brandsLoaded && carsLoaded) {
    carsDatabase.forEach(car => {
      car.country = brandsCountries[car.make] || 'Unknown';
    });
    datasetStatusSpan.innerText = `${carsDatabase.length} cars loaded.`;
    fullRender();
    // Inicialmente limpiamos todos los filtros
    selectedManufacturers.clear();
    selectedCarsIds.clear();
    selectedCountries.clear();
    selectedDecades.clear();
    selectedTypes.clear();
    selectedClasses.clear();
    fullRender();
  }
}

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
// 8. LIMPIAR FILTROS
// -------------------------------------------------------------
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

const clearButton = document.getElementById('clearFiltersButton');
if (clearButton) clearButton.addEventListener('click', clearAllFilters);

spinButton.addEventListener('click', startSpinSequence);

// -------------------------------------------------------------
// TEMA OSCURO / CLARO
// -------------------------------------------------------------
const themeToggle = document.getElementById('themeToggleBtn');
if (themeToggle) {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      themeToggle.textContent = '🌞 Horizon Mode';
    } else {
      document.body.classList.remove('light-mode');
      themeToggle.textContent = '🌙 JDM Mode';
    }
    localStorage.setItem('theme', theme);
  }
  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    setTheme(newTheme);
  });
  setTheme(currentTheme);
}

// -------------------------------------------------------------
// SISTEMA DE PUNTOS
// -------------------------------------------------------------
let honorPoints = 0;
const pointsDisplay = document.getElementById('pointsDisplay');

function loadPoints() {
  const saved = localStorage.getItem('honorPoints');
  honorPoints = saved ? parseInt(saved, 10) : 0;
  updatePointsDisplay();
}
function updatePointsDisplay() {
  if (pointsDisplay) pointsDisplay.innerText = honorPoints;
}
function addPoints(amount) {
  honorPoints += amount;
  localStorage.setItem('honorPoints', honorPoints);
  updatePointsDisplay();
}
function resetPoints() {
  honorPoints = 0;
  localStorage.setItem('honorPoints', 0);
  updatePointsDisplay();
  Swal.fire({
    title: 'Points Reset',
    text: 'Your honor points have been reset to 0.',
    icon: 'info',
    confirmButtonText: 'OK',
    background: '#1e1e2f',
    color: '#fff',
    confirmButtonColor: '#f97316'
  });
}

// -------------------------------------------------------------
// MODO ESTRICTO: carga y aplicación
// -------------------------------------------------------------
function applyStrictModeUI() {
  if (strictModeEnabled) {
    // Limpiar filtros al activar modo estricto
    selectedManufacturers.clear();
    selectedCarsIds.clear();
    selectedCountries.clear();
    selectedDecades.clear();
    selectedTypes.clear();
    fullRender();
  } else {
    fullRender();
  }
}

if (strictModeToggle) {
  const savedStrictMode = localStorage.getItem('strictModeEnabled');
  if (savedStrictMode !== null) {
    strictModeEnabled = savedStrictMode === 'true';
    strictModeToggle.checked = strictModeEnabled;
    applyStrictModeUI();
  }
  strictModeToggle.addEventListener('change', (e) => {
    strictModeEnabled = e.target.checked;
    localStorage.setItem('strictModeEnabled', strictModeEnabled);
    applyStrictModeUI();
  });
}

loadPoints();

// -------------------------------------------------------------
// INSTRUCCIONES (con reset points)
// -------------------------------------------------------------
const instructionsBtn = document.getElementById('instructionsBtn');
if (instructionsBtn) {
  instructionsBtn.addEventListener('click', () => {
    Swal.fire({
      title: '📖 How to Use',
      html: `
        <div style="text-align: left;">
          <p><strong>1. Filter your car pool</strong><br>Select manufacturers, models, countries, decades, car styles, or performance classes.</p>
          <p><strong>2. Spin the roulette</strong><br>Click <strong>Spin Roulette</strong> to get a random challenge inside the popup.</p>
          <p><strong>3. Honor points system</strong><br>
            - <strong>Normal mode (Strict OFF):</strong> Complete the challenge using ANY car that meets the criteria → <strong>+5 points</strong>.<br>
            - <strong>Strict mode (ON):</strong> Use the EXACT car shown → <strong>+15 points</strong>. All other filters are disabled.<br>
            Points are saved automatically.
          </p>
          <p><strong>4. Clear filters</strong><br>Use <strong>Clear Filter</strong> to reset all selections.</p>
          <p><strong>5. Dark/Light mode</strong><br>Toggle between JDM dark mode and Horizon Festival light mode.</p>
          <p><em>All data comes from Forza Horizon 6. Enjoy!</em></p>
          <hr>
          <button id="confirmResetBtn" style="background: #dc3545; border: none; border-radius: 40px; padding: 8px 16px; color: white; font-weight: bold; cursor: pointer; width: 100%; margin-top: 10px;">⚠️ Reset Honor Points</button>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Got it!',
      background: '#1e1e2f',
      color: '#fff',
      confirmButtonColor: '#f97316',
      didOpen: () => {
        const resetBtn = document.getElementById('confirmResetBtn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            Swal.fire({
              title: '⚠️ Are you sure?',
              text: 'You will lose all your honor points!',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, reset them!',
              cancelButtonText: 'No, cancel',
              confirmButtonColor: '#dc3545',
              cancelButtonColor: '#28a745',
              background: '#1e1e2f',
              color: '#fff'
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: '🔁 Really really sure?',
                  text: 'Your points will be set to 0. This cannot be undone.',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, erase everything!',
                  cancelButtonText: 'No, keep them',
                  confirmButtonColor: '#dc3545',
                  cancelButtonColor: '#28a745',
                  background: '#1e1e2f',
                  color: '#fff'
                }).then((finalResult) => {
                  if (finalResult.isConfirmed) {
                    resetPoints();
                    Swal.fire({
                      title: 'Points reset!',
                      text: 'Your honor points are now 0.',
                      icon: 'success',
                      confirmButtonText: 'OK',
                      background: '#1e1e2f',
                      color: '#fff',
                      confirmButtonColor: '#f97316'
                    });
                  }
                });
              }
            });
          });
        }
      }
    });
  });
}