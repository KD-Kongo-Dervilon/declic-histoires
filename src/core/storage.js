/* Les données restent sur l'appareil. En mode fichier local, le stockage peut être désactivé. */
const STORAGE_KEY='declic.episode01.v2';
const storage={read(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}catch{return null}},write(value){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value))}catch{}},clear(){try{localStorage.removeItem(STORAGE_KEY)}catch{}}};
