// -------------------------------------------------------------
// FILTROS DE BÚSQUEDA EN CHECKBOXES
// -------------------------------------------------------------
export function initSearchFilters() {
    // Seleccionar todos los inputs de búsqueda
    const searchInputs = document.querySelectorAll('.filter-search-input');
    searchInputs.forEach(input => {
        // Evitar duplicar event listeners
        if (input.hasAttribute('data-search-initialized')) return;
        input.setAttribute('data-search-initialized', 'true');
        
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const targetId = e.target.getAttribute('data-target');
            if (!targetId) return;
            const container = document.getElementById(targetId);
            if (!container) return;
            const labels = container.querySelectorAll('label');
            labels.forEach(label => {
                const text = label.textContent.toLowerCase();
                if (searchTerm === '' || text.includes(searchTerm)) {
                    label.style.display = ''; // mostrar
                } else {
                    label.style.display = 'none'; // ocultar
                }
            });
        });
    });
}