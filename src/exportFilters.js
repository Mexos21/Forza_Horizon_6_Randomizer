// -------------------------------------------------------------
// EXPORTAR E IMPORTAR FILTROS (CÓDIGO COMPACTO)
// -------------------------------------------------------------
import {
    selectedManufacturers, selectedCarsIds, selectedCountries, selectedDecades,
    selectedTypes, selectedClasses,
    manufacturerById, countryById, styleById,
    manufacturerToId, countryToId, styleToId,
    DECADES_LIST
} from './data.js';

const CLASS_INDEX = {
    'D 500': '0',
    'C 600': '1',
    'B 700': '2',
    'A 800': '3',
    'S1 900': '4',
    'S2 998': '5',
    'X 999': '6'
};
const INDEX_CLASS = {
    '0': 'D 500',
    '1': 'C 600',
    '2': 'B 700',
    '3': 'A 800',
    '4': 'S1 900',
    '5': 'S2 998',
    '6': 'X 999'
};

export function exportFiltersToCode() {
    const parts = [];
    if (selectedManufacturers.size) {
        const ids = Array.from(selectedManufacturers).map(m => manufacturerToId[m]).join('');
        parts.push(`m${ids}`);
    }
    if (selectedCountries.size) {
        const ids = Array.from(selectedCountries).map(c => countryToId[c]).join('');
        parts.push(`c${ids}`);
    }
    if (selectedDecades.size) {
        const decades = Array.from(selectedDecades).map(d => d.slice(0,2)).join('');
        parts.push(`d${decades}`);
    }
    if (selectedTypes.size) {
        const ids = Array.from(selectedTypes).map(s => styleToId[s]).join('');
        parts.push(`s${ids}`);
    }
    if (selectedClasses.size) {
        const classIdx = CLASS_INDEX[Array.from(selectedClasses)[0]];
        if (classIdx !== undefined) parts.push(`p${classIdx}`);
    }
    if (selectedCarsIds.size) {
        const ids = Array.from(selectedCarsIds).map(id => String(id).padStart(3, '0')).join('');
        parts.push(`i${ids}`);
    }
    return parts.join('');
}

export function importFiltersFromCode(code) {
    if (!code) {
        console.warn('Empty code');
        return;
    }
    // Limpiar selecciones actuales
    selectedManufacturers.clear();
    selectedCarsIds.clear();
    selectedCountries.clear();
    selectedDecades.clear();
    selectedTypes.clear();
    selectedClasses.clear();

    let i = 0;
    while (i < code.length) {
        const category = code[i];
        i++;
        let buffer = '';
        while (i < code.length && !'mcdspi'.includes(code[i])) {
            buffer += code[i];
            i++;
        }
        switch (category) {
            case 'm':
                for (let j = 0; j < buffer.length; j += 2) {
                    const id = buffer.substr(j, 2);
                    const name = manufacturerById[id];
                    if (name) selectedManufacturers.add(name);
                    else console.warn(`Manufacturer ID ${id} not found`);
                }
                break;
            case 'c':
                for (let j = 0; j < buffer.length; j += 2) {
                    const id = buffer.substr(j, 2);
                    const name = countryById[id];
                    if (name) selectedCountries.add(name);
                    else console.warn(`Country ID ${id} not found`);
                }
                break;
            case 'd':
                for (let j = 0; j < buffer.length; j += 2) {
                    const decCode = buffer.substr(j, 2);
                    let decade;
                    if (parseInt(decCode, 10) >= 90) {
                        decade = `19${decCode}s`;
                    } else {
                        decade = `20${decCode}s`;
                    }
                    if (DECADES_LIST.includes(decade)) selectedDecades.add(decade);
                    else console.warn(`Decade ${decade} not valid`);
                }
                break;
            case 's':
                for (let j = 0; j < buffer.length; j += 2) {
                    const id = buffer.substr(j, 2);
                    const name = styleById[id];
                    if (name) selectedTypes.add(name);
                    else console.warn(`Style ID ${id} not found`);
                }
                break;
            case 'p':
                {
                    const idx = buffer;
                    const className = INDEX_CLASS[idx];
                    if (className) selectedClasses.add(className);
                    else console.warn(`Class index ${idx} not valid`);
                }
                break;
            case 'i':
                for (let j = 0; j < buffer.length; j += 3) {
                    const idStr = buffer.substr(j, 3);
                    const id = parseInt(idStr, 10);
                    if (!isNaN(id)) selectedCarsIds.add(id);
                    else console.warn(`Invalid car ID ${idStr}`);
                }
                break;
            default:
                console.warn(`Unknown category ${category} at position ${i}`);
        }
    }
}