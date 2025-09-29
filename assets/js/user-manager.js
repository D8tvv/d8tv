/* ========= D8 User Manager - LocalStorage System ========= */

class D8UserManager {
    constructor() {
        this.storageKey = 'd8_user_data'; // Clé unique pour toutes les données
    }

    // Sauvegarder les données utilisateur
    saveUser(userData) {
        try {
            const currentData = this.getUser() || {};
            const mergedData = {
                ...currentData,
                ...userData,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(mergedData));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return false;
        }
    }

    // Récupérer les données utilisateur
    getUser() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return null;
            return JSON.parse(data);
        } catch (error) {
            console.error('Erreur lors de la récupération:', error);
            return null;
        }
    }

    // Vérifier si un utilisateur est configuré
    isUserConfigured() {
        const user = this.getUser();
        return user && user.username && user.username.length > 0;
    }

    // Mettre à jour le pseudo
    updateUsername(newUsername) {
        if (newUsername && newUsername.trim().length > 0) {
            const user = this.getUser() || {};
            user.username = newUsername.trim();
            this.saveUser(user);
            this.updateUI();
            return true;
        }
        return false;
    }

    // Mettre à jour la langue
    updateLanguage(newLanguage) {
        if (newLanguage && ['fr', 'en', 'es', 'de'].includes(newLanguage)) {
            const user = this.getUser() || {};
            user.language = newLanguage;
            this.saveUser(user);
            return true;
        }
        return false;
    }

    // Mettre à jour l'interface utilisateur
    updateUI() {
        const user = this.getUser();

        // Mettre à jour le nom d'utilisateur
        const userNameElements = document.querySelectorAll('#userName, .user-name');
        userNameElements.forEach(el => {
            if (el) {
                if (user && user.username) {
                    el.textContent = user.username;
                } else {
                    // Ne pas afficher "Utilisateur" par défaut
                    el.style.display = 'none';
                }
            }
        });

        // Mettre à jour l'avatar
        const userAvatarElements = document.querySelectorAll('#userAvatar, .user-avatar');
        userAvatarElements.forEach(el => {
            if (el) {
                if (user && user.username) {
                    el.textContent = user.username.charAt(0).toUpperCase();
                    el.style.display = 'flex';
                } else {
                    // Icône par défaut si pas d'utilisateur
                    el.innerHTML = '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                }
            }
        });

        // Masquer/Afficher le profil si pas d'utilisateur
        const userProfileElements = document.querySelectorAll('#userProfile, .user-profile');
        userProfileElements.forEach(el => {
            if (el) {
                if (!user || !user.username) {
                    el.style.cursor = 'pointer';
                    el.title = 'Se connecter';
                }
            }
        });
    }

    // Effacer toutes les données utilisateur
    clearUser() {
        localStorage.removeItem(this.storageKey);
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
        window.location.href = 'tv.html';
    }

    navigateToHome() {
        window.location.href = 'index.html';
    }

    navigateToD8Plus() {
        window.location.href = 'd8plus.html';
    }

    // Migration depuis l'ancien système (si nécessaire)
    migrateOldData() {
        const oldKeys = {
            username: 'd8_user_username',
            language: 'd8_user_language',
            password: 'd8_user_password',
            settings: 'd8_user_settings',
            isConfigured: 'd8_user_configured'
        };

        const oldUsername = localStorage.getItem(oldKeys.username);
        if (oldUsername && !this.getUser()) {
            // Migrer les anciennes données
            const userData = {
                username: oldUsername,
                language: localStorage.getItem(oldKeys.language) || 'fr',
                password: localStorage.getItem(oldKeys.password) || '',
                settings: JSON.parse(localStorage.getItem(oldKeys.settings) || '{}')
            };

            this.saveUser(userData);

            // Nettoyer les anciennes clés
            Object.values(oldKeys).forEach(key => localStorage.removeItem(key));
        }
    }

    // Fonction d'initialisation complète
    initialize() {
        // Migrer les anciennes données si nécessaire
        this.migrateOldData();

        // Initialiser l'interface
        this.initializeUI();

        // Retourner l'état de configuration
        return this.isUserConfigured();
    }

    // Gérer le clic sur le profil non connecté
    handleProfileClick() {
        if (!this.isUserConfigured()) {
            // Déclencher l'ouverture du modal d'onboarding
            const event = new CustomEvent('openOnboarding');
            document.dispatchEvent(event);
        } else {
            // Menu utilisateur connecté (à implémenter selon besoins)
            const event = new CustomEvent('openUserMenu');
            document.dispatchEvent(event);
        }
    }
}

// Instance globale
const userManager = new D8UserManager();

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = D8UserManager;
}