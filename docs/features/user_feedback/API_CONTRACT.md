# User Feedback — Contratto GraphQL

> Operazioni così come implementate (`backend/GraphQL/Models/UserFeedback/`). Nomi campi/operazioni sono quelli reali di freedihare — riusabili identici in un'altra app GraphQL+Prisma, o come riferimento semantico se si preferisce un naming diverso.

## Tipi

```graphql
enum FeedbackType {
  BUG
  SUGGESTION
  COMMENT
}

enum FeedbackStatus {
  SENT
  PROGRESS
  DONE
  REJECTED
}

type UserFeedback {
  id: ID!
  type: FeedbackType!
  title: String
  text: String!
  page: String!
  isImportant: Boolean!
  status: FeedbackStatus!
  seen: Boolean!
  adminNote: String
  createdAt: DateTime!
  user: User            # nullable: autore può essere stato eliminato
}

# Variante "sicura" per l'utente proprietario: stesso record, subset di campi.
# NON un tipo GraphQL separato per forza — l'importante è che il resolver
# non esponga mai adminNote/seen/user su questa query, qualunque sia
# l'implementazione (variant type, projection, DTO manuale...).
type MyFeedback {
  id: ID!
  type: FeedbackType!
  title: String
  text: String!
  page: String!
  isImportant: Boolean!
  status: FeedbackStatus!   # REJECTED collassato in DONE, vedi sotto
  createdAt: DateTime!
}
```

**Punto critico di sicurezza**: `adminNote` e `seen` non devono essere raggiungibili da nessuna query lato utente, nemmeno introspection permettendo. In freedihare questo è garantito a livello di *tipo* (Pothos `variant`), non solo omettendo i campi nella query client — cioè il campo non esiste proprio nello schema esposto alla query utente, non è solo "non richiesto". Riprodurre questa garanzia strutturale, non affidarsi alla disciplina del frontend.

**Collasso `REJECTED → DONE` lato server**: per la query "i miei feedback", il resolver stesso rimappa `REJECTED` a `DONE` prima di restituirlo — non è un dettaglio di presentazione lasciato al client. Motivazione: l'utente non deve mai vedere un rifiuto esplicito, e va garantito anche se in futuro nascesse un secondo client (es. l'app mobile che leggerà questo documento) che dimenticasse di applicare la stessa etichettatura UI.

## Query

### `userFeedbacks: [UserFeedback!]!` — solo ADMIN

Ritorna **l'intero dataset**, ordinato `createdAt desc`. Nessun parametro di filtro server-side: tab, ricerca testuale, toggle "solo importanti" e conteggi badge sono derivati client-side da questo stesso array (vedi `README.md` §6 punto 1 per il perché).

Guardia: richiede utente autenticato con `role === "ADMIN"` — altrimenti `GraphQLError`.

### `myFeedbacks: [MyFeedback!]!` — utente autenticato

Ritorna solo i feedback dell'utente corrente (`where userId = context.userId`), ordinati `createdAt desc`. Usa il tipo/proiezione "sicura" (vedi sopra).

## Mutation

### `createUserFeedback(type, title, text, page): UserFeedback!` — utente autenticato

```graphql
createUserFeedback(
  type: FeedbackType!
  title: String
  text: String!
  page: String!
): UserFeedback!
```

- `userId` preso **dal contesto di autenticazione**, mai da un argomento passato dal client.
- Nessun controllo di ruolo: chiunque sia autenticato (incluso un admin) può inviare feedback.
- Nessun rate-limit applicato (vedi README §6 punto 5 — valutare se necessario nella nuova app).
- `title` normalizzato a `null` se vuoto/whitespace lato client prima dell'invio (buona norma da riprodurre, non enforced dal server).

### `updateFeedbackStatus(id, status): UserFeedback!` — solo ADMIN

Imposta liberamente uno qualsiasi dei 4 valori di `FeedbackStatus`. Nessuna transizione vietata (l'admin può anche tornare da `DONE` a `SENT`).

### `updateFeedbackSeen(id, seen): UserFeedback!` — solo ADMIN

Toggle manuale del flag "letto". In UI viene chiamata automaticamente con `seen: true` alla prima apertura del dettaglio di un feedback non ancora letto — ma resta una mutation esplicita, non un side-effect nascosto della query.

### `updateFeedbackImportant(id, isImportant): UserFeedback!` — solo ADMIN

Toggle del flag "importante". **Effetto collaterale funzionale**: se impostato a `true`, il feedback smette di essere eliminabile dall'utente (vedi `deleteUserFeedback`).

### `updateFeedbackNote(id, adminNote): UserFeedback!` — solo ADMIN

Sovrascrive la nota interna. `adminNote: null`/stringa vuota cancella la nota. Nessuna cronologia delle note (l'ultima sovrascrive la precedente).

### `deleteUserFeedback(id): Boolean!` — utente autenticato, proprietario del record

Elimina fisicamente il record. Il resolver verifica, **in quest'ordine**, e lancia `GraphQLError` con messaggio parlante al primo controllo che fallisce:

1. il feedback esiste ed appartiene all'utente chiamante (`fb.userId === context.userId`) → altrimenti "Feedback non trovato" (messaggio deliberatamente generico, per non rivelare l'esistenza di feedback altrui)
2. `fb.status === "SENT"` → altrimenti "Il feedback è in lavorazione e non può essere eliminato"
3. `fb.isImportant === false` → altrimenti "Il feedback è stato contrassegnato e non può essere eliminato"

Questi tre controlli vanno **riprodotti identici lato server** in qualunque stack: sono l'unica vera regola di autorizzazione non banale di tutta la feature. La UI deve inoltre disabilitare preventivamente l'azione quando sa già che fallirebbe (evita una roundtrip inutile), ma il controllo server è quello che conta per la sicurezza.

## Guardia di autorizzazione admin (pattern comune alle 5 mutation/1 query admin)

Tutte le operazioni "solo ADMIN" condividono la stessa logica, centralizzata in un helper:

```
se non autenticato → GraphQLError("Non autenticato")
altrimenti: carica l'utente chiamante, leggi il suo `role`
se role !== "ADMIN" → GraphQLError("Accesso riservato agli amministratori")
```

Non esiste un middleware/direttiva GraphQL dedicato in freedihare — è una funzione riusata esplicitamente in ogni resolver. In un'app nuova è ragionevole promuoverla a middleware/direttiva (`@auth(role: ADMIN)`) se il framework GraphQL scelto lo supporta bene: qui è rimasta funzione per coerenza con lo stile del resto del backend, non per un vincolo tecnico.

## Riepilogo permessi

| Operazione | Autenticato | Proprietario | Admin |
| ---------- | :---------: | :----------: | :---: |
| `createUserFeedback` | ✅ richiesto | — | — |
| `myFeedbacks` | ✅ richiesto | (implicito: solo i propri) | — |
| `deleteUserFeedback` | ✅ richiesto | ✅ richiesto | — |
| `userFeedbacks` | ✅ richiesto | — | ✅ richiesto |
| `updateFeedbackStatus` / `Seen` / `Important` / `Note` | ✅ richiesto | — | ✅ richiesto |
