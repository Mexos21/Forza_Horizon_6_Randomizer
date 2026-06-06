import { resetPoints } from './points.js';

const Swal = window.Swal;
if (!Swal) {
    console.error('SweetAlert2 no cargado');
}

export function initInstructions(instructionsBtn) {
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