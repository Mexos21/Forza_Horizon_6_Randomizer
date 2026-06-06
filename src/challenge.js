import {
    carsDatabase, selectedManufacturers, selectedCarsIds,
    selectedCountries, selectedDecades, selectedTypes, selectedClasses,
    PERFORMANCE_CLASSES, getCarDecade, strictModeEnabled
} from './data.js';
import { getUniqueManufacturers } from './filters.js';

export function generateRandomChallenge() {
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
    const realMake = pickedCar.make;

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

    return {
        carText, countryText, decadeText, styleText, classText,
        realMake, showCarModel, showCountry, showDecade, showType
    };
}

export function getManufacturerFromCarText(carText) {
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

export function getManufacturerFromChallenge(challenge) {
    const { carText, realMake, showCarModel } = challenge;
    if (showCarModel) return realMake;
    if (!strictModeEnabled && Math.random() < 0.3) return realMake;
    if (carText.includes('Any Car')) return 'Any';
    if (carText.includes('Any ') && !carText.includes('Any Car')) {
        const match = carText.match(/Any (.+?)!/);
        if (match) return match[1];
        return 'Any';
    }
    return 'Any';
}