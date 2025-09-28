/* ========= D8 Home – Routing, I18n, Onboarding, Animations ========= */

// --- Utils
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => Array.from(ctx.querySelectorAll(q));
const storage = {
  get: (k, d=null) => {
    try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch{return d}
  },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
};

// --- I18n
const i18n = {
  fr: {
    homeTitle: "Bienvenue sur la nouvelle meilleure chaîne",
    heroSubtitle: (name) => name ? `Salut ${name} 👋 — prêt à reprendre là où tu t’es arrêté ?`
        : "Regardez le meilleur des séries, films et sport en illimité.",
    discover: "Découvrir",
    live: "TV en direct",
    tabs: {home:"Accueil", tv:"TV", prog:"Programmes", plus:"D8 +"},
    rails: {trend:"Tendances", cont:"Reprendre"},
    ob: {
      title:"Bienvenue sur D8, configurons votre expérience",
      lang:"Choisis ta langue",
      name:"Ton pseudo",
      pass:"Mot de passe",
      hint:"Tes infos sont stockées en local sur cet appareil.",
      next:"Étape suivante",
      finish:"Terminer",
      done:(name)=>`Compte créé avec succès. Bienvenue ${name} !`
    },
    back:"Retour en arrière disponible",
    loading:"Chargement…"
  },
  en: {
    homeTitle: "Welcome to the new best channel",
    heroSubtitle: (name) => name ? `Hey ${name} 👋 — ready to continue watching?`
        : "Watch the best series, movies and sports.",
    discover: "Discover",
    live: "Live TV",
    tabs: {home:"Home", tv:"TV", prog:"Programs", plus:"D8 +"},
    rails: {trend:"Trending", cont:"Continue watching"},
    ob: {
      title:"Welcome to D8, let’s set you up",
      lang:"Choose your language",
      name:"Your nickname",
      pass:"Password",
      hint:"Your info is stored locally on this device.",
      next:"Next step",
      finish:"Finish",
      done:(name)=>`Account created successfully. Welcome ${name}!`
    },
    back:"Back available",
    loading:"Loading…"
  },
  es: {
    homeTitle: "Bienvenido al nuevo mejor canal",
    heroSubtitle: (name) => name ? `Hola ${name} 👋 — ¿listo para continuar?`
        : "Mira las mejores series, películas y deportes.",
    discover: "Descubrir",
    live: "TV en directo",
    tabs: {home:"Inicio", tv:"TV", prog:"Programas", plus:"D8 +"},
    rails: {trend:"Tendencias", cont:"Continuar"},
    ob: {
      title:"Bienvenido a D8, configuremos tu experiencia",
      lang:"Elige tu idioma",
      name:"Tu apodo",
      pass:"Contraseña",
      hint:"Tu información se guarda localmente en este dispositivo.",
      next:"Siguiente paso",
      finish:"Finalizar",
      done:(name)=>`Cuenta creada con éxito. ¡Bienvenido ${name}!`
    },
    back:"Volver disponible",
    loading:"Cargando…"
  },
  de: {
    homeTitle: "Willkommen beim neuen besten Sender",
    heroSubtitle: (name) => name ? `Hi ${name} 👋 — bereit weiterzuschauen?`
        : "Die besten Serien, Filme und Sport – unbegrenzt.",
    discover: "Entdecken",
    live: "Live-TV",
    tabs: {home:"Start", tv:"TV", prog:"Programme", plus:"D8 +"},
    rails: {trend:"Trends", cont:"Weiterschauen"},
    ob: {
      title:"Willkommen bei D8, richten wir dich ein",
      lang:"Wähle deine Sprache",
      name:"Dein Spitzname",
      pass:"Passwort",
      hint:"Deine Daten werden lokal gespeichert.",
      next:"Weiter",
      finish:"Fertig",
      done:(name)=>`Konto erfolgreich erstellt. Willkommen ${name}!`
    },
    back:"Zurück verfügbar",
    loading:"Wird geladen…"
  }
};

function getLang(){
  const saved = storage.get('d8.lang','fr');
  return i18n[saved] ? saved : 'fr';
}
function setLang(code){
  storage.set('d8.lang', code);
  applyTexts();
}

function applyTexts(){
  const lang = getLang();
  const t = i18n[lang];
  const name = storage.get('d8.username','');

  // Hero + CTAs
  $('#heroTitle').textContent = t.homeTitle;
  $('#heroSubtitle').textContent = t.heroSubtitle(name);
  $('#ctaWatch').textContent = t.discover;
  $('#ctaMore').textContent = t.live;

  // Rails
  $('#railTrending').textContent = t.rails.trend;
  $('#railContinue').textContent = t.rails.cont;

  // Tabs
  $('#tabHome').textContent = t.tabs.home;
  $('#tabTV').textContent = t.tabs.tv;
  $('#tabProg').textContent = t.tabs.prog;
  $('#tabPlus').textContent = t.tabs.plus;

  // Loader & toast
  $('#loaderText').textContent = t.loading;
  $('#backToastText').textContent = t.back;

  // Onboarding strings (in case reopened)
  $('#obTitle').textContent = t.ob.title;
  $('#obLangLabel').textContent = t.ob.lang;
  $('#obNameLabel').textContent = t.ob.name;
  $('#obPassLabel').textContent = t.ob.pass;
  $('#obHint').textContent = t.ob.hint;
  $('#nextToName').textContent = t.ob.next;
  $('#nextToPass').textContent = t.ob.next;
  $('#finishOb').textContent = t.ob.finish;
}

// --- Onboarding flow
function maybeOpenOnboarding(){
  const hasUser = !!storage.get('d8.username', '');
  if(!hasUser){
    $('#onboard').showModal();
    $('#obLang').value = getLang();
    stepTo('lang');
  }
}
function stepTo(step){
  $$('.ob-step').forEach(s => s.classList.remove('active'));
  $(`.ob-step--${step}`).classList.add('active');
}
function finishOnboarding(){
  const lang = $('#obLang').value;
  const name = ($('#obName').value || '').trim();
  const pass = $('#obPass').value || '';
  if(!name || !pass){ return; }
  setLang(lang);
  storage.set('d8.username', name);
  storage.set('d8.password', pass); // local only, as demandé
  applyTexts();
  // Success mini modal
  const msg = i18n[getLang()].ob.done(name);
  $('#onboard').close();
  showToast(msg, 2800);
  // Avatar initial
  $('#avatar').textContent = (name[0] || 'U').toUpperCase();
}

// --- Routing (fake)
function navigate(route){
  // Set active links/tabs
  $$('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.route===route));
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.route===route));

  // Show loader & toast back hint
  showLoader(true);
  setTimeout(() => {
    showLoader(false);
    showBackToast();
    // Fake anchor
    history.pushState({route}, '', `#${route}`);
    // Personalize hero subtitle every nav
    applyTexts();
  }, 640 + Math.random()*240);
}

function showLoader(flag){
  $('#loader').classList.toggle('show', !!flag);
}
function showBackToast(){
  const t = $('#backToast');
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 2300);
}
function showToast(text, ms=2000){
  const t = $('#backToast');
  $('#backToastText').textContent = text;
  t.classList.add('show');
  setTimeout(()=>{ t.classList.remove('show'); applyTexts(); }, ms);
}

// --- Events
window.addEventListener('DOMContentLoaded', () => {
  // Personalisation initiale
  const user = storage.get('d8.username','');
  if(user) $('#avatar').textContent = (user[0]||'U').toUpperCase();

  applyTexts();
  maybeOpenOnboarding();

  // Desktop nav
  $$('.nav-link').forEach(a => a.addEventListener('click', (e)=>{
    e.preventDefault(); navigate(a.dataset.route);
  }));
  // Mobile tabs
  $$('.tab').forEach(t => t.addEventListener('click', (e)=>{
    e.preventDefault(); navigate(t.dataset.route);
  }));
  // CTA
  $('#ctaWatch').addEventListener('click', ()=> navigate('programmes'));
  $('#ctaMore').addEventListener('click', ()=> navigate('tv'));

  // Back button in toast
  $('#goBackBtn').addEventListener('click', ()=> history.back());
  window.addEventListener('popstate', ()=> showBackToast());

  // Onboarding steps
  $('#nextToName').addEventListener('click', ()=> stepTo('name'));
  $('#backToLang').addEventListener('click', ()=> stepTo('lang'));
  $('#nextToPass').addEventListener('click', ()=> stepTo('pass'));
  $('#backToName').addEventListener('click', ()=> stepTo('name'));
  $('#onboardForm').addEventListener('submit', (e)=>{ e.preventDefault(); finishOnboarding(); });

  // Lang live switch when selecting during onboarding
  $('#obLang').addEventListener('change', (e)=> setLang(e.target.value));
});
