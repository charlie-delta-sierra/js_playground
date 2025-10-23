const aboutBtn = document.getElementById('about-btn');

const aboutModal = document.getElementById('about-modal');
const aboutContent = document.getElementById('about-content');

aboutBtn.addEventListener('click', () => {
    aboutModal.classList.remove('hidden');
    document.getElementById("menu-panel").classList.add('hidden');
});

aboutModal.addEventListener('mousedown', (e) => {
    if (!aboutContent.contains(e.target)) {
        aboutModal.classList.add('hidden');
    }
});
