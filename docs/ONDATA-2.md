# ONDATA-2

**Data**: 25/11/2026 · **Metodo**: [`metodo-agenti/METODO.md`](metodo-agenti/METODO.md) · **Da**: [`TODO.md`](TODO.md)

Pianificazione dell'ondata, non ancora eseguita. Nessun figlio è stato lanciato: questo file è il mandato —
"il piano è codice" (regola 15), va riletto prima di lanciare chiunque.

---

## Candidati

17 task su 19 (T31-T49) entrano nell'ondata. Esclusi su richiesta esplicita (vedi `TODO.md`):

- **T38** 🔍 — in valutazione (quali statistiche mostrare nel confronto profilo amico, decisione non ancora
  presa).
- **T36** ⏸️ — rimandato il 25/11/2026: richiede toccare `PageHeader.tsx`, componente condiviso in tutta
  l'app, e l'utente ha scelto di non autorizzarlo per ora.

**T47 parziale**: entra nell'ondata senza la parte "placeholder immagine upload", che dipende da T03 (ancora
⏸️ in attesa, fuori da questa ondata). Il mandato della foglia che lo contiene deve escludere esplicitamente
quella parte.

---

## Decisioni

**Forma dell'albero**: radice (coordinatore) → 7 pacchetti (nodi, uno per area) → 11 foglie totali (1-2 task
ciascuna, salvo il pacchetto Impostazioni — vedi motivo sotto). Più pacchetti e foglie più piccole rispetto
all'ondata 1 per lo stesso motivo di allora: tenere lontani due agenti dallo stesso file in parallelo.

**Perché questi confini di pacchetto**: raggruppano task che condividono file. Dove più task toccano lo
stesso file, sono nella stessa foglia (in sequenza dichiarata) o in foglie diverse ma **sequenziate fra loro**
(mai in parallelo sullo stesso file). Le sovrapposizioni di file trovate in questa ondata:

| File condiviso | Task che lo toccano | Soluzione |
|---|---|---|
| `settings.tsx` | T40, T41, T42, T48 | **Stessa foglia** (S1), in sequenza interna |
| `app-tabs.tsx` | T32, T35 | Foglie diverse, **sequenziate**: T35 (F2) parte solo dopo che T32 (N1) è unito |
| `friend/[id].tsx` | T35, T37, T39 | F2 (T35) prima; F3 (T37+T39) dopo, stessa foglia per i due task fra loro |
| `ItemCardDetails.tsx` + `useItemMutations.ts` | T44, T45, T46, T47 | Due foglie sequenziate: I1 (T45+T46, additivi) prima; I2 (T44+T47, strutturali) dopo |

Nessun'altra cella ripetuta: tutti gli altri file compaiono in una sola foglia.

**Ordine di lancio**:

- **Possono partire tutti subito, in parallelo**: N1 (T32), N2 (T33), F1 (T34), P1 (T31), S1 (T40+T41+T42+T48),
  H1 (T43), I1 (T45+T46), R1 (T49). Otto foglie, nessuna delle quali condivide un file con un'altra di questo
  gruppo.
- **F2** (T35) parte solo **dopo che N1 è unito e verificato** (condivide `app-tabs.tsx`).
- **F3** (T37+T39) parte solo **dopo che F2 è unito e verificato** (condivide `friend/[id].tsx`).
- **I2** (T44+T47) parte solo **dopo che I1 è unito e verificato** (condivide `ItemCardDetails.tsx` e
  `useItemMutations.ts`).
- La **"versione di partenza"** per F2, F3, I2 non è il commit iniziale dell'ondata ma **l'head dopo il merge
  della foglia da cui dipendono** (N1 per F2; F2 per F3; I1 per I2). Dichiararlo esplicitamente in ogni
  mandato, non lasciarlo implicito.

**Modelli dichiarati** (regola 3 — sempre; regola 5 — il più economico che fa il lavoro bene):

| Foglia | Task | Natura | Modello |
|---|---|---|---|
| N1 | T32 | Badge su tab esistente, spec chiusa, basso rischio | economico (Haiku) |
| N2 | T33 | Azioni contestuali per tipo, branching non banale | Sonnet |
| F1 | T34 | UI nuova (sheet), riuso di ricerca esistente | Sonnet |
| F2 | T35 | Debug reale (bug di navigazione, causa non ovvia) | Sonnet |
| F3 | T37+T39 | Rimozione stat (mecc.) + nuova navigazione a dettaglio | Sonnet |
| P1 | T31 | Solo layout (colonna→riga), nessuna logica | economico (Haiku) |
| S1 | T40+T41+T42+T48 | 3 task UI mecc. + 1 con resolver nuovo (T42) | Sonnet |
| H1 | T43 | Nuova BottomSheet + gestione codice errore GraphQL | Sonnet |
| I1 | T45+T46 | Icona (mecc.) + `optimisticResponse` (cache Apollo, delicato) | Sonnet |
| I2 | T44+T47 | Nuovo toggle + consolidamento UI esistente | Sonnet |
| R1 | T49 | Nuovo resolver + nuova card modalità, pattern già esistente da ricalcare (4 modalità analoghe) | Sonnet |

**Divieti comuni a ogni foglia** (regola 14): nessun comando che azzera la cartella di lavoro
(`git checkout .`, `git reset --hard`, `git clean -f`); nessuna modifica a file fuori dal proprio elenco,
nemmeno "di passaggio"; se un file del proprio elenco sembra già modificato da altri, fermarsi e segnalarlo
al coordinatore invece di sovrascrivere.

**Consegna**: ogni foglia lavora su un branch proprio (`ondata2/<pacchetto>-<foglia>`, es.
`ondata2/notifiche-n1-badge`), commit locale a fine lavoro — **non fa push**, non apre PR: l'unione è compito
del coordinatore.

---

## Pacchetti

### Pacchetto Notifiche (2 task, 2 foglie)

| Foglia | Task | File | Quando parte |
|---|---|---|---|
| N1 | T32 | `app-tabs.tsx`, `useNotifications.ts` | subito |
| N2 | T33 | `notifications.tsx`, `NotificationCard.tsx`, `useFriendRequests.ts` (solo lettura/riuso, non modificarne la firma) | subito |

**Controllo sulla base (Notifiche)**: `app-tabs.tsx` non ha nessun meccanismo di badge/contatore su nessuna
tab (verificare con un grep su "badge"/"count"/"unread" prima di iniziare — se già presente, fermarsi e
segnalarlo); `useNotifications()` espone `markedAsRead` per singola notifica ma nessun conteggio aggregato.
**Attenzione per N1**: `app-tabs.tsx` non è una tab bar semplice — `SideTabButton` ha già due `Animated.View`
sovrapposte in crossfade (icona piena/outline) più path SVG custom e blur. Il badge va aggiunto come overlay
accanto a queste, senza alterare le `Animated.View` esistenti.

**Verifica propria N1**: con almeno una notifica non letta, l'icona Notifiche in navbar mostra il numerino;
a zero non lette il badge non compare; nessuna altra tab ha un badge indesiderato.
**Scope corretto dopo revisione**: niente ramo "richiesta di amicizia accettabile/rifiutabile dalla
notifica" — verificato che nessun punto del backend crea mai una `Notification` con `notificationType:
'FRIENDSHIP'` (le richieste pendenti arrivano solo dalla query separata `friendRequests`, già mostrata in
una sezione propria di `notifications.tsx` fin da T24); quel ramo sarebbe codice morto, mai esercitabile.
T33 resta scoped a: notifica legata a lista/gruppo → naviga lì; notifica di sistema → solo espansione testo,
nessuna azione.

**Verifica propria N2**: una notifica legata a lista/gruppo naviga lì; una notifica di sistema si espande
mostrando il testo per intero, senza azioni che non ha.

### Pacchetto Amici (3 task, 3 foglie, **sequenza interna obbligata dopo N1**)

| Foglia | Task | File | Parte dopo |
|---|---|---|---|
| F1 | T34 | `friends.tsx` | subito |
| F2 | T35 | `app-tabs.tsx`, `(friends)/_layout.tsx`, `friend/[id].tsx`, `useFriendProfile.ts` | **N1 unito e verificato** (condivide `app-tabs.tsx`) |
| F3 | T37 poi T39 | `friend/[id].tsx`, `profile-stats-group.tsx`, `web/graphql/models/friendship/index.ts` (`FriendListRef` — oggi espone solo `id/name/icon/color/description/itemCount`, **nessun item**), `web/graphql/models/friendship/friendship.queries.ts` (`friendProfile`), `packages/graphql-schema/gql_crud/friendship/friendship.queries.ts` (`FRIEND_PROFILE`), `useFriendProfile.ts` (da estendere) | **F2 unito e verificato** (condivide `friend/[id].tsx`) |

**Controllo sulla base (Amici)**: `friends.tsx` ha un `Input` di ricerca sempre visibile in testa alla lista,
nessun `BottomSheet`/`+` per l'aggiunta; la tab Amici (`(friends)/_layout.tsx`) è uno `Stack` semplice senza
logica di reset sul ri-tap; `ProfileStatsGroup` renderizza ancora `ProfileDrawAcceptance` sia da solo sia in
confronto; ogni `ListCard` in `friend/[id].tsx` ha `onPress={() => {}}`.

**Controllo sulla base aggiuntivo per F3** (corretto dopo revisione — non è una verifica, è una costruzione
da zero): il resolver per gli item di una lista condivisa con un amico **non esiste**. `FriendListRef` (in
`friendship/index.ts`) espone solo i campi pubblici della lista, mai gli item; la query `list` esistente
(`list.queries.ts`) è scoped per owner (`where: { id, userId: ctx.userId }`) e non è riusabile per il profilo
di un amico. Serve un nuovo field (es. `items` su `FriendListRef`, filtrato `isHidden: false` sia a livello
di lista — già garantito da T13 — sia a livello di singolo item), esteso nel layer condiviso e nell'hook
mobile, poi **`npm run codegen`** in `packages/graphql-schema` prima di cablare `friend/[id].tsx`.

**Verifica propria F1**: la lista amici non mostra più un campo di ricerca fisso; un bottone `+` apre la
ricerca in una sheet, stessi risultati di prima.
**Verifica propria F2** (regola 18, rompere apposta): riprodurre il bug PRIMA della fix — aprire un profilo
amico, ritoccare "Amici" in navbar, verificare che non resetti — poi applicare la fix e confermare che resetta
sempre; verificare anche se l'errore "Couldn't load this profile" non compare più in questo flusso.
**Verifica propria F3**: la statistica di accettazione sorteggio non compare più né da solo né in confronto;
dal profilo amico, toccare una lista non nascosta mostra i suoi item non nascosti (nessun item nascosto
dell'amico deve comparire).

### Pacchetto Profilo (1 task, 1 foglia)

| Foglia | Task | File | Quando parte |
|---|---|---|---|
| P1 | T31 | `profile-stats-panel.tsx` | subito |

**Controllo sulla base (Profilo)**: `ProfileStatsPanel` (non `ProfileStatsGroup`, che è un componente diverso
per il confronto con l'amico, T27) renderizza oggi Lists/Completed/Friends come tre `StatRow` impilate
verticalmente con `Divider`.

**Precisazione sul layout** (ogni `StatRow` ha oggi icona+label+value+un `detail` opzionale, es. media item
per lista): il passaggio da colonna a riga deve mantenere tutti e quattro per blocco, solo riorientati in
verticale dentro ciascun blocco affiancato — non va tagliato nulla per far entrare i tre blocchi in riga.

**Verifica propria P1**: nel profilo personale, Lists/Completed/Friends compaiono affiancati sulla stessa
riga, non più in colonna; nessuna informazione (icona/label/value/detail) sparisce rispetto a prima.

### Pacchetto Impostazioni (4 task, 1 foglia)

| Foglia | Task | File | Quando parte |
|---|---|---|---|
| S1 | T40 poi T41 poi T48 poi T42 | `settings.tsx`, `web/graphql/models/membership/index.ts` (nuovo field resolver `endDate` su `MembershipRef`, stesso pattern di `activeSubscriptionsCount`), `web/graphql/models/membership/membership.queries.ts`, `packages/graphql-schema/gql_crud/membership/membership.queries.ts` (`MEMBERSHIP_FIELDS` deve richiedere anche `endDate`), `mobile/src/utils/useMembershipPlans.ts` (interfaccia `MembershipData` + hook), `components/ui/collapsible.tsx` (riuso, non modificare) | subito |

**Perché un'unica foglia con 4 task**: tutti e quattro toccano `settings.tsx`; separarli in foglie parallele
significherebbe quattro agenti sullo stesso file nello stesso momento. T40/T41/T48 sono piccoli e meccanici
(accordion, colore); l'ordine interno (collassare Email, poi Password, poi il colore cyan, infine la
scadenza piano) riduce il rischio che un intervento ne annulli un altro — **salvo T48 e T42, che agiscono
sullo stesso blocco JSX** (la `CardShell` "Payments" e la sua sheet, righe 186-229 di `settings.tsx`): non è
un rischio di collisione (una sola foglia, in sequenza), ma T42 lavora *sopra* quanto lasciato da T48 sullo
stesso blocco, non su una sezione "diversa" come invece vale per Email/Password.

**T42 — passo obbligatorio di codegen**: `endDate` appartiene a `Subscription`, non a `Membership` — non è
"gratis", va esposto come field resolver nuovo su `MembershipRef` in `index.ts`. Dopo aver esteso lo schema
backend e `MEMBERSHIP_FIELDS` nel layer condiviso, eseguire `npm run codegen` in `packages/graphql-schema`
(obbligatorio da CLAUDE.md dopo ogni modifica alle operation condivise) prima di toccare
`useMembershipPlans.ts` lato mobile — altrimenti i tipi generati non includono ancora il campo.

**Controllo sulla base (Impostazioni)**: `settings.tsx` ha Email/"Send code" e "Cambio password" come due
`CardShell` sempre espanse, stesso peso visivo; `components/ui/collapsible.tsx` esiste già (titolo + chevron
+ `FadeIn`) e va riusato, non ricostruito; la UI membership reale usa `colors.primary`, non `colors.accent`;
`Subscription.endDate` esiste già in `subscription.prisma` ma `myMembership` (in `membership.queries.ts`)
ritorna solo il `Membership`, non la subscription con la sua scadenza.

**Verifica propria S1**: Email e Cambio password sono collassate di default, con un'etichetta che spiega cosa
fanno; badge/card/bottoni legati a membership usano l'accent cyan; un utente con piano a scadenza vede la
data; il bottone payments ha un'etichetta che dice cosa fa (non più "Learn more" generico).

### Pacchetto Home (1 task, 1 foglia)

| Foglia | Task | File | Quando parte |
|---|---|---|---|
| H1 | T43 | `index.tsx` (home), `list-form.tsx`, `list.mutations.ts` (solo lettura del `code: 'LIMIT_REACHED'` già esistente, non modificare il resolver) | subito |

**Controllo sulla base (Home)**: `createList` lancia già un `GraphQLError` con `extensions.code:
'LIMIT_REACHED'` (T06, ondata 1); `list-form.tsx` oggi lo mostra come testo d'errore generico via
`setLocalError`.

**Verifica propria H1**: un utente al limite che tenta di creare una lista vede una `BottomSheet` dedicata con
un bottone verso la sheet piani di T07, non un testo d'errore grezzo; un utente sotto il limite crea
normalmente, nessuna regressione.

### Pacchetto Item (4 task, 2 foglie, **sequenza interna obbligata**)

| Foglia | Task | File | Parte dopo |
|---|---|---|---|
| I1 | T45 poi T46 | `ItemCard.tsx`, `ItemCardDetails.tsx`, `lucideIconRegistry.ts` (solo lettura di `getLucideIcon`, riuso — non `CategoryPickerSheet.tsx`, che lo importa ma non lo definisce), `useItemMutations.ts` | subito |
| I2 | T44 poi T47 | `ItemCardDetails.tsx`, `list/[id].tsx`, `useItemMutations.ts` (prop già presente, `isHidden` su `UpdateUserItemInput`) | **I1 unito e verificato** |

**Perché I1 prima di I2**: I1 è additivo (mostra un'icona che già esiste altrove, aggiunge `optimisticResponse`
a una mutation già presente) e a basso rischio di rompere la struttura del componente; I2 è strutturale
(nuovo toggle, nuovo punto d'ingresso "Pencil" che consolida editor già esistenti) e conviene scriverlo
**sopra** la versione di `ItemCardDetails.tsx` già aggiornata da I1, non in parallelo.

**T47 — esclusione esplicita**: l'area placeholder immagine (visibile a tutti, bloccata/lucchetto per chi non
ha il piano) **non entra in questa foglia**: dipende da T03, ancora in attesa. I2 copre solo l'icona Pencil
che apre una vista unica di modifica (nome/categoria/descrizione, riusando gli editor inline già esistenti).

**Controllo sulla base (Item)**: `ItemCard.tsx` mostra `category` come stringa, nessuna prop icona;
`ItemCardDetails.tsx` ha già `categoryOptions`/`categoryId` con `.icon` disponibile ma non lo usa nella riga
categoria; `updateMutation` in `useItemMutations.ts` non ha `optimisticResponse`; `UpdateUserItemInput` ha già
`isHidden?: boolean` ma nessuna prop/controllo lo espone in `ItemCardDetails.tsx`; non c'è nessuna icona
Pencil fra Tag e Trash in `headerActions`.

**Verifica propria I1**: l'icona di categoria compare anche nella card lista e nel dettaglio item, non solo
nel picker; cambiando lo stato di un item, il controllo cambia visivamente subito (non solo dopo la risposta
di rete) e torna indietro solo in caso di errore reale.
**Verifica propria I2**: un utente con piano abilitato può nascondere/mostrare un singolo item dal suo
dettaglio; un'icona Pencil fra Tag e Trash apre un'unica vista con nome/categoria/descrizione modificabili,
nessun placeholder immagine presente.

### Pacchetto Randomizzatore (1 task, 1 foglia)

| Foglia | Task | File | Quando parte |
|---|---|---|---|
| R1 | T49 | `mobile/src/utils/random.ts` (nuova funzione pura), `mobile/src/utils/useRandomizer.ts` (nuovo wrapper), `mobile/src/app/(app)/(tabs)/(home)/randomizer.tsx`, `mobile/src/components/randomizer/ModeGrid.tsx` (se serve) | subito |

**Controllo sulla base (Randomizzatore) — riscritto dopo l'incidente del 25/11/2026** (vedi «Incidente» in
fondo al file): il randomizzatore **non è più su GraphQL**. Una collega ha mosso tutto il calcolo lato
client in `random.ts` (`randomInt`, `drawUnique`, `randomNumbers`, `randomLetters`, `randomColors`,
`rollDice`), consumato da `useRandomizer.ts` (nessuna query/mutation, solo funzioni sincrone/async locali) —
il commento nel file lo dice esplicitamente: risultati "usa e getta", non serve il backend. I modi oggi sono
numbers/letters/colors/dice/bottle/coin (6, non 5): "coin" già riusa `generateNumbers(0,1,1)` lato client
come trucco, stesso spirito di quanto va fatto per "carta forbice pietra". **Nessun file in
`web/graphql/` o `packages/graphql-schema/` va toccato per questo task**, e non serve `npm run codegen`.

**Verifica propria R1**: dalla griglia del randomizzatore, una nuova card "Carta Forbice Pietra" produce un
risultato casuale fra le tre opzioni, stessa struttura griglia→stage delle altre modalità, nessuna modalità
esistente alterata.

---

## Integrazione

Chi unisce è il coordinatore, mai le foglie. Ordine:

1. **N1** — merge, riverifica. Poi **N2** — merge, riverifica (nessuna dipendenza da N1, ma dopo per tenere
   il pacchetto Notifiche compatto).
2. **F1** — merge, riverifica (nessuna dipendenza).
3. **F2** — lanciare solo ora (dipende da N1 unito) — merge, riverifica, incluso rompere apposta il bug di
   navigazione prima e dopo.
4. **F3** — lanciare solo ora (dipende da F2 unito) — merge, riverifica.
5. **P1** — merge, riverifica (indipendente, può avvenire in qualunque punto da qui in su).
6. **S1** — merge, riverifica.
7. **H1** — merge, riverifica.
8. **I1** — merge, riverifica.
9. **I2** — lanciare solo ora (dipende da I1 unito) — merge, riverifica.
10. **R1** — merge, riverifica.

Dopo ogni merge, rilanciare anche le verifiche dei pacchetti già uniti in precedenza che condividono area o
file (in particolare dopo F2/F3 su `app-tabs.tsx`/`friend/[id].tsx`, e dopo I2 su `ItemCardDetails.tsx`).

---

## Correzioni della revisione (25/11/2026)

Un revisore indipendente ha riletto questo piano prima del lancio (regola 17) e trovato:

**Bloccanti, corretti in questa versione**:
1. **S1/T42**: elenco file incompleto — `endDate` appartiene a `Subscription`, non a `Membership`, e non
   arriva al client "gratis". Mancavano `web/graphql/models/membership/index.ts` (nuovo field resolver),
   `packages/graphql-schema/gql_crud/membership/membership.queries.ts` (`MEMBERSHIP_FIELDS`) e
   `mobile/src/utils/useMembershipPlans.ts`, più il passo `npm run codegen`. Aggiunti tutti al mandato S1.
2. **F3/T39**: il "controllo sulla base" presupponeva un resolver esistente da verificare/filtrare; in realtà
   **non esiste** (`FriendListRef` non espone item, la query `list` è scoped per owner). Riscritto come
   costruzione da zero, con i file reali del layer backend+condiviso+hook aggiunti al mandato.
3. **R1/T49**: stesso schema di 1-2 — mancavano `packages/graphql-schema/gql_crud/randomizer/randomizer.queries.ts`
   e `mobile/src/utils/useRandomizer.ts`, più il passo di codegen. Aggiunti.

Difetto ripetuto 3 volte nello stesso modo (ogni foglia che introduce un campo/resolver backend nuovo citava
solo il resolver web, mai il layer condiviso `packages/graphql-schema/gql_crud/` né l'hook mobile né il
codegen) — da tenere a mente come promemoria per le prossime ondate: ogni task che tocca GraphQL va
controllato su tutta la catena, non solo sul resolver.

**Dubbi, risolti in questa versione**:
- **N2/T33**: il ramo "richiesta di amicizia accettabile/rifiutabile dalla notifica" sarebbe stato codice
  morto — nessuna `Notification` di tipo `FRIENDSHIP` viene mai creata dal backend. Tolto dallo scope di T33
  (scheda in `TODO.md` aggiornata); T33 resta su navigazione lista/gruppo ed espansione testo di sistema.
- **S1**: corretta la motivazione "ognuno tocca una sezione diversa" — falsa per T42/T48, che agiscono sullo
  stesso blocco "Payments"; non è un rischio (foglia unica, sequenziale) ma il testo ora lo dice chiaramente.
- **N1**: aggiunta un'avvertenza esplicita — `app-tabs.tsx` ha già `Animated.View` in crossfade per le icone;
  il badge va aggiunto accanto, non alterandole. Modello lasciato economico (regola 5 è sul compito, non sul
  file), ma il mandato ora lo dice.

**Osservazioni minori, applicate**: `getLucideIcon` corretto da `CategoryPickerSheet.tsx` (che lo importa) a
`lucideIconRegistry.ts` (dove è definito) nel mandato I1; `randomizer.queries.ts` ha 4 resolver per 5
modalità (bottle riusa `randomNumbers` lato client), precisato nel controllo-base R1; P1 ora specifica che
icona/label/value/detail di ogni `StatRow` vanno mantenuti nel passaggio a riga, non tagliati.

---

## Incidente — merge di una collega durante l'ondata (25/11/2026)

A metà lancio (8 foglie "subito" partite dal commit `19d847d`), una collega ha pushato lavoro su `main`
(commit `2541064` + merge `f4d4f07`) che tocca tra l'altro **l'intero randomizzatore**: `randomizer.tsx`,
`ModeGrid.tsx`, `useRandomizer.ts`, `NumberResults.tsx`, `LetterResults.tsx`, `ColorResults.tsx`,
`DiceResults.tsx`, `CustomFacesChip.tsx`, più file nuovi (`BottleSpinner.tsx`, `BottleNamesInput.tsx`,
`CoinResults.tsx`, `ParticipantsSheet.tsx`). Il cambio rilevante per questa ondata: **il randomizzatore non
passa più dal backend** — ogni modalità (numeri/lettere/colori/dadi/bottiglia/moneta) è calcolata sul device
in `mobile/src/utils/random.ts`.

**Effetto su R1 (T49)**: il mandato originale (nuovo resolver GraphQL + codegen) era scritto per
un'architettura che non esiste più. Riscritto per lo stesso pattern client-side già usato da "coin".

**Nessun'altra foglia tocca gli stessi file** del merge della collega (verificato: nessuna sovrapposizione
con `app-tabs.tsx`, `useNotifications.ts`, `friends.tsx`, `profile-stats-panel.tsx`, `settings.tsx`,
`index.tsx`/`list-form.tsx`, `ItemCard*.tsx`, `useItemMutations.ts` — tutti fuori dall'elenco di file
toccati dal merge), quindi nessun altro mandato va rivisto.

**Foglie morte per limite di sessione (tetto d'uso, non un errore di codice)**, nello stesso momento: N1,
P1, S1, R1, I1. Per ciascuna, prima di rilanciare, controllato lo spazio di lavoro (regola 13):
- **N1**: worktree con 8 righe di diff non committate (`app-tabs.tsx`, `useNotifications.ts`) — troppo
  piccole per valere la pena di trapiantarle fra worktree diversi; worktree rimosso, foglia rilanciata da
  zero.
- **P1, S1, R1, I1**: nessun worktree rimasto (erano morte prima di scrivere modifiche sostanziali — pulizia
  automatica di un worktree senza modifiche). Rilanciate da zero.

**Tutte le foglie rilanciate partono dal nuovo HEAD, `f4d4f07`** (non più `19d847d`) — la "versione di
partenza" dichiarata nel mandato originale non vale più, corretta regola 10. F1 e H1 (già consegnate,
commit `24c649d` e `d29ab20`, basate su `19d847d`) non toccano nessuno dei file del merge della collega:
verranno unite normalmente, nessuna necessità di rifarle.

**Secondo incidente — `git stash` è condiviso fra worktree, non isolato come i file**: durante il lancio,
R1 ha usato `git stash`/`git stash pop` per metterne via temporaneamente il proprio lavoro; lo stash è
risultato **globale al repository** (la lista è tenuta nel `.git` comune a tutti i worktree, non per-copia),
e il pop di R1 ha estratto lo stash di **un'altra foglia viva nello stesso momento** (S1 — i file coincidono
esattamente: `settings.tsx`, `profile.json`, `membership/membership.queries.ts`, `membership/index.ts`). R1
ha salvato il diff estraneo su file prima di scartarlo dalla propria copia (nessun danno al lavoro reale di
S1, che vive nel SUO worktree, non in quello di R1) e ha rifatto le proprie 4 modifiche da zero. **Nuovo
divieto per tutte le foglie future, oltre a quelli già in regola 14**: mai usare `git stash` (né `pop` né
`apply`) dentro una foglia isolata — è un comando che, come quelli già vietati, attraversa i confini del
worktree e può travolgere il lavoro di un fratello. Se serve "mettere via" del lavoro temporaneamente, usare
un commit locale (anche provvisorio, da amend/squash dopo) sul proprio branch, mai lo stash.

---

## Esito

*(da compilare a chiusura ondata)*
