// Configuration et données
const ADMIN_PASSWORD = 'coupdefood2024';
let currentSlide = 0;
let isAdmin = false;
let carouselInterval;

// Données de menu par défaut
let menuData = {
    bagels: [
        {
            id: 1,
            name: "Bagel Saumon Avocat",
            image: "assets/images/bagel-hero.jpg",
            ingredients: "Bagel complet, saumon fumé, avocat, cream cheese, aneth",
            calories: 420,
            proteins: 18,
            price: 12.50
        }
    ],
    sandwiches: [
        {
            id: 1,
            name: "Sandwich Gourmet Grillé",
            image: "assets/images/sandwich-hero.jpg",
            ingredients: "Pain artisanal, fromage de chèvre, légumes grillés, pesto",
            calories: 380,
            proteins: 15,
            price: 11.00
        }
    ],
    toasts: [
        {
            id: 1,
            name: "Toast Avocat Multigraines",
            image: "assets/images/toast-hero.jpg",
            ingredients: "Pain multigraines, avocat, tomates cerises, graines",
            calories: 320,
            proteins: 12,
            price: 9.50
        }
    ],
    salades: [
        {
            id: 1,
            name: "Salade Gourmet du Chef",
            image: "assets/images/salad-hero.jpg",
            ingredients: "Mesclun, quinoa, légumes de saison, vinaigrette maison",
            calories: 280,
            proteins: 14,
            price: 13.00
        }
    ],
    desserts: [
        {
            id: 1,
            name: "Panna Cotta aux Fruits Rouges",
            image: "assets/images/dessert-hero.jpg",
            ingredients: "Panna cotta vanille, coulis de fruits rouges, menthe",
            calories: 220,
            proteins: 6,
            price: 7.50
        }
    ],
    boissons: [
        {
            id: 1,
            name: "Smoothie Détox",
            image: "assets/images/drink-hero.jpg",
            ingredients: "Épinards, pomme verte, gingembre, citron vert",
            calories: 120,
            proteins: 3,
            price: 6.50
        }
    ]
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadMenuData();
    renderAllDishes();
    updateCategoryCounts();
    initCarousel();
    initSmoothScrolling();
    initScrollAnimations();
});

// Gestion du carrousel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    
    // Auto-slide
    carouselInterval = setInterval(() => {
        nextSlide();
    }, 5000);
    
    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    });
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + 1) % totalSlides;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const totalSlides = slides.length;
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function goToSlide(slideIndex) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = slideIndex;
    
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// Navigation
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    
    if (mobileMenu.style.display === 'block') {
        mobileMenu.style.display = 'none';
        menuBtn.className = 'fas fa-bars';
    } else {
        mobileMenu.style.display = 'block';
        menuBtn.className = 'fas fa-times';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    mobileMenu.style.display = 'none';
    menuBtn.className = 'fas fa-bars';
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
        updateActiveNavLink(sectionId);
    }
}

function updateActiveNavLink(sectionId) {
    // Mettre à jour les liens de navigation actifs
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling pour tous les liens d'ancrage
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Animations au scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const elementsToAnimate = document.querySelectorAll('.stat-item, .category-card, .dish-card');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Gestion des données du menu
function loadMenuData() {
    const savedData = localStorage.getItem('coupDeFood_menu');
    if (savedData) {
        menuData = JSON.parse(savedData);
    }
}

function saveMenuData() {
    localStorage.setItem('coupDeFood_menu', JSON.stringify(menuData));
}

function renderAllDishes() {
    Object.keys(menuData).forEach(category => {
        renderDishes(category);
    });
}

function renderDishes(category) {
    const container = document.getElementById(`${category}-dishes`);
    if (!container) return;
    
    const dishes = menuData[category] || [];
    
    if (dishes.length === 0) {
        container.innerHTML = `
            <div class="no-dishes">
                <h3>Aucun plat disponible</h3>
                <p>Cette catégorie sera bientôt remplie de délicieuses spécialités !</p>
                <button class="btn-premium" onclick="showAdminPanel()">Ajouter des plats</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = dishes.map(dish => `
        <div class="dish-card" data-dish-id="${dish.id}">
            <img src="${dish.image}" alt="${dish.name}" class="dish-image" onerror="this.src='assets/images/placeholder.jpg'">
            <div class="dish-content">
                <h3 class="dish-name">${dish.name}</h3>
                <p class="dish-ingredients">${dish.ingredients}</p>
                <div class="dish-info">
                    <div class="dish-nutrition">
                        <div class="nutrition-item">
                            <i class="fas fa-bolt"></i>
                            <span>${dish.calories} cal</span>
                        </div>
                        <div class="nutrition-item">
                            <i class="fas fa-dumbbell"></i>
                            <span>${dish.proteins}g protéines</span>
                        </div>
                    </div>
                </div>
                <div class="dish-footer">
                    <span class="dish-price">${dish.price.toFixed(2)}€</span>
                    <button class="order-btn" onclick="orderDish('${dish.name}')">Commander</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCategoryCounts() {
    Object.keys(menuData).forEach(category => {
        const countElement = document.getElementById(`${category}-count`);
        if (countElement) {
            countElement.textContent = menuData[category].length;
        }
    });
}

function orderDish(dishName) {
    alert(`Commande de "${dishName}" ajoutée ! (Fonctionnalité de démonstration)`);
}

// Administration
function showAdminPanel() {
    document.getElementById('adminPanel').style.display = 'flex';
    if (isAdmin) {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        renderAdminMenuList();
    } else {
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminDashboard').style.display = 'none';
    }
}

function hideAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
}

function adminLogin(event) {
    event.preventDefault();
    const password = document.getElementById('adminPassword').value;
    const errorElement = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        isAdmin = true;
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        document.getElementById('adminPassword').value = '';
        errorElement.textContent = '';
        renderAdminMenuList();
    } else {
        errorElement.textContent = 'Mot de passe incorrect';
    }
}

function renderAdminMenuList() {
    const container = document.getElementById('adminMenuList');
    let html = '';
    
    Object.keys(menuData).forEach(category => {
        const dishes = menuData[category];
        html += `
            <div class="admin-category">
                <h4>${category.charAt(0).toUpperCase() + category.slice(1)} (${dishes.length} plats)</h4>
                <div class="admin-dishes">
                    ${dishes.map(dish => `
                        <div class="admin-dish-item">
                            <div class="admin-dish-info">
                                <strong>${dish.name}</strong>
                                <p>${dish.ingredients}</p>
                                <span class="admin-dish-price">${dish.price.toFixed(2)}€</span>
                            </div>
                            <div class="admin-dish-actions">
                                <button class="edit-btn" onclick="editDish('${category}', ${dish.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-btn" onclick="deleteDish('${category}', ${dish.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function showAddDishForm() {
    document.getElementById('addDishModal').style.display = 'flex';
}

function hideAddDishForm() {
    document.getElementById('addDishModal').style.display = 'none';
    document.getElementById('addDishForm').reset();
}

function addDish(event) {
    event.preventDefault();
    
    const category = document.getElementById('dishCategory').value;
    const name = document.getElementById('dishName').value;
    const ingredients = document.getElementById('dishIngredients').value;
    const calories = parseInt(document.getElementById('dishCalories').value);
    const proteins = parseInt(document.getElementById('dishProteins').value);
    const price = parseFloat(document.getElementById('dishPrice').value);
    const image = document.getElementById('dishImage').value || `assets/images/${category}-hero.jpg`;
    
    const newDish = {
        id: Date.now(), // Simple ID generation
        name,
        ingredients,
        calories,
        proteins,
        price,
        image
    };
    
    if (!menuData[category]) {
        menuData[category] = [];
    }
    
    menuData[category].push(newDish);
    saveMenuData();
    renderDishes(category);
    updateCategoryCounts();
    renderAdminMenuList();
    hideAddDishForm();
    
    alert('Plat ajouté avec succès !');
}

function editDish(category, dishId) {
    const dish = menuData[category].find(d => d.id === dishId);
    if (!dish) return;
    
    // Pré-remplir le formulaire avec les données existantes
    document.getElementById('dishCategory').value = category;
    document.getElementById('dishName').value = dish.name;
    document.getElementById('dishIngredients').value = dish.ingredients;
    document.getElementById('dishCalories').value = dish.calories;
    document.getElementById('dishProteins').value = dish.proteins;
    document.getElementById('dishPrice').value = dish.price;
    document.getElementById('dishImage').value = dish.image;
    
    // Modifier le formulaire pour la modification
    const form = document.getElementById('addDishForm');
    form.onsubmit = function(event) {
        event.preventDefault();
        updateDish(category, dishId);
    };
    
    document.querySelector('#addDishModal .modal-header h3').textContent = 'Modifier le plat';
    showAddDishForm();
}

function updateDish(category, dishId) {
    const dishIndex = menuData[category].findIndex(d => d.id === dishId);
    if (dishIndex === -1) return;
    
    const name = document.getElementById('dishName').value;
    const ingredients = document.getElementById('dishIngredients').value;
    const calories = parseInt(document.getElementById('dishCalories').value);
    const proteins = parseInt(document.getElementById('dishProteins').value);
    const price = parseFloat(document.getElementById('dishPrice').value);
    const image = document.getElementById('dishImage').value;
    
    menuData[category][dishIndex] = {
        ...menuData[category][dishIndex],
        name,
        ingredients,
        calories,
        proteins,
        price,
        image
    };
    
    saveMenuData();
    renderDishes(category);
    renderAdminMenuList();
    hideAddDishForm();
    
    // Restaurer le formulaire d'ajout
    document.getElementById('addDishForm').onsubmit = addDish;
    document.querySelector('#addDishModal .modal-header h3').textContent = 'Ajouter un nouveau plat';
    
    alert('Plat modifié avec succès !');
}

function deleteDish(category, dishId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
        menuData[category] = menuData[category].filter(d => d.id !== dishId);
        saveMenuData();
        renderDishes(category);
        updateCategoryCounts();
        renderAdminMenuList();
        alert('Plat supprimé avec succès !');
    }
}

// Import/Export Excel
function exportMenu() {
    // Créer les données CSV
    let csvContent = "Catégorie,Nom,Ingrédients,Calories,Protéines,Prix,Image\\n";
    
    Object.keys(menuData).forEach(category => {
        menuData[category].forEach(dish => {
            csvContent += `"${category}","${dish.name}","${dish.ingredients}",${dish.calories},${dish.proteins},${dish.price},"${dish.image}"\\n`;
        });
    });
    
    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'menu_coup_de_food.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Menu exporté avec succès !');
}

function importMenu(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\\n');
            const newMenuData = {
                bagels: [],
                sandwiches: [],
                toasts: [],
                salades: [],
                desserts: [],
                boissons: []
            };
            
            // Ignorer la première ligne (en-têtes)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                // Parser la ligne CSV (simple, peut être amélioré)
                const matches = line.match(/(".*?"|[^",\\s]+)(?=\\s*,|\\s*$)/g);
                if (matches && matches.length >= 6) {
                    const category = matches[0].replace(/"/g, '');
                    const name = matches[1].replace(/"/g, '');
                    const ingredients = matches[2].replace(/"/g, '');
                    const calories = parseInt(matches[3]);
                    const proteins = parseInt(matches[4]);
                    const price = parseFloat(matches[5]);
                    const image = matches[6] ? matches[6].replace(/"/g, '') : `assets/images/${category}-hero.jpg`;
                    
                    if (newMenuData[category]) {
                        newMenuData[category].push({
                            id: Date.now() + Math.random(),
                            name,
                            ingredients,
                            calories,
                            proteins,
                            price,
                            image
                        });
                    }
                }
            }
            
            // Confirmer l'import
            if (confirm('Voulez-vous remplacer le menu actuel par le menu importé ?')) {
                menuData = newMenuData;
                saveMenuData();
                renderAllDishes();
                updateCategoryCounts();
                renderAdminMenuList();
                alert('Menu importé avec succès !');
            }
        } catch (error) {
            alert('Erreur lors de l\\'import du fichier. Vérifiez le format.');
            console.error('Import error:', error);
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// Gestion des clics en dehors des modals
document.addEventListener('click', function(event) {
    const adminPanel = document.getElementById('adminPanel');
    const addDishModal = document.getElementById('addDishModal');
    
    if (event.target === adminPanel) {
        hideAdminPanel();
    }
    
    if (event.target === addDishModal) {
        hideAddDishForm();
    }
});

// Gestion des touches clavier
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideAdminPanel();
        hideAddDishForm();
        closeMobileMenu();
    }
    
    // Navigation du carrousel avec les flèches
    if (event.key === 'ArrowLeft') {
        prevSlide();
    } else if (event.key === 'ArrowRight') {
        nextSlide();
    }
});

// Styles CSS additionnels pour l'administration
const adminStyles = `
<style>
.admin-category {
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    border-left: 4px solid var(--color-primary);
}

.admin-category h4 {
    font-family: var(--font-primary);
    color: var(--color-primary);
    margin-bottom: 15px;
    text-transform: capitalize;
}

.admin-dishes {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.admin-dish-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    transition: var(--transition-fast);
}

.admin-dish-item:hover {
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.1);
}

.admin-dish-info {
    flex: 1;
}

.admin-dish-info strong {
    display: block;
    color: var(--color-text-dark);
    margin-bottom: 5px;
}

.admin-dish-info p {
    color: var(--color-text-light);
    font-size: 0.9rem;
    margin: 0 0 5px 0;
}

.admin-dish-price {
    font-weight: 600;
    color: var(--color-primary);
}

.admin-dish-actions {
    display: flex;
    gap: 10px;
}

.edit-btn, .delete-btn {
    background: none;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: var(--transition-fast);
}

.edit-btn {
    color: #3498db;
}

.edit-btn:hover {
    background: #3498db;
    color: white;
}

.delete-btn {
    color: #e74c3c;
}

.delete-btn:hover {
    background: #e74c3c;
    color: white;
}

.no-dishes {
    text-align: center;
    padding: 60px 20px;
    color: var(--color-text-light);
}

.no-dishes h3 {
    font-family: var(--font-primary);
    color: var(--color-text-dark);
    margin-bottom: 15px;
}

.no-dishes p {
    margin-bottom: 25px;
}

@media (max-width: 768px) {
    .admin-dish-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
    
    .admin-dish-actions {
        align-self: flex-end;
    }
}
</style>
`;

// Injecter les styles additionnels
document.head.insertAdjacentHTML('beforeend', adminStyles);

