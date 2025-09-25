// ===== JT Page - YouTube Player avec détection de langue =====

// Configuration des playlists par langue
const PLAYLISTS_CONFIG = {
  fr: {
    playlistId: 'PLKEy1unUi6hWfyfSJtH4tL5r5JKBBTQuj',
    title: 'D8 News France',
    description: 'Actualités françaises en continu'
  },
  en: {
    playlistId: 'PLSyY1udCyYqA0klB0MeTnE4cKTqX_MnAi',
    title: 'D8 News International',
    description: 'International news coverage'
  },
  es: {
    playlistId: 'PLeWLUsiMVbC9AaPHgZEXZQyGq_4AzOzCv',
    title: 'D8 Noticias',
    description: 'Noticias en español'
  },
  de: {
    playlistId: 'PLD9tv0TxyeYLFh8UZzMy8TjfEhMpdgkFH',
    title: 'D8 Nachrichten',
    description: 'Deutsche Nachrichten'
  }
};

// Clé API YouTube (à remplacer par votre vraie clé)
const YOUTUBE_API_KEY = 'AIzaSyAk2SSgFGfE-xNRG8H7xD973BywrYFVnaM';

// Variables globales
let player = null;
let currentLang = 'fr';
let isYouTubeAPIReady = false;

// Initialisation quand la page se charge
document.addEventListener('DOMContentLoaded', function() {
  initializeJTPage();
});

// Fonction principale d'initialisation
function initializeJTPage() {
  // Détecter la langue de l'utilisateur
  currentLang = detectUserLanguage();
  console.log('Langue détectée:', currentLang);

  // Charger l'API YouTube
  loadYouTubeAPI();

  // Mettre à jour l'année dans le footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Détecter la langue de l'utilisateur
function detectUserLanguage() {
  // 1. Vérifier le localStorage (préférence sauvegardée)
  const savedLang = localStorage.getItem('userLang');
  if (savedLang && PLAYLISTS_CONFIG[savedLang]) {
    return savedLang;
  }

  // 2. Vérifier la langue du navigateur
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();

  if (PLAYLISTS_CONFIG[langCode]) {
    return langCode;
  }

  // 3. Langue par défaut
  return 'fr';
}

// Charger l'API YouTube de manière asynchrone
function loadYouTubeAPI() {
  // Créer le script de l'API YouTube
  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  script.onload = function() {
    console.log('API YouTube chargée');
  };
  document.head.appendChild(script);

  // Fonction callback appelée automatiquement par l'API YouTube
  window.onYouTubeIframeAPIReady = function() {
    console.log('API YouTube prête');
    isYouTubeAPIReady = true;
    initializePlayer();
  };
}

// Initialiser le lecteur YouTube
function initializePlayer() {
  const config = PLAYLISTS_CONFIG[currentLang];

  // Créer le lecteur YouTube
  player = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    playerVars: {
      'autoplay': 0,
      'controls': 1,
      'rel': 0,
      'showinfo': 0,
      'modestbranding': 1,
      'fs': 1,
      'cc_load_policy': 0,
      'iv_load_policy': 3
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}

// Quand le lecteur est prêt
function onPlayerReady(event) {
  console.log('Lecteur YouTube prêt');
  loadLatestVideoFromPlaylist();
}

// Gérer les changements d'état du lecteur
function onPlayerStateChange(event) {
  // Vous pouvez ajouter des actions spécifiques ici
  if (event.data === YT.PlayerState.PLAYING) {
    console.log('Vidéo en cours de lecture');
  }
}

// Gérer les erreurs du lecteur
function onPlayerError(event) {
  console.error('Erreur du lecteur YouTube:', event.data);
  updateVideoInfo('Erreur de chargement', 'Impossible de charger la vidéo. Veuillez réessayer plus tard.');
}

// Charger la dernière vidéo de la playlist
async function loadLatestVideoFromPlaylist() {
  const config = PLAYLISTS_CONFIG[currentLang];

  try {
    // Si pas de clé API, utiliser une méthode alternative
    if (YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
      console.warn('Clé API YouTube non configurée, utilisation d\'une vidéo de démonstration');
      loadDemoVideo();
      return;
    }

    // Appel à l'API YouTube pour récupérer les vidéos de la playlist
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?` +
      `part=snippet&playlistId=${config.playlistId}&maxResults=1&order=date&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Erreur API YouTube');
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const latestVideo = data.items[0];
      const videoId = latestVideo.snippet.resourceId.videoId;
      const videoTitle = latestVideo.snippet.title;
      const videoDescription = latestVideo.snippet.description;

      // Charger la vidéo dans le lecteur
      player.loadVideoById(videoId);

      // Mettre à jour les informations
      updateVideoInfo(videoTitle, videoDescription);
    } else {
      throw new Error('Aucune vidéo trouvée dans la playlist');
    }

  } catch (error) {
    console.error('Erreur lors du chargement de la playlist:', error);
    loadDemoVideo();
  }
}

// Charger une vidéo de démonstration (fallback)
function loadDemoVideo() {
  const config = PLAYLISTS_CONFIG[currentLang];

  // Vidéos de démonstration par langue
  const demoVideos = {
    fr: { id: 'dQw4w9WgXcQ', title: 'JT D8 - Édition du soir', description: 'Retrouvez toute l\'actualité française et internationale.' },
    en: { id: 'dQw4w9WgXcQ', title: 'D8 News - Evening Edition', description: 'Stay updated with French and international news.' },
    es: { id: 'dQw4w9WgXcQ', title: 'D8 Noticias - Edición nocturna', description: 'Mantente informado con noticias francesas e internacionales.' },
    de: { id: 'dQw4w9WgXcQ', title: 'D8 Nachrichten - Abendausgabe', description: 'Bleiben Sie auf dem Laufenden mit französischen und internationalen Nachrichten.' }
  };

  const demoVideo = demoVideos[currentLang];

  if (player && player.loadVideoById) {
    player.loadVideoById(demoVideo.id);
    updateVideoInfo(demoVideo.title, demoVideo.description);
  }
}

// Mettre à jour les informations de la vidéo
function updateVideoInfo(title, description) {
  const titleElement = document.getElementById('video-title');
  const descriptionElement = document.getElementById('video-description');

  if (titleElement) {
    titleElement.textContent = title;
  }

  if (descriptionElement) {
    // Limiter la description à 150 caractères
    const shortDescription = description.length > 150
      ? description.substring(0, 150) + '...'
      : description;
    descriptionElement.textContent = shortDescription;
  }
}

// Fonction utilitaire pour changer de langue manuellement
window.changeNewsLanguage = function(newLang) {
  if (PLAYLISTS_CONFIG[newLang] && newLang !== currentLang) {
    currentLang = newLang;
    localStorage.setItem('userLang', newLang);

    if (isYouTubeAPIReady && player) {
      loadLatestVideoFromPlaylist();
    }
  }
};

// Export pour utilisation dans d'autres scripts
window.JTPlayer = {
  changeLanguage: window.changeNewsLanguage,
  getCurrentLanguage: () => currentLang,
  getSupportedLanguages: () => Object.keys(PLAYLISTS_CONFIG)
};
