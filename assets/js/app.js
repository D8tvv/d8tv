/* ====== Utils / Storage ====== */
const storage = {
  get(key, fallback=null){
    try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch{ return fallback; }
  },
  set(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
};

/* ====== I18N ====== */
const I18N = {
  fr: { ob_welcome_title:"Bienvenue sur D8", ob_welcome_desc:"Configurons votre expérience.", next:"Étape suivante", back:"Retour",
        choose_lang:"Choisissez votre langue", choose_name:"Votre pseudo", choose_password:"Mot de passe",
        pwd_local_hint:"Il sera enregistré en local sur cet appareil.", finish:"Terminer", success_title:"Compte créé",
        enter_site:"Entrer sur le site", back_title:"Revenir en arrière ?", back_desc:"Vous allez revenir à la page précédente.",
        cancel:"Annuler", confirm:"Confirmer", offers:"NOS OFFRES", nav_discover:"Découvrir", nav_sport:"Sport",
        nav_ent:"Divertissement", nav_series:"Séries", nav_cinema:"Cinéma", nav_kids:"Jeunesse",
        hero_title:"Bienvenue sur la nouvelle meilleure chaîne", hero_sub:"Regardez séries, films et sport en illimité.",
        watch_now:"Regarder maintenant", discover_offers:"Découvrir nos offres", continue_watching:"Continuer de regarder",
        trending:"Tendances", series:"Séries", legal:"Mentions légales", privacy:"Confidentialité", cookies:"Cookies",
        help:"Aide", reset:"Reconfigurer l’expérience", home:"Accueil", search:"Recherche", downloads:"Téléchargements", profile:"Profil"
      },
  en: { ob_welcome_title:"Welcome to D8", ob_welcome_desc:"Let's set up your experience.", next:"Next", back:"Back",
        choose_lang:"Choose your language", choose_name:"Your nickname", choose_password:"Password",
        pwd_local_hint:"It will be stored locally on this device.", finish:"Finish", success_title:"Account created",
        enter_site:"Enter the site", back_title:"Go back?", back_desc:"You are about to go to the previous page.",
        cancel:"Cancel", confirm:"Confirm", offers:"OUR OFFERS", nav_discover:"Discover", nav_sport:"Sport",
        nav_ent:"Entertainment", nav_series:"Series", nav_cinema:"Cinema", nav_kids:"Kids",
        hero_title:"Welcome to the new best channel", hero_sub:"Watch series, movies and sports without limits.",
        watch_now:"Watch now", discover_offers:"Discover our offers", continue_watching:"Continue watching",
        trending:"Trending", series:"Series", legal:"Legal", privacy:"Privacy", cookies:"Cookies",
        help:"Help", reset:"Reconfigure experience", home:"Home", search:"Search", downloads:"Downloads", profile:"Profile"
      },
  es: { ob_welcome_title:"Bienvenido a D8", ob_welcome_desc:"Configuremos tu experiencia.", next:"Siguiente", back:"Atrás",
        choose_lang:"Elige tu idioma", choose_name:"Tu apodo", choose_password:"Contraseña",
        pwd_local_hint:"Se guardará localmente en este dispositivo.", finish:"Finalizar", success_title:"Cuenta creada",
        enter_site:"Entrar al sitio", back_title:"¿Volver?", back_desc:"Vas a volver a la página anterior.",
        cancel:"Cancelar", confirm:"Confirmar", offers:"NUESTRAS OFERTAS", nav_discover:"Descubrir", nav_sport:"Deporte",
        nav_ent:"Entretenimiento", nav_series:"Series", nav_cinema:"Cine", nav_kids:"Infantil",
        hero_title:"Bienvenido al nuevo mejor canal", hero_sub:"Mira series, películas y deportes sin límites.",
        watch_now:"Ver ahora", discover_offers:"Descubrir ofertas", continue_watching:"Seguir viendo",
        trending:"Tendencias", series:"Series", legal:"Aviso legal", privacy:"Privacidad", cookies:"Cookies",
        help:"Ayuda", reset:"Reconfigurar experiencia", home:"Inicio", search:"Buscar", downloads:"Descargas", profile:"Perfil"
      },
  de: { ob_welcome_title:"Willkommen bei D8", ob_welcome_desc:"Lassen Sie uns Ihr Erlebnis einrichten.", next:"Weiter", back:"Zurück",
        choose_lang:"Wählen Sie Ihre Sprache", choose_name:"Ihr Spitzname", choose_password:"Passwort",
        pwd_local_hint:"Wird lokal auf diesem Gerät gespeichert.", finish:"Fertig", success_title:"Konto erstellt",
        enter_site:"Website betreten", back_title:"Zurückgehen?", back_desc:"Sie kehren zur vorherigen Seite zurück.",
        cancel:"Abbrechen", confirm:"Bestätigen", offers:"UNSERE ANGEBOTE", nav_discover:"Entdecken", nav_sport:"Sport",
        nav_ent:"Unterhaltung", nav_series:"Serien", nav_cinema:"Kino", nav_kids:"Kinder",
        hero_title:"Willkommen beim neuen besten Sender", hero_sub:"Serien, Filme und Sport ohne Grenzen ansehen.",
        watch_now:"Jetzt ansehen", discover_offers:"Angebote entdecken", continue_watching:"Weiterschauen",
        trending:"Angesagt", series:"Serien", legal:"Impressum", privacy:"Datenschutz", cookies:"Cookies",
        help:"Hilfe", reset:"Erlebnis neu konfigurieren", home:"Start", search:"Suche", downloads:"Downloads", profile:"Profil"
      }
};

function applyI18n(lang){
  const dict = I18N[lang] || I18N.fr;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(dict[key]) el.textContent = dict[key];
  });
  document.documentElement.lang = lang;
}

/* ====== Theme ====== */
function applyTheme(theme){
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  metaTheme.setAttribute("content", theme === "light" ? "#ffffff" : "#111111");
}
function toggleTheme(){
  const profile = storage.get('d8.profile') || {};
  const next = (profile.theme === "light") ? "dark" : "light";
  profile.theme = next;
  storage.set('d8.profile', profile);
  applyTheme(next);
}

/* ====== Loader ====== */
function hideLoader(){ document.getElementById('loader').classList.add('hidden'); }

/* ====== Onboarding ====== */
const onboardingEl = document.getElementById('onboarding');
const steps = [...document.querySelectorAll('.step')];
function showModal(mod){ mod.classList.remove('hidden'); }
function hideModal(mod){ mod.classList.add('hidden'); }
function goStep(n){ steps.forEach(s=>s.classList.toggle('active', s.dataset.step === String(n))); }
function initOnboarding(){
  const profile = storage.get('d8.profile');
  if(!profile){ showModal(onboardingEl); goStep(1); }
  else{
    applyI18n(profile.lang || 'fr');
    applyTheme(profile.theme || 'dark');
    personalize(profile);
  }
}
function personalize(profile){
  const sub = document.getElementById('hero-sub');
  const dict = I18N[profile.lang || 'fr'];
  sub.textContent = `${dict.hero_sub} ${profile.username ? `— ${profile.username}` : ''}`;
  const avatar = document.getElementById('avatar');
  avatar.textContent = profile.username ? profile.username[0].toUpperCase() : "";
}
document.addEventListener('click', (e)=>{
  const nextBtn = e.target.closest('.next');
  const prevBtn = e.target.closest('.prev');
  if(nextBtn){ goStep(nextBtn.dataset.next); }
  if(prevBtn){ goStep(prevBtn.dataset.prev); }
});
document.getElementById('ob-close').addEventListener('click', ()=> hideModal(onboardingEl));
document.getElementById('ob-finish').addEventListener('click', ()=>{
  const lang = document.getElementById('lang-select').value || 'fr';
  const username = (document.getElementById('ob-username').value || '').trim() || 'Invité';
  const password = document.getElementById('ob-password').value || '';
  const profile = { lang, username, passwordSaved: !!password, theme: 'dark' };
  storage.set('d8.profile', profile);
  storage.set('d8.secret', password);
  applyI18n(lang);
  applyTheme(profile.theme);
  personalize(profile);
  const dict = I18N[lang];
  document.getElementById('ob-success').textContent = dict.success_title;
  document.getElementById('ob-success-msg').textContent = `${username}, ${dict.success_title.toLowerCase()} !`;
  goStep(5);
});
document.getElementById('ob-start').addEventListener('click', ()=> hideModal(onboardingEl));
document.getElementById('reset-onboarding').addEventListener('click', ()=>{
  localStorage.removeItem('d8.profile');
  localStorage.removeItem('d8.secret');
  showModal(onboardingEl); goStep(1);
});

/* ====== Back popup ====== */
const backPopup = document.getElementById('back-popup');
let pendingBack = false;
window.addEventListener('popstate', (e)=>{
  if(pendingBack){ pendingBack = false; return; }
  e.preventDefault(); showModal(backPopup);
});
document.getElementById('bp-cancel').addEventListener('click', ()=> hideModal(backPopup));
document.getElementById('bp-confirm').addEventListener('click', ()=>{ hideModal(backPopup); pendingBack = true; history.back(); });

/* ====== Fake route changes with loader ====== */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      document.getElementById('loader').classList.remove('hidden');
      setTimeout(()=>{ hideLoader(); history.pushState({}, "", href); }, 400);
    }
  });
});

/* ====== Drag-to-Scroll for scrollers ====== */
document.querySelectorAll('.scroller').forEach(scroller => {
  let isDown = false, startX = 0, scrollLeft = 0;
  const start = (x)=>{ isDown = TrueFlag(); scroller.classList.add('grabbing'); startX = x - scroller.offsetLeft; scrollLeft = scroller.scrollLeft; };
  const move = (x)=>{
    if(!isDown) return;
    const walk = (x - scroller.offsetLeft - startX) * 1.1;
    scroller.scrollLeft = scrollLeft - walk;
  };
  const end = ()=>{ isDown = false; scroller.classList.remove('grabbing'); };
  scroller.addEventListener('mousedown', e=> start(e.pageX));
  scroller.addEventListener('mousemove', e=> move(e.pageX));
  scroller.addEventListener('mouseleave', end);
  scroller.addEventListener('mouseup', end);
  scroller.addEventListener('touchstart', e=> start(e.touches[0].pageX), {passive:true});
  scroller.addEventListener('touchmove', e=> move(e.touches[0].pageX), {passive:true});
  scroller.addEventListener('touchend', end);
});
// small helper to avoid minifiers removing booleans during copy/paste
function TrueFlag(){ return true; }

/* ====== Theme toggle button ====== */
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

/* Year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Boot */
window.addEventListener('load', ()=>{
  const profile = storage.get('d8.profile') || {};
  applyI18n(profile.lang || 'fr');
  applyTheme(profile.theme || 'dark');
  personalize(profile || {});
  setTimeout(hideLoader, 450);
  initOnboarding();
  // PWA register
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('service-worker.js');
  }
});
