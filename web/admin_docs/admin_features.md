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

**Bug trovato e risolto (12/08/2026, durante lo STEP 9)**: stesso pattern timezone-bug scoperto in `adminPaymentStats` — `usersGrowth` mischiava confini di giorno locali (`setHours`/`setDate`, timezone del server) con etichette UTC (`toISOString()`), causando un bucket randagio in più (31 invece di 30) con server in fuso non-UTC. Mascherato finora dal fatto che i conteggi sono cumulativi (nessun valore "mancante" visibile, solo un punto extra nel grafico). Risolto con lo stesso fix: calcolo interamente in UTC (`Date.UTC(...)`). Verificato a runtime: `usersGrowth` ora restituisce esattamente 30 bucket, l'ultimo è oggi e coincide con `totalUsers`.

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

## STEP 8 — ✅ COMPLETATA

Gestione Report (bug/feedback/segnalazioni utenti)

Scope confermato: sola lettura + cambio stato (SENT/IN_PROGRESS/SOLVED/REJECTED), nessuna eliminazione. Il target polimorfico opzionale (`reportedId`/`itemId`/`groupId`/`challengeId`) va risolto nel dettaglio (username se utente reportato, nome se gruppo, ecc.) invece di mostrare solo l'id grezzo.

### Fase 1 — ✅ completata

Query `adminReports` (filtro per `status`/`reportType` opzionali, tipizzati sugli enum reali via `StatusReportEnum`/`ReportTypeEnum` — esportati come const da `enum.ts`, prima solo registrati; stesso pattern `take+1`/`nextCursor` già usato altrove) — righe con mittente risolto (username) e un campo `targetLabel` calcolato lato resolver (risolve `reportedId`→username, `itemId`→nome item, `groupId`→nome gruppo, `challengeId`→nome sfida, in base a quale dei quattro è valorizzato). Mutation `adminUpdateReportStatus(id, status)`. Entrambe guardate da `requireAdmin`. Tipo `AdminReportRow`/`AdminReportDetail` come `objectRef` dedicati (stesso motivo di `AdminUserRow`: non estendere un `ReportRef` pubblico che non esiste ancora e non serve altrove).

### Fase 2 — ✅ completata

UI — `/dashboard/reports`: tabella (titolo, mittente, tipo, stato con `Badge` colorato, data) con filtri stato/tipo sopra (`<select>` nativi, come in `MembershipFormModal`), colonne essenziali come la tabella utenti (niente scroll orizzontale). Click riga apre `ReportDetailModal`: titolo, corpo, `attachedFiles` (link cliccabili), target risolto, select cambio stato (aggiorna e refetch immediato). Sidebar aggiornata con il link "Segnalazioni".

**Test eseguiti** (build pulita + server di produzione isolato, cookie reale, su un report di test reale creato ad-hoc con `reportedId` valorizzato): `adminReports`/`adminReport` → target risolto correttamente ("Utente: testapikeyuser"); `adminUpdateReportStatus` → stato aggiornato, verificato anche l'effetto sul filtro (`status: SENT` → vuoto dopo il cambio, `status: IN_PROGRESS` → lo trova); report di test eliminato al termine, lista tornata vuota come all'inizio.

## STEP 9 — ✅ COMPLETATA

Statistiche pagamenti/abbonamenti aggregate (temporali) + storico dettagliato per utente

Scope confermato: selettore periodo (7/30/90 giorni) invece di una finestra fissa. Storico dettagliato per utente va dentro `UserDetailModal` (STEP 3), non una sezione a parte. **Nota**: Stripe non è ancora collegato (`stripeInvoiceId`/`stripeSubId` commentati "per ora non funziona" in schema) — nessun `Payment` reale nel DB oggi. Le query saranno corrette ma la dashboard mostrerà dati vuoti finché Stripe non è attivo; verificarle con pagamenti di test creati/rimossi ad-hoc, come già fatto per membership/notifiche.

### Fase 1 — ✅ completata

Query `adminPaymentStats(days: Int)` — entrate totali (SUCCESS), conteggio pagamenti per `STATUS_PAYMENT` (SUCCESS/PENDING/FAILED), serie temporale entrate/giorno **non cumulativa** (totale del singolo giorno, a differenza di `usersGrowth` che è progressivo) sul periodo scelto (7/30/90, validato). `StatusPaymentEnum` esportato come const in `enum.ts` (stesso trattamento degli altri enum in questi STEP). Guardata da `requireAdmin`.

**Bug trovato e risolto**: il calcolo dei bucket giornalieri mischiava confini locali (`setHours`/`setDate`, timezone del server) con etichette UTC (`toISOString()`). Con server in UTC+2, questo sfasa le date dei bucket di un giorno indietro rispetto al calendario reale — e i pagamenti "di oggi" (registrati in UTC) finiscono fuori dai bucket pre-seminati, creando un bucket randagio in più invece di popolare l'ultimo giorno atteso (verificato: `days: 7` restituiva 8 bucket). Risolto ricalcolando interamente in UTC (`Date.UTC(...)` invece di `setHours`/`setDate` locali) — più corretto anche in produzione, dove i server serverless girano tipicamente in UTC indipendentemente dal fuso di sviluppo.

**Stesso pattern trovato anche in `adminDashboardStats.usersGrowth` (STEP 2)** — non toccato qui (fuori scope, nessuna richiesta esplicita), ma va segnalato: probabilmente ha lo stesso sfasamento, mascherato lì dal fatto che i conteggi sono cumulativi (l'effetto visibile sarebbe un punto in più nel grafico, non un valore mancante). Da verificare/correggere se richiesto.

**Test eseguiti** (build pulita + server di produzione isolato, cookie reale): stato vuoto (nessun `Payment` nel DB, coerente con Stripe non collegato) → tutto zero senza errori; periodo non valido (`days: 15`) → `BAD_REQUEST`; creati membership/subscription/3 pagamenti di test reali (2 SUCCESS da 4.99€, 1 FAILED) → `totalRevenue: 9.98`, `paymentsByStatus` corretto, `revenueByDay` con esattamente 7 bucket (non 8) dopo il fix, entrate di oggi nell'ultimo bucket come atteso; tutti i dati di test eliminati al termine, stato tornato a zero.

### Fase 2 — ✅ completata

Estende `adminUser(id)` (STEP 3) con `payments: [AdminUserPayment]` (storico ordinato per data desc, importo, stato) — non una query separata, si carica insieme al resto del dettaglio già interrogato da `UserDetailModal`. `StatusPaymentEnum` esportato come const in `enum.ts` (stesso trattamento degli altri enum in questi STEP).

**Test eseguiti** (build pulita + server di produzione isolato, cookie reale): creati membership/subscription/pagamento di test reali per l'utente admin → `adminUser(id).payments` restituisce correttamente il pagamento (id/amount/status/createdAt); dati di test eliminati al termine, `payments: []` e `membershipPlan: FREE` tornati come prima del test.

### Fase 3 — ✅ completata

UI — `/dashboard/payments`: selettore periodo (7/30/90 giorni, riusa `Chip` come toggle — coerente con gli altri usi nel pannello, non un nuovo componente dedicato). KPI row (`StatTile`: entrate totali, pagamenti riusciti/falliti) + breakdown testuale per stato. `RevenueChart` (organism nuovo, non `UserGrowthChart` riusato: stesso stile visivo ma logica diversa — non cumulativo, formattazione valuta invece di conteggio intero). Sidebar aggiornata con il link "Pagamenti".

**Test eseguiti** (build pulita + server di produzione isolato, cookie reale): pagina → HTTP 200, zero errori, selettori periodo/sidebar renderizzati; creato un pagamento di test reale per confermare che l'hook `usePaymentStats` non generi errori runtime con dati popolati (verifica dei valori numerici già coperta a fondo dai test della Fase 1 sulla query); dati di test rimossi al termine.

### Fase 4 — ✅ completata

`UserDetailModal` (STEP 3) esteso con una sezione storico pagamenti (importo, data, stato con `Badge` colorato) sotto le stats esistenti, sopra le azioni sospendi/reset password — visibile solo se `payments.length > 0` (nessuna sezione vuota per utenti senza pagamenti).

**Test eseguiti** (build pulita + server di produzione isolato, cookie reale): creato un pagamento reale collegato all'utente admin, verificata la query esatta usata dalla modale (`adminUser(id).payments`, già validata in Fase 2) → dato corretto, zero errori server; dati di test rimossi al termine, stato tornato vuoto.
