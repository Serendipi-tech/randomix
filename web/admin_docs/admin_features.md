In questo file stabiliamo il contenuro frontend e i conseguenti gql necessari per interfacciarci col db e creare un pannello admin.

# Obiettivo

Dobbiamo creare un'interfaccia che sia accessibile solo agli utenti con ruolo **ADMIN**, che permetta di:

- visionare dati aggregatidi utenti e statistiche
- gestione utenti singoli
- gestione ListCategory
- visualizzazione tag utilizzati (aggregando quelli uguali) e possibilità di rendere comuni/app i tags
- pannello per inviare notifiche a tutti gli utenti
- impostare/modificare pacchetti di abbonamento membership e specifiche accessibili per ogni pacchetto e per quanto tempo
- gestione Report (bug/feedback/segnalazioni utenti): visionare e aggiornare stato (SENT/IN_PROGRESS/SOLVED/REJECTED)
- statistiche pagamenti/abbonamenti aggregate (anche su base temporale) + storico dettagliato pagamenti per singolo utente, interrogabile su richiesta

# STEPS di implementazione

## STEP 1 — ✅ COMPLETATA

Verifica di sicurezza per solo accesso **ADMIN** in middlewere

### Fase 1 — ✅ completata

Route `(auth)/login` (pagina + `LoginForm` in `components/organisms/`, Server Action `loginAdmin` in `utils/`, riusa mutation `loginWithCredentials` esistente via esecuzione in-process dello schema — nessun flusso separato) e route group `(admin)/dashboard` come stub protetto. Login separata dal gruppo `(admin)` per evitare che il layout di Fase 3 la blocchi.

### Fase 2 — ✅ completata

`web/src/proxy.ts` (rinominato da `middleware.ts`: convenzione deprecata in Next.js 16, sostituita da `proxy.ts` con funzione esportata `proxy`) — matcher `/dashboard/:path*`: verifica solo che il JWT nel cookie `admin_session` sia presente e valido (firma), redirect a `/login` se assente/invalido. Nessuna query DB qui (fast path).

### Fase 3 — ✅ completata

`web/src/app/(admin)/layout.tsx` (Server Component) — check autoritativo: decode JWT dal cookie + query `me` (via schema GraphQL in-process) per il `role` dell'utente, redirect a `/login` se `role !== ADMIN`. Sempre aggiornato, nessun re-login richiesto dopo un cambio ruolo.

### Fase 4 — ✅ completata

Helper `requireAdmin(ctx)` in `web/graphql/auth.ts` — guard riutilizzabile in ogni query/mutation admin-only (da richiamare negli STEP 2+). Obbligatorio: l'endpoint GraphQL è condiviso con mobile e raggiungibile anche fuori dalle pagine web, quindi proxy/layout da soli non bastano a proteggere le mutation.

**Test eseguiti**: build pulita; `/dashboard` senza cookie → redirect (Fase 2); con JWT valido ma di un utente non-ADMIN → redirect (Fase 3, conferma la difesa a due livelli).

## STEP 2 — ✅ COMPLETATA

Dati aggregati utenti e statistiche

Query `adminDashboardStats` (`web/graphql/models/adminDashboard/`, guard `requireAdmin`) + operazione condivisa in `packages/graphql-schema/gql_crud/adminDashboard/`. Dashboard (`(admin)/dashboard/page.tsx`) mostra:
- KPI row (`StatTile`): totale utenti, medie liste/gruppi/utenti per gruppo
- `UserGrowthChart`: andamento cumulativo utenti ultimi 30 giorni (line chart, hue singolo `--primary`, hover crosshair+tooltip)
- `MembershipPlanChart`: utenti per piano membership (bar chart orizzontale, hue singolo `--accent`, utenti senza abbonamento attivo confluiscono in FREE)

Palette costruita e validata con la skill dataviz (`scripts/validate_palette.js`): i colori `extraColors` di mobile non passano i check CVD/lightness per uso come palette categorica su sfondo scuro, quindi i grafici usano hue singoli già validati (`--primary`, `--accent`) invece di una palette multi-colore.

**Bug trovato e risolto (storico)**: `execute()` di graphql-js restituisce oggetti a prototipo null — React RSC li rifiuta se passati direttamente a un Client Component ("Classes or null prototypes are not supported"). All'epoca risolto con `JSON.parse(JSON.stringify(...))`.

**Aggiornata alla Fase 3-4 dello STEP 3** (07/08/2026, uniformità col resto del pannello): `dashboard/page.tsx` non usa più `execute()` server-side — è ora un Client Component con hook `useAdminDashboardStats` (`useQuery` Apollo, `fetchPolicy: 'cache-and-network'`). L'hack JSON round-trip per il prototipo null non serve più: Apollo su HTTP restituisce sempre oggetti plain. Restano server-side solo login (Fase 1, deve impostare il cookie httpOnly) e il layout `(admin)` (Fase 3, gate di sicurezza pre-render) — unici punti con un vincolo tecnico reale a restare `execute()` in-process.

**Test eseguiti**: build pulita, verifica runtime end-to-end su server di produzione isolato (porta separata) con JWT admin reale — HTTP 200, zero errori, dati reali renderizzati (stat tile, SVG line chart, bar chart); poi riverificato dopo la conversione ad Apollo con lo stesso metodo (cookie di sessione al posto dell'header, come farebbe il browser).

## STEP 3

Gestione utenti singoli

Scope confermato: dettaglio (profilo/stats/abbonamento), sospensione/riattivazione account, reset password. Modifica ruolo esclusa per ora. Ricerca + paginazione cursor per la lista.

**Convenzione routing** (da qui in avanti): tutte le pagine admin protette vivono sotto `/dashboard/...` (es. `/dashboard/users`), così il matcher del `proxy.ts` (`/dashboard/:path*`, Fase 2 dello STEP 1) copre automaticamente ogni nuova pagina senza bisogno di modifiche ad ogni STEP.

### Fase 1 — ✅ completata

Query `adminUsers` (ricerca username/email contains + paginazione cursor, stesso pattern `take+1`/`nextCursor` già usato in `myLists`) e `adminUser(id)` (dettaglio: profilo, ruolo, `deletedAt`, piano membership attivo, conteggi liste/gruppi/amici) — entrambe guardate da `requireAdmin`. Tipo `AdminUserRow`/`AdminUserDetail` come `objectRef` dedicati (non estendono lo `UserRef` pubblico, per non rischiare di esporre campi admin-only come `deletedAt` alle query condivise con mobile). Operazioni condivise in `packages/graphql-schema/gql_crud/adminUser/`. Helper `getAdminUserDetail(userId)` in `adminUser/index.ts`, riusato anche dalla mutation di Fase 2.

### Fase 2 — ✅ completata

Mutation `adminSetUserSuspended(userId, suspended)` — toggle di `deletedAt` (sospensione/riattivazione), guardata da `requireAdmin`, con self-protection (l'admin non può sospendere il proprio account). L'azione "reset password" riusa la mutation `requestPasswordReset` già esistente (nessun nuovo endpoint necessario: l'admin la richiama passando l'email dell'utente target).

**Test eseguiti** (build pulita + server di produzione isolato su porta separata, JWT admin reale via `x-api-key`+`Authorization`): `adminUsers` e `adminUser(id)` restituiscono dati reali dal DB; `adminSetUserSuspended` verificata in entrambe le direzioni (sospendi→`deletedAt` valorizzato, riattiva→`null`) sull'utente di test, poi ripristinata allo stato originale; self-protection conferma il blocco (`FORBIDDEN`) se l'admin tenta di sospendere se stesso; richiesta senza token → `UNAUTHENTICATED`.

### Fase 3 — ✅ completata

UI lista utenti — `/dashboard/users`: barra di ricerca (debounce 400ms, stesso pattern di `useUserSearch` mobile) + tabella cursor-paginata ("Carica altri") con **solo le colonne essenziali** (username, email, ruolo, stato, data iscrizione) — niente scroll orizzontale. Componente `Table` generico e riusabile (non esiste un equivalente diretto in mobile — nessuna vista tabellare lì — quindi costruito da zero con i token di `globals.css`, coerente con gli altri componenti dashboard). `Badge` (atom) portato da mobile per ruolo/stato.

**Cambio architetturale**: per la prima volta il pannello admin fa chiamate GraphQL interattive lato browser (ricerca, paginazione, mutation), non più solo `execute()` server-side in-process. Aggiunto `@apollo/client` a `web/`, `web/src/lib/apollo.ts` + `AdminProviders` (`(admin)/providers.tsx`) che avvolge le pagine protette. Poiché il cookie `admin_session` è httpOnly (non leggibile da JS di proposito), `web/src/app/api/graphql/route.ts` ora accetta l'auth anche dal cookie oltre che dall'header `Authorization` (fallback, priorità al Bearer — nessuna regressione per mobile che continua a usare solo l'header). Aggiunta `NEXT_PUBLIC_CLIENT_API_KEY` (stesso valore di `CLIENT_API_KEY`, esposta al bundle browser come già fa mobile con `EXPO_PUBLIC_CLIENT_API_KEY`).

### Fase 4 — ✅ completata

Modale dettaglio utente (`UserDetailModal`, click sul nome in tabella, non una route dedicata): profilo, badge ruolo/stato/piano, stats (liste/gruppi/amici), data iscrizione, azioni (sospendi/riattiva con conferma inline a due passaggi, invia reset password). Carica `adminUser(id)` all'apertura via `useAdminUserDetail`.

**Gap trovato e risolto (07/08/2026)**: nessuna delle pagine admin era raggiungibile da UI — `/dashboard/users` esisteva ma non c'era modo di arrivarci se non digitando l'URL a mano, perché non era mai stata costruita una navigazione. Aggiunta `Sidebar` (organism) in `(admin)/layout.tsx`, condivisa da tutte le pagine del gruppo — desktop-first fissa, come da `docs/architecture.md`. Da estendere con un link per ogni nuova pagina degli STEP 4-9.

**Test eseguiti** (build pulita + server di produzione isolato, cookie di sessione al posto dell'header Authorization per simulare esattamente Apollo dal browser): `adminUsers` con e senza ricerca, `adminUser(id)` → dati reali; pagina `/dashboard/users` → HTTP 200, zero errori, markup atteso presente. Confermato che il fallback cookie in `route.ts` funziona senza header `Authorization`.

## STEP 4

Gestione ListCategory

Scope confermato: creare, modificare, eliminare (bloccata se la categoria è già in uso da liste/gruppi esistenti, per non romperle silenziosamente). Icon picker: porting completo di `IconPickerSheet` da mobile (ricerca + tab per categoria + griglia), non una versione semplificata.

### Fase 1

Mutation `adminCreateListCategory`, `adminUpdateListCategory`, `adminDeleteListCategory` (quest'ultima blocca se `lists`/`groupLists` collegate > 0, errore con i conteggi) — guardate da `requireAdmin`. La query di lettura riusa quella pubblica già esistente (`listCategories`, nessun campo admin-only da nascondere), estesa con `listsCount`/`groupListsCount` (via `t.relationCount`) per mostrare l'utilizzo in UI prima di eliminare. Operazioni condivise (mutation + query estesa) in `packages/graphql-schema/gql_crud/listCategory/`.

### Fase 2

Porting delle utility icone da mobile a `web/src/utils/` (`lucideIconRegistry.ts`, `lucideIconCategories.ts`, `itEnIconSearchDictionary.ts`) — dati e logica pura, adattate a `lucide-react` invece di `lucide-react-native` (stessi nomi icona PascalCase, stesso registry). Componente `IconPickerSheet` (organism) come modale invece di bottom sheet, coerente con `UserDetailModal`.

### Fase 3

UI — `/dashboard/list-categories`: vista a card (non tabella: icona + nome + descrizione + chip delle `CATEGORY` incluse non stanno bene in righe strette) con bottone "Nuova categoria". Modale creazione/modifica: nome, descrizione, icona (`IconPickerSheet`), multi-select delle 32 `CATEGORY` (griglia di chip toggle, raggruppate se serve leggibilità).

### Fase 4

Eliminazione con conferma inline (stesso pattern a due passaggi di "sospendi utente"); se la categoria è in uso mostra il conteggio liste/gruppi collegati e blocca l'azione invece di un errore generico.

## STEP 5

Visualizzazione tag (aggregazione duplicati) + promozione a tag di sistema

## STEP 6

Pannello invio notifiche broadcast a tutti gli utenti

## STEP 7

Gestione pacchetti membership (creazione/modifica piani, specifiche e durata)

## STEP 8

Gestione Report (bug/feedback/segnalazioni utenti)

## STEP 9

Statistiche pagamenti/abbonamenti aggregate (temporali) + storico dettagliato per utente
