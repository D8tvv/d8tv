/* ========= D8 User Manager - LocalStorage System ========= */

class D8UserManager {
    constructor() {
        this.storageKeys = {
            username: 'd8_user_username',
            language: 'd8_user_language',
            password: 'd8_user_password',
            settings: 'd8_user_settings',
            isConfigured: 'd8_user_configured'
        };
    }

    // Sauvegarder les données utilisateur
    saveUser(userData) {
        try {
            localStorage.setItem(this.storageKeys.username, userData.username || '');
            localStorage.setItem(this.storageKeys.language, userData.language || 'fr');
            localStorage.setItem(this.storageKeys.password, userData.password || '');
            localStorage.setItem(this.storageKeys.settings, JSON.stringify(userData.settings || {}));
            localStorage.setItem(this.storageKeys.isConfigured, 'true');
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return false;
        }
    }

    // Récupérer les données utilisateur
    getUser() {
        try {
            const user = {
                username: localStorage.getItem(this.storageKeys.username) || '',
                language: localStorage.getItem(this.storageKeys.language) || 'fr',
                password: localStorage.getItem(this.storageKeys.password) || '',
                settings: JSON.parse(localStorage.getItem(this.storageKeys.settings) || '{}'),
                isConfigured: localStorage.getItem(this.storageKeys.isConfigured) === 'true'
            };
            return user;
        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            return null;
        }
    }

    // Vérifier si un utilisateur est configuré
    isUserConfigured() {
        const user = this.getUser();
        return user && user.isConfigured && user.username.length > 0;
    }

    // Mettre à jour le pseudo
    updateUsername(newUsername) {
        if (newUsername && newUsername.trim().length > 0) {
            localStorage.setItem(this.storageKeys.username, newUsername.trim());
            this.updateUI();
            return true;
        }
        return false;
    }

    // Mettre à jour la langue
    updateLanguage(newLanguage) {
        if (newLanguage && ['fr', 'en', 'es', 'de'].includes(newLanguage)) {
            localStorage.setItem(this.storageKeys.language, newLanguage);
            return true;
        }
        return false;
    }

    // Mettre à jour l'interface utilisateur
    updateUI() {
        const user = this.getUser();
        if (!user || !user.username) return;

        // Mettre à jour le nom d'utilisateur
        const userNameElements = document.querySelectorAll('#userName, .user-name');
        userNameElements.forEach(el => {
            if (el) el.textContent = user.username;
        });

        // Mettre à jour l'avatar
        const userAvatarElements = document.querySelectorAll('#userAvatar, .user-avatar');
        userAvatarElements.forEach(el => {
            if (el) el.textContent = user.username.charAt(0).toUpperCase();
        });

        // Mettre à jour les éléments personnalisés
        const personalizedElements = document.querySelectorAll('[data-personalized]');
        personalizedElements.forEach(el => {
            const template = el.getAttribute('data-personalized');
            if (template) {
                el.textContent = template.replace('{username}', user.username);
            }
        });
    }

    // Effacer toutes les données utilisateur
    clearUser() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    // Initialiser l'interface au chargement
    initializeUI() {
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateUI());
        } else {
            this.updateUI();
        }
    }

    // Méthodes de navigation avec préservation des données
    navigateToTV() {
        const user = this.getUser();
        if (user && user.username) {
            window.location.href = `tv.html?user=${encodeURIComponent(user.username)}`;
        } else {
            window.location.href = 'tv.html';
        }
    }

    navigateToHome() {
        const user = this.getUser();
        if (user && user.username) {
            window.location.href = `index.html?user=${encodeURIComponent(user.username)}`;
        } else {
            window.location.href = 'index.html';
        }
    }

    // Récupérer l'utilisateur depuis l'URL (pour compatibilité)
    getUserFromURL() {
        const params = new URLSearchParams(window.location.search);
        const usernameFromURL = params.get('user');

        if (usernameFromURL) {
            // Si on a un utilisateur dans l'URL, le sauvegarder
            const existingUser = this.getUser() || {};
            existingUser.username = decodeURIComponent(usernameFromURL);
            existingUser.isConfigured = true;
            this.saveUser(existingUser);
        }

        return this.getUser();
    }

    // Fonction d'initialisation complète
    initialize() {
        // Récupérer l'utilisateur depuis l'URL si présent
        this.getUserFromURL();

        // Initialiser l'interface
        this.initializeUI();

        // Retourner l'état de configuration
        return this.isUserConfigured();
    }
}

// Instance globale
const userManager = new D8UserManager();

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = D8UserManager;
}
