document.addEventListener('DOMContentLoaded', function() {
    const cartItems = [];
    const tableBody = document.querySelector('#medication-table tbody');
    const cartContainer = document.querySelector('.cart-container');
    const cartItemsContainer = cartContainer.querySelector('.cart-items');
    const cartTotalElement = cartContainer.querySelector('.cart-total');
    const searchBar = document.getElementById('search-bar');
    const clearCartButton = document.getElementById('clear-cart');

    let medications = [];

    fetch('/static/js/medicament.json')
        .then(response => response.json())
        .then(data => {
            medications = data;
            populateTable(medications);
        })
        .catch(error => console.error('Error loading JSON data:', error));

    function populateTable(data) {
        tableBody.innerHTML = '';
        data.forEach(med => {
            const row = document.createElement('tr');

            const attributes = ['NOM', 'DCI1', 'FORME', 'PRESENTATION', 'PRIX_BR'];
            attributes.forEach(attr => {
                const cell = document.createElement('td');
                cell.textContent = med[attr];
                row.appendChild(cell);
            });

            const actionCell = document.createElement('td');
            const addButton = document.createElement('button');
            addButton.textContent = 'Ajouter au panier';

            addButton.onclick = function() {
                if (addButton.textContent === 'Ajouter au panier') {
                    addButton.textContent = 'Ajouté';
                    addButton.classList.add('added');
                    addToCart(med.NOM, med.PRIX_BR);
                } else {
                    addButton.textContent = 'Ajouter au panier';
                    addButton.classList.remove('added');
                    removeFromCart(med.NOM, med.PRIX_BR);
                }
            };

            actionCell.appendChild(addButton);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    }

    function addToCart(name, price) {
        cartItems.push({ name, price: parseFloat(price) });
        updateCart();
        showNotification(`${name} ajouté au panier!`, 'success');
    }

    function removeFromCart(name, price) {
        const index = cartItems.findIndex(item => item.name === name);
        if (index !== -1) {
            cartItems.splice(index, 1);
            updateCart();
            showNotification(`${name} retiré du panier!`, 'error');
        }
    }

    function clearCart() {
        cartItems.length = 0;
        updateCart();
        showNotification('Panier vidé!', 'success');
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cartItems.forEach(item => {
            const cartItemElement = document.createElement('li');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <span>${item.name}</span>
                <span>${item.price.toFixed(2)} DH</span>
            `;
            cartItemsContainer.appendChild(cartItemElement);
            total += item.price;
        });
        cartTotalElement.textContent = `Total: ${total.toFixed(2)} DH`;
    }

    function showNotification(message, type) {
        const notificationContainer = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    searchBar.addEventListener('input', function() {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredMedications = medications.filter(med => {
            return med.NOM.toLowerCase().includes(searchTerm) ||
                med.DCI1.toLowerCase().includes(searchTerm) ||
                med.FORME.toLowerCase().includes(searchTerm) ||
                med.PRESENTATION.toLowerCase().includes(searchTerm);
        });
        populateTable(filteredMedications);
    });

    clearCartButton.addEventListener('click', function(e) {
        if(!clearCartButton.classList.contains('delete')) {
            clearCartButton.classList.add('delete');
            setTimeout(() => {
                clearCartButton.classList.remove('delete');
                clearCart();
            }, 3200);
        }
        e.preventDefault();
    });

    function animateLogoText() {
        let logoText = document.querySelector('.logo-text');
        logoText.style.color = 'white'; 

        setTimeout(() => {
            logoText.style.color = 'black'; 
        }, 1000); 
    }

    animateLogoText();
    setInterval(animateLogoText, 2000); 

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark Mode';
        }
    });

    let map;

    async function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 34.015, lng: -6.836 },
            zoom: 12
        });

        fetch('/get_drugstore_coordinates')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    let coord = item.location;
                    let name = item.name;
                    let phone = item.phone_number;
                    let photoUrl = item.photo_url;

                    let contentString = `
                        <div class="info-window">
                            <img src="${photoUrl}" alt="${name}">
                            <strong>${name}</strong>
                            <div>Merci d'appeler avant de partir</div>
                            <div class="phone">${phone}</div>
                            <button onclick="openDirections(${coord.lat}, ${coord.lng})">Get Directions</button>
                        </div>
                    `;

                    let infoWindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    let marker = new google.maps.Marker({
                        position: coord,
                        map: map
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(map, marker);
                    });
                });
            });
    }

    function openDirections(lat, lng) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                let startLat = position.coords.latitude;
                let startLng = position.coords.longitude;
                window.location.href = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${lat},${lng}&travelmode=driving`;
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
    initMap(); // Initialize the map
});
document.addEventListener('DOMContentLoaded', function(event) {
    var dataText = [
        "École Marocaine des Sciences de l'Ingénieur",
        "EMSI",
        "PREMIÈRE ÉCOLE PRIVÉE D'INGÉNIEUR AU MAROC RECONNUE PAR L'ÉTAT",
        "37 ANS D'EXPÉRIENCE",
        "18 CAMPUS",
        "18 000 LAURÉATS",
        "13 000 ELÈVES INGÉNIEUR",
        "ÉXCELLENCE",
        "INNOVATION",
        "TECHNOLOGY"
    ];
    
    function typeWriter(text, i, fnCallback) {
        var targetElement = document.getElementById("typewriter-text");
        if (!targetElement) {
            console.error("Target element not found");
            return;
        }
    
        if (i < text.length) {
            targetElement.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
            setTimeout(function() {
                typeWriter(text, i + 1, fnCallback);
            }, 100);
        } else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 700);
        }
    }
    
    function StartTextAnimation(i) {
        if (typeof dataText[i] == 'undefined') {
            setTimeout(function() {
                StartTextAnimation(0);
            }, 20000);
        } else {
            typeWriter(dataText[i], 0, function() {
                StartTextAnimation(i + 1);
            });
        }
    }
    
    // Initialize the typewriter effect after DOM content is loaded
    console.log('Starting text animation');
    StartTextAnimation(0);
    });

    // type text for the P tag ABOUT-US
    document.addEventListener('DOMContentLoaded', function(event) {
        var dataText = [
            "Peu importe l’heure ou le jour, avec Pharmagarde, vous pouvez toujours trouver une pharmacie de garde ouverte, que ce soit en semaine, le dimanche, les jours fériés ou même la nuit. Ce service de garde est conçu pour répondre aux besoins urgents du public en dehors des heures d’ouverture habituelles des pharmacies. Les pharmacies de garde sont facilement reconnaissables grâce à leur croix verte illuminée pendant toute la durée de leur service."
        ];
        
        function typeWriter(text, i, fnCallback) {
            var targetElement = document.getElementById("ABOUT-US-P");
            if (!targetElement) {
                console.error("Target element not found");
                return;
            }
        
            if (i < text.length) {
                targetElement.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
                setTimeout(function() {
                    typeWriter(text, i + 1, fnCallback);
                }, 100);
            } else if (typeof fnCallback == 'function') {
                setTimeout(fnCallback, 700);
            }
        }
        
        function StartTextAnimation(i) {
            if (typeof dataText[i] == 'undefined') {
                setTimeout(function() {
                    StartTextAnimation(0);
                }, 2000);
            } else {
                typeWriter(dataText[i], 0, function() {
                    StartTextAnimation(i + 1);
                });
            }
        }
        
        // Initialize the typewriter effect after DOM content is loaded
        console.log('Starting text animation');
        StartTextAnimation(0);
        });
    // review section

    document.addEventListener('DOMContentLoaded', function () {
        const stars = document.querySelectorAll('.star');
        const reviewText = document.getElementById('review-text');
        const submitReview = document.getElementById('submit-review');
        const reviewsContainer = document.getElementById('reviews-container');
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        let selectedRating = 0;
    
        stars.forEach(star => {
            star.addEventListener('mouseover', function () {
                resetStars();
                highlightStars(star.dataset.value);
            });
    
            star.addEventListener('mouseout', function () {
                resetStars();
                highlightStars(selectedRating);
            });
    
            star.addEventListener('click', function () {
                selectedRating = star.dataset.value;
                highlightStars(selectedRating);
            });
        });
    
        submitReview.addEventListener('click', function (e) {
            submitReview.classList.add('processing');
            e.preventDefault();
            
            // Simulate a delay to demonstrate the animation
            setTimeout(function () {
                const review = reviewText.value.trim();
                const name = userName.value.trim();
                const email = userEmail.value.trim();
    
                if (selectedRating > 0 && review && name && email) {
                    addReview(selectedRating, name, email, review);
                    resetReviewForm();
                    submitReview.classList.remove('processing');
                } else {
                    alert('Veuillez remplir tous les champs et sélectionner une note.');
                    submitReview.classList.remove('processing');
                }
            }, 3000);
        });
    
        function resetStars() {
            stars.forEach(star => {
                star.classList.remove('selected');
            });
        }
    
        function highlightStars(rating) {
            stars.forEach(star => {
                if (star.dataset.value <= rating) {
                    star.classList.add('selected');
                }
            });
        }
    
        function addReview(rating, name, email, review) {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';
            reviewElement.innerHTML = `
                <div class="stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
                <p><strong>${name}</strong> (${email})</p>
                <p>${review}</p>
            `;
            reviewsContainer.prepend(reviewElement);
        }
    
        function resetReviewForm() {
            reviewText.value = '';
            userName.value = '';
            userEmail.value = '';
            selectedRating = 0;
            resetStars();
        }
    });
    
    // animatiuon soumettre button
    document.addEventListener('DOMContentLoaded', function () {
        const submitReview = document.getElementById('submit-review');
        
        submitReview.addEventListener('click', function (e) {
            submitReview.classList.add('processing');
            e.preventDefault();
            
            // Simulate a delay to demonstrate the animation
            setTimeout(function () {
                submitReview.classList.remove('processing');
            }, 3000);
        });
    
        document.querySelector('.restart').addEventListener('click', e => {
            document.querySelectorAll('.button').forEach(button => {
                button.classList.remove('processing');
            });
            e.preventDefault();
        });
    });
    
        