
// On vérifie si le navigateur du GSM supporte les Service Workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker enregistré avec succès !'))
        .catch((err) => console.log('Échec de l\'enregistrement :', err));
}


document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION GOOGLE SHEETS ---
    // Remplace l'URL ci-dessous par l'URL que tu as obtenue lors du déploiement App Script
    const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbxDJ5QeK2feo7VWcx0oWdjxF2TE7XbsDSiyEVeDAys1GOWoo84BbgbRhFXT4FoA5IIr/exec";

    const allSelectors = document.querySelectorAll('.selector-box');

    function updateIndicator(activeItem, container) {
        const indicator = container.querySelector('.indicator');

        const x = activeItem.offsetLeft;
        const itemWidth = activeItem.offsetWidth;
        const indicatorWidth = indicator.offsetWidth;
        const deplacement = x + itemWidth / 2 - indicatorWidth / 2;

        indicator.style.transform = `translateX(${deplacement}px) `;

        const newGradient = activeItem.getAttribute('data-color');
        if (newGradient) {
            container.style.background = newGradient;
            container.style.transition = "background 0.4s ease";
        }

        const colorTxt = activeItem.getAttribute('cltxt');
        if (colorTxt) {
            container.style.color = colorTxt;
            indicator.style.borderColor = colorTxt;

            const allItems = container.querySelectorAll('.value-item');
            allItems.forEach(item => {
                item.style.color = colorTxt;
            });
        }
    }

    allSelectors.forEach(container => {
        const valueItems = container.querySelectorAll('.value-item');

        valueItems.forEach(item => {
            item.addEventListener('click', (event) => {
                const clickedItem = event.currentTarget;
                container.querySelector('.value-item.active').classList.remove('active');
                clickedItem.classList.add('active');
                updateIndicator(clickedItem, container);
            });
        });

        const initialActive = container.querySelector('.value-item.active');
        if (initialActive) {
            setTimeout(() => updateIndicator(initialActive, container), 50);
        }
    });

    // --- LOGIQUE D'ENREGISTREMENT ---
    const saveBtn = document.querySelector('.my-button');

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Désactiver le bouton temporairement pour éviter les doubles clics
            saveBtn.disabled = true;
            saveBtn.innerText = "Envoi...";

            // Récupération dynamique des valeurs "actives"
            // On part du principe que tes sélecteurs sont dans l'ordre : Chlore, PH, Alcalinité dans le HTML
            const values = [];
            allSelectors.forEach(container => {
                const activeItem = container.querySelector('.value-item.active');
                values.push(activeItem ? activeItem.getAttribute('data-value') : "");
            });

            const payload = {
                chlore: values[0],
                ph: values[1],
                alcalinite: values[2]
            };

            fetch(URL_SCRIPT, {
                method: 'POST',
                mode: 'no-cors', // Évite les soucis de CORS avec Google Script
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(() => {
                    alert("Données envoyées à la feuille Google !");
                    window.location.href = "https://francoisdebelle.github.io/swimmingPool/";
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    alert("Erreur lors de l'enregistrement.");
                })
                .finally(() => {
                    saveBtn.disabled = false;
                    saveBtn.innerText = "Enregistrer";
                });
                
        });
    }
});

const burger = document.getElementById('burger-menu');
const navLinks = document.getElementById('nav-links');

burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('active');
});
