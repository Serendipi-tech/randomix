# ROADMAP

Agile, no server dedicato. 2 persone in parallelo — dove possibile, split web/backend vs mobile/UI per non bloccarsi a vicenda.

## Fase 0 — Setup (insieme)

`web/` e `mobile/` sono vuote (nessun package.json, nessuna dipendenza) — si parte da zero.

- [x] Init workspace root (npm workspaces: `web`, `mobile`, `packages/graphql-schema` — pnpm scartato, non installato sulla macchina, npm basta)
- [x] Init `web/` (Next.js)
  - [x] Scaffold Next.js (TypeScript, Tailwind, App Router, `src/`, alias `@/*`)
  - [x] Install Prisma + `@prisma/client` + `@prisma/extension-accelerate`
  - [x] Install Pothos/builder GraphQL (`@pothos/core`, `@pothos/plugin-prisma`) + Apollo Server (`@apollo/server`, `@as-integrations/next`)
- [x] Init `mobile/` (Expo 57 / React Native 0.86 — versione aggiornata rispetto al piano iniziale)
  - [x] Scaffold Expo (TypeScript, Expo Router incluso di default)
  - [x] Install Apollo Client
  - [x] Install NativeWind (+ Tailwind 3, compatibile con NativeWind 4)
- [x] Init `packages/graphql-schema` (package condiviso `@randomix/graphql-schema`, linkato come dipendenza di web/mobile via workspace)
- [ ] Scaffolding cartelle interne come da `docs/architecture.md` (graphql/, gql_crud/, prisma/schema/, ecc. — solo i package.json/tool di base sono pronti)
- [ ] Import schema Prisma completo (già pronto in `docs/prismaSTRUCTURE/schema/`) in `web/prisma/schema/` + `prisma db push`
  - [x] Schema copiato in `web/prisma/schema/`
  - [x] `web/prisma.config.ts` creato (Prisma 7: url del datasource si configura qui, non più nello `.prisma`)
  - [x] `web/.env.example` creato (`DATABASE_URL` diretto + placeholder Accelerate)
  - [ ] Collegamento DB reale (in corso lato utente) → poi `prisma db push`
- [ ] GraphQL builder/schema base (Next.js)
- [ ] Expo Router skeleton + NativeWind config condiviso

### Test

- [ ] `prisma db push` esegue senza errori, tabelle visibili sul DB
- [x] `next build` (`web/`) completa senza errori
- [x] `expo-doctor` (`mobile/`) 20/20 check passati, nessuna dipendenza duplicata
- [x] `web/` e `mobile/` importano correttamente `packages/graphql-schema` (verificato con `npm ls`)

---
---
---
---
---
---
---
---

## Fase 1 — Fondamenta (parallelo)

- [ ] **Dev A (web)**
  - [ ] Login Google OAuth
  - [ ] Login credentials
  - [ ] Resolver `User` (query/mutation base: me, update profilo)
- [ ] **Dev B (mobile)**
  - [ ] Schermata login
  - [ ] Schermata onboarding (consenso email)
  - [ ] ThemeContext/NativeWind setup
  - [ ] Apollo Client setup (auth header injection)
- [ ] Blocking point comune: contratto schema GraphQL (query/mutation auth + user) da concordare prima di separarsi

### Test

- [ ] Login Google funziona end-to-end (mobile → Next.js → sessione valida)
- [ ] Login credentials funziona end-to-end
- [ ] Onboarding blocca l'accesso finché non si dà consenso email
- [ ] Query `me` ritorna l'utente autenticato corretto da mobile

---
---
---
---
---
---
---
---

## Fase 2 — Core MVP (parallelo)

- [ ] **Dev A**: resolver base
  - [ ] `List`, `ListCategory`
  - [ ] `Item`, `User_Item`, `List_UserItem`
  - [ ] `Tag`
  - [ ] `Rating`
  - [ ] Randomizzatore backend
    - [ ] Numeri (range X-Y, N estrazioni)
    - [ ] Lettere alfabeto
    - [ ] Colori
    - [ ] Dadi
    - [ ] Tracking `count` / `skippedCount` / `acceptedCount` (skip solo su rigenerazione, non su chiusura app)
- [ ] **Dev B**: UI corrispondente
  - [ ] Creazione/gestione liste (nome, icona, colore, categoria, isHidden)
  - [ ] Creazione/gestione elementi
    - [ ] Ricerca in API (OpenLibrary, TMDb, ecc.) con finestra "Stai cercando..."
    - [ ] Fallback creazione manuale (categoria CUSTOM)
    - [ ] Note/descrizione personale, tag custom su elemento
  - [ ] UI randomizzatore
  - [ ] UI rating a stelline (1-5 + nota opzionale)
  - [ ] Profilo utente base
- [ ] Sync point: `gql_crud/` condiviso aggiornato ad ogni nuova query/mutation

### Test

- [ ] Creazione lista con categoria + icona + colore va a buon fine
- [ ] Creazione elemento da ricerca API salva correttamente record + join (o riusa il record se già presente)
- [ ] Creazione elemento CUSTOM senza API funziona
- [ ] Randomizzatore numeri/lettere/colori/dadi restituisce risultati coerenti con i parametri richiesti
- [ ] `skippedCount` aumenta solo su rigenerazione del randomizzatore, mai su chiusura app o cambio lista
- [ ] Rating 1-5 con nota si salva e resta anche eliminando la join elemento↔lista

---
---
---
---
---
---
---
---

## Fase 3 — Sociale

### Sotto-fase 3.1 — Amici

- [ ] **Dev A**: resolver `Friendship` (invio/accetta/rifiuta/rimuovi)
- [ ] **Dev B**: UI lista amici, ricerca per username/email, vista progressi/liste condivise dell'amico

#### Test

- [ ] Invio, accettazione e rifiuto richiesta amicizia funzionano
- [ ] Ricerca per username/email trova l'utente corretto
- [ ] Rimozione amico funziona e sparisce da entrambe le liste

### Sotto-fase 3.2 — Gruppi base

- [ ] **Dev A**: resolver `Group`, `Group_User`, `GroupList`, `GroupList_AcceptedItemHistory`
- [ ] **Dev B**: UI creazione/gestione gruppo, inviti, scelta liste condivise, lista fittizia unione (front-end only)

#### Test

- [ ] Creazione gruppo, invito, accettazione/rifiuto invito funzionano
- [ ] Uscita dal gruppo e rimozione membro funzionano
- [ ] Unione liste condivise per categoria elimina i duplicati correttamente
- [ ] Import lista di gruppo nel proprio elenco funziona

### Sotto-fase 3.3 — Obiettivi/sfide di gruppo

- [ ] **Dev A**: resolver `GroupChallenge`, `GroupUser_Challenge`
- [ ] **Dev B**: UI creazione obiettivo, avanzamento manuale/automatico, conferma utente su autocompilazione

#### Test

- [ ] Obiettivo senza elemento numerico/categoria richiede spunta manuale
- [ ] Obiettivo con elemento numerico + categoria autocompila ma chiede conferma prima di aggiungere al progresso
- [ ] Stato sfida (DRAFT → IN_PROGRESS → COMPLETED/FAILED) transita correttamente a scadenza

### Sotto-fase 3.4 — Notifiche & matching

- [ ] **Dev A**: resolver `Notification`
- [ ] **Dev B**: UI notifiche, push (Expo), pagina matching statistiche amici

#### Test

- [ ] Notifica push arriva su invito gruppo/sfida/richiesta amicizia
- [ ] Segna come letta funziona e persiste
- [ ] Pagina matching mostra correttamente rating/elementi in comune tra due amici

---
---
---
---
---
---
---
---

## Fase 4 — Monetizzazione

- [ ] **Dev A**: resolver `Membership`, `Subscription`, `Payment`
  - [ ] Enforcement limiti piano lato resolver
    - [ ] Free: 3 liste, 20 elementi/lista, 1 gruppo creato, max 3 partecipazioni, max 15 membri
    - [ ] Plus: 15 liste, 100 elementi/lista, 10 gruppi, max 30 partecipazioni
    - [ ] Unlimited: illimitato, max 100 membri gruppo proprio
  - [ ] Logica "congelamento" liste oltre il limite (downgrade/mancato rinnovo)
- [ ] **Dev B**: UI upgrade/paywall, integrazione pagamenti in-app (store), ads (Free)

### Test

- [ ] Superato il limite Free, creazione nuova lista richiede congelamento di una esistente
- [ ] Downgrade da Plus a Free congela le liste in eccesso senza eliminarle
- [ ] Acquisto in-app aggiorna correttamente `Subscription`/`Membership` dell'utente
- [ ] Ads visibili solo su piano Free

---
---
---
---
---
---
---
---

## Fase 5 — Rifinitura & Lancio

- [ ] `Report` (moderazione/bug/feedback): resolver + UI invio segnalazione
- [ ] Sorteggio live/realtime (canale dedicato, non GraphQL subscription)
- [ ] Admin dashboard (web) per gestione contenuti/utenti/report
- [ ] Testing end-to-end, bug fix
- [ ] Submission store (Play Store / App Store review)

### Test

- [ ] Invio report (bug/feedback/segnalazione utente) arriva in admin dashboard
- [ ] Sorteggio live visibile in tempo reale a tutti i membri collegati del gruppo
- [ ] Admin può gestire utenti/contenuti/report da dashboard
- [ ] Build store (Android/iOS) passa la review

## Extra (post-lancio)

- [ ] Extra App #1 (film/serie TV) collegata
- [ ] Estrazione programmata/countdown

### Test

- [ ] Collegamento tra le due app scambia dati correttamente
- [ ] Countdown/estrazione programmata parte e notifica all'orario previsto
