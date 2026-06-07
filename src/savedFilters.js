// -------------------------------------------------------------
// GUARDAR / CARGAR FILTROS (localStorage)
// -------------------------------------------------------------
import { exportFiltersToCode, importFiltersFromCode } from './exportFilters.js';

let fullRenderCallback = null;

export function initSavedFilters(callback) {
    fullRenderCallback = callback;
}

// Obtener lista de filtros guardados
function getStoredFilters() {
    const stored = localStorage.getItem('savedFilters');
    return stored ? JSON.parse(stored) : [];
}

// Guardar los filtros actuales
export function saveCurrentFilters() {
    const code = exportFiltersToCode();
    if (!code) {
        Swal.fire({
            title: 'Nothing to save',
            text: 'No filters selected. Please select some filters first.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    Swal.fire({
        title: 'Save current filters',
        input: 'text',
        inputLabel: 'Enter a name for this filter set',
        inputPlaceholder: 'e.g., My Hypercar Setup',
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            if (!value) return 'You need to enter a name!';
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const name = result.value.trim();
            const savedFilters = getStoredFilters();
            const existingIndex = savedFilters.findIndex(f => f.name === name);
            if (existingIndex !== -1) {
                Swal.fire({
                    title: 'Name already exists',
                    text: 'Do you want to overwrite it?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, overwrite',
                    cancelButtonText: 'No'
                }).then((overwrite) => {
                    if (overwrite.isConfirmed) {
                        savedFilters[existingIndex] = { name, code, date: new Date().toISOString() };
                        localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
                        Swal.fire('Saved!', `Filters saved as "${name}"`, 'success');
                    }
                });
            } else {
                savedFilters.push({ name, code, date: new Date().toISOString() });
                localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
                Swal.fire('Saved!', `Filters saved as "${name}"`, 'success');
            }
        }
    });
}

// Mostrar lista de filtros guardados
export function showSavedFiltersList() {
    const savedFilters = getStoredFilters();
    if (savedFilters.length === 0) {
        Swal.fire({
            title: 'No saved filters',
            text: 'You have not saved any filter sets yet.',
            icon: 'info',
            confirmButtonText: 'OK'
        });
        return;
    }

    let html = '<div style="max-height: 300px; overflow-y: auto;">';
    savedFilters.forEach((filter, index) => {
        const date = new Date(filter.date).toLocaleString();
        html += `
            <div style="margin-bottom: 8px; padding: 6px; border: 1px solid var(--border-color); border-radius: 8px;">
                <strong>${escapeHtml(filter.name)}</strong><br>
                <small style="color: #888;">Saved: ${date}</small><br>
                <button class="load-saved-btn" data-index="${index}" style="background: #28a745; border: none; border-radius: 20px; padding: 2px 10px; margin-top: 4px; margin-right: 5px;">Load</button>
                <button class="delete-saved-btn" data-index="${index}" style="background: #dc3545; border: none; border-radius: 20px; padding: 2px 10px;">Delete</button>
            </div>
        `;
    });
    html += '</div>';

    Swal.fire({
        title: 'Saved Filter Sets',
        html: html,
        showConfirmButton: false,
        showCloseButton: true,
        focusConfirm: false,
        didOpen: () => {
            document.querySelectorAll('.load-saved-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(btn.getAttribute('data-index'), 10);
                    const code = savedFilters[idx].code;
                    importFiltersFromCode(code);
                    if (fullRenderCallback) fullRenderCallback();
                    Swal.close();
                    Swal.fire({
                        title: 'Filters Loaded',
                        text: `Loaded "${savedFilters[idx].name}"`,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                });
            });
            document.querySelectorAll('.delete-saved-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(btn.getAttribute('data-index'), 10);
                    Swal.fire({
                        title: 'Delete?',
                        text: `Are you sure you want to delete "${savedFilters[idx].name}"?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, delete',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            savedFilters.splice(idx, 1);
                            localStorage.setItem('savedFilters', JSON.stringify(savedFilters));
                            Swal.close();
                            showSavedFiltersList(); // refresh list
                        }
                    });
                });
            });
        }
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}