# Feature: User Feedback

> **Cos'è questo documento.** Descrizione **portabile** (non legata a React/Vite/Tailwind) della feature "Feedback utente" così come è **realmente implementata** in freedihare, ricavata confrontando i piani originali (`_freediehere_studies/planes/DONE/user_feedback/`) con il codice attuale. Dove piano e codice divergono, questo documento descrive **il codice** (fonte di verità).
>
> Obiettivo: permettere la reimplementazione della feature in un'app diversa — nello specifico la prossima destinazione è un'app **React Native** con backend online **GraphQL + Prisma** — senza dover leggere il codice sorgente di freedihare.

File di questa cartella:

| File              | Contenuto                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `README.md`       | Questo file: panoramica, attori, ciclo di vita                                                                 |
| `DATA_MODEL.md`   | Schema dati (Prisma) portabile, con razionale di ogni scelta                                                   |
| `API_CONTRACT.md` | Contratto GraphQL completo (query/mutation), regole di autorizzazione                                          |
| `UX_FLOWS.md`     | Flussi utente/admin descritti in modo indipendente dal framework UI, + note di adattamento mobile/React Native |

---

## 1. Obiettivo della feature

Canale di comunicazione diretto **USER → ADMIN**, a bassa frizione, con tre tipologie di messaggio:

- **Bug** — segnalazione di malfunzionamento
- **Suggerimento** — proposta di funzionalità/miglioramento
- **Commento** — feedback generico

Non è una feature di supporto/ticketing bidirezionale: l'admin non risponde testualmente all'utente, ma comunica lo stato di avanzamento tramite un **campo status** visibile all'utente stesso. È deliberatamente minimale (niente allegati, niente thread di risposta, niente notifiche push).

## 2. Attori

| Attore                                                              | Può fare                                                                                                                                                                                                                    |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User** (qualsiasi utente autenticato, incluso chi ha ruolo admin) | Inviare feedback; consultare lo storico dei **propri** feedback con lo status corrente; eliminare un proprio feedback **solo se** non ancora preso in carico e non contrassegnato come importante                           |
| **Admin**                                                           | Consultare **tutti** i feedback di tutti gli utenti; filtrare per stato/importanza/ricerca testuale; cambiare lo status; marcare "letto"; marcare "importante"; scrivere una nota interna privata (mai visibile all'utente) |

Non esiste un ruolo intermedio (moderatore, ecc.). Il controllo permessi è binario: autenticato (crea/legge il proprio) vs admin (legge/gestisce tutto).

## 3. Ciclo di vita di un feedback

```
                 ┌────────┐   admin cambia status   ┌──────────┐
   utente invia  │  SENT  │ ───────────────────────▶│ PROGRESS │
   ─────────────▶│(default)│                         └────┬─────┘
                 └───┬────┘                                │ admin cambia status
                     │ admin cambia status                 ▼
                     │                              ┌──────────────┐
                     └─────────────────────────────▶│ DONE/REJECTED│
                                                      └──────────────┘
```

- Stato iniziale sempre `SENT`.
- Le transizioni di stato sono **libere** per l'admin (nessuna macchina a stati rigida lato server: può impostare qualsiasi valore in qualsiasi momento, incluso tornare indietro). Il vincolo è solo UX-side (select con le 4 opzioni).
- **Vista utente**: `REJECTED` non viene mai mostrato come tale — collassa in `DONE` con etichetta neutra ("Valutato"), per non comunicare un rifiuto esplicito. Il backend stesso collassa il valore per la query "i miei feedback" (non solo la UI) — vedi `DATA_MODEL.md` / `API_CONTRACT.md`.
- Un feedback è **eliminabile dall'utente proprietario** solo quando `status === SENT` **e** `isImportant === false`. Non appena l'admin lo prende in carico (cambia status) o lo marca importante, l'utente perde la possibilità di cancellarlo. Regola enforced **sia lato server che lato UI** (mai fidarsi solo del client).
- **Non esiste soft delete**: l'eliminazione è una `DELETE` fisica della riga. Attenzione al naming se si recupera documentazione storica: nei piani originali questa fase si chiamava "soft delete", rinominata in "eliminazione condizionale" perché il nome era fuorviante.

## 4. Due flag indipendenti dallo status

Oltre allo `status`, ogni feedback ha due booleani gestiti solo dall'admin:

- **`seen`** — l'admin ha aperto il dettaglio almeno una volta (si imposta automaticamente all'apertura del dettaglio, toggle manuale possibile). Serve solo per il badge "non letti" nell'UI admin, **non è visibile all'utente**.
- **`isImportant`** — l'admin marca il feedback come rilevante (stella). Effetto collaterale: blocca l'eliminazione da parte dell'utente (vedi §3). Non è un filtro di priorità automatica, solo un flag manuale.

Più un campo `adminNote` (testo libero) — annotazione **strettamente interna**, mai esposta nella query "i miei feedback", pensata per appunti di triage ("duplicato di #123", "in attesa di conferma da backend team"...).

## 5. Contesto applicativo (`page`)

Ogni feedback porta con sé la sezione dell'app da cui è stato inviato (`page`), per dare all'admin un contesto immediato senza dover chiedere all'utente "da dove scrivi?".

- **Pre-compilato automaticamente** dalla sezione/schermata corrente al momento dell'apertura del form.
- **Editabile dall'utente** prima dell'invio (può correggerlo se il feedback riguarda un'altra sezione).
- **Stringa libera lato database e GraphQL** (`String`, non enum) — l'enumerazione dei valori validi (`dashboard`, `diary`, `foods`, `meals`, `user`, `guide`, `admin`, `other` in freedihare) esiste **solo lato client**, come mappa di label leggibili. Scelta deliberata: aggiungere una nuova sezione app non richiede una migrazione DB. Il rovescio della medaglia è che non c'è validazione server-side sui valori — accettato consapevolmente (rischio basso, nessun controllo di integrità referenziale necessario).

## 6. Decisioni progettuali degne di nota (per chi riadatta la feature)

Queste scelte non sono ovvie dal solo schema dati: registrarle evita di reintrodurre problemi già risolti in freedihare.

1. **Filtri e tab admin sono client-side**, non query server parametrizzate. La query `userFeedbacks` (admin) ritorna _sempre l'intero dataset_ ordinato per data; tab (Ricevuti/In progress/Conclusi), ricerca testuale e toggle "solo importanti" filtrano l'array già in memoria. Motivazione: la UI usa comunque paginazione client-side, quindi i dati sono già tutti caricati; a scala "centinaia di utenti" il fetch completo è economico e evita refetch ad ogni cambio tab. **Non scalare oltre le poche migliaia di righe senza rivedere questa scelta** (a quel punto servono filtri server-side + paginazione cursor-based reale).
2. **Il conteggio badge (non letti / in lavorazione) è derivato client-side** dallo stesso array, non da una query di aggregazione separata (il piano originale la prevedeva, l'implementazione finale l'ha eliminata perché ridondante una volta che tutto il dataset è già in memoria).
3. **La relazione utente è nullable con `onDelete: SetNull`**, non `Cascade`. Se l'utente autore viene eliminato, il feedback **sopravvive** (storico admin), con autore mostrato come "Utente eliminato". Questa è una decisione di prodotto (mantenere lo storico), non un dettaglio tecnico incidentale — riportarla se si eliminano utenti nell'app di destinazione.
4. **Ricerca case-insensitive** su titolo, testo, nome/cognome/email autore — fatta interamente client-side dopo il fetch completo (vedi punto 1), quindi la normalizzazione a lowercase è banale. Se si sceglie search server-side in un'altra app, ricordare esplicitamente `mode: "insensitive"` (in Prisma non è il default).
5. **Nessun throttling/rate-limit** sulla creazione feedback. Qualsiasi utente autenticato può inviare messaggi ripetutamente. Accettato come rischio minore per la scala attuale — da rivalutare se l'app di destinazione è pubblica/ad alto traffico.
6. **Nessuna notifica push/email** in nessuna direzione. L'admin scopre nuovi feedback aprendo la sezione dedicata (badge contatore); l'utente scopre l'aggiornamento di stato solo tornando sullo storico. Se l'app di destinazione ha già un sistema di notifiche, è il punto più naturale da estendere.
7. **`title` è sempre opzionale.** Se assente, la UI mostra i primi caratteri di `text` come titolo surrogato — pattern da riprodurre ovunque il titolo viene renderizzato (lista admin, storico utente, dettaglio).
8. **Il campo `text` ha un limite di 3000 caratteri** imposto a livello di colonna DB (`VarChar(3000)`) e riflesso come `maxLength` nel campo di input lato client con contatore caratteri a vista. **Non è ri-validato esplicitamente nel resolver GraphQL** — il limite reale è quello del database, che fallisce silenziosamente/con errore SQL se superato by-passando il client. Consigliato, nell'app di destinazione, validare anche lato resolver per un errore GraphQL leggibile invece di un errore DB grezzo.
9. **Lo storico personale non vive dove il piano originale lo aveva previsto.** I piani di progetto (fase 3) lo posizionavano in fondo alla pagina Guida/Help. Nell'implementazione finale è stato spostato nella pagina **Profilo utente**, insieme al pulsante "Invia feedback" (vedi `UX_FLOWS.md`, Flusso 2). Motivo osservabile dal codice: la Guida non è raggiungibile dalla navigazione mobile principale in freedihare, mentre il Profilo sì — coerente con l'obiettivo "raggiungibile facilmente da mobile". Nell'app di destinazione, posizionare lo storico in qualunque schermata sia effettivamente raggiungibile dalla navigazione primaria, non necessariamente dentro una sezione "Aiuto/Guida".

## 7. Punti opzionali — da valutare caso per caso nell'app di destinazione

Il nucleo della feature (§1-5) è ciò che la definisce; questi invece sono **assi di scelta implementativa** su cui freedihare ha preso una decisione precisa (spesso per la propria scala — centinaia di utenti, non migliaia), ma che **non sono vincoli della feature in sé**. Per ognuno: cosa fa oggi freedihare, e — dove rilevante — cosa **non è affatto integrato** e andrebbe valutato da zero se l'app di destinazione ne ha bisogno.

1. **Filtri/tab/ricerca admin** — oggi client-side su dataset completo (`userFeedbacks` senza argomenti). Alternativa: query parametrizzata server-side + paginazione cursor-based. Conviene deviare se il dataset atteso supera qualche migliaio di righe, o con client a banda/memoria limitata (es. mobile su rete lenta).
2. **Conteggio badge (non letti / in lavorazione)** — oggi derivato client-side dallo stesso array, nessuna query dedicata. Alternativa: query di aggregazione server-side (`count`). Conviene deviare se si adotta il filtro server-side del punto 1 — a quel punto il conteggio client-side non è più possibile, serve comunque una query separata.
3. **Relazione con l'autore alla cancellazione utente** — oggi `onDelete: SetNull`, il feedback sopravvive e l'autore è mostrato come "Utente eliminato". Alternativa: `onDelete: Cascade`, il feedback sparisce con l'utente. Conviene deviare verso Cascade se non serve conservare uno storico admin indipendente dall'esistenza dell'utente (più semplice, meno stato "orfano" da gestire in UI).
4. **Ricerca testuale case-insensitive** — oggi fatta client-side dopo fetch completo (banale, nessuna opzione DB coinvolta). Alternativa: `mode: "insensitive"` esplicito in Prisma se la ricerca si sposta server-side. Necessario **non appena** si passa al punto 1 lato server — è facile da dimenticare, Prisma non lo applica di default.
5. **Rate-limiting sull'invio** — **non integrato.** Nessun controllo di frequenza: un utente autenticato può inviare feedback senza limiti. Alternativa: limite per utente/finestra temporale (es. N invii/ora) a livello di resolver o middleware. Da valutare per app pubbliche, con utenza non fidata, o esposte a possibile spam/abuso — non è un pattern da "riattivare", va progettato da zero.
6. **Notifiche push/email** — **non integrate**, in nessuna direzione. L'admin scopre i nuovi feedback solo aprendo la sezione; l'utente scopre l'aggiornamento di stato solo riaprendo lo storico. Alternativa: notifica push all'admin su nuovo feedback, notifica push/email all'utente su cambio status. Se l'app di destinazione ha già un sistema di notifiche, è il punto di estensione più naturale — qui manca del tutto.
7. **Validazione lunghezza `text` lato resolver** — **non integrata.** Il limite (3000 caratteri) è imposto solo dalla colonna DB (`VarChar(3000)`); un input troppo lungo fallisce con errore SQL grezzo, non un `GraphQLError` leggibile. Alternativa: controllo esplicito di lunghezza nel resolver `createUserFeedback` prima dell'insert. Sempre consigliato in un nuovo backend — costo minimo, evita di propagare errori DB grezzi al client.
8. **Guardia di autorizzazione admin** — oggi funzione condivisa `requireAdmin`, riusata dalle 4 mutation admin, **ma non** dalla query `userFeedbacks`, che duplica il controllo inline invece di importarla (inconsistenza reale nel codice attuale). Alternativa: middleware/direttiva GraphQL centralizzata (es. `@auth(role: ADMIN)`) applicata uniformemente a tutte le operazioni admin. Conviene se il framework GraphQL scelto supporta bene le direttive — evita la duplicazione già presente in freedihare.
9. **Campo `page`** — oggi stringa libera, enum di valori validi solo lato client. Alternativa: enum GraphQL/DB tipizzato. Conviene se le sezioni dell'app di destinazione sono stabili e non cambiano spesso — altrimenti la stringa libera evita migrazioni ad ogni nuova sezione.
10. **Punto di ingresso UI + posizione storico** — oggi icona in header (sempre visibile) + storico nella pagina Profilo. Alternative: FAB, voce di tab bar, sezione Impostazioni/Supporto dedicata, ecc. Dipende puramente dalla navigation architecture dell'app di destinazione (vedi anche `UX_FLOWS.md`, note React Native) — nessuna delle due opzioni è "più corretta" in assoluto.

**In sintesi per chi implementa in React Native + GraphQL/Prisma**: i punti 5, 6 e 7 sono le vere lacune di freedihare (non scelte consapevoli di semplicità, ma funzionalità assenti) — se la nuova app ha requisiti di sicurezza/UX più stringenti (traffico pubblico, necessità di notifiche, validazione robusta), vanno progettati da zero e non semplicemente "copiati" dal comportamento attuale.
