# ONDATA-1

**Data**: 19/11/2026 · **Metodo**: [`metodo-agenti/METODO.md`](metodo-agenti/METODO.md) · **Da**: [`TODO.md`](TODO.md)

Pianificazione dell'ondata, non ancora eseguita. Nessun figlio è stato lanciato: questo file è il mandato —
"il piano è codice" (regola 15), va riletto prima di lanciare chiunque.

**Revisione**: un revisore indipendente (regola 17) ha riletto questa pianificazione il 19/11/2026 e trovato
4 bloccanti, ora corretti (vedi «Correzioni della revisione» in fondo). Le schede T01, T14, T16, T02, T18,
T19, T27 in `TODO.md` sono state corrette di conseguenza — i file di riferimento sbagliati nella prima
stesura erano copiati anche qui.

**Seconda revisione**: dopo che l'utente ha rimandato T03/T08/T15(parziale)/T21/T25 (vedi «Candidati»), un
secondo revisore indipendente ha riletto piano e `TODO.md` aggiornati e trovato un bloccante: la scheda T01
in `TODO.md` citava ancora la dipendenza da B4 e l'inclusione di `item-form.tsx`, entrambe superate dalla
rimozione di T03. Corretto.

---

## Candidati

23 task su 29 in `TODO.md` entrano nell'ondata. Esclusi su richiesta esplicita:

- **T26** 🔍 — in valutazione (due opzioni di formato card, decisione utente non ancora presa) — rimandato
  insieme a T25
- **T29** ⏸️ — decisione del titolare (Gruppi dentro l'MVP o no), non un task eseguibile
- **T08, T21, T25** ⏸️ — i tre redesign estetici senza spec visiva, tutti rimandati dall'utente il
  19/11/2026 (nessun brief per ora). Formavano il pacchetto F ("fase 0: proposte di direzione, nessun
  codice", la soluzione scelta per non dare a un agente un mandato da indovinare), rimosso dal piano insieme
  a loro: **l'ondata ora ha 5 pacchetti, non 6**. T25 era anche legato a T26 per il formato delle card —
  entrambi rimandati insieme, il legame non è più rilevante per questa ondata.
- **T03** ⏸️ — rimandato dall'utente il 19/11/2026: i task sulle immagini item (upload e utilizzo) vanno
  valutati in un'ondata a parte dedicata. Era in B4 insieme a T14; **B4 resta nell'ondata con solo T14**
  (non è un task sulle immagini — è il gating di `isHidden`, già presente nello schema). Il fattore
  "immagini in item (on/off)" è stato tolto anche dallo scope di T04/T05/T06 per lo stesso motivo (vedi
  schede corrispondenti in `TODO.md`).

---

## Decisioni

**Forma dell'albero**: radice (coordinatore) → 5 pacchetti (nodi, uno per area o gruppo di aree con file
condivisi) → foglie (1-2 task ciascuna, 1 agente per foglia). Il metodo indica un range di 6-8 figli per
nodo come ideale ("più largo e piatto costa meno"); con 5 pacchetti restiamo leggermente sotto, conseguenza
diretta di aver tolto il pacchetto F (T08/T21/T25 rimandati) — non c'è nulla da aggiungere artificialmente
per tornare nel range.

**Perché questi confini di pacchetto, non altri**: ogni pacchetto raggruppa task che condividono file o area,
per tenere lontani due agenti dallo stesso file in parallelo. Dove due task dello stesso pacchetto toccano lo
stesso file (es. T16+T02 su `ItemCardDetails.tsx`/`list/[id].tsx`), sono nella **stessa foglia**, in sequenza
dichiarata — mai in foglie diverse. Tre sovrapposizioni fra pacchetti *diversi* erano sfuggite alla prima
stesura (vedi «Correzioni della revisione»): sono state risolte spostando il lavoro in conflitto in fondo
all'integrazione, dopo i merge che modificano quei file.

**Ordine di lancio, non solo di merge** (voce mancante segnalata dal revisore): i 5 pacchetti **non** partono
tutti insieme.

- **A, C, D, E** possono partire tutti subito, in parallelo: non condividono file fra loro né con gli altri
  (vedi tabella file-foglia più sotto — nessuna cella ripetuta). C1 in particolare non ha più nulla ad
  aspettare: la sovrapposizione con B4 su `item-form.tsx` è decaduta insieme a T03 (rimandato, vedi
  «Candidati») — B4 oggi contiene solo T14, che tocca `item.mutations.ts`, non `item-form.tsx`.
- **B** ha una sequenza interna obbligata: **B1 parte per primo**; B2 e B3 partono solo dopo che B1 è stato
  unito e verificato; **B4 parte solo dopo B2 unito** (riusa l'helper di lettura piano che B2 introduce).
- La **"versione di partenza"** per B2/B3/B4 non è il commit iniziale dell'ondata ma **l'head dopo il merge
  del pacchetto/foglia da cui dipendono** (B1 per B2/B3; B2 per B4). Dichiararlo esplicitamente in ogni
  mandato, non lasciarlo implicito.

**Modelli dichiarati** (regola 3 — sempre, altrimenti il figlio eredita quello del padre; regola 5 — il più
economico che fa il lavoro bene):

| Pacchetto | Natura del lavoro | Modello |
|---|---|---|
| A | Fix meccanici, spec chiusa, basso rischio | economico (Haiku) |
| B | Schema + resolver + enforcement, rischio medio-alto | Sonnet |
| C | UI + un task a rischio 🔴 (T09, tocca dati esistenti) | Sonnet (C1, C2, C5) · economico (C3, C4 — mapping icone e test manuale, nessuna logica delicata) |
| D | Debug reale (causa non ovvia), non meccanico | Sonnet |
| E | UI sociale, sequenze su file condivisi, un resolver nuovo (E3) | Sonnet |

**Divieti comuni a ogni foglia** (regola 14): nessun comando che azzera la cartella di lavoro
(`git checkout .`, `git reset --hard`, `git clean -f`); nessuna modifica a file fuori dal proprio elenco,
nemmeno "di passaggio"; se un file del proprio elenco sembra già modificato da altri, fermarsi e segnalarlo
al coordinatore invece di sovrascrivere.

**Consegna**: ogni foglia lavora su un branch proprio (`ondata1/<pacchetto>-<foglia>`, es.
`ondata1/b-b1-membership-fields`), commit locale a fine lavoro — **non fa push**, non apre PR: l'unione è
compito del coordinatore (vedi «Integrazione»).

---

## Pacchetti

### Pacchetto A — Micro-fix trasversali (3 task, 4 foglie: A1/A2/A3 subito + A1b in coda)

| Foglia | Task | File | Quando parte |
|---|---|---|---|
| A1 | T01 (meccanismo) | `BottomSheet.tsx` | subito |
| A2 | T11 | nuovo componente toast (percorso a scelta in `components/molecules/` o `organisms/`) | subito |
| A3 | T20 | `app-tabs.tsx` | subito |
| A1b | T01 (applicazione, foglia di coda) | `ItemCardDetails.tsx`, `list-form.tsx` | **dopo** il merge di C1 e C5 |

**Perché A1 è diviso in due**: il revisore ha trovato che il file-elenco originale di T01 (`ItemCardDetails.tsx`,
`list-form.tsx`) si sovrapponeva a C1 e C5. A1 costruisce ora solo il meccanismo riusabile (un hook tipo
`useDirtyState` o equivalente) su `BottomSheet.tsx`; applicarlo ai due form specifici è rimandato a dopo che
quei form hanno già preso la loro forma finale da C, per non scrivere sugli stessi file in parallelo.
(`item-form.tsx` era un terzo file in conflitto con B4/T03: T03 è stato rimandato dall'utente — vedi
«Candidati» — quindi non c'è più nulla con cui A1b possa entrare in conflitto su quel file; resta comunque
fuori dallo scope di T01, perché `item-form.tsx` è una schermata di sola creazione, non un form di modifica
con uno stato "sporco" da confrontare.)

**Controllo sulla base (A)**: `BottomSheet.tsx` esiste in `mobile/src/components/organisms/` ed è il
componente che sia `ItemCardDetails.tsx` sia `list-form.tsx` usano per i propri sheet (verificarlo con un
grep sull'import prima di iniziare).

**Verifica propria A1/A1b**: aprire un bottom sheet di modifica senza cambiare nulla → salva disabilitato;
cambiare un campo → salva abilitato. Verifica propria A2: toast compare su un salvataggio item e su un errore
di rete simulato, sparisce da solo. Verifica propria A3: tab Profilo e Amici mostrano icone diverse, build
Expo non rotta.

### Pacchetto B — Membership e pagamenti (5 task, 4 foglie, **sequenza interna obbligata**)

| Foglia | Task | File | Parte dopo |
|---|---|---|---|
| B1 | T04 + T05 | `MembershipFormModal.tsx`, `adminMembership.mutations.ts`, `membership/index.ts` | subito |
| B2 | T06 | `list.mutations.ts`, `item.mutations.ts` | B1 unito e verificato |
| B3 | T07 | `settings.tsx`, `adminMembership.queries.ts` (+ nuova query pubblica) | B1 unito e verificato |
| B4 | T14 | `item.mutations.ts` | B2 unito e verificato |

T03 tolto da B4: rimandato dall'utente il 19/11/2026 insieme agli altri task sulle immagini item (vedi
«Candidati»), valutazione in un'ondata a parte. B4 ha ora un solo task, T14, e un solo file:
`item.mutations.ts` — non richiede aggiungere il campo `isHidden` (esiste già su `User_Item`, riga 70 di
`item.prisma`, ed è già letto/scritto da `updateUserItem` senza gating), richiede solo aggiungere lì il
controllo di piano.

**Riuso dichiarato B2→B4**: B2 introduce la lettura di `Membership.limitations` per l'utente corrente per il
controllo di `maxLists`/`maxItemsPerList`. B4 deve **riusare lo stesso helper**, non riscriverne uno proprio,
per il gating di `isHidden`. Il mandato di B2 include esplicitamente: esporre questo helper in un punto
riusabile da B4 (non inline nel resolver di lista).

**Vincolo da preservare in B1** (trovato dal revisore, non ovvio): `adminUpdateMembership` **non fa update
in-place** — crea una nuova riga `Membership` e soft-elimina quella precedente (`deletedAt`), così gli
abbonati già attivi restano legati a prezzo/limiti del momento della sottoscrizione. Questo comportamento è
commentato nel codice esistente e **va preservato**, non "semplificato" in un update diretto.

**Controllo sulla base (B)**: `web/prisma/schema/membership.prisma` contiene `limitations Json?`;
`web/graphql/models/membership/index.ts` contiene l'interfaccia `MembershipLimitations`.

**Verifica propria B1**: un admin crea/modifica un pacchetto coi nuovi campi, il piano esistente (FREE ecc.)
resta leggibile; una modifica produce una nuova riga + soft-delete della precedente (non un update diretto).
**Verifica propria B2**: un utente FREE che supera `maxLists` riceve un errore GraphQL leggibile, non un 500;
un utente sotto il limite crea normalmente.
**Verifica propria B3**: la nuova query pubblica non richiede `requireAdmin`; un utente qualunque la può
chiamare e vede prezzo/limiti dei piani attivi.
**Verifica propria B4**: `isHidden` su `User_Item` rifiuta `true` se il piano non lo consente, accetta
normalmente se il piano lo consente (comportamento preesistente, solo gated).

### Pacchetto C — Liste e item (7 task, 5 foglie)

| Foglia | Task | File | Nota |
|---|---|---|---|
| C1 | T16 poi T02 | `item-form.tsx` (solo lettura/contesto, non modificato), `ItemCardDetails.tsx`, `list/[id].tsx` | correzione revisione: l'integrazione vera è in `list/[id].tsx` (dove `ItemCardDetails` è montato e cablato a `updateUserItem`/`removeItemFromList`/`rateItem`), non in `item-form.tsx` (schermata di sola creazione) |
| C2 | T09 | `categories.prisma`, `listCategory.prisma`, `CategoryFormModal.tsx`, `ListCategoryFormModal.tsx` | rischio 🔴: tocca dati esistenti (categorie già seedate in italiano) |
| C3 | T10 + T12 | `CategoryPickerSheet.tsx`, `list-icons.ts` | entrambe "icone mancanti", stesso tema |
| C4 | T13 | — (solo test, nessun file da modificare) | |
| C5 | T15 | `list-form.tsx` | |

**Controllo sulla base (C)**: `ItemCardDetails.tsx` esiste con la categoria mostrata come `Text` non editabile
(non un campo); `list/[id].tsx` importa `useItemMutations` e passa `updateUserItem`/`removeItemFromList`/
`rateItem` a `ItemCardDetails`.

**Verifica propria C1**: da un item esistente, aperto da `list/[id].tsx`, si cambia nome/categoria e si vede
aggiornato nella lista; un item con almeno un amico che lo ha valutato mostra la sua recensione nello stesso
bottom sheet.
**Verifica propria C2** (la più delicata del pacchetto): **prima** di migrare, contare le `Category`/
`ListCategory` esistenti; **dopo** la migration a `translations Json?`, lo stesso conteggio e tutti i `name`
originali devono comparire come fallback — nessuna categoria deve sparire o restare senza nome.
**Verifica propria C4**: lista con `isHidden=true` non visibile da `friendProfile` né da liste di gruppo
condivisibili.

C1 non ha più dipendenze da/verso il pacchetto B: con T03 rimandato, B4 (solo T14) non tocca più
`item-form.tsx` né alcun file di C1.

### Pacchetto D — Profilo e statistiche (3 task, 2 foglie)

| Foglia | Task | File | Nota |
|---|---|---|---|
| D1 | T18 + T19 | `useListMutations.ts`, `useItemMutations.ts`, `useListDraw.ts` | correzione revisione: `useProfileStats.ts` è sola query, non c'è nulla da agganciare lì — la fix va nelle mutation di creazione/accettazione |
| D2 | T17 | `index.tsx`, `home.json` | |

File corretto in D1 dopo revisione: la fix è aggiungere `'ProfileStats'` a `refetchQueries` di `CREATE_LIST`
(in `useListMutations.ts`, che ha già `refetchQueries: ['MyLists']`), di `ADD_ITEM_TO_LIST` (in
`useItemMutations.ts`, che ha già `refetchQueries: ['ListDetail']`) e di `ACCEPT_DRAW` (in `useListDraw.ts`,
che oggi non ha `refetchQueries`).

**Controllo sulla base (D)**: `useProfileStats.ts` usa `fetchPolicy: 'cache-and-network'` e nessun
`refetchQueries` proprio (è normale, è sola query); `CREATE_LIST`/`ADD_ITEM_TO_LIST` hanno già
`refetchQueries` per altre query, senza `'ProfileStats'`.

**Verifica propria D1** (regola 18, rompere apposta): riprodurre il bug PRIMA della fix (creare un item,
confermare che le stat non si aggiornano) — se non si riproduce, il task non è quello descritto e va
rifermato col coordinatore prima di "risolverlo". Dopo la fix, stesso scenario deve aggiornarsi senza
refresh né re-login; stesso per un'accettazione di sorteggio (T19). Indagare separatamente, come nota a
parte, il blocco di caricamento dell'intera pagina al refresh (probabile errore non gestito, causa diversa
dalla cache stantia).

### Pacchetto E — Sociale: notifiche e amici (5 task, 3 foglie)

| Foglia | Task | File | Nota |
|---|---|---|---|
| E1 | T23 poi T24 | `notifications.tsx`, `useFriendRequests.ts` | stesso file: T23 costruisce la pagina, T24 aggiunge le richieste di amicizia sopra |
| E2 | T22 | — (solo test, admin) | indipendente, nessun file da modificare |
| E3 | T27 poi T28 | `friend/[id].tsx`, `useFriendProfile.ts`, `friendship.queries.ts` (resolver backend) | scope corretto dopo revisione: serve anche un resolver nuovo, `friendProfile` oggi ritorna solo `user`+`lists`, nessuna statistica |

**Controllo sulla base (E)**: `notifications.tsx` mostra solo `PageHeader` + `t('comingSoon')`, nessuna lista
reale; `friendProfile` (in `friendship.queries.ts`) non espone statistiche.

**Verifica propria E1**: notifiche reali (sistema, amicizia, gruppo) compaiono con stato letto/non letto
persistito; una richiesta di amicizia in arrivo è accettabile/rifiutabile dalla stessa pagina.
**Verifica propria E3**: profilo amico mostra statistiche in due tab ("solo sue"/"mie e sue"), popolate dal
nuovo resolver; rimozione amico funziona dalla stessa pagina senza tornare alla lista amici.

---

## Integrazione

Chi unisce è il coordinatore, mai le foglie (regola: «unire il lavoro dei figli»). Ordine:

1. **A** (A1, A2, A3 — basso rischio, veloce) — merge, riverifica le 3 verifiche proprie.
2. **D** — merge, riprodurre di nuovo lo scenario di bug (non solo rilanciare i test della foglia: la
   regola 18 chiede di romperlo apposta anche qui, perché tocca cache condivisa con altre mutation).
3. **C** — merge **C2, C3, C4, C5 prima**, poi **C1**, poi — essendo a rischio 🔴 — **C2** va riverificata
   un'ultima volta dopo tutto il resto del pacchetto (non prima: l'ordine qui corregge la bozza iniziale,
   che la metteva per ultima senza motivo esplicito).
4. **B** — merge **B1**, riverificare, solo poi **B2** e **B3** (possono entrare in parallelo essendo
   indipendenti fra loro), riverificare, infine **B4** (richiede solo B2 unito).
5. **A1b** — ora che C1 e C5 sono uniti, applicare il dirty-check di T01 a `ItemCardDetails.tsx` e
   `list-form.tsx`. Verifica propria A1/A1b ripetuta sui due file.
6. **E** — merge E2, poi E1, poi E3.

Dopo ogni merge, rilanciare anche le verifiche dei pacchetti già uniti in precedenza che condividono area
(es. dopo B4, ri-controllare che B1/B2 siano ancora verdi — B4 ha modificato `item.mutations.ts`, che B2 ha
già modificato).

---

## Correzioni della revisione (19/11/2026)

Un revisore indipendente ha riletto questo piano prima del lancio (regola 17) e trovato:

**Bloccanti, corretti in questa versione**:
1. Tre sovrapposizioni di file fra pacchetti diversi non dichiarate (`ItemCardDetails.tsx` A1/C1,
   `list-form.tsx` A1/C5, `item-form.tsx` B4/C1) → risolte spostando T01 su quei file in coda (A1b), dopo i
   merge di C1/C5/B4.
2. T14 aveva una premessa falsa (`isHidden` dato per mancante, in realtà già presente e funzionante senza
   gating) → scheda T14 in `TODO.md` riscritta, file-elenco di B4 corretto con `item.mutations.ts`.
3. C1 non includeva `list/[id].tsx`, il file dove `ItemCardDetails` è davvero montato e cablato alle
   mutation → aggiunto; schede T16/T02 in `TODO.md` corrette.
4. D1 puntava a `useProfileStats.ts` (sola query, nessuna mutation) invece delle mutation reali
   (`useListMutations.ts`, `useItemMutations.ts`, `useListDraw.ts`) → corretto; schede T18/T19 in `TODO.md`
   corrette con i nomi esatti delle query da aggiungere a `refetchQueries`.

**Dubbi, risolti in questa versione**: ordine di lancio reso esplicito (sezione «Decisioni»); E3 corretto con
lo scope backend reale (resolver `friendProfile`, scheda T27 aggiornata); rischio F3→T26 dichiarato come
vincolo esplicito nel mandato di F3; helper riusabile B2→B4 reso un vincolo esplicito del mandato B2.

**Osservazioni minori, applicate**: vincolo di versioning di `adminUpdateMembership` reso esplicito nel
mandato B1; aggiunto un controllo sulla base per ciascun pacchetto (A, D, E — F non ne ha bisogno, non
produce codice).

---

## Esito

**Chiusa il 19/11/2026. Tutti i 23 task entrati nell'ondata sono ✅ Fatto.** Dettaglio task-per-task e commit
nelle rispettive schede di `TODO.md`. Riepilogo per pacchetto:

- **A** (T01, T11, T20): A1 `62eb1ae`, A2 `70d68ce`, A3 `e71f062`, A1b `514e420` (rilanciata una volta — la
  prima esecuzione si è fermata correttamente su una base disallineata, vedi incidente sotto).
- **B** (T04, T05, T06, T07, T14): B1 `f8da768`, B2 `f393a22`, B3 `e9b3de9`, B4 `dd31a42`. Sequenza interna
  rispettata (B1 → B2/B3 → B4).
- **C** (T02, T09, T10, T12, T13, T15, T16): C1 `ce3e566`, C4 (solo verifica, nessun commit), C5 `0da39b5`;
  C2 e C3 interrotte da un rate limit di sessione a metà lavoro, riprese dal WIP già scritto (non rilanciate
  da zero) — C2 chiusa con fix aggiuntivo `6730e65` (migrazione applicata), C3 chiusa dopo verifica che T12
  non richiedeva più alcuna modifica. Un bug di integrazione fra C1 e C3 (tipo `CategoryOption` richiedeva
  `icon`, non popolato in un punto) corretto con `330b467`.
- **D** (T17, T18, T19): D1 `f5d5ff3`, D2 `0fd0a41`.
- **E** (T22, T23, T24, T27, T28): E2 (solo verifica, nessun commit); E1 ed E3 interrotte dallo stesso rate
  limit di C2/C3, riprese dal WIP già scritto.

**Trovato durante il lavoro**: T30 (`myLists` non filtra `isHidden`), scoperto da C4 mentre verificava T13.
Aggiunto a `TODO.md`, non assegnato a questa ondata.

**Incidente — base worktree disallineata**: a metà ondata, dopo molti merge locali mai pushati, `origin/main`
era 27 commit indietro rispetto alla HEAD locale. Gli agenti con `isolation: "worktree"` partono per default
da `origin/main` ("fresh"), non dalla HEAD locale — tre foglie lanciate in quella finestra (B2, B3, il primo
tentativo di A1b) hanno quindi ricevuto una base vecchia. A1b l'ha rilevato da sola (due controlli sulla base
nel mandato) e si è fermata senza scrivere nulla, come da istruzioni; B2 e B3 l'hanno rilevato e corretto da
sole con un `git merge main` interno. Nessun danno, ma il mandato per le ondate future dovrebbe includere
esplicitamente il controllo "la tua base include gli ultimi merge?" come primo passo, non solo per i casi a
rischio. Corretto alla radice pushando `main` su `origin` (`git push origin main`, 27 commit, autorizzato
dall'utente) e impostando `worktree.baseRef: "head"` in `.claude/settings.json`.

**Verifica finale**: `npx tsc --noEmit` pulito su `mobile/` e `web/` dopo l'ultimo merge (solo un errore
preesistente non correlato in `TagCreateSheet.tsx`). Nessuna verifica visiva interattiva reale (nessun
browser/simulatore disponibile in questo ambiente) — build statica (`expo export --platform web`) usata come
proxy da una foglia, raccomandata una verifica manuale dell'utente prima di considerare l'ondata "provata",
non solo "scritta".
