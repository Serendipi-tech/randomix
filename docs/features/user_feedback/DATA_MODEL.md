# User Feedback — Modello dati

> Schema così com'è realmente in produzione in freedihare (`backend/prisma/schema.prisma`), con annotazioni sul *perché* di ogni scelta. Copiabile pressoché as-is in un altro progetto Prisma; per un ORM diverso vedi le note di "traduzione" in fondo.

## Schema Prisma di riferimento

```prisma
enum FeedbackType {
  BUG
  SUGGESTION
  COMMENT
}

enum FeedbackStatus {
  SENT       // stato iniziale, sempre. Nessun default diverso previsto.
  PROGRESS
  DONE
  REJECTED
}

model UserFeedback {
  id          String         @id @default(uuid())

  // Nullable + SetNull: il feedback sopravvive alla cancellazione dell'autore
  // (serve come storico per l'admin). Se il tuo dominio non richiede questo,
  // usare relazione obbligatoria + onDelete: Cascade è più semplice.
  user        User?          @relation(fields: [userId], references: [id], onDelete: SetNull)
  userId      String?

  type        FeedbackType
  title       String?                          // sempre opzionale
  text        String         @db.VarChar(3000) // limite duro a livello DB
  page        String                           // stringa libera: enum vive solo nel client
  isImportant Boolean        @default(false)   // flag admin, blocca la delete utente se true
  status      FeedbackStatus @default(SENT)
  seen        Boolean        @default(false)   // flag admin, mai esposto all'utente
  adminNote   String?                          // nota interna, mai esposta all'utente
  createdAt   DateTime       @default(now())

  @@index([createdAt(sort: Desc)])
  @@index([isImportant])
  @@index([status])
  @@index([seen])
}
```

Relazione inversa sul model utente esistente (nessuna nuova colonna su `User`, solo il campo virtuale):

```prisma
model User {
  // ... campi esistenti
  feedbacks UserFeedback[]
}
```

### Perché questi indici

Tutti e quattro gli indici servono i pattern di query dell'admin dashboard: ordinamento cronologico (`createdAt desc`), e i tre filtri booleani/enum usati per badge e tab (`isImportant`, `status`, `seen`). Con basi utenti piccole (centinaia di righe) non sono strettamente necessari per le performance — sono lì per correttezza semantica e per non doverli aggiungere in un secondo momento.

### Perché niente `deletedAt` / soft delete

Scelta esplicita: l'eliminazione condizionale (vedi `API_CONTRACT.md`) è una `DELETE` fisica. Aggiungere un `deletedAt` avrebbe introdotto superficie extra (filtrare ovunque `deletedAt IS NULL`) per un beneficio che qui non serve — un utente può eliminare solo un proprio feedback non ancora gestito, quindi non c'è valore di business nel recuperarlo dopo la cancellazione.

### Perché `page` non è un enum DB

Il set di sezioni dell'app cambia più spesso dello schema dati non dovrebbe. Tenere `page` come `String` libera evita una migrazione ogni volta che si aggiunge/rinomina una sezione UI. Il costo accettato: nessuna validazione referenziale server-side sul valore.

## Modello dati equivalente, indipendente da Prisma

Se il backend di destinazione non usa Prisma, questa è la forma logica minima da replicare (tipi generici, adattare al proprio ORM/schema DB):

```
UserFeedback
├─ id            : uuid, PK
├─ userId        : uuid, FK → User.id, NULLABLE, on-delete: set null
├─ type          : enum("BUG" | "SUGGESTION" | "COMMENT"), NOT NULL
├─ title         : string, NULLABLE
├─ text          : string(max 3000), NOT NULL
├─ page          : string, NOT NULL           -- valori validi enumerati solo client-side
├─ isImportant   : boolean, NOT NULL, default false
├─ status        : enum("SENT" | "PROGRESS" | "DONE" | "REJECTED"), NOT NULL, default "SENT"
├─ seen          : boolean, NOT NULL, default false
├─ adminNote     : string, NULLABLE            -- mai esposto all'utente finale
└─ createdAt     : timestamp, NOT NULL, default now()

Indici consigliati: createdAt DESC, status, isImportant, seen
```

Nessun'altra tabella è richiesta: la feature non ha entità figlie (niente allegati, niente commenti/thread, niente cronologia di stato separata — i cambi di stato non vengono storicizzati, solo il valore corrente è persistito).

## Nota su una feature affine (fuori scope, utile come riferimento)

Nel codebase sorgente esiste anche un model `RecordReport` ("segnalazione di dati errati su un record", non trattato in questo documento) che **riusa deliberatamente lo stesso pattern** `status` / `seen` / `isImportant` / `adminNote` con la stessa semantica descritta sopra. Se nell'app di destinazione servirà anche un canale di "segnalazione contenuti" oltre al feedback libero, è ragionevole generalizzare questi quattro campi (status/seen/isImportant/adminNote) in una struttura condivisa piuttosto che duplicarli per ogni tipo di segnalazione — ma questa è un'estensione, non parte del contratto minimo descritto qui.
