export function initTheme(themeToggleBtn) {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    function setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            themeToggleBtn.textContent = '🌞 Horizon Mode';
        } else {
            document.body.classList.remove('light-mode');
            themeToggleBtn.textContent = '🌙 JDM Mode';
        }
        localStorage.setItem('theme', theme);
    }
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        setTheme(newTheme);
    });
    setTheme(currentTheme);
}