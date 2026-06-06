import {
    carsDatabase, selectedManufacturers, selectedCarsIds,
    selectedCountries, selectedDecades, selectedTypes, selectedClasses,
    PERFORMANCE_CLASSES, strictModeEnabled
} from './data.js';
import { getAvailableCars, getAvailableCountries, getAvailableDecades, getAvailableTypes, getUniqueManufacturers } from './filters.js';
import { generateRandomChallenge, getManufacturerFromChallenge } from './challenge.js';
import { addPoints } from './points.js';

const Swal = window.Swal;
if (!Swal) {
    console.error('SweetAlert2 no cargado');
}

let spinInProgress = false;

export function startSpinSequence(spinButtonElement) {
    if (spinInProgress) return;
    spinInProgress = true;
    spinButtonElement.disabled = true;

    const intervals = [20, 20, 25, 30, 35, 45, 55, 70, 90, 120, 160, 220, 300, 400];
    let step = 0;
    let animationTimer = null;
    let finalTimer = null;

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

    function randomManufacturer() {
        if (selectedManufacturers.size > 0) {
            return randomFrom(Array.from(selectedManufacturers));
        }
        const allMakes = getUniqueManufacturers();
        if (allMakes.length === 0) return 'Any';
        return randomFrom(allMakes);
    }

    function updateModalContent() {
        const pools = getPools();
        let carText = '', countryText = '', decadeText = '', styleText = '', classText = '';
        let manufacturerText = '';

        if (strictModeEnabled) {
            if (pools.availableCars.length) {
                const randomCar = randomFrom(pools.availableCars);
                carText = `${randomCar.make} ${randomCar.model}`;
                manufacturerText = randomCar.make;
            } else {
                carText = '???';
                manufacturerText = '???';
            }
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
            manufacturerText = randomManufacturer();
            if (pools.availableCountries.length) countryText = randomFrom(pools.availableCountries);
            if (pools.availableDecades.length) decadeText = randomFrom(pools.availableDecades);
            if (pools.availableStyles.length) styleText = randomFrom(pools.availableStyles);
            if (pools.availableClasses.length) classText = randomFrom(pools.availableClasses);
        }

        const manuSpan = document.getElementById('swalManufacturer');
        const carSpan = document.getElementById('swalCar');
        const countrySpan = document.getElementById('swalCountry');
        const decadeSpan = document.getElementById('swalDecade');
        const styleSpan = document.getElementById('swalStyle');
        const classSpan = document.getElementById('swalClass');
        if (manuSpan) manuSpan.innerText = manufacturerText;
        if (carSpan) carSpan.innerText = carText;
        if (countrySpan) countrySpan.innerText = countryText;
        if (decadeSpan) decadeSpan.innerText = decadeText;
        if (styleSpan) styleSpan.innerText = styleText;
        if (classSpan) classSpan.innerText = classText;
    }

    function cancelAnimation() {
        if (animationTimer) clearTimeout(animationTimer);
        if (finalTimer) clearTimeout(finalTimer);
        if (Swal.isVisible()) Swal.close();
    }

    Swal.fire({
        title: '🎲 WHEELSPIN 🎲',
        html: `
            <div style="text-align: center;">
                <button id="swalRerollBtn" style="background: #4a5568; border: none; border-radius: 40px; padding: 6px 16px; margin-bottom: 15px; color: white; font-weight: bold; cursor: pointer; font-size: 13px;" disabled>🔄 Reroll Challenge</button>
                <div>
                    <p><strong>🏭 Manufacturer:</strong> <span id="swalManufacturer">🌀</span></p>
                    <p><strong>🚗 Car:</strong> <span id="swalCar">🌀</span></p>
                    <p><strong>🌍 Country:</strong> <span id="swalCountry">🌀</span></p>
                    <p><strong>📅 Decade:</strong> <span id="swalDecade">🌀</span></p>
                    <p><strong>🏎️ Style:</strong> <span id="swalStyle">🌀</span></p>
                    <p><strong>⚙️ Class:</strong> <span id="swalClass">🌀</span></p>
                </div>
            </div>
        `,
        icon: 'info',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: strictModeEnabled ? '✅ I used the exact car (+15)' : '✅ I completed the challenge (+5)',
        cancelButtonText: '❌ Pass (0)',
        allowOutsideClick: false,
        background: '#1e1e2f',
        color: '#fff',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545',
        didOpen: (modal) => {
            const confirmBtn = modal.querySelector('.swal2-confirm');
            const cancelBtn = modal.querySelector('.swal2-cancel');
            if (confirmBtn) confirmBtn.disabled = true;
            if (cancelBtn) cancelBtn.disabled = true;
            const rerollBtn = document.getElementById('swalRerollBtn');
            if (rerollBtn) {
                rerollBtn.disabled = true;
                rerollBtn.addEventListener('click', () => {
                    cancelAnimation();
                    startSpinSequence(spinButtonElement);
                });
            }
        }
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
        spinButtonElement.disabled = false;
    }).catch(() => {
        spinInProgress = false;
        spinButtonElement.disabled = false;
    });

   function animate() {
    updateModalContent();
    if (step < intervals.length - 1) {
        step++;
        animationTimer = setTimeout(animate, intervals[step]);
    } else {
        // Animación terminada: mostrar resultado real directamente
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
                spinButtonElement.disabled = false;
            });
            return;
        }
        const { carText, countryText, decadeText, styleText, classText } = challenge;
        const manufacturer = getManufacturerFromChallenge(challenge);
        Swal.update({
            title: strictModeEnabled ? '🎯 Strict Challenge!' : '🎉 Challenge Generated!',
            html: `
                <div style="text-align: center;">
                    <button id="swalRerollBtn" style="background: #4a5568; border: none; border-radius: 40px; padding: 6px 16px; margin-bottom: 15px; color: white; font-weight: bold; cursor: pointer; font-size: 13px;">🔄 Reroll Challenge</button>
                    <div>
                        <p><strong>🏭 Manufacturer:</strong> ${manufacturer}</p>
                        <p><strong>🚗 Car:</strong> ${carText}</p>
                        <p><strong>🌍 Country:</strong> ${countryText}</p>
                        <p><strong>📅 Decade:</strong> ${decadeText}</p>
                        <p><strong>🏎️ Style:</strong> ${styleText}</p>
                        <p><strong>⚙️ Class:</strong> ${classText}</p>
                    </div>
                </div>
            `,
            confirmButtonDisabled: false,
            cancelButtonDisabled: false
        });
        const modal = Swal.getPopup();
        if (modal) {
            const confirmBtn = modal.querySelector('.swal2-confirm');
            const cancelBtn = modal.querySelector('.swal2-cancel');
            if (confirmBtn) confirmBtn.disabled = false;
            if (cancelBtn) cancelBtn.disabled = false;
            const newRerollBtn = document.getElementById('swalRerollBtn');
            if (newRerollBtn) {
                newRerollBtn.addEventListener('click', () => {
                    if (Swal.isVisible()) Swal.close();
                    startSpinSequence(spinButtonElement);
                });
            }
        }
        spinInProgress = false;
        spinButtonElement.disabled = false;
    }
}

    animationTimer = setTimeout(animate, intervals[0]);
}