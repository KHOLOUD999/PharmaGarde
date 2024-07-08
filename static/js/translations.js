const translations = {
    en: {
        "title-pharmacies": "On-Duty Pharmacies",
        "title-medications": "Medications",
        "cart-title": "Medications in Cart",
        "clear-cart-text": "Clear Cart",
        "about-title": "Who Are We?",
        "reviews-title": "Give Your Review",
        "footer-about-title": "About Us",
        "footer-about-text": "Welcome to Pharmagarde, your trusted source for finding on-duty pharmacies in your area. Our mission is to provide you with accurate and up-to-date information about the nearest pharmacies, ensuring you have access to the medication and health products you need, whenever you need them.",
        "footer-contact-title": "Contact Us",
        "user-name": "Name",
        "user-email": "Email",
        "review-text": "Write your review here..."
    },
    fr: {
        "title-pharmacies": "Pharmacies De Garde",
        "title-medications": "Médicaments",
        "cart-title": "Médicaments dans le panier",
        "clear-cart-text": "Vider le panier",
        "about-title": "Qui Sommes Nous?",
        "reviews-title": "Donnez votre avis",
        "footer-about-title": "À propos de nous",
        "footer-about-text": "Bienvenue chez Pharmagarde, votre source fiable pour trouver des pharmacies de garde dans votre région. Notre mission est de vous fournir des informations précises et à jour sur les pharmacies les plus proches, vous assurant ainsi d'avoir accès aux médicaments et produits de santé dont vous avez besoin, à tout moment.",
        "footer-contact-title": "Contactez-nous",
        "user-name": "Nom et Prénom",
        "user-email": "Email",
        "review-text": "Écrivez votre avis ici..."
    },
    ar: {
        "title-pharmacies": "الصيدليات المناوبة",
        "title-medications": "الأدوية",
        "cart-title": "الأدوية في السلة",
        "clear-cart-text": "إفراغ السلة",
        "about-title": "من نحن؟",
        "reviews-title": "أعط رأيك",
        "footer-about-title": "معلومات عنا",
        "footer-about-text": "مرحبًا بكم في Pharmagarde، مصدرك الموثوق للعثور على الصيدليات المناوبة في منطقتك. مهمتنا هي تزويدك بمعلومات دقيقة ومحدثة حول أقرب الصيدليات، مما يضمن لك الوصول إلى الأدوية ومنتجات الصحة التي تحتاجها في أي وقت.",
        "footer-contact-title": "اتصل بنا",
        "user-name": "الاسم واللقب",
        "user-email": "البريد الإلكتروني",
        "review-text": "اكتب رأيك هنا..."
    }
};

function setLanguage(language) {
    document.querySelectorAll('[id]').forEach(el => {
        if (translations[language][el.id]) {
            el.innerHTML = translations[language][el.id];
       
            if (el.placeholder) {
                el.placeholder = translations[language][el.id];
            }
        }});
    }
    
    document.getElementById('lang-fr').addEventListener('click', () => setLanguage('fr'));
    document.getElementById('lang-ar').addEventListener('click', () => setLanguage('ar'));
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
    
    setLanguage('fr'); // Set default language to French
    