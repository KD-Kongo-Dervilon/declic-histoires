/* Entrée unique : aucune dépendance et aucune requête serveur. */
(function(){
  const app=document.getElementById('app');
  window.addEventListener('error',function(e){console.error('DÉCLIC :',e.message)});
  try {
    if(typeof EPISODE==='undefined'||typeof mountApp!=='function'||typeof createEngine!=='function')throw new Error('Un module de jeu manque.');
    mountApp(app,EPISODE,{scene:'./assets/scene.webp'});
  } catch(error) {
    console.error(error);
    app.innerHTML='<main class="boot"><h1>Impossible d’ouvrir l’histoire</h1><p>Réessaie en actualisant la page. Si le problème persiste, vérifie que tous les dossiers du projet ont été publiés.</p><button type="button" onclick="location.reload()">Réessayer</button></main>';
  }
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
    window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(err=>console.warn('Mode hors connexion non activé',err)));
  }
})();
