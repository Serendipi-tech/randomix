# ROADMAP

Agile, no server dedicato. 2 persone in parallelo — dove possibile, split web/backend vs mobile/UI per non bloccarsi a vicenda.

## Fase 0 — Setup (insieme)

`web/` e `mobile/` sono vuote (nessun package.json, nessuna dipendenza) — si parte da zero.

- [x] 0.1 Init workspace root (npm workspaces: `web`, `mobile`, `packages/graphql-schema` — pnpm scartato, non installato sulla macchina, npm basta)
- [x] 0.2 Init `web/` (Next.js)
  - [x] 0.2.1 Scaffold Next.js (TypeScript, Tailwind, App Router, `src/`, alias `@/*`)
  - [x] 0.2.2 Install Prisma + `@prisma/client` + `@prisma/extension-accelerate`
  - [x] 0.2.3 Install Pothos/builder GraphQL (`@pothos/core`, `@pothos/plugin-prisma`) + Apollo Server (`@apollo/server`, `@as-integrations/next`)
- [x] 0.3 Init `mobile/` (Expo 57 / React Native 0.86 — versione aggiornata rispetto al piano iniziale)
  - [x] 0.3.1 Scaffold Expo (TypeScript, Expo Router incluso di default)
  - [x] 0.3.2 Install Apollo Client
  - [x] 0.3.3 Install NativeWind (+ Tailwind 3, compatibile con NativeWind 4)
- [x] 0.4 Init `packages/graphql-schema` (package condiviso `@randomix/graphql-schema`, linkato come dipendenza di web/mobile via workspace)
- [x] 0.5 Scaffolding cartelle interne come da `docs/architecture.md` (graphql/, gql_crud/, prisma/schema/, ecc. — solo i package.json/tool di base sono pronti)
- [x] 0.6 Import schema Prisma completo (già pronto in `docs/prismaSTRUCTURE/schema/`) in `web/prisma/schema/` + `prisma db push`
  - [x] 0.6.1 Schema copiato in `web/prisma/schema/`
  - [x] 0.6.2 `web/prisma.config.ts` creato (Prisma 7: url del datasource si configura qui, non più nello `.prisma`)
  - [x] 0.6.3 `web/.env.example` creato (`DATABASE_URL` diretto + placeholder Accelerate)
  - [x] 0.6.4 Collegamento DB reale → `prisma db push` completato
- [x] 0.7 GraphQL builder/schema base (Next.js)
- [x] 0.8 Expo Router skeleton + NativeWind config condiviso

### Test

- [x] T0.1 `prisma db push` esegue senza errori, tabelle visibili sul DB
- [x] T0.2 `next build` (`web/`) completa senza errori
- [x] T0.3 `expo-doctor` (`mobile/`) 20/20 check passati, nessuna dipendenza duplicata
- [x] T0.4 `web/` e `mobile/` importano correttamente `packages/graphql-schema` (verificato con `npm ls`)

---

---

---

---

---

---

---

---

## Fase 1 — Fondamenta (parallelo)

- [x] 1.1 **Dev A (web)**
  - [x] 1.1.1 Login Google OAuth (`loginWithGoogle` mutation via Supabase signInWithIdToken)
  - [x] 1.1.2 Login credentials (`loginWithCredentials` mutation via Supabase signInWithPassword)
  - [x] 1.1.3 Resolver `User` (query/mutation base: `me`, `updateProfile`, `logout`)
  - [x] 1.1.4 Apollo Server route `/api/graphql` con context JWT (Supabase Bearer token)
  - [x] 1.1.5 Supabase client setup (`supabase` anonimo + `supabaseAdmin`)
  - [x] 1.1.6 Pothos builder con Prisma 7 (`getDatamodel()` + `PrismaPg` adapter)

---

### Contesto per riprendere — Dev B (mobile)

**Stack decisioni prese:**

- Auth engine: **Supabase Auth** (Google OAuth + credentials). Il mobile NON chiama Supabase direttamente — tutto passa per il GraphQL di Next.js.
- Flusso auth mobile: l'app si autentica con Google tramite Expo (Expo AuthSession o `expo-auth-session`), ottiene un `idToken` Google, lo manda alla mutation `loginWithGoogle(idToken)` → Next.js lo verifica con Supabase → riceve `accessToken` + `refreshToken` Supabase.
- Per credentials: mutation `loginWithCredentials(email, password)` → Next.js → Supabase → accessToken.
- Il token Supabase va iniettato nell'header Apollo: `Authorization: Bearer <accessToken>`.
- L'endpoint GraphQL è `https://<dominio>/api/graphql` (in dev: `http://localhost:3000/api/graphql`).

**Contratto GraphQL già pronto (web):**

```graphql
mutation LoginWithCredentials($email: String!, $password: String!) {
  loginWithCredentials(email: $email, password: $password) {
    accessToken
    refreshToken
    user {
      id
      username
      email
      avatarUrl
      language
      role
    }
  }
}
mutation LoginWithGoogle($idToken: String!) {
  loginWithGoogle(idToken: $idToken) {
    accessToken
    refreshToken
    user {
      id
      username
      email
    }
  }
}
mutation Logout {
  logout
}
query Me {
  me {
    id
    username
    email
    avatarUrl
    language
    role
    createdAt
  }
}
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    username
    avatarUrl
    language
  }
}
```

**Cosa serve attivare in Supabase prima di testare:**

- Dashboard → Authentication → Providers → Google: abilitare e inserire Client ID + Secret da Google Cloud Console.
- Per credentials: funziona già, ma bisogna creare utenti con `signUp` (o abilitare "Email confirmations" off in dev).

**Dev B — prossimi task:**

- [x] 1.2 **Dev B (mobile)**
  - [x] 1.2.1 Schermata login
  - [x] 1.2.2 Schermata onboarding (consenso email)
  - [x] 1.2.3 ThemeContext/NativeWind setup
  - [x] 1.2.4 Apollo Client setup (auth header injection)
- [x] 1.3 Blocking point comune: contratto schema GraphQL (query/mutation auth + user) da concordare prima di separarsi
  - [x] 1.3.1 `me: User`, `updateProfile`, `loginWithCredentials`, `loginWithGoogle`, `logout` — definiti e deployabili

### Test

- [ ] T1.1 Login Google funziona end-to-end (mobile → Next.js → sessione valida)
- [x] T1.2 Login credentials funziona end-to-end
- [ ] T1.3 Onboarding blocca l'accesso finché non si dà consenso email
- [ ] T1.4 Query `me` ritorna l'utente autenticato corretto da mobile

---

---

---

---

---

---

---

---

## Fase 2 — Core MVP (parallelo)

- [ ] 2.1 **Dev A**: resolver base
  - [x] 2.1.1 `List`, `ListCategory` (CRUD List + query `list`/`myLists`; ListCategory predefinite, solo lettura `listCategories`)
  - [x] 2.1.2 `Item`, `User_Item`, `List_UserItem` (`addItemToList` con riuso item esistente, `updateUserItem`, `removeItemFromList`)
  - [x] 2.1.3 `Tag` (`myTags` personali + sistema, `createTag`/`deleteTag`, assegnazione via `updateUserItem.tagIds`)
  - [x] 2.1.4 `Rating` (`rateItem` upsert 1-5 + nota, `deleteRating`, `myRating` esposto su Item)
  - [x] 2.1.5 Randomizzatore backend
    - [x] 2.1.5.1 Numeri (range X-Y, N estrazioni senza ripetizione)
    - [x] 2.1.5.2 Lettere alfabeto
    - [x] 2.1.5.3 Colori
    - [x] 2.1.5.4 Dadi
    - [x] 2.1.5.5 Tracking `count` / `skippedCount` / `acceptedCount` (`drawFromList`/`acceptDraw`: skip solo su rigenerazione, non su chiusura app)
- [ ] 2.2 **Dev B**: UI corrispondente
  - [x] 2.2.1 Creazione/gestione liste (nome, icona, colore, categoria, isHidden)
  - [/] 2.2.2 Creazione/gestione elementi
    - [ ] 2.2.2.1 Ricerca in API (OpenLibrary, TMDb, ecc.) con finestra "Stai cercando..."
    - [x] 2.2.2.2 Fallback creazione manuale (categoria CUSTOM)
    - [x] 2.2.2.3 Note/descrizione personale, tag custom su elemento
  - [x] 2.2.3 UI randomizzatore (schermata generatori da Home + sorteggio lista con Rigenera/Accetta dal dettaglio)
  - [x] 2.2.4 UI rating a stelline (1-5 + nota opzionale)
  - [x] 2.2.5 Profilo utente base (vista + modifica username nella tab Social)
- [ ] 2.3 Sync point: `gql_crud/` condiviso aggiornato ad ogni nuova query/mutation

### Test

- [/] T2.1 Creazione lista con categoria + icona + colore va a buon fine — testata senza categoria (tabella ListCategory ancora vuota, serve seed)
- [ ] T2.2 Creazione elemento da ricerca API salva correttamente record + join (o riusa il record se già presente)
- [x] T2.3 Creazione elemento CUSTOM senza API funziona
- [ ] T2.4 Randomizzatore numeri/lettere/colori/dadi restituisce risultati coerenti con i parametri richiesti
- [ ] T2.5 `skippedCount` aumenta solo su rigenerazione del randomizzatore, mai su chiusura app o cambio lista
- [x] T2.6 Rating 1-5 con nota si salva e resta anche eliminando la join elemento↔lista

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

- [/] 3.1.1 **Dev A**: resolver `Friendship` (invio/accetta/rifiuta/rimuovi) — fatta solo lettura `myFriends` (amici ACCEPTED)
- [/] 3.1.2 **Dev B**: UI lista amici, ricerca per username/email, vista progressi/liste condivise dell'amico — fatta solo la lista amici nella tab Social

#### Test

- [ ] T3.1.1 Invio, accettazione e rifiuto richiesta amicizia funzionano
- [ ] T3.1.2 Ricerca per username/email trova l'utente corretto
- [ ] T3.1.3 Rimozione amico funziona e sparisce da entrambe le liste

### Sotto-fase 3.2 — Gruppi base

- [ ] 3.2.1 **Dev A**: resolver `Group`, `Group_User`, `GroupList`, `GroupList_AcceptedItemHistory`
- [ ] 3.2.2 **Dev B**: UI creazione/gestione gruppo, inviti, scelta liste condivise, lista fittizia unione (front-end only)

#### Test

- [ ] T3.2.1 Creazione gruppo, invito, accettazione/rifiuto invito funzionano
- [ ] T3.2.2 Uscita dal gruppo e rimozione membro funzionano
- [ ] T3.2.3 Unione liste condivise per categoria elimina i duplicati correttamente
- [ ] T3.2.4 Import lista di gruppo nel proprio elenco funziona

### Sotto-fase 3.3 — Obiettivi/sfide di gruppo

- [ ] 3.3.1 **Dev A**: resolver `GroupChallenge`, `GroupUser_Challenge`
- [ ] 3.3.2 **Dev B**: UI creazione obiettivo, avanzamento manuale/automatico, conferma utente su autocompilazione

#### Test

- [ ] T3.3.1 Obiettivo senza elemento numerico/categoria richiede spunta manuale
- [ ] T3.3.2 Obiettivo con elemento numerico + categoria autocompila ma chiede conferma prima di aggiungere al progresso
- [ ] T3.3.3 Stato sfida (DRAFT → IN_PROGRESS → COMPLETED/FAILED) transita correttamente a scadenza

### Sotto-fase 3.4 — Notifiche & matching

- [ ] 3.4.1 **Dev A**: resolver `Notification`
- [ ] 3.4.2 **Dev B**: UI notifiche, push (Expo), pagina matching statistiche amici

#### Test

- [ ] T3.4.1 Notifica push arriva su invito gruppo/sfida/richiesta amicizia
- [ ] T3.4.2 Segna come letta funziona e persiste
- [ ] T3.4.3 Pagina matching mostra correttamente rating/elementi in comune tra due amici

---

---

---

---

---

---

---

---

## Fase 4 — Monetizzazione

- [ ] 4.1 **Dev A**: resolver `Membership`, `Subscription`, `Payment`
  - [ ] 4.1.1 Enforcement limiti piano lato resolver
    - [ ] 4.1.1.1 Free: 3 liste, 20 elementi/lista, 1 gruppo creato, max 3 partecipazioni, max 15 membri
    - [ ] 4.1.1.2 Plus: 15 liste, 100 elementi/lista, 10 gruppi, max 30 partecipazioni
    - [ ] 4.1.1.3 Unlimited: illimitato, max 100 membri gruppo proprio
  - [ ] 4.1.2 Logica "congelamento" liste oltre il limite (downgrade/mancato rinnovo)
- [ ] 4.2 **Dev B**: UI upgrade/paywall, integrazione pagamenti in-app (store), ads (Free)

### Test

- [ ] T4.1 Superato il limite Free, creazione nuova lista richiede congelamento di una esistente
- [ ] T4.2 Downgrade da Plus a Free congela le liste in eccesso senza eliminarle
- [ ] T4.3 Acquisto in-app aggiorna correttamente `Subscription`/`Membership` dell'utente
- [ ] T4.4 Ads visibili solo su piano Free

---

---

---

---

---

---

---

---

## Fase 5 — Rifinitura & Lancio

- [ ] 5.1 `Report` (moderazione/bug/feedback): resolver + UI invio segnalazione
- [ ] 5.2 Sorteggio live/realtime (canale dedicato, non GraphQL subscription)
- [ ] 5.3 Admin dashboard (web) per gestione contenuti/utenti/report
- [ ] 5.4 Testing end-to-end, bug fix
- [ ] 5.5 Submission store (Play Store / App Store review)

### Test

- [ ] T5.1 Invio report (bug/feedback/segnalazione utente) arriva in admin dashboard
- [ ] T5.2 Sorteggio live visibile in tempo reale a tutti i membri collegati del gruppo
- [ ] T5.3 Admin può gestire utenti/contenuti/report da dashboard
- [ ] T5.4 Build store (Android/iOS) passa la review

## Extra (post-lancio)

- [ ] E.1 Extra App #1 (film/serie TV) collegata
- [ ] E.2 Estrazione programmata/countdown

### Test

- [ ] TE.1 Collegamento tra le due app scambia dati correttamente
- [ ] TE.2 Countdown/estrazione programmata parte e notifica all'orario previsto
