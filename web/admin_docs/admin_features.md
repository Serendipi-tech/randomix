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

## STEP 3 — ✅ COMPLETATA

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

## STEP 4 — ✅ COMPLETATA

Gestione ListCategory

Scope confermato: creare, modificare, eliminare (bloccata se la categoria è già in uso da liste/gruppi esistenti, per non romperle silenziosamente). Icon picker: porting completo di `IconPickerSheet` da mobile (ricerca + tab per categoria + griglia), non una versione semplificata.

### Fase 1 — ✅ completata

Mutation `adminCreateListCategory`, `adminUpdateListCategory`, `adminDeleteListCategory` (quest'ultima blocca se `lists`/`groupLists` collegate > 0, errore con i conteggi) — guardate da `requireAdmin`. La query di lettura riusa quella pubblica già esistente (`listCategories`, nessun campo admin-only da nascondere), estesa con `listsCount`/`groupListsCount` (via `t.relationCount`) per mostrare l'utilizzo in UI prima di eliminare. Operazioni condivise (mutation + query estesa) in `packages/graphql-schema/gql_crud/listCategory/`.

### Fase 2 — ✅ completata

Porting delle utility icone da mobile a `web/src/utils/` (`lucideIconRegistry.ts`, `lucideIconCategories.ts`, `itEnIconSearchDictionary.ts`) — dati e logica pura, adattate a `lucide-react` invece di `lucide-react-native` (stessi nomi icona PascalCase, stesso registry; aggiunte `lucide-react`/`lucide-static` a `web/package.json`). Componente `IconPickerSheet` (organism) come modale invece di bottom sheet, coerente con `UserDetailModal`.

**Test eseguiti** (build pulita + server di produzione isolato, cookie di sessione reale): `adminCreateListCategory`/`adminUpdateListCategory`/`adminDeleteListCategory` verificate in sequenza su una categoria di test (creata → modificata → eliminata → confermata assenza da `listCategories`), nessun residuo lasciato nel DB.

### Fase 3 — ✅ completata

UI — `/dashboard/list-categories`: vista a card (icona, nome, descrizione, chip `CATEGORY` incluse, conteggio liste/liste di gruppo collegate) + bottone "Nuova categoria". `ListCategoryFormModal` (organism, usata sia per creazione che modifica): nome, descrizione, icona (`IconPickerSheet`), multi-select delle 32 `CATEGORY` (componente `Chip` portato da mobile, atom). Etichette italiane per l'enum `CATEGORY` in `utils/categoryLabels.ts` (web non ha ancora un setup i18n come mobile — stesso approccio a stringhe dirette già usato nel resto del pannello). Sidebar aggiornata con il link "Categorie liste".

### Fase 4 — ✅ completata

Eliminazione integrata nella stessa modale (non un'azione separata): conferma inline a due passaggi, messaggio che segnala il blocco se la categoria è in uso prima ancora di confermare.

**Test eseguiti** (server isolato + cookie reale): pagina `/dashboard/list-categories` → HTTP 200, zero errori, sidebar con nuovo link presente. Blocco "in uso" verificato end-to-end: categoria di test collegata temporaneamente a una lista reale esistente ("Test List WOW"), tentativo di eliminazione → correttamente respinto con `CATEGORY_IN_USE` e conteggio (`1 liste, 0 liste di gruppo`), poi scollegata e ripulita — nessun residuo, stato DB ripristinato esattamente com'era prima del test.

**Test eseguiti** (build pulita + server di produzione isolato, cookie di sessione reale): `adminCreateListCategory`/`adminUpdateListCategory`/`adminDeleteListCategory` verificate in sequenza su una categoria di test (creata → modificata → eliminata → confermata assenza da `listCategories`), nessun residuo lasciato nel DB.

## STEP 5 — ✅ COMPLETATA

Visualizzazione tag (aggregazione duplicati) + promozione a tag di sistema

Scope confermato: aggregazione case-insensitive per nome; "Promuovi" accorpa anche eventuali nuovi duplicati in un tag di sistema già esistente (non blocca/errore); oltre alla promozione, anche modifica (nome/colore) ed eliminazione dei tag di sistema. L'algoritmo di promozione è già specificato nel commento su `Tag` in `web/prisma/schema/tag.prisma`: crea/riusa il tag di sistema, riassegna gli item collegati, elimina i personali, colore = più frequente tra i promossi (sorteggio in parità).

### Fase 1 — ✅ completata

Query `adminTagGroups` (aggregazione case-insensitive dei tag personali per nome: nome con la capitalizzazione più frequente, conteggio tag personali, utenti distinti, item totali collegati, breakdown colori con frequenza, `existingSystemTagId` se già promosso) e `adminSystemTags` (elenco tag di sistema esistenti) — guardate da `requireAdmin`. Operazioni condivise in `packages/graphql-schema/gql_crud/tag/` (nuovo file admin, la query pubblica `myTags` resta invariata). Aggregazione fatta lato applicazione (Prisma non supporta `groupBy` su un'espressione come `LOWER(name)`, solo su colonne dirette). Aggiunto `itemsCount` al tipo `Tag` condiviso (`t.relationCount('useItems')`, non sensibile).

**Test eseguiti** (build pulita + server di produzione isolato, cookie di sessione reale): entrambe le query restituiscono dati reali dal DB (4 tag personali attuali, nessun duplicato, zero tag di sistema — stato iniziale coerente).

### Fase 2 — ✅ completata

Mutation `adminPromoteTagToSystem(name)` — implementa l'algoritmo dal commento dello schema: se esiste già un tag di sistema con lo stesso nome (case-insensitive) accorpa i nuovi duplicati lì, altrimenti crea il tag di sistema col colore più frequente tra i personali promossi (sorteggio in parità); riassegna `useItems`/`connectedChallenges` dai tag personali al tag di sistema, poi elimina i personali. Guardata da `requireAdmin`. Match case-insensitive via `mode: 'insensitive'` di Prisma (non serve l'aggregazione lato applicazione della Fase 1, qui il filtro è su un singolo nome noto).

**Test eseguiti** (server di produzione isolato, cookie reale, su dati reali con ripristino esatto dopo il test): promozione del tag personale "Nha" → creato correttamente il tag di sistema (nome/colore invariati, item riassegnato); creato un duplicato "nha" (case diverso) per lo stesso utente e ripromosso → accorpato nello **stesso** tag di sistema esistente (stesso id, colore non sovrascritto, nessun duplicato in `adminSystemTags`), confermando il ramo "merge in sistema già esistente". Stato finale ripristinato esattamente com'era (stessi ID, nomi, colori, item collegato) prima del test.

### Fase 3 — ✅ completata

Mutation `adminUpdateSystemTag(id, name?, color?)` e `adminDeleteSystemTag(id)` — modifica ed eliminazione di un tag di sistema esistente, guardate da `requireAdmin`; entrambe respingono un id che non è un tag di sistema (`userId !== null`) con `NOT_FOUND`. `adminUpdateSystemTag` blocca anche la collisione di nome con un altro tag di sistema esistente (case-insensitive) con `CONFLICT`. Color picker (`ColorPickerSheet`, organism) portato da mobile per la modifica colore — palette `TAG_COLORS` (`utils/tagColors.ts`), hex letterali (non `var(--token)`: il colore va salvato nel DB e mostrato identico su mobile, che non supporta le CSS custom properties) — stessi 10 valori di `extraColors` (dark).

**Test eseguiti** (server isolato + cookie reale, dati reali con ripristino esatto): promosso un tag di test a sistema, modificato nome+colore (`adminUpdateSystemTag`) → aggiornato correttamente; promosso un secondo tag e tentato di rinominarlo con lo stesso nome del primo → bloccato con `CONFLICT`; entrambi eliminati e i due tag personali originali ricreati con ID/colore/collegamento item identici — stato finale a 4 tag personali, zero di sistema, come all'inizio.

### Fase 4 — ✅ completata

UI — `/dashboard/tags`: due sezioni. "Duplicati da promuovere" (card per gruppo aggregato: nome, conteggi, swatch colori con frequenza, badge "già promosso" se `existingSystemTagId` non nullo, bottone "Promuovi" con conferma inline). "Tag di sistema" (card esistenti, click apre `SystemTagFormModal` con nome + `ColorPickerSheet`, eliminazione con conferma). Sidebar aggiornata con il link "Tag".

**Test eseguiti** (build pulita + server di produzione isolato, cookie reale): pagina `/dashboard/tags` → HTTP 200, zero errori, entrambe le sezioni e la sidebar renderizzate correttamente.

## STEP 6 — ✅ COMPLETATA

Pannello invio notifiche broadcast a tutti gli utenti

Scope confermato: solo utenti attivi (`deletedAt: null`, un sospeso non può comunque accedere); anche storico degli invii passati (titolo, data, N destinatari).

**Nota tecnica**: `Notification` ha `@@unique([senderId, receiverId, groupId])` — se il broadcast usasse `senderId` = id dell'admin, il secondo invio allo stesso utente violerebbe il vincolo. Fix: `senderId: null` per ogni notifica broadcast (Postgres tratta NULL come sempre distinto nei vincoli unique, quindi invii ripetuti restano validi) — coerente anche semanticamente con "notifica di sistema" invece che da un admin specifico. `notificationType: SYSTEM` (l'unico valore dell'enum non legato a un evento relazionale specifico).

### Fase 1 — ✅ completata

Backend, mutation + query insieme (entrambe piccole, stesso modello): `adminSendBroadcastNotification(title, body?)` — crea una `Notification` (`senderId: null`, `notificationType: SYSTEM`, `groupId`/`challengeId: null`) per ogni utente con `deletedAt: null`, via `createMany` (fan-out in una sola query), ritorna il conteggio destinatari. `adminBroadcastHistory` — raggruppa (`groupBy` Prisma su `title`, `body`, `createdAt`) le notifiche broadcast già inviate (`senderId: null`, `notificationType: SYSTEM`) con conteggio destinatari per invio. Entrambe guardate da `requireAdmin`.

**Test eseguiti** (build pulita + server di produzione isolato, cookie reale, invio reale a tutti e 3 gli utenti attivi con titolo etichettato "[TEST STEP6]"): mutation → 3 destinatari; `adminBroadcastHistory` → 1 invio aggregato con `recipientCount: 3`; notifiche di test eliminate subito dopo, storico tornato vuoto — nessun residuo nelle caselle notifiche reali.

### Fase 2 — ✅ completata

UI — `/dashboard/notifications`: form (titolo, corpo opzionale) + anteprima "Verrà inviato a N utenti attivi" + invio con conferma inline. Sotto, lista storico invii (titolo, data, N destinatari) da `adminBroadcastHistory`. Aggiunta query `adminActiveUsersCount` (non prevista nel dettaglio della Fase 1, necessaria per l'anteprima — `adminUsers` è paginata, non dà un totale). Sidebar aggiornata con il link "Notifiche".

**Test eseguiti** (build pulita + server di produzione isolato, cookie reale): pagina → HTTP 200, zero errori, sezioni e sidebar renderizzate; `adminActiveUsersCount` → 3, coerente con l'invio reale della Fase 1.

## STEP 7 — ✅ COMPLETATA

Gestione pacchetti membership (creazione/modifica piani, specifiche e durata)

Scope confermato: `MEMBERSHIP_PLAN` è un enum fisso (FREE/PREMIUM/UNLIMITED/FREE_TRIAL/FULL_ACCESS) — "creare un pacchetto" significa configurare/riconfigurare uno di questi 5 slot, non inventare nuovi piani. Modifica = **versionata**: ogni edit crea una nuova riga `Membership` e soft-elimina quella precedente (`deletedAt`), così gli abbonati già attivi restano legati a prezzo/limiti che avevano al momento della sottoscrizione (`subscription.membershipId` non cambia mai da solo); le nuove sottoscrizioni prendono la versione attiva più recente per quel piano. `limitations` (JSON libero in schema): forma fissata a `{ maxLists: number | null, maxItemsPerList: number | null }` (null = illimitato) — primo uso di questo campo nel codice, nessuno schema preesistente da rispettare.

### Fase 1 — ✅ completata

Query `adminMemberships` (righe con `deletedAt: null`, una per piano configurato, con conteggio abbonamenti attivi collegati). Mutation `adminCreateMembership(input)` — crea una nuova versione per un piano (errore `CONFLICT` se esiste già una versione attiva per quello stesso piano, va usato `adminUpdateMembership` per sostituirla). `adminUpdateMembership(id, input)` — crea la nuova versione e soft-elimina quella passata come `id` in una transazione; respinge (`BAD_REQUEST`) se `input.plan` non coincide col piano della versione modificata (il piano non è modificabile in un edit, solo in una nuova configurazione), e `NOT_FOUND` se l'id è già stato superato da una versione più recente. `adminDeleteMembership(id)` — soft-delete diretto (nessun blocco su abbonamenti attivi: il soft-delete non li rompe, semplicemente il piano non è più offerto a nuove sottoscrizioni). Tutte guardate da `requireAdmin`. `limitations` esposto come due campi tipizzati (`maxLists`, `maxItemsPerList`) invece di un JSON scalar generico — MEMBERSHIP_PLAN e BILLING ora esportati da `enum.ts` (prima registrati ma non esposti come const).

**Test eseguiti** (build pulita + server di produzione isolato, cookie reale, su dati reali): creato un piano PREMIUM di test → duplicato bloccato (`CONFLICT`) → modificato (nuova riga con id diverso, vecchia sparita dalla lista attiva — versioning confermato) → update sull'id ormai superato → `NOT_FOUND` → cambio piano in un update → `BAD_REQUEST` → eliminato, stato tornato vuoto come all'inizio (le versioni di test restano nel DB soft-eliminate, invisibili a ogni query).

### Fase 2 — ✅ completata

UI — `/dashboard/memberships`: card per ognuno dei 5 slot piano — configurato mostra prezzo/valuta/billing/limiti/abbonati attivi (click apre `MembershipFormModal` in modifica), non configurato mostra "Configura piano" (stessa modale in creazione, piano precompilato dallo slot cliccato). Modale: descrizione, prezzo, valuta, billing (`<select>` nativo — primo uso nel pannello, nessun componente Select dedicato necessario), limiti (due campi numerici opzionali), eliminazione con conferma in modifica. Sidebar aggiornata con il link "Membership".

**Test eseguiti** (build pulita + server di produzione isolato, cookie reale): pagina → HTTP 200, zero errori, tutti e 5 gli slot renderizzati correttamente nello stato vuoto (coerente col DB, nessun pacchetto configurato dopo i test della Fase 1).

## STEP 8

Gestione Report (bug/feedback/segnalazioni utenti)

## STEP 9

Statistiche pagamenti/abbonamenti aggregate (temporali) + storico dettagliato per utente
