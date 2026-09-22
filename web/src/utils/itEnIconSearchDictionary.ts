/** Dizionario IT -> EN per la ricerca icone: NON è una traduzione di tutti i nomi/tag delle icone
 *  (impraticabile, sono migliaia), ma un elenco curato delle ~150 parole italiane più comuni che un
 *  utente probabilmente digita cercando un'icona per una lista. La query viene tradotta con questo
 *  dizionario prima di essere confrontata con slug/tag ufficiali (in inglese) di lucide-static. Se
 *  la parola non è nel dizionario, la ricerca prova comunque il testo originale così digitare
 *  direttamente in inglese continua a funzionare. */
export const IT_EN_ICON_SEARCH_TERMS: Record<string, string> = {
  // persone / corpo
  persona: 'person',
  utente: 'user',
  faccia: 'face',
  corpo: 'body',
  bambino: 'baby',
  occhio: 'eye',
  cuore: 'heart',
  mano: 'hand',
  orecchio: 'ear',
  // animali
  animale: 'animal',
  cane: 'dog',
  gatto: 'cat',
  uccello: 'bird',
  pesce: 'fish',
  coniglio: 'rabbit',
  // natura / meteo
  natura: 'nature',
  albero: 'tree',
  pianta: 'plant',
  fiore: 'flower',
  sole: 'sun',
  luna: 'moon',
  pioggia: 'rain',
  neve: 'snow',
  nuvola: 'cloud',
  vento: 'wind',
  fuoco: 'fire',
  acqua: 'water',
  montagna: 'mountain',
  stella: 'star',
  // cibo
  cibo: 'food',
  bevanda: 'drink',
  frutta: 'fruit',
  verdura: 'vegetable',
  cucina: 'kitchen',
  caffe: 'coffee',
  caffè: 'coffee',
  pizza: 'pizza',
  torta: 'cake',
  // viaggi / trasporti
  viaggio: 'travel',
  trasporto: 'transport',
  auto: 'car',
  macchina: 'car',
  aereo: 'plane',
  volo: 'flight',
  treno: 'train',
  nave: 'ship',
  mappa: 'map',
  posizione: 'location',
  bici: 'bike',
  bicicletta: 'bike',
  autobus: 'bus',
  // sport / tempo libero
  sport: 'sport',
  gioco: 'game',
  esercizio: 'exercise',
  palla: 'ball',
  pallone: 'ball',
  // tecnologia
  dispositivo: 'device',
  computer: 'computer',
  telefono: 'phone',
  cellulare: 'phone',
  batteria: 'battery',
  wifi: 'wifi',
  // comunicazione
  messaggio: 'message',
  chat: 'chat',
  mail: 'mail',
  email: 'email',
  notifica: 'notification',
  invia: 'send',
  chiamata: 'call',
  // business / finanza
  soldi: 'money',
  denaro: 'money',
  finanza: 'finance',
  grafico: 'chart',
  pagamento: 'payment',
  negozio: 'store',
  banca: 'bank',
  carta: 'card',
  // media
  musica: 'music',
  video: 'video',
  foto: 'photo',
  fotocamera: 'camera',
  immagine: 'image',
  film: 'movie',
  suono: 'sound',
  audio: 'audio',
  // casa / oggetti
  casa: 'home',
  edificio: 'building',
  mobili: 'furniture',
  strumento: 'tool',
  chiave: 'key',
  porta: 'door',
  finestra: 'window',
  lampada: 'lamp',
  sedia: 'chair',
  letto: 'bed',
  // forme
  forma: 'shape',
  simbolo: 'symbol',
  cerchio: 'circle',
  quadrato: 'square',
  triangolo: 'triangle',
  // frecce / navigazione UI
  freccia: 'arrow',
  direzione: 'direction',
  // testo / documenti
  testo: 'text',
  documento: 'document',
  file: 'file',
  scrivi: 'writing',
  modifica: 'edit',
  nota: 'note',
  libro: 'book',
  cartella: 'folder',
  // salute
  salute: 'health',
  medico: 'medical',
  ospedale: 'hospital',
  pillola: 'pill',
  // sicurezza
  sicurezza: 'security',
  lucchetto: 'lock',
  scudo: 'shield',
  privacy: 'privacy',
  // tempo
  tempo: 'time',
  orologio: 'clock',
  sveglia: 'alarm',
  calendario: 'calendar',
  // varie / azioni comuni
  aggiungi: 'add',
  elimina: 'delete',
  rimuovi: 'remove',
  cerca: 'search',
  cestino: 'trash',
  regalo: 'gift',
  bandiera: 'flag',
  stampa: 'print',
  download: 'download',
  scarica: 'download',
  carica: 'upload',
  condividi: 'share',
  preferiti: 'favorite',
  impostazioni: 'settings',
  utenti: 'users',
  gruppo: 'group',
};

/** Traduce una parola/frase italiana in inglese usando il dizionario curato, parola per parola.
 *  Le parole non trovate restano invariate, così una query mista o già in inglese funziona comunque. */
export function translateSearchQuery(query: string): string {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((word) => IT_EN_ICON_SEARCH_TERMS[word] ?? word)
    .join(' ');
}
