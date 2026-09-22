# User Feedback — Flussi UX

> Descrizione dei flussi **indipendente dalla libreria UI** (in freedihare sono componenti React/Tailwind, ma qui sono descritti per comportamento, non per implementazione). In fondo: note specifiche per un adattamento React Native + backend GraphQL/Prisma online.

## Flusso 1 — Invio feedback (utente)

**Punto di ingresso**: un'icona "feedback" **sempre visibile e raggiungibile in un tap**, indipendentemente dalla sezione in cui ci si trova — in freedihare è nella barra superiore, accanto ad account/logout, visibile per ogni ruolo (anche l'admin può inviare feedback). Non è un elemento contestuale a una sola schermata.

**Passi**:

1. Tap sull'icona → si apre un form modale/overlay. Lo stato della sezione da cui si è partiti viene catturato in quel momento.
2. Il form ha 4 campi:
   - **Tipo** — selettore a scelta singola tra 3 opzioni con icona (Bug / Suggerimento / Commento). Default: **Commento** (l'opzione meno "impegnativa", per non scoraggiare l'invio di feedback generici).
   - **Titolo** — campo di testo breve, esplicitamente opzionale, placeholder tipo "Sintesi breve".
   - **Messaggio** — area di testo multi-riga, **obbligatoria**, con limite visibile (contatore caratteri, max 3000).
   - **Pagina** — selettore a scelta singola, **pre-compilato automaticamente** con la sezione da cui si è aperto il form, ma **modificabile** dall'utente prima di inviare.
3. Il pulsante di invio è **disabilitato** finché il messaggio è vuoto o mentre la richiesta è in corso (nessun doppio invio possibile).
4. Esito:
   - **Successo** → notifica di conferma ("Feedback inviato"), chiusura automatica del form, reset di tutti i campi allo stato iniziale (tipo torna a Commento, pagina torna a quella corrente).
   - **Errore** (rete/server) → notifica di errore, **il form resta aperto con i dati inseriti intatti** (l'utente non deve riscrivere tutto).
5. Se l'utente riapre il form dopo essere navigato altrove, il campo "Pagina" si ri-allinea automaticamente alla nuova sezione corrente (non resta congelato sul valore della sessione precedente).

## Flusso 2 — Storico personale + eliminazione (utente)

**Punto di ingresso**: una sezione dedicata raggiungibile dal profilo/impostazioni dell'utente (in freedihare: dentro la pagina Profilo, non dentro la Guida come originariamente pianificato — vedi nota in fondo a `README.md`).

**Contenuto**:

1. Un avviso testuale in cima che spiega la regola di eliminazione, in linguaggio semplice: *"Puoi rimuovere un feedback solo finché non è in fase di valutazione/lavorazione da parte del nostro team."*
2. Un pulsante primario "Invia feedback" che apre **lo stesso** form del Flusso 1 (nessun componente duplicato — la sezione storico è anche un secondo punto di ingresso per l'invio).
3. La lista dei propri feedback, più recenti in cima, ciascuno con:
   - icona del tipo
   - titolo (o inizio del testo se il titolo manca)
   - badge di stato (etichette utente-friendly: "Ricevuto" / "In valutazione" / "Valutato" — **mai** "Rifiutato", vedi `API_CONTRACT.md`)
   - data
   - icona cestino: **attiva** solo se il feedback è ancora eliminabile (stato iniziale, non contrassegnato), altrimenti visibile ma disabilitata con tooltip che spiega il motivo
4. Tap sul cestino (solo se attivo) → dialogo di conferma esplicito prima di eliminare (azione distruttiva, mai immediata al primo tap).
5. Dopo eliminazione confermata: notifica di conferma, riga rimossa dalla lista senza dover ricaricare la pagina.
6. Stato vuoto: messaggio dedicato ("Non hai ancora inviato feedback"), non una lista vuota silenziosa.
7. Se la lista è lunga, viene paginata (mostrane N, poi "carica altri"/paginazione), non caricata infinita in un colpo solo.

## Flusso 3 — Triage admin

**Punto di ingresso**: una sezione dedicata nel pannello di amministrazione, separata dalle altre statistiche/gestioni.

**Struttura**:

1. **Tre viste (tab)** sullo stesso dataset, non tre query diverse:
   - *Ricevuti* — status iniziale, non ancora gestiti
   - *In lavorazione*
   - *Conclusi* — raggruppa sia "completati" che "rifiutati" in un'unica vista (l'admin distingue i due esiti solo dal colore/etichetta del badge stato all'interno della lista, non da un tab separato)
2. **Barra filtri**, applicata sopra la tab attiva:
   - campo di ricerca libera (cerca contemporaneamente in titolo, testo del messaggio, nome/cognome/email dell'autore)
   - toggle "solo importanti"
3. **Contatori sintetici** sempre visibili sopra la lista: quanti non letti, quanti in lavorazione — gli stessi numeri che alimentano un eventuale badge nella navigazione principale dell'admin.
4. **Lista feedback**, card compatta per ciascuno:
   - riga 1: autore (nome+cognome, email se c'è spazio) · data · **pallino "non letto"** se applicabile
   - riga 2: titolo (o inizio testo)
   - riga 3: anteprima del testo troncata a poche righe
   - riga 4: badge tipo + badge pagina di provenienza · icona stella cliccabile (toggle importante, **senza aprire il dettaglio** — azione rapida sulla card stessa) · badge stato (sola lettura sulla card)
   - un bordo/accento colorato per tipo (es. rosso per bug) rende la lista scansionabile a colpo d'occhio
   - tap sulla card (fuori dalla stella) → apre il dettaglio
5. **Dettaglio** (modale/schermata separata):
   - titolo, badge tipo/pagina/stato, autore+data, testo completo scrollabile
   - **all'apertura, se non era ancora letto, viene marcato automaticamente come letto** (nessuna azione esplicita richiesta)
   - selettore per cambiare lo stato (le 4 opzioni, libere)
   - toggle "importante" e toggle "letto" manuali (l'admin può anche "smarcare" un letto per tornare a trattarlo come nuovo)
   - area di testo per la nota interna + pulsante salva esplicito (non autosave) con conferma visiva temporanea dopo il salvataggio
6. Chiudendo il dettaglio si torna alla lista, che riflette immediatamente eventuali cambi di stato/importanza fatti nel frattempo.

## Principi trasversali (validi in ogni flusso)

- **Nessuna azione distruttiva senza conferma esplicita** (solo l'eliminazione utente ha un dialogo di conferma; i toggle admin sono reversibili e quindi non lo richiedono).
- **Feedback visivo immediato** dopo ogni mutazione di stato: le modifiche admin si riflettono nella card/lista senza refresh manuale (aggiornamento ottimistico o rilettura in background).
- **Etichette di stato mai tecniche**: l'utente non vede mai i valori enum grezzi (`SENT`, `PROGRESS`...) ma sempre label localizzate; l'admin sì può vedere una terminologia più operativa ma comunque tradotta, mai l'enum raw.
- **Il form di invio è un componente unico**, riusato identico nei due punti di ingresso (icona globale + sezione storico) — non duplicarlo.

---

## Note di adattamento — React Native + backend GraphQL/Prisma online

L'app di destinazione ha uno stack diverso (RN invece di React DOM, presumibilmente Apollo Client o urql su RN, stesso backend GraphQL/Prisma già online). Punti da ripensare esplicitamente, non da portare 1:1:

- **Punto di ingresso globale**: in una webapp desktop-first un'icona in header funziona; su mobile va valutato tra *floating action button* persistente, voce in un tab bar "Profilo/Altro", o entrambi. Il vincolo funzionale da preservare è "raggiungibile in un tap da qualunque schermata", non la posizione esatta.
- **Modali → bottom sheet nativi.** In freedihare il form è già presentato come bottom sheet su mobile (pattern responsivo dello stesso componente Modal). Su React Native è naturale usare direttamente un bottom sheet nativo (es. libreria dedicata) invece di un modale full-screen, sia per il form di invio sia per il dettaglio admin.
- **Selettore "tipo" e tab admin**: il segmented control web si traduce bene in un `SegmentedControl`/pill-tabs nativo; su iOS è disponibile anche il componente nativo di sistema.
- **Selettore "pagina"**: su mobile con poche opzioni un picker nativo o un action sheet è più adatto di una select desktop-style.
- **Paginazione client-side**: su RN preferire una `FlatList`/`SectionList` con `onEndReached` per il "carica altri", mantenendo comunque il filtraggio lato client se il dataset resta di dimensioni ridotte (vedi `README.md` §6 punto 1 — la soglia oltre cui serve filtro server-side vale a maggior ragione su mobile, dove la banda/memoria sono più vincolate).
- **Notifiche di conferma/errore**: sostituire il pattern "Notification" con un toast/snackbar nativo o libreria equivalente (es. quella già eventualmente in uso nell'app RN).
- **Contatore caratteri e tastiera multi-riga**: assicurarsi che il campo testo con `maxLength` gestisca correttamente la tastiera nativa e mostri il counter senza layout shift quando la tastiera è aperta.
- **Badge/contatori nella navigazione**: se l'app RN ha già un pattern di badge numerici su tab/icone (es. notifiche non lette), riusare lo stesso meccanismo per i contatori admin invece di introdurne uno nuovo.
- **Auto-`seen` all'apertura del dettaglio**: comportamento da preservare identico — è un dettaglio funzionale del prodotto, non un'implementazione legata al DOM.
- **Autenticazione**: il contratto assume che il client sappia già autenticarsi verso il backend GraphQL esistente (stesso meccanismo usato dal resto dell'app RN) — questa feature non introduce un proprio sistema di auth, si appoggia a `context.userId` lato server come ogni altra risorsa autenticata dell'app.
