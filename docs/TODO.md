# TODO.md — Randomix

> **Origine**: lista ricostruita dalla versione precedente di questo file (destrutturata, sezioni "COSE DA
> FARE" / "NOTIFICHE" / "AMICI" / "GRUPPI"). Riorganizzata il 19/11/2026 nel formato descritto in
> [`TODO-MODELLO.md`](TODO-MODELLO.md). I task `[FIX]` e `[TEST]` sono stati ricontrollati sul codice attuale
> (percorso in calce a ogni scheda); i `[TODO]` sono funzionalità mancanti dichiarate dall'utente, non difetti,
> quindi non richiedono una prova di bug. **Solo task certi**: nessuna voce della versione precedente è stata
> scartata; due voci duplicate sull'upload immagini item sono state unite in T03.
>
> **19/11/2026**: ondata 1 ([`ONDATA-1.md`](ONDATA-1.md), metodo in [`metodo-agenti/`](metodo-agenti/)) —
> **23 task chiusi** (vedi dettaglio nei riepiloghi sotto). Restano fuori T26 (🔍, in valutazione), T29 (⏸️,
> decisione del titolare), T08, T21, T25 (⏸️, rimandati — nessun brief per i tre redesign estetici, per ora) e
> T03 (⏸️, rimandato — le immagini item, upload e utilizzo, vanno valutate in un'ondata a parte). **T30** nato
> durante l'ondata 1 (trovato dalla foglia C4 mentre verificava T13), non ancora assegnato a nessuna ondata.
>
> **25/11/2026**: aggiunti **T31-T49** dai punti elencati in [`altri-errori.md`](altri-errori.md), **esclusa la
> sezione Gruppi** (in fase di analisi separata, su richiesta esplicita). Ogni scheda è stata verificata sul
> codice attuale prima di essere scritta (non trascritta alla lettera dalla wishlist): un punto della wishlist
> ("categoria lista obbligatoria, con *") risulta **già implementato** (`list-form.tsx`), quindi non ha
> generato un task nuovo; "randomizzatore della lista da rifare" è lo stesso T08 già presente, nessun duplicato.

---

## Prefazione: struttura e legenda

Il file ha: questa prefazione · la tabella riassuntiva · i riepiloghi (generati dalla tabella, da rigenerare
a mano quando cambia uno stato) · l'elenco delle schede.

### Checkbox

| Segno | Significato | Stato corrispondente |
|-------|-------------|----------------------|
| `[ ]` | da fare | ⏳, 🔄, 🔍 |
| `[x]` | fatto | ✅ |
| `[/]` | incompleto (iniziato, non finito) | 🧩 |
| `[!]` | problemi (bloccato o con errori da risolvere) | qualsiasi stato bloccato da un errore |
| `[?]` | in attesa di una decisione o di un dato dell'utente | ⏸️ |
| `[-]` | rimosso (non più necessario, con il motivo) | 🗑️ |

### Tipo

| Tipo | Significato |
|------|-------------|
| `[SEC]` | falla di sicurezza |
| `[FIX]` | difetto di logica o di dati |
| `[TODO]` | funzione o attività da realizzare |
| `[TEST]` | test o verifica da eseguire |
| `[OPS]` | configurazione, deploy, infrastruttura |
| `[DEC]` | decisione di business, fiscale o legale |
| `[CHORE]` | manutenzione del repository o delle dipendenze |
| `[DOC]` | documentazione |

### Stato

| Emoji | Stato | Quando |
|-------|-------|--------|
| ⏳ | da fare | pronto, nessuna decisione aperta |
| 🔄 | in corso | assegnato a una sessione di lavoro |
| 🔍 | da valutare | il problema è certo, la soluzione va scelta (la scheda elenca le opzioni) |
| ⏸️ | in attesa | di una decisione, di un dato o di un altro task (il motivo è fra parentesi) |
| 🧩 | da completare | iniziato, manca una parte dichiarata |
| 🧪 | da testare | fatto, manca la prova |
| ✅ | fatto | chiuso, con data e commit |
| 🗑️ | rimosso | con il motivo |

### Area

| Area | Comprende |
|------|-----------|
| 🎲 Randomizzatore | generatori numeri/lettere/colori/dadi, sorteggio da lista |
| 📋 Liste e item | liste, categorie, elementi, tag, anteprime |
| 👤 Profilo e statistiche | profilo utente, statistiche, aggiornamento in tempo reale |
| 🔔 Notifiche | notifiche di sistema e sociali |
| 🧑‍🤝‍🧑 Amici | ricerca, richieste, profilo amico |
| 👥 Gruppi | gruppi e sfide di gruppo |
| 💳 Membership e pagamenti | pacchetti, limiti, abbonamenti, immagini a pagamento |
| 🎨 UI/UX trasversale | componenti condivisi, feedback visivo, grafica generale |
| 🧭 Navigazione | tab bar e struttura di navigazione |

### Urgenza, rischio, effort

| | 🔴 | 🟡 | 🟢 |
|---|---|---|---|
| **Urgenza**: quanto presto va fatto | subito, prima del go-live | prima di attivare la funzione interessata | quando c'è tempo |
| **Rischio**: rischio dell'intervento (regressioni, dati, pagamenti) | tocca dati esistenti, schema o soldi | tocca un flusso importante, va testato bene | modifica circoscritta |
| **Effort**: lavoro stimato | più giorni | circa una giornata | qualche ora |

---

## Tabella riassuntiva

| ID | Titolo | File di riferimento | Breve descrizione | Stato | Urgenza | Rischio | Effort |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T01 | Dirty-check sui bottom sheet di salvataggio | [`BottomSheet.tsx`](../mobile/src/components/organisms/BottomSheet.tsx) | Il bottone salva resta attivo anche senza modifiche | ✅ | 🟢 | 🟢 | 🟡 |
| T02 | Recensioni visibili ai soli amici | [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx) | Manca la vista dei rating lasciati dagli amici su un item | ✅ | 🟡 | 🟡 | 🟡 |
| T03 | Upload immagini item legato al pacchetto | [`item-form.tsx`](../mobile/src/app/(app)/(tabs)/(home)/item-form.tsx) | Nessun campo immagine su item, né lato client né backend | ⏸️ | 🟢 | 🟡 | 🔴 |
| T04 | Estendere i pacchetti abbonamento con i fattori mancanti | [`MembershipFormModal.tsx`](../web/src/components/organisms/MembershipFormModal.tsx) | CRUD admin già esiste (prezzo, billing, maxLists, maxItemsPerList); mancano item nascosti/gruppi/ads/supporto (immagini escluse, rimandate a parte) | ✅ | 🟡 | 🟡 | 🟡 |
| T05 | Estendere la tipizzazione di `Membership.limitations` | [`membership/index.ts`](../web/graphql/models/membership/index.ts) | `limitations` è già tipizzato per maxLists/maxItemsPerList; va esteso ai fattori di T04 | ✅ | 🟡 | 🟡 | 🟢 |
| T06 | Enforcement dei limiti piano sui resolver | [`list.mutations.ts`](../web/graphql/models/list/list.mutations.ts) | Nessun controllo lato backend su `maxLists`/`maxItemsPerList`, già tipizzati e pronti all'uso | ✅ | 🟡 | 🔴 | 🟡 |
| T07 | Pagina utente per visualizzare/scegliere il pacchetto | [`settings.tsx`](../mobile/src/app/(app)/settings.tsx) | Solo placeholder "in arrivo"; manca anche una query pubblica sui piani (oggi solo `adminMemberships`) | ✅ | 🟢 | 🟡 | 🟡 |
| T08 | Randomizzatore liste da rifare (UI) | [`draw.tsx`](../mobile/src/app/(app)/(tabs)/(home)/draw.tsx), [`randomizer.tsx`](../mobile/src/app/(app)/(tabs)/(home)/randomizer.tsx) | UI attuale del sorteggio da lista giudicata da rifare, solo estetica (interazione invariata) | ⏸️ | 🟡 | 🟡 | 🔴 |
| T09 | Nome categorie non localizzato | [`categories.prisma`](../web/prisma/schema/categories.prisma) | `Category.name`/`ListCategory.name` sono stringhe fisse, senza traduzione | ✅ | 🟡 | 🔴 | 🟡 |
| T10 | Icone per singola categoria item | [`CategoryPickerSheet.tsx`](../mobile/src/components/organisms/CategoryPickerSheet.tsx) | Le categorie item non hanno un'icona dedicata | ✅ | 🟢 | 🟢 | 🟢 |
| T11 | Toast informativi su conferma/errore | — (trasversale, nessun componente toast esistente) | Azioni come l'aggiunta di un item non danno feedback visivo | ✅ | 🟡 | 🟢 | 🟡 |
| T12 | Icone mancanti per categorie lista | [`list-icons.ts`](../mobile/src/constants/list-icons.ts) | Non tutte le `ListCategory` hanno un'icona diversa | ✅ | 🟢 | 🟢 | 🟢 |
| T13 | Verificare "nascondi lista agli amici" | [`list.prisma`](../web/prisma/schema/list.prisma) | `List.isHidden` esiste, da confermare che il filtro funzioni end-to-end | ✅ | 🟢 | 🟢 | 🟢 |
| T14 | "Nascondi item agli amici" (gated da membership) | [`item.mutations.ts`](../web/graphql/models/item/item.mutations.ts) | `User_Item.isHidden` esiste e funziona già, ma senza controllo di piano | ✅ | 🟡 | 🟡 | 🟡 |
| T15 | Anteprima lista con conteggio item corretto | [`list-form.tsx`](../mobile/src/app/(app)/(tabs)/(home)/list-form.tsx) | In modifica lista l'anteprima non riflette il numero reale di item | ✅ | 🟡 | 🟢 | 🟢 |
| T16 | Abilitare la modifica di nome/categoria item | [`item-form.tsx`](../mobile/src/app/(app)/(tabs)/(home)/item-form.tsx), [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx) | `item-form` è solo creazione; nel bottom sheet dettaglio nome/categoria sono testo non editabile | ✅ | 🔴 | 🟡 | 🟡 |
| T17 | Rimuovere il sottotitolo "N liste · N item" | [`index.tsx`](../mobile/src/app/(app)/(tabs)/(home)/index.tsx), [`home.json`](../mobile/src/locales/en/home.json) | `statsSubtitle` nell'header della pagina Liste va tolto | ✅ | 🟢 | 🟢 | 🟢 |
| T18 | Statistiche profilo non si aggiornano senza re-login | [`useProfileStats.ts`](../mobile/src/utils/useProfileStats.ts) | Dopo creare item/lista le stat restano ferme, serve logout/login | ✅ | 🔴 | 🟡 | 🟡 |
| T19 | Refresh "accettazione sorteggio" non istantaneo | [`useListDraw.ts`](../mobile/src/utils/useListDraw.ts), [`useProfileStats.ts`](../mobile/src/utils/useProfileStats.ts) | Il profilo non si aggiorna in tempo reale dopo un'accettazione | ✅ | 🟡 | 🟡 | 🟡 |
| T20 | Icone profilo e amici identiche in navbar | [`app-tabs.tsx`](../mobile/src/components/app-tabs.tsx) | `SIDE_TAB_ICONS` usa `Users` sia per `profile` sia per `friends` | ✅ | 🟢 | 🟢 | 🟢 |
| T21 | Rifare l'estetica esterna dell'app (UX) | — (trasversale, tutto `mobile/src`) | Direzione grafica generale giudicata da rivedere | ⏸️ | 🟡 | 🟡 | 🔴 |
| T22 | Verificare completezza notifiche di sistema da admin | [`page.tsx`](../web/src/app/(admin)/dashboard/page.tsx) | Il pannello admin per notifiche di sistema esiste, da confermare completo | ✅ | 🔴 | 🟢 | 🟢 |
| T23 | Pagina notifiche utente vuota | [`notifications.tsx`](../mobile/src/app/(app)/(tabs)/notifications.tsx) | Mostra solo un testo "coming soon", nessun elenco reale | ✅ | 🔴 | 🟡 | 🔴 |
| T24 | Richieste di amicizia nella sezione notifiche | [`notifications.tsx`](../mobile/src/app/(app)/(tabs)/notifications.tsx), [`useFriendRequests.ts`](../mobile/src/utils/useFriendRequests.ts) | Le richieste di amicizia non compaiono fra le notifiche | ✅ | 🔴 | 🟡 | 🟡 |
| T25 | Rifare la grafica della sezione Amici | [`friends.tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friends.tsx) | Intera schermata Amici giudicata da rifare | ⏸️ | 🟡 | 🟡 | 🔴 |
| T26 | Mini card amici troppo ingombranti | [`FriendCard.tsx`](../mobile/src/components/cards/FriendCard.tsx) | Da decidere il nuovo formato (solo avatar+nome+ricerca o altro) | 🔍 | 🟡 | 🟢 | 🟡 |
| T27 | Ridisegnare il profilo amico (statistiche in accordion) | [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx) | Pagina attuale: solo header + elenco liste condivise, nessuna statistica | ✅ | 🟡 | 🟡 | 🔴 |
| T28 | Rimozione amico dalla pagina profilo amico | [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx) | La rimozione esiste solo dalla lista amici, non dal profilo singolo | ✅ | 🟢 | 🟢 | 🟢 |
| T29 | Decidere se includere i Gruppi nell'MVP | [`group.prisma`](../web/prisma/schema/group.prisma) | Da valutare mole di lavoro residua vs. rimando a post-MVP | ⏸️ | 🟡 | 🟢 | 🟢 |
| T30 | `myLists` non filtra le liste nascoste | [`group-list/[groupListId].tsx`](../mobile/src/app/(app)/(tabs)/(groups)/group-list/[groupListId].tsx) | Una lista `isHidden` può essere condivisa in un `GroupList` | ✅ | 🟡 | 🟡 | 🟢 |
| T31 | Statistiche profilo in riga, non in lista | [`profile-stats-panel.tsx`](../mobile/src/components/molecules/profile-stats-panel.tsx) | Lists/Completed/Friends sono tre righe impilate, non affiancate | ⏳ | 🟢 | 🟢 | 🟢 |
| T32 | Badge notifiche non lette in navbar | [`app-tabs.tsx`](../mobile/src/components/app-tabs.tsx) | Nessun contatore sulla tab Notifiche, nemmeno il meccanismo di base | ⏳ | 🟡 | 🟢 | 🟡 |
| T33 | Apertura/lettura estesa di una notifica (con azioni) | [`notifications.tsx`](../mobile/src/app/(app)/(tabs)/notifications.tsx) | Bloccato: il modello dati non supporta oggi notifiche legate a lista/gruppo | ⏸️ | 🟢 | 🟢 | 🟡 |
| T34 | Sistema di aggiunta amici (+ e BottomSheet) | [`friends.tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friends.tsx) | La ricerca è un campo sempre visibile in testa alla lista, non un + con sheet | ⏳ | 🟡 | 🟡 | 🟡 |
| T35 | Tab Amici non resetta sul profilo amico | [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx) | Ritoccare "Amici" in navbar non torna alla lista; a volte compare "Couldn't load this profile" | ⏳ | 🔴 | 🟡 | 🟡 |
| T36 | Header profilo amico: layout e nome troncato | [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx), [`PageHeader.tsx`](../mobile/src/components/molecules/PageHeader.tsx) | Serve "Rimuovi"/"Indietro" in space-between col nome; il nome nell'header non ha truncate | ⏸️ | 🟢 | 🟢 | 🟢 |
| T37 | Togliere "accettazione sorteggio" dalle statistiche amico | [`profile-stats-group.tsx`](../mobile/src/components/molecules/profile-stats-group.tsx) | La statistica compare ancora nel profilo amico e nel confronto | ⏳ | 🟢 | 🟢 | 🟢 |
| T38 | Sezione "Compare" profilo amico da rivedere | [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx) | Le due colonne del confronto mostrano le stesse identiche statistiche | 🔍 | 🟡 | 🟢 | 🟡 |
| T39 | Liste dell'amico non cliccabili | [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx) | `ListCard` ha `onPress={() => {}}`, nessuna vista degli item | ⏳ | 🟡 | 🟡 | 🟡 |
| T40 | Area Email/"Send code" poco chiara in Impostazioni | [`settings.tsx`](../mobile/src/app/(app)/settings.tsx) | Flusso OTP reale ma senza etichette/step, sempre espanso | ⏳ | 🟢 | 🟢 | 🟢 |
| T41 | Sezione "Cambio password" troppo in evidenza | [`settings.tsx`](../mobile/src/app/(app)/settings.tsx) | Stessa prominenza visiva di tutte le altre sezioni | ⏳ | 🟢 | 🟢 | 🟢 |
| T42 | Scadenza piano e CTA migliore in Payments | [`settings.tsx`](../mobile/src/app/(app)/settings.tsx), [`membership.queries.ts`](../web/graphql/models/membership/membership.queries.ts) | `Subscription.endDate` esiste ma non è mai esposto; CTA è un generico "Learn more" | ⏳ | 🟡 | 🟢 | 🟡 |
| T43 | Avviso limite raggiunto alla creazione lista | [`index.tsx`](../mobile/src/app/(app)/(tabs)/(home)/index.tsx), [`list-form.tsx`](../mobile/src/app/(app)/(tabs)/(home)/list-form.tsx) | L'errore `LIMIT_REACHED` del backend arriva come testo grezzo, nessuna BottomSheet/CTA | ⏳ | 🟡 | 🟢 | 🟡 |
| T44 | Nascondere un singolo item: manca il controllo in UI | [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx) | Il gate di T14 è solo backend; nessun toggle per l'utente | ⏳ | 🟡 | 🟢 | 🟡 |
| T45 | Icona categoria item non mostrata fuori dal picker | [`ItemCard.tsx`](../mobile/src/components/cards/ItemCard.tsx), [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx) | La card lista e il dettaglio item mostrano solo il nome testuale della categoria | ⏳ | 🟢 | 🟢 | 🟢 |
| T46 | Cambio di stato item percepito lento | [`useItemMutations.ts`](../mobile/src/utils/useItemMutations.ts) | Nessun `optimisticResponse`, l'UI aspetta il giro di rete completo | ⏳ | 🟡 | 🟡 | 🟡 |
| T47 | Pagina/flusso unico di modifica item | [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx) | Editing frammentato in micro-pencil separati, nessuna icona Pencil dedicata fra Tag e Trash | ⏳ | 🟡 | 🟡 | 🟡 |
| T48 | UI membership/upgrade deve usare l'accent Cyan | [`settings.tsx`](../mobile/src/app/(app)/settings.tsx) | La UI membership reale usa `primary`, non l'accent `colors.accent` già mockato in colors-showcase | ⏳ | 🟢 | 🟢 | 🟢 |
| T49 | Modalità "Carta Forbice Pietra" nel Randomizzatore | [`random.ts`](../mobile/src/utils/random.ts) | Il randomizzatore è ora tutto client-side (merge di una collega, 25/11/2026) — nessun backend da toccare | ⏳ | 🟢 | 🟢 | 🟢 |

---

### Riepilogo per stato

Conteggio sui 49 task della tabella (aggiornato al 25/11/2026).

| Stato | Task | Urgenza 🔴 · 🟡 · 🟢 | Quota |
|---|---:|---|---:|
| ✅ Fatti | 24 | 🔴 5 · 🟡 11 · 🟢 8 | 49% |
| ⏳ Da fare | 17 | 🔴 1 · 🟡 9 · 🟢 7 | 35% |
| 🔄 In corso | 0 | — | 0% |
| 🔍 Da valutare | 2 | 🔴 0 · 🟡 2 · 🟢 0 | 4% |
| ⏸️ In attesa | 6 | 🔴 0 · 🟡 4 · 🟢 2 | 12% |
| 🧩 Da completare | 0 | — | 0% |
| 🧪 Da testare | 0 | — | 0% |
| 🗑️ Rimossi | 0 | — | 0% |
| **Totale** | **49** | 🔴 6 · 🟡 25 · 🟢 18 | 100% |

**✅ Fatti (24)**
- Ondata 1 (23): T01, T02, T04, T05, T06, T07, T09, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20,
  T22, T23, T24, T27, T28 — chiusi il 19/11/2026, dettaglio pacchetti/foglie e commit in
  [`ONDATA-1.md`](ONDATA-1.md).
- Fuori ondata (1): T30 — nato durante l'ondata 1, chiuso il 19/11/2026 con un fix diretto (sotto soglia di
  delega, nessun agente lanciato).

**⏳ Da fare (17)**, aggiunti il 25/11/2026 da [`altri-errori.md`](altri-errori.md) (sezione Gruppi esclusa):
T31, T32, T33, T34, T35, T37, T39, T40, T41, T42, T43, T44, T45, T46, T47, T48, T49.

**🔍 Da valutare (2)**, per urgenza:
- 🔴: —
- 🟡: T26 (rimandato dall'utente il 19/11/2026, insieme a T25), T38 (decisione su quali statistiche mostrare
  nel confronto profilo amico, segnalata [DA-VALUTARE] nella fonte originale)
- 🟢: —

**⏸️ In attesa (6)**, per urgenza:
- 🔴: —
- 🟡: T08 (rimandato dall'utente il 19/11/2026 — niente brief per ora), T21 (rimandato dall'utente il
  19/11/2026 — niente brief per ora), T25 (rimandato dall'utente il 19/11/2026, insieme a T26), T29 (scelta
  o dato del titolare — mole di lavoro Gruppi)
- 🟢: T03 (rimandato dall'utente il 19/11/2026 — immagini item, upload e utilizzo, in un'ondata a parte),
  T36 (rimandato dall'utente il 25/11/2026 — richiede toccare `PageHeader.tsx` condiviso)

### Riepilogo per urgenza e rischio

Conteggio sui 49 task della tabella (aggiornato al 25/11/2026).

| | 🔴 | 🟡 | 🟢 | Totale |
|---|---|---|---|---|
| **Urgenza** | 6 | 25 | 18 | 49 |
| **Rischio** | 2 | 21 | 26 | 49 |

Incrocio urgenza × rischio (per l'urgenza 🔴 sono indicati anche gli id):

| Urgenza \ Rischio | Rischio 🔴 | Rischio 🟡 | Rischio 🟢 | Totale |
|---|---|---|---|---|
| **Urgenza 🔴** | **0** (—) | **5** (T16, T18, T23, T24, T35) | **1** (T22) | **6** |
| **Urgenza 🟡** | **2** | **14** | **9** | **25** |
| **Urgenza 🟢** | **0** | **2** | **16** | **18** |
| **Totale** | **2** | **21** | **26** | **49** |

---

## Elenco task

### T01
- [x] [TODO] Dirty-check sui bottom sheet di salvataggio
- 🏷️ Area: 🎨 UI/UX trasversale
- ✅ Fatto (ondata 1, pacchetto A, 19/11/2026 — meccanismo `62eb1ae`, applicazione `514e420`) · Urgenza 🟢 · Rischio 🟢 · Effort 🟡
- [`BottomSheet.tsx`](../mobile/src/components/organisms/BottomSheet.tsx), [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx), [`list-form.tsx`](../mobile/src/app/(app)/(tabs)/(home)/list-form.tsx)
- **Problema**: i bottom sheet che salvano modifiche (note/descrizione item, modifica lista, tag) non
  confrontano lo stato corrente con quello iniziale: il bottone salva resta sempre premibile.
  **Cosa fare**: tenere un valore iniziale di riferimento in ciascun form e disabilitare il bottone salva
  quando il valore corrente coincide con quello iniziale.
  **Fatto quando**: aprendo un bottom sheet di modifica senza cambiare nulla, il bottone salva risulta
  disabilitato.

### T02
- [x] [TODO] Recensioni visibili ai soli amici
- 🏷️ Area: 📋 Liste e item
- ✅ Fatto (ondata 1, pacchetto C, foglia C1, 19/11/2026, commit `ce3e566`) · Urgenza 🟡 · Rischio 🟡 · Effort 🟡
- [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx), [`rating.prisma`](../web/prisma/schema/rating.prisma), [`list/[id].tsx`](../mobile/src/app/(app)/(tabs)/(home)/list/[id].tsx) (è qui, non in `item-form.tsx`, che `ItemCardDetails` è montato e cablato alle mutation)
- **Problema**: nessun resolver o query espone le valutazioni lasciate dagli amici su un item; il bottom
  sheet dettaglio item mostra solo la valutazione dell'utente corrente.
  **Cosa fare**: query backend che, dato uno `User_Item`, ritorni i `Rating` degli amici (ACCEPTED) che
  hanno lo stesso item; sezione dedicata in `ItemCardDetails.tsx`, visibile solo se ce ne sono.
  **Fatto quando**: aprendo un item con almeno un amico che lo ha valutato, le sue recensioni compaiono nel
  dettaglio; se nessun amico lo ha valutato, la sezione non appare.

### T03
- [ ] [TODO] Upload immagini item legato al pacchetto
- 🏷️ Area: 📋 Liste e item · 💳 Membership e pagamenti
- ⏸️ In attesa (rimandato dall'utente il 19/11/2026 — i task sulle immagini item (upload e utilizzo) vanno
  valutati in un'ondata a parte; escluso dall'ondata 1) · Urgenza 🟢 · Rischio 🟡 · Effort 🔴
- [`item-form.tsx`](../mobile/src/app/(app)/(tabs)/(home)/item-form.tsx), [`item.prisma`](../web/prisma/schema/item.prisma)
- **Problema**: `User_Item` non ha un campo immagine; l'upload va abilitato solo per i pacchetti che lo
  prevedono (vedi T04/T05), quindi non è realizzabile prima che i pacchetti siano definiti.
  **Cosa fare**: campo immagine su `User_Item` (storage da scegliere), bottone upload in `item-form.tsx`
  visibile solo se il piano dell'utente lo consente, validazione dimensione/formato lato backend.
  **Fatto quando**: un utente con pacchetto abilitato può caricare un'immagine su un item e vederla nella
  card/dettaglio; un utente senza il pacchetto non vede il bottone.

### T04
- [x] [TODO] Estendere i pacchetti abbonamento con i fattori mancanti
- 🏷️ Area: 💳 Membership e pagamenti
- ✅ Fatto (ondata 1, pacchetto B, foglia B1, 19/11/2026, commit `f8da768`) · Urgenza 🟡 · Rischio 🟡 · Effort 🟡
- [`MembershipFormModal.tsx`](../web/src/components/organisms/MembershipFormModal.tsx), [`adminMembership.mutations.ts`](../web/graphql/models/membership/adminMembership.mutations.ts), [`membership.prisma`](../web/prisma/schema/membership.prisma)
- **Problema**: ricontrollato sul codice — l'admin ha già un CRUD completo sui pacchetti
  (`dashboard/memberships/page.tsx` + `MembershipFormModal.tsx`), con prezzo, billing, `maxLists` e
  `maxItemsPerList`. Mancano ancora i fattori elencati nella wishlist originale: nascondere item alle
  persone (on/off), n° gruppi creabili, n° gruppi a cui poter partecipare, ads in app (on/off), priorità
  supporto cliente (basso/medio/alto). **Escluso da questo task**: "inserimento immagini in item (on/off)"
  — rimandato dall'utente il 19/11/2026 insieme a T03, va valutato in un'ondata a parte dedicata alle
  immagini.
  **Cosa fare**: aggiungere i campi mancanti a `MembershipInput` (in `adminMembership.mutations.ts`) e al
  form `MembershipFormModal.tsx`, seguendo lo stesso pattern già usato per `maxLists`/`maxItemsPerList`.
  **Fatto quando**: un admin può impostare anche item nascosti/gruppi/ads/supporto per ciascun piano, non
  solo liste e item (il toggle immagini resta fuori, vedi sopra).
  **Consegnato**: nuovi campi `hideItemsEnabled`, `maxGroupsCreatable`, `maxGroupsJoinable`, `showAds`,
  `supportPriority` su `MembershipInput`/form admin, stesso pattern di `maxLists`/`maxItemsPerList`.

### T05
- [x] [TODO] Estendere la tipizzazione di `Membership.limitations`
- 🏷️ Area: 💳 Membership e pagamenti
- ✅ Fatto (ondata 1, pacchetto B, foglia B1, 19/11/2026, commit `f8da768` — stesso intervento di T04) · Urgenza 🟡 · Rischio 🟡 · Effort 🟢
- [`membership/index.ts`](../web/graphql/models/membership/index.ts) (interfaccia `MembershipLimitations`,
  commento "STEP 7"), [`adminMembership.mutations.ts`](../web/graphql/models/membership/adminMembership.mutations.ts) (`buildLimitations()`)
- **Problema**: ricontrollato sul codice — `limitations` **non** è più JSON libero: ha già una forma fissa e
  tipizzata (interfaccia `MembershipLimitations { maxLists, maxItemsPerList }`, usata sia in lettura sia in
  scrittura). Non è tipizzata per i fattori extra di T04, che oggi non hanno posto nello schema.
  **Cosa fare**: estendere `MembershipLimitations`, `MembershipInput` e `buildLimitations()` con i nuovi
  campi definiti in T04, mantenendo la stessa convenzione (`null`/assente = illimitato o disabilitato).
  **Fatto quando**: `limitations` espone e accetta anche i fattori extra con la stessa tipizzazione esplicita
  già in uso per `maxLists`/`maxItemsPerList`.

### T06
- [x] [TODO] Enforcement dei limiti piano sui resolver
- 🏷️ Area: 💳 Membership e pagamenti
- ✅ Fatto (ondata 1, pacchetto B, foglia B2, 19/11/2026, commit `f393a22`) · Urgenza 🟡 · Rischio 🔴 · Effort 🟡
- [`list.mutations.ts`](../web/graphql/models/list/list.mutations.ts), [`item.mutations.ts`](../web/graphql/models/item/item.mutations.ts), [`group.mutations.ts`](../web/graphql/models/group/group.mutations.ts), [`membership/limitations.ts`](../web/graphql/models/membership/limitations.ts) (nuovo helper `getActiveMembership`)
- **Problema**: ricontrollato sul codice — la creazione di liste e item non legge mai il piano dell'utente
  né `Membership.limitations`: nessun limite è applicato oggi.
  **Cosa fare**:
  - fase 1 (sbloccabile subito, `maxLists`/`maxItemsPerList` già tipizzati da T05): nei resolver di
    creazione lista/item, leggere la subscription attiva dell'utente e il relativo `Membership`, rifiutare
    (o congelare, per la logica free/plus) quando il limite è superato;
  - fase 2 (dopo T04/T05 estesi): stesso controllo per i fattori extra (item nascosti, gruppi, ads,
    supporto — le immagini sono fuori, vedi T04).
  **Fatto quando**: un utente FREE non può superare `maxLists`/`maxItemsPerList` del proprio pacchetto;
  superato il limite riceve un errore GraphQL leggibile, non un 500 generico.
  **Consegnato**: helper riusabile `getActiveMembership(userId)` (fallback a 3 livelli: subscription attiva
  → piano FREE di default → tutto a zero se nessuno dei due); enforcement su `maxLists` (createList),
  `maxItemsPerList` (addItemToList), `maxGroupsCreatable` (createGroup), `maxGroupsJoinable`
  (acceptGroupInvite). `showAds`/`supportPriority` restano informativi, nessun enforcement (non hanno un
  punto d'uso lato backend).

### T07
- [x] [TODO] Pagina utente per visualizzare/scegliere il pacchetto
- 🏷️ Area: 💳 Membership e pagamenti
- ✅ Fatto (ondata 1, pacchetto B, foglia B3, 19/11/2026, commit `e9b3de9`) · Urgenza 🟢 · Rischio 🟡 · Effort 🟡
- [`settings.tsx`](../mobile/src/app/(app)/settings.tsx), [`membership.queries.ts`](../web/graphql/models/membership/membership.queries.ts) (nuove query pubbliche `membershipPlans`/`myMembership`)
- **Problema**: il bottone pagamenti in Impostazioni apre un bottom sheet con solo testo placeholder "in
  arrivo". Ricontrollato sul codice: non esiste nemmeno una query lato utente per leggere i piani —
  `adminMemberships` richiede permessi admin, quindi non è riusabile così com'è da mobile.
  **Cosa fare**: nuova query pubblica (es. `membershipPlans`, senza `requireAdmin`) che espone i piani attivi
  (prezzo, billing, limiti); schermata che li elenca con il piano attuale dell'utente evidenziato.
  L'azione di sottoscrizione/cambio piano vera e propria (pagamento in-app, `Subscription`/`Payment`) resta
  fuori da questo task: è la Fase 4 "Monetizzazione" di `ROADMAP.md`, non ancora iniziata.
  **Fatto quando**: un utente vede i pacchetti disponibili con prezzo e limiti, con il proprio piano attuale
  evidenziato (la scelta/acquisto resta un placeholder finché la Fase 4 non è attiva).
  **Consegnato**: query `membershipPlans` (elenco piani attivi) e `myMembership` (piano corrente via
  `Subscription` ACTIVE più recente, `null` = FREE implicito); sheet pagamenti in `settings.tsx` mostra
  l'elenco con badge "Il tuo piano"; azione di cambio piano disabilitata/placeholder.

### T08
- [ ] [TODO] Randomizzatore liste da rifare (UI)
- 🏷️ Area: 🎲 Randomizzatore
- ⏸️ In attesa (rimandato dall'utente il 19/11/2026 — niente brief per ora; escluso dall'ondata 1) · Urgenza 🟡 · Rischio 🟡 · Effort 🔴
- [`draw.tsx`](../mobile/src/app/(app)/(tabs)/(home)/draw.tsx), [`randomizer.tsx`](../mobile/src/app/(app)/(tabs)/(home)/randomizer.tsx), [`useListDraw.ts`](../mobile/src/utils/useListDraw.ts)
- **Problema**: la UI attuale del sorteggio da lista è giudicata da rifare interamente (nessun dettaglio di
  design fornito finora). Scope confermato dall'utente: **solo estetico**, l'interazione rigenera/accetta
  (`drawFromList`/`acceptDraw`) non cambia.
  **Cosa fare**: nuova interfaccia per `draw.tsx`, da definire con l'utente prima dell'implementazione — solo
  la veste visiva, la logica di rigenera/accetta resta quella attuale.
  **Fatto quando**: nuova UI approvata dall'utente e funzionante con `drawFromList`/`acceptDraw` esistenti,
  invariati.

### T09
- [x] [FIX] Nome categorie non localizzato
- 🏷️ Area: 📋 Liste e item
- ✅ Fatto (ondata 1, pacchetto C, foglia C2, 19/11/2026, commit `8cc9f45` + fix `6730e65` — migrazione
  applicata, 33 Category/23 ListCategory invariate) · Urgenza 🟡 · Rischio 🔴 · Effort 🟡
- [`categories.prisma`](../web/prisma/schema/categories.prisma), [`listCategory.prisma`](../web/prisma/schema/listCategory.prisma), [`CategoryFormModal.tsx`](../web/src/components/organisms/CategoryFormModal.tsx), [`ListCategoryFormModal.tsx`](../web/src/components/organisms/ListCategoryFormModal.tsx)
- **Problema**: confermato sul codice — `Category.name` e `ListCategory.name` sono stringhe libere senza
  traduzione ("testo mostrato direttamente, nessuna chiave i18n" riportato nel commento del modello); restano
  fisse in italiano indipendentemente dalla lingua dell'app. Le categorie sono inoltre gestite **dinamicamente**
  da admin (`CategoryFormModal.tsx`/`ListCategoryFormModal.tsx`, CRUD via GraphQL), quindi una chiave i18n
  risolta da file `locales/` statici (compilati nell'app) non è percorribile: richiederebbe un redeploy ogni
  volta che l'admin crea una categoria. L'app oggi ha comunque una sola lingua attiva (EN, `mobile/src/lib/i18n.ts`
  con `lng: 'en'` fisso) — il cambio lingua è previsto solo in futuro.
  **Cosa fare**: aggiungere un campo `translations Json?` (es. `{ en: "...", it: "..." }`) a `Category` e
  `ListCategory`, con fallback al `name` esistente quando la lingua richiesta manca; estendere i form admin
  con un campo di traduzione per lingua supportata (oggi solo EN); mobile/web risolvono il nome leggendo
  `translations[locale] ?? name`.
  **Fatto quando**: un admin può impostare la traduzione di una categoria per ogni lingua supportata, e l'app
  mostra quella corrispondente alla lingua attiva (oggi solo EN, pronta per aggiungerne altre).
  **Consegnato**: campo `translations Json?` su entrambi i model, campo `nameEn` esposto/accettato via
  GraphQL, resolver mobile con fallback `nameEn ?? name`, form admin estesi, migrazione (`prisma db push` +
  `generate`) applicata al DB reale senza perdita di righe.

### T10
- [x] [TODO] Icone per singola categoria item
- 🏷️ Area: 📋 Liste e item
- ✅ Fatto (ondata 1, pacchetto C, foglia C3, 19/11/2026, commit `fa603ad`) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`CategoryPickerSheet.tsx`](../mobile/src/components/organisms/CategoryPickerSheet.tsx), [`categories.prisma`](../web/prisma/schema/categories.prisma)
- **Problema**: `Category` ha un campo `icon`, ma le singole categorie item non mostrano un'icona
  differenziata nell'interfaccia di scelta.
  **Cosa fare**: mostrare l'icona di ogni `Category` nel picker, come già avviene per `ListCategory`.
  **Fatto quando**: ogni categoria item nel picker mostra un'icona propria, non un segnaposto comune.

### T11
- [x] [TODO] Toast informativi su conferma/errore
- 🏷️ Area: 🎨 UI/UX trasversale
- ✅ Fatto (ondata 1, pacchetto A, foglia A2, 19/11/2026, commit `70d68ce`) · Urgenza 🟡 · Rischio 🟢 · Effort 🟡
- [`Toast.tsx`](../mobile/src/components/molecules/Toast.tsx), [`useToast.tsx`](../mobile/src/utils/useToast.tsx)
- **Problema**: azioni come l'aggiunta di un item, la creazione di una lista o un errore di rete non danno
  nessun feedback visivo transitorio.
  **Cosa fare**: componente toast riusabile (varianti successo/errore/info) in `components/molecules/` o
  `organisms/`, agganciato alle mutation principali (item, lista, tag, rating, amici).
  **Fatto quando**: un'azione di salvataggio o un errore mostra un toast coerente con lo stile dell'app, che
  sparisce da solo.
  **Consegnato**: componente `Toast.tsx` (successo/errore/info, auto-dismiss) + `ToastProvider`/`useToast()`
  montato in `app/_layout.tsx`. Non ancora agganciato alle mutation esistenti (mutation-per-mutation è lavoro
  futuro, il componente è pronto all'uso).

### T12
- [x] [TODO] Icone mancanti per categorie lista
- 🏷️ Area: 📋 Liste e item
- ✅ Fatto (ondata 1, pacchetto C, foglia C3, 19/11/2026 — verificato sul DB reale, nessuna modifica
  necessaria: 23/23 `ListCategory` hanno già un'icona distinta) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`list-icons.ts`](../mobile/src/constants/list-icons.ts), [`listCategory.prisma`](../web/prisma/schema/listCategory.prisma)
- **Problema**: non tutte le `ListCategory` seedate hanno un'icona distinta (alcune condividono lo stesso
  simbolo).
  **Cosa fare**: completare il mapping in `list-icons.ts` (o il campo `icon` lato seed) con un'icona univoca
  per ogni macro-categoria.
  **Fatto quando**: ogni `ListCategory` mostra un'icona diversa dalle altre nella UI di scelta lista.
  **Consegnato**: nessun intervento necessario — query diretta sul DB (19/11/2026) conferma 23 `ListCategory`
  con 23 icone distinte. Il problema originale non è più presente nei dati.

### T13
- [x] [TEST] Verificare "nascondi lista agli amici"
- 🏷️ Area: 📋 Liste e item
- ✅ Fatto (ondata 1, pacchetto C, foglia C4, 19/11/2026 — solo verifica, nessun commit; ha portato alla
  scoperta di T30) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`list.prisma`](../web/prisma/schema/list.prisma) (`isHidden Boolean @default(false)`)
- **Problema**: il campo esiste ed è già filtrato lato `friendProfile` (liste `isHidden=false` per il
  profilo amico), ma non risulta una verifica end-to-end dedicata.
  **Cosa fare**: test manuale/E2E — creare una lista nascosta, verificare che non compaia nel profilo
  dell'amico né nelle liste condivisibili in un gruppo.
  **Fatto quando**: una lista con `isHidden=true` non è visibile da nessun punto dell'app lato amico.
  **Consegnato**: `friendProfile` filtra correttamente (`isHidden: false`) — confermato. Il resolver `myLists`
  invece **non** filtra, e viene usato per scegliere le liste da condividere in un `GroupList`: difetto reale,
  fuori scope per questa foglia, tracciato come **T30**.

### T14
- [x] [TODO] "Nascondi item agli amici" (gated da membership)
- 🏷️ Area: 📋 Liste e item · 💳 Membership e pagamenti
- ✅ Fatto (ondata 1, pacchetto B, foglia B4, 19/11/2026, commit `dd31a42`) · Urgenza 🟡 · Rischio 🟡 · Effort 🟡
- [`item.prisma`](../web/prisma/schema/item.prisma) (`User_Item.isHidden`, riga 70), [`item.mutations.ts`](../web/graphql/models/item/item.mutations.ts) (`updateUserItem`, `checkHideItemsEnabled`)
- **Problema**: corretto dopo revisione — ricontrollando il codice, `User_Item.isHidden` **esiste già** (non
  manca, come scritto nella prima stesura di questa scheda) e `updateUserItem` lo legge/scrive già
  (`...(input.isHidden != null && { isHidden: input.isHidden })`). Il campo è funzionante ma **senza alcun
  controllo di piano**: oggi qualunque utente, su qualunque pacchetto, può già nascondere un proprio item.
  **Cosa fare**: aggiungere in `updateUserItem` un controllo che rifiuti (o ignori) `isHidden: true` se il
  piano dell'utente non lo consente; riusare l'helper di lettura piano/limiti introdotto in T06, invece di
  duplicarlo.
  **Fatto quando**: un utente senza il pacchetto giusto non può impostare `isHidden: true` (richiesta
  rifiutata con errore leggibile); un utente con pacchetto abilitato continua a funzionare come oggi.
  **Consegnato**: `checkHideItemsEnabled(userId)` riusa `getActiveMembership` di B2, chiamato solo quando
  `input.isHidden === true`; nascondere (`false`) non è mai bloccato.

### T15
- [x] [TODO] Anteprima lista con conteggio item corretto
- 🏷️ Area: 📋 Liste e item
- ✅ Fatto (ondata 1, pacchetto C, foglia C5, 19/11/2026, commit `0da39b5`) · Urgenza 🟡 · Rischio 🟢 · Effort 🟢
- [`list-form.tsx`](../mobile/src/app/(app)/(tabs)/(home)/list-form.tsx)
- **Problema**: in modifica lista, l'anteprima non mostra il numero reale di item contenuti. La freccia
  dell'anteprima è voluta così: presente ma non interattiva (l'anteprima non è cliccabile), non è un difetto.
  **Cosa fare**: collegare l'anteprima al conteggio reale degli `User_Item` della lista. Non toccare la
  freccia: resta solo visiva.
  **Fatto quando**: l'anteprima in modifica lista mostra lo stesso numero di item della pagina lista.

### T16
- [x] [FIX] Abilitare la modifica di nome/categoria item
- 🏷️ Area: 📋 Liste e item
- ✅ Fatto (ondata 1, pacchetto C, foglia C1, 19/11/2026, commit `ce3e566` + fix integrazione `330b467`) · Urgenza 🔴 · Rischio 🟡 · Effort 🟡
- [`item-form.tsx`](../mobile/src/app/(app)/(tabs)/(home)/item-form.tsx) (commento: "Schermata di sola
  creazione item... ogni modifica successiva avviene nel bottomsheet ItemCardDetails, non qui"),
  [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx) (categoria mostrata come
  `Text` non editabile), [`list/[id].tsx`](../mobile/src/app/(app)/(tabs)/(home)/list/[id].tsx) (è qui che
  `ItemCardDetails` è montato e cablato a `updateUserItem`/`removeItemFromList`/`rateItem`: la modifica va
  agganciata in questo file, `item-form.tsx` non c'entra)
- **Problema**: confermato sul codice — non esiste alcun punto dell'app in cui un utente possa correggere
  nome o categoria di un item già creato.
  **Cosa fare**: estendere `ItemCardDetails.tsx` con campi editabili per nome e categoria (riusando
  `CategoryPickerSheet`), cablati in `list/[id].tsx` alla mutation `updateUserItem` già importata lì.
  **Fatto quando**: da un item esistente è possibile cambiare nome e categoria e vederli aggiornati nella
  lista.

### T17
- [x] [TODO] Rimuovere il sottotitolo "N liste · N item"
- 🏷️ Area: 👤 Profilo e statistiche
- ✅ Fatto (ondata 1, pacchetto D, foglia D2, 19/11/2026, commit `0fd0a41`) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`index.tsx`](../mobile/src/app/(app)/(tabs)/(home)/index.tsx) (prop `subtitle` di `PageHeader`,
  `t('statsSubtitle', ...)`), [`home.json`](../mobile/src/locales/en/home.json) (chiave `statsSubtitle`)
- **Problema**: la pagina Liste mostra nell'header un sottotitolo con conteggio liste/item, segnalato come
  da togliere.
  **Cosa fare**: rimuovere la prop `subtitle` dalla `PageHeader` in `index.tsx` (ed eventualmente la chiave
  `statsSubtitle` se non più usata altrove).
  **Fatto quando**: la pagina Liste non mostra più il conteggio nel sottotitolo.

### T18
- [x] [FIX] Statistiche profilo non si aggiornano senza re-login
- 🏷️ Area: 👤 Profilo e statistiche
- ✅ Fatto (ondata 1, pacchetto D, foglia D1, 19/11/2026, commit `f5d5ff3`) · Urgenza 🔴 · Rischio 🟡 · Effort 🟡
- [`useProfileStats.ts`](../mobile/src/utils/useProfileStats.ts) (`fetchPolicy: 'cache-and-network'`, query
  pura, nessuna mutation da cui agganciarsi), [`useListMutations.ts`](../mobile/src/utils/useListMutations.ts)
  (`CREATE_LIST` ha già `refetchQueries: ['MyLists']`, manca `'ProfileStats'`),
  [`useItemMutations.ts`](../mobile/src/utils/useItemMutations.ts) (`ADD_ITEM_TO_LIST` ha già
  `refetchQueries: ['ListDetail']`, manca `'ProfileStats'`)
- **Problema**: alla creazione di nuovi item/liste le statistiche di profilo non si aggiornano; ricaricando
  la pagina l'app smette di caricare, costringendo l'utente a logout/login. Corretto dopo revisione: la
  fix non va in `useProfileStats.ts` (è sola query) ma nelle mutation di creazione, che oggi fanno già
  `refetchQueries` mirati per altre query (`MyLists`, `ListDetail`) — manca solo aggiungere `'ProfileStats'`
  all'elenco.
  **Cosa fare**: aggiungere `'ProfileStats'` a `refetchQueries` di `CREATE_LIST` (in `useListMutations.ts`) e
  di `ADD_ITEM_TO_LIST` (in `useItemMutations.ts`). Indagare separatamente il blocco di caricamento al
  refresh (probabile errore non gestito, non solo cache stantia).
  **Fatto quando**: dopo aver creato un item o una lista, le statistiche di profilo si aggiornano senza
  bisogno di refresh o re-login.
  **Nota aperta**: il blocco di caricamento dell'intera pagina Profilo al refresh non è stato risolto in
  questa ondata — indiziato ma non confermato un errore non gestito su `useProfile`/`useMyFriends`; non
  bloccante per chiudere T18 (il sintomo principale, refetch mancante, è risolto).

### T19
- [x] [FIX] Refresh "accettazione sorteggio" non istantaneo
- 🏷️ Area: 👤 Profilo e statistiche · 🎲 Randomizzatore
- ✅ Fatto (ondata 1, pacchetto D, foglia D1, 19/11/2026, commit `f5d5ff3` — stessa causa di T18) · Urgenza 🟡 · Rischio 🟡 · Effort 🟡
- [`useListDraw.ts`](../mobile/src/utils/useListDraw.ts) (`ACCEPT_DRAW` non ha nessun `refetchQueries`, confermato)
- **Problema**: dopo `acceptDraw`, il profilo (in particolare `drawAcceptance`) non si aggiorna in tempo
  reale.
  **Cosa fare**: aggiungere `refetchQueries: ['ProfileStats']` ad `ACCEPT_DRAW` in `useListDraw.ts`, stesso
  pattern di T18.
  **Fatto quando**: dopo un'accettazione di sorteggio, le statistiche di profilo cambiano senza azioni
  manuali dell'utente.

### T20
- [x] [FIX] Icone profilo e amici identiche in navbar
- 🏷️ Area: 🧭 Navigazione
- ✅ Fatto (ondata 1, pacchetto A, foglia A3, 19/11/2026, commit `e71f062`) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`app-tabs.tsx`](../mobile/src/components/app-tabs.tsx) (`SIDE_TAB_ICONS`, righe 37-42: `profile: Users` e
  `friends: Users` — stessa icona Lucide)
- **Problema**: confermato sul codice — le tab Profilo e Amici usano la stessa icona (`Users`), rendendole
  indistinguibili a colpo d'occhio.
  **Cosa fare**: assegnare un'icona Lucide diversa a una delle due tab (es. `UserRound` per il profilo).
  **Fatto quando**: le icone di Profilo e Amici nella tab bar sono visivamente distinte.
  **Consegnato**: `profile` → `UserRound`, `friends` resta `Users`.

### T21
- [ ] [TODO] Rifare l'estetica esterna dell'app (UX)
- 🏷️ Area: 🎨 UI/UX trasversale
- ⏸️ In attesa (rimandato dall'utente il 19/11/2026 — niente brief per ora; escluso dall'ondata 1) · Urgenza 🟡 · Rischio 🟡 · Effort 🔴
- — (trasversale, nessun file specifico: riguarda la direzione grafica generale di `mobile/src`)
- **Problema**: la direzione grafica generale dell'app è segnalata come da rifare, senza indicazioni di
  dettaglio.
  **Cosa fare**: da definire con l'utente (riferimenti visivi, schermate prioritarie) prima di aprire questo
  task; non procedere senza un brief più preciso, per non "improvvisare" un redesign non richiesto.
  **Fatto quando**: direzione grafica approvata dall'utente e applicata alle schermate concordate.

### T22
- [x] [TEST] Verificare completezza notifiche di sistema da admin
- 🏷️ Area: 🔔 Notifiche
- ✅ Fatto (ondata 1, pacchetto E, foglia E2, 19/11/2026 — solo verifica, nessun commit) · Urgenza 🔴 · Rischio 🟢 · Effort 🟢
- [`page.tsx`](../web/src/app/(admin)/dashboard/page.tsx), [`notifications/page.tsx`](../web/src/app/(admin)/dashboard/notifications/page.tsx), [`adminNotification.mutations.ts`](../web/graphql/models/notification/adminNotification.mutations.ts)
- **Problema**: l'invio di notifiche di sistema da pannello admin risulta presente, ma non ne è stata
  verificata la completezza funzionale.
  **Cosa fare**: test manuale — invio di una notifica di sistema dall'admin, conferma che arrivi e sia
  leggibile lato mobile (T23).
  **Fatto quando**: una notifica di sistema inviata da admin compare correttamente nella pagina notifiche
  utente.
  **Consegnato**: verificata end-to-end — UI admin reale (non uno script), mutation `adminSendBroadcastNotification`
  protetta da `requireAdmin`, crea righe `Notification` con `notificationType: SYSTEM`, `markedAsRead: false`
  per ogni utente. Nessun difetto trovato, nessuna modifica necessaria.

### T23
- [x] [TODO] Pagina notifiche utente vuota
- 🏷️ Area: 🔔 Notifiche
- ✅ Fatto (ondata 1, pacchetto E, foglia E1, 19/11/2026, commit `dc89d69`) · Urgenza 🔴 · Rischio 🟡 · Effort 🔴
- [`notifications.tsx`](../mobile/src/app/(app)/(tabs)/notifications.tsx), [`useNotifications.ts`](../mobile/src/utils/useNotifications.ts), [`notification.queries.ts`](../web/graphql/models/notification/notification.queries.ts)
- **Problema**: confermato sul codice — la schermata notifiche non legge né mostra alcuna `Notification`
  reale.
  **Cosa fare**: hook `useNotifications` (query `Notification` dell'utente), lista con componente
  `NotificationCard` (già esistente in `components/cards/NotificationCard.tsx`), segna-come-letta.
  **Fatto quando**: le notifiche ricevute (sistema, amicizia, gruppo) compaiono nella pagina, con stato
  letto/non letto persistito.
  **Consegnato**: query `myNotifications` + mutation `markNotificationAsRead` lato backend; hook
  `useNotifications` lato mobile; pagina con lista, skeleton, stato vuoto, segna-come-letta persistito.

### T24
- [x] [TODO] Richieste di amicizia nella sezione notifiche
- 🏷️ Area: 🔔 Notifiche · 🧑‍🤝‍🧑 Amici
- ✅ Fatto (ondata 1, pacchetto E, foglia E1, 19/11/2026, commit `dc89d69` — stessa foglia di T23) · Urgenza 🔴 · Rischio 🟡 · Effort 🟡
- [`notifications.tsx`](../mobile/src/app/(app)/(tabs)/notifications.tsx), [`useFriendRequests.ts`](../mobile/src/utils/useFriendRequests.ts)
- **Problema**: le richieste di amicizia in arrivo sono oggi visibili solo nella tab Amici, non fra le
  notifiche.
  **Cosa fare**: una volta pronta la pagina notifiche (T23), includere le richieste di amicizia pendenti fra
  gli elementi mostrati, con azioni accetta/rifiuta inline.
  **Fatto quando**: una richiesta di amicizia in arrivo compare anche nella pagina notifiche, accettabile o
  rifiutabile da lì.
  **Consegnato**: sezione dedicata in testa alla pagina notifiche, riusa `useFriendRequests` esistente,
  azioni accetta/rifiuta inline con `FriendRequestRow`.

### T25
- [ ] [TODO] Rifare la grafica della sezione Amici
- 🏷️ Area: 🧑‍🤝‍🧑 Amici
- ⏸️ In attesa (rimandato dall'utente il 19/11/2026, insieme a T26 — escluso dall'ondata 1) · Urgenza 🟡 · Rischio 🟡 · Effort 🔴
- [`friends.tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friends.tsx)
- **Problema**: l'intera schermata Amici è segnalata come da rifare graficamente.
  **Cosa fare**: da definire con l'utente il nuovo layout prima di implementare (collegato a T26 per le
  card).
  **Fatto quando**: nuova grafica della schermata Amici approvata e applicata.

### T26
- [ ] [TODO] Mini card amici troppo ingombranti
- 🏷️ Area: 🧑‍🤝‍🧑 Amici
- 🔍 Da valutare (fuori dall'ondata 1; rimandato dall'utente il 19/11/2026 insieme a T25) · Urgenza 🟡 · Rischio 🟢 · Effort 🟡
- [`FriendCard.tsx`](../mobile/src/components/cards/FriendCard.tsx)
- **Problema**: le card amici nella lista sono giudicate troppo ingombranti.
  **Cosa fare (da scegliere)**:
  (a) ridurre la card esistente mantenendo le informazioni attuali;
  (b) ridurla a sola immagine + nome, con barra di ricerca separata per i dettagli.
  **Decisione da prendere**: quale formato adottare, prima di toccare `FriendCard.tsx`.
  **Fatto quando**: la lista amici mostra card più compatte, nel formato scelto dall'utente.

### T27
- [x] [TODO] Ridisegnare il profilo amico (statistiche in accordion)
- 🏷️ Area: 🧑‍🤝‍🧑 Amici
- ✅ Fatto (ondata 1, pacchetto E, foglia E3, 19/11/2026, commit `21051ef`) · Urgenza 🟡 · Rischio 🟡 · Effort 🔴
- [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx) (confermato: oggi solo
  `PageHeader` + `FlatList` delle liste condivise, nessuna statistica), [`useFriendProfile.ts`](../mobile/src/utils/useFriendProfile.ts)
  (la query ritorna solo `user`+`lists`, nessuna stat), [`friendship.queries.ts`](../web/graphql/models/friendship/friendship.queries.ts)
  (resolver `friendProfile`: va esteso con le statistiche, non solo l'hook mobile)
- **Problema**: la pagina profilo amico non ha statistiche, a differenza del profilo personale. Scope
  corretto dopo revisione: non basta un intervento mobile-only, serve anche un resolver backend che esponga
  le statistiche dell'amico (oggi `friendProfile` ritorna solo `user` e `lists`).
  **Cosa fare**: estendere il resolver `friendProfile` con le statistiche (riuso di quanto già calcolato per
  `profileStats`, applicato all'utente amico); estendere `useFriendProfile.ts`; stessa struttura grafica del
  profilo personale, con statistiche in accordion a due tab ("solo sue" / "mie e sue") e bottone per vedere
  le sue liste non nascoste.
  **Fatto quando**: aprendo il profilo di un amico si vedono le sue statistiche, confrontabili con le
  proprie, in due tab.
  **Consegnato**: resolver `friendProfile` esteso con le statistiche dell'amico; nuovo componente
  `ProfileStatsGroup` riusato per "solo sue"/confronto; bottone per mostrare/nascondere le liste condivise.

### T28
- [x] [TODO] Rimozione amico dalla pagina profilo amico
- 🏷️ Area: 🧑‍🤝‍🧑 Amici
- ✅ Fatto (ondata 1, pacchetto E, foglia E3, 19/11/2026, commit `21051ef` — stessa foglia di T27) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx)
- **Problema**: la rimozione di un amico è disponibile solo dalla lista amici (tab Amici), non dalla pagina
  del profilo del singolo amico.
  **Cosa fare**: aggiungere l'azione di rimozione (con `ConfirmSheet`, come nel resto dell'app) anche in
  `friend/[id].tsx`, riusando `useRemoveFriend`.
  **Fatto quando**: da `friend/[id].tsx` è possibile rimuovere l'amico senza tornare alla lista amici.
  **Consegnato**: bottone `UserMinus` nell'header, `ConfirmSheet` di conferma, riusa `useRemoveFriend`.

### T29
- [ ] [DEC] Decidere se includere i Gruppi nell'MVP
- 🏷️ Area: 👥 Gruppi
- ⏸️ In attesa (decisione del titolare: mole di lavoro Gruppi per MVP — fuori dall'ondata 1, su richiesta esplicita) · Urgenza 🟡 · Rischio 🟢 · Effort 🟢
- [`group.prisma`](../web/prisma/schema/group.prisma), [`groupChallenge.prisma`](../web/prisma/schema/groupChallenge.prisma)
- **Problema**: i Gruppi (backend + UI base, Fase 3.2) sono già completi, ma resta da decidere se le parti
  mancanti (sfide, notifiche di gruppo) vadano completate per l'MVP o rimandate a dopo il lancio.
  **Cosa fare**: stimare il lavoro residuo su sfide/notifiche di gruppo, presentare la stima al titolare.
  **Decisione da prendere**: Gruppi dentro l'MVP o rimandati a post-lancio.
  **Fatto quando**: la decisione è presa e riportata in questa scheda con la data.

### T30
- [x] [FIX] `myLists` non filtra le liste nascoste
- 🏷️ Area: 📋 Liste e item
- ✅ Fatto (19/11/2026, fuori da ogni ondata — fix diretto, sotto soglia di delega) · Urgenza 🟡 · Rischio 🟡 · Effort 🟢
- [`group-list/[groupListId].tsx`](../mobile/src/app/(app)/(tabs)/(groups)/group-list/[groupListId].tsx), [`useLists.ts`](../mobile/src/utils/useLists.ts) (`UserList.isHidden` già presente nei dati scaricati)
- **Problema**: confermato sul codice — a differenza di `friendProfile` (che filtra correttamente
  `isHidden: false`), il resolver `myLists` restituisce tutte le liste dell'utente senza escludere quelle
  nascoste. La UI di scelta liste da condividere in un `GroupList` usa `myLists` senza filtro aggiuntivo,
  quindi una lista nascosta agli amici può comunque essere condivisa in un gruppo — il che contraddice il
  senso di `isHidden`.
  **Cosa fare**: filtrare `isHidden: false` in `myLists`, oppure (se altrove nell'app `myLists` deve
  mostrare anche le liste nascoste all'utente stesso, es. nella propria Home) aggiungere un parametro
  esplicito e filtrare solo nel punto di scelta per `GroupList`. Decidere quale dei due, verificando prima
  tutti i chiamanti di `myLists`.
  **Fatto quando**: una lista con `isHidden=true` non compare più fra le liste condivisibili in un gruppo.
  **Consegnato**: verificato che `myLists` è usato anche dalla Home (`index.tsx`), dove l'utente deve
  continuare a vedere le proprie liste nascoste — quindi niente filtro lato backend (avrebbe rotto la Home).
  `isHidden` era già nei dati scaricati da `useMyLists()`: filtro client-side in
  `group-list/[groupListId].tsx` (`allMyLists.filter(l => !l.isHidden)`), nessuna modifica al resolver né
  all'hook condiviso.

### T31
- [ ] [TODO] Statistiche profilo in riga, non in lista
- 🏷️ Area: 👤 Profilo e statistiche
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`profile-stats-panel.tsx`](../mobile/src/components/molecules/profile-stats-panel.tsx), [`profile.tsx`](../mobile/src/app/(app)/(tabs)/profile.tsx)
- **Problema**: confermato sul codice — `ProfileStatsPanel` (da non confondere con `ProfileStatsGroup` di
  T27, che riguarda solo il confronto con l'amico) mostra Lists/Completed/Friends come tre `StatRow`
  impilate verticalmente dentro una `CardShell`, separate da `Divider`, non affiancate.
  **Cosa fare**: cambiare il contenitore da colonna a riga (3 blocchi di pari larghezza fianco a fianco),
  mantenendo icona+valore di ogni `StatRow` ma senza i `Divider` orizzontali.
  **Fatto quando**: nel profilo personale, Lists/Completed/Friends compaiono affiancati sulla stessa riga.

### T32
- [ ] [TODO] Badge notifiche non lette in navbar
- 🏷️ Area: 🔔 Notifiche · 🧭 Navigazione
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟡 · Rischio 🟢 · Effort 🟡
- [`app-tabs.tsx`](../mobile/src/components/app-tabs.tsx), [`useNotifications.ts`](../mobile/src/utils/useNotifications.ts)
- **Problema**: confermato sul codice — `app-tabs.tsx` non ha nessun meccanismo di badge/contatore su
  nessuna tab; la tab Notifiche usa solo l'icona `Bell` senza overlay numerico. `useNotifications()` calcola
  `markedAsRead` per singola notifica ma non espone un conteggio aggregato.
  **Cosa fare**: derivare un conteggio non-lette da `useNotifications` (o una query dedicata più leggera) ed
  esporlo come badge sulla tab Notifiche in `app-tabs.tsx`.
  **Fatto quando**: con almeno una notifica non letta, l'icona Notifiche in navbar mostra il numerino; a
  zero non-lette il badge non compare.

### T33
- [ ] [TODO] Apertura/lettura estesa di una notifica (con azioni)
- 🏷️ Area: 🔔 Notifiche
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026 — scope deciso dall'utente il 25/11/2026:
  azioni contestuali, non solo testo esteso) · Urgenza 🟢 · Rischio 🟢 · Effort 🟡
- [`notifications.tsx`](../mobile/src/app/(app)/(tabs)/notifications.tsx), [`NotificationCard.tsx`](../mobile/src/components/cards/NotificationCard.tsx)
- **Problema**: corretto dopo verifica — il sistema letto/non letto **esiste già** (pallino colorato su
  `NotificationCard` quando `unread`, persistito via `markNotificationAsRead`). Manca invece una vera
  interazione di apertura: il tap su una card chiama solo `markAsRead`, nessuna azione contestuale in base al
  tipo di notifica. **Scope corretto in revisione (ondata 2)**: niente ramo "richiesta di amicizia
  accettabile/rifiutabile dalla notifica" — nessun punto del backend crea mai una `Notification` con
  `notificationType: 'FRIENDSHIP'` (le richieste pendenti arrivano solo dalla query separata
  `friendRequests`, già mostrata in una sezione propria di questa pagina fin da T24); quel ramo sarebbe
  codice morto.
  **Cosa fare**: in base al `notificationType`, offrire un'azione diretta dalla card/sheet — notifica legata
  a una lista o a un gruppo → bottone che naviga lì; notifica di sistema → solo espansione testo, nessuna
  azione.
  **Fatto quando**: aprendo una notifica legata a lista/gruppo si naviga lì direttamente; una notifica di
  sistema si espande mostrando il testo per intero.

### T34
- [ ] [TODO] Sistema di aggiunta amici (+ e BottomSheet)
- 🏷️ Area: 🧑‍🤝‍🧑 Amici
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟡 · Rischio 🟡 · Effort 🟡
- [`friends.tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friends.tsx)
- **Problema**: confermato sul codice — la ricerca amici è un `Input` sempre visibile in testa alla lista
  (occupa spazio permanente), non un bottone `+` che apre una ricerca in `BottomSheet`.
  **Cosa fare**: spostare il campo di ricerca in un `BottomSheet` (già usato altrove in app) aperto da un
  bottone `+`, mantenendo `UserSearchRow` e la logica di ricerca esistenti.
  **Fatto quando**: la lista amici non mostra più un campo di ricerca fisso; un bottone `+` apre la ricerca
  in una sheet.

### T35
- [ ] [FIX] Tab Amici non resetta sul profilo amico
- 🏷️ Area: 🧑‍🤝‍🧑 Amici · 🧭 Navigazione
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🔴 · Rischio 🟡 · Effort 🟡
- [`app-tabs.tsx`](../mobile/src/components/app-tabs.tsx), [`(friends)/_layout.tsx`](../mobile/src/app/(app)/(tabs)/(friends)/_layout.tsx), [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx), [`useFriendProfile.ts`](../mobile/src/utils/useFriendProfile.ts)
- **Problema**: confermato sul codice — la tab Amici è un `Stack` semplice senza alcuna logica di reset;
  ritoccare "Amici" in navbar mentre si è su `friend/[id]` non fa nulla (nessun `popToTop`/listener sul
  ri-tap). In quello stato, a volte compare "Couldn't load this profile. Please try again." — testo in
  `friends.json` (`friend.error`), mostrato quando `useFriendProfile` resta con `profile` nullo (es. `id`
  temporaneamente non valido durante la navigazione bloccata).
  **Cosa fare**: agganciare il ri-tap della tab Amici a un reset dello stack interno (pattern standard Expo
  Router/React Navigation per "tab già attiva → pop to top"); verificare se risolvere il reset basta anche a
  far sparire l'errore di caricamento (sintomo collegato) o se serve un controllo separato su `id` instabile.
  **Fatto quando**: da qualunque profilo amico, ritoccare "Amici" in navbar torna sempre alla lista amici;
  l'errore "Couldn't load this profile" non compare più in questo flusso.

### T36
- [ ] [TODO] Header profilo amico: layout e nome troncato
- 🏷️ Area: 🧑‍🤝‍🧑 Amici · 🎨 UI/UX trasversale
- ⏸️ In attesa (rimandato dall'utente il 25/11/2026 — richiede toccare `PageHeader.tsx`, componente condiviso
  in tutta l'app; decisione rimandata, escluso dall'ondata) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx), [`PageHeader.tsx`](../mobile/src/components/molecules/PageHeader.tsx)
- **Problema**: confermato sul codice — `friend/[id].tsx` usa il `PageHeader` condiviso, che mette icona+nome
  a sinistra e (azione, poi back) impilati a destra: non il layout "Indietro / nome / Rimuovi amico" in
  space-between richiesto. Il nome nel titolo del `PageHeader` non ha `numberOfLines`, quindi può sborare (il
  nome più in basso nella pagina, invece, ha già `numberOfLines={1}`).
  **Cosa fare**: **`PageHeader.tsx` è un componente condiviso in tutta l'app — non va modificato senza
  permesso esplicito.** Due strade possibili: (a) un header dedicato solo per questa pagina, senza toccare
  `PageHeader.tsx`; (b) un piccolo intervento sul componente condiviso (`numberOfLines` sul titolo, riordino
  azioni), solo se autorizzato. Il 25/11/2026 l'utente ha rimandato la decisione.
  **Fatto quando**: nella pagina profilo amico, back/nome/rimuovi sono disposti come richiesto e il nome non
  sbora mai, anche se molto lungo.

### T37
- [ ] [FIX] Togliere "accettazione sorteggio" dalle statistiche amico
- 🏷️ Area: 🧑‍🤝‍🧑 Amici
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`profile-stats-group.tsx`](../mobile/src/components/molecules/profile-stats-group.tsx), [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx)
- **Problema**: confermato sul codice — `ProfileStatsGroup` renderizza ancora `ProfileDrawAcceptance`
  (statistica "sorteggio accettato") sia nel profilo amico singolo sia in entrambe le colonne del confronto.
  **Cosa fare**: togliere il rendering di `ProfileDrawAcceptance` da `ProfileStatsGroup` (o da dove viene
  passato il dato in `friend/[id].tsx`), lasciando `categoryStats`/`completionBreakdown`.
  **Fatto quando**: la statistica sull'accettazione del sorteggio non compare più né nel profilo amico né nel
  confronto.

### T38
- [ ] [TODO] Sezione "Compare" profilo amico da rivedere
- 🏷️ Area: 🧑‍🤝‍🧑 Amici
- 🔍 Da valutare (da [`altri-errori.md`](altri-errori.md), 25/11/2026 — segnalato [DA-VALUTARE] nella fonte
  originale) · Urgenza 🟡 · Rischio 🟢 · Effort 🟡
- [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx), [`profile-stats-group.tsx`](../mobile/src/components/molecules/profile-stats-group.tsx)
- **Problema**: confermato sul codice — in modalità confronto, le due `ProfileStatsGroup` ("tue" e
  dell'amico) mostrano esattamente lo stesso set di statistiche fianco a fianco, senza alcuna
  differenziazione: non è un vero confronto, solo una duplicazione.
  **Cosa fare (da decidere)**: scegliere quali statistiche mostrare in modalità confronto (diverse da quelle
  "solo mie"/"solo sue"), per evitare la ripetizione identica segnalata.
  **Decisione da prendere**: quale set di statistiche è più sensato per un confronto a due persone, prima di
  toccare `profile-stats-group.tsx`.
  **Fatto quando**: la sezione "Compare" mostra statistiche scelte apposta per il confronto, non la stessa
  lista duplicata due volte.

### T39
- [ ] [TODO] Liste dell'amico non cliccabili
- 🏷️ Area: 🧑‍🤝‍🧑 Amici · 📋 Liste e item
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟡 · Rischio 🟡 · Effort 🟡
- [`friend/[id].tsx`](../mobile/src/app/(app)/(tabs)/(friends)/friend/[id].tsx)
- **Problema**: confermato sul codice — ogni `ListCard` nel profilo amico ha `onPress={() => {}}`: le liste
  condivise sono solo mostrate/nascoste con un toggle, non apribili.
  **Cosa fare**: collegare il tap della card a una vista di dettaglio in sola lettura degli item della lista
  (riusando la UI di `list/[id].tsx` dove possibile), rispettando sia `List.isHidden` (già filtrato da
  `friendProfile`, T13) sia l'eventuale `isHidden` a livello di singolo item (da verificare lato resolver).
  **Fatto quando**: dal profilo di un amico, toccando una delle sue liste non nascoste si vedono i suoi item
  non nascosti.

### T40
- [ ] [TODO] Area Email/"Send code" poco chiara in Impostazioni
- 🏷️ Area: 🎨 UI/UX trasversale
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`settings.tsx`](../mobile/src/app/(app)/settings.tsx), [`collapsible.tsx`](../mobile/src/components/ui/collapsible.tsx)
- **Problema**: confermato sul codice — il flusso è reale e funzionante (OTP a due passi: richiesta codice →
  conferma), non rotto; il problema è che non è etichettato (nessun titolo che spieghi i due step) e resta
  sempre espanso con lo stesso peso visivo di tutto il resto.
  **Cosa fare**: aggiungere testo che spieghi i due passaggi (richiesta/conferma codice) e racchiudere la
  sezione nel `Collapsible` già esistente in `components/ui/collapsible.tsx` (riuso, non un nuovo
  componente).
  **Fatto quando**: la sezione Email spiega cosa fa prima di essere aperta, ed è collassata di default.

### T41
- [ ] [TODO] Sezione "Cambio password" troppo in evidenza
- 🏷️ Area: 🎨 UI/UX trasversale
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`settings.tsx`](../mobile/src/app/(app)/settings.tsx), [`collapsible.tsx`](../mobile/src/components/ui/collapsible.tsx)
- **Problema**: confermato sul codice — la sezione cambio password è una `CardShell` sempre visibile, stessa
  prominenza di ogni altra sezione (stesso stile titolo, stessa card), posizionata subito sotto Email.
  **Cosa fare**: racchiuderla nel `Collapsible` esistente (stesso riuso di T40), chiusa di default.
  **Fatto quando**: la sezione cambio password è collassata di default e non spicca più delle altre.

### T42
- [ ] [TODO] Scadenza piano e CTA migliore in Payments
- 🏷️ Area: 💳 Membership e pagamenti
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟡 · Rischio 🟢 · Effort 🟡
- [`settings.tsx`](../mobile/src/app/(app)/settings.tsx), [`membership.queries.ts`](../web/graphql/models/membership/membership.queries.ts) (`myMembership`), [`subscription.prisma`](../web/prisma/schema/subscription.prisma) (`Subscription.endDate`)
- **Problema**: confermato sul codice — `Subscription.endDate` **esiste già** nello schema, ma `myMembership`
  seleziona solo `membershipId` dalla subscription attiva e ritorna il solo `Membership` (il piano), scartando
  la data di scadenza; lato mobile non arriva quindi nessuna data. Il bottone "Learn more" in realtà apre
  correttamente la sheet dei piani di T07 (non è disconnesso), ma l'etichetta non dice cosa fa.
  **Cosa fare**: estendere `myMembership` (o un campo dedicato) per esporre anche `endDate` quando presente;
  mostrarla in `settings.tsx` solo se il piano prevede una scadenza; rinominare "Learn more" con un'etichetta
  che dica cosa succede al tap (es. "Vedi i piani").
  **Fatto quando**: un utente con piano a scadenza vede quando scade; il bottone ha un'etichetta chiara.

### T43
- [ ] [TODO] Avviso limite raggiunto alla creazione lista
- 🏷️ Area: 💳 Membership e pagamenti · 📋 Liste e item
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟡 · Rischio 🟢 · Effort 🟡
- [`index.tsx`](../mobile/src/app/(app)/(tabs)/(home)/index.tsx), [`list-form.tsx`](../mobile/src/app/(app)/(tabs)/(home)/list-form.tsx), [`list.mutations.ts`](../web/graphql/models/list/list.mutations.ts) (`code: 'LIMIT_REACHED'`)
- **Problema**: confermato sul codice — il bottone `+` apre direttamente il form; se il limite piano è già
  raggiunto, `createList` fallisce con `LIMIT_REACHED` ma `list-form.tsx` lo mostra come testo d'errore
  generico, nessuna `BottomSheet` dedicata né collegamento alla pagina membership.
  **Cosa fare**: in `list-form.tsx`, intercettare `extensions.code === 'LIMIT_REACHED'` e mostrare una
  `BottomSheet` con spiegazione e bottone verso la sheet piani di T07 (non un errore inline).
  **Fatto quando**: un utente al limite che prova a creare una lista vede una sheet chiara con un bottone per
  passare a un piano superiore, non un testo d'errore grezzo.

### T44
- [ ] [TODO] Nascondere un singolo item: manca il controllo in UI
- 🏷️ Area: 📋 Liste e item · 💳 Membership e pagamenti
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟡 · Rischio 🟢 · Effort 🟡
- [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx), [`list/[id].tsx`](../mobile/src/app/(app)/(tabs)/(home)/list/[id].tsx), [`useItemMutations.ts`](../mobile/src/utils/useItemMutations.ts) (`UpdateUserItemInput.isHidden` già presente)
- **Problema**: confermato sul codice — il gate di piano per `isHidden` su un item esiste già lato backend
  (T14), e la mutation già accetta `isHidden`, ma `ItemCardDetails` non ha nessuna prop/controllo per
  impostarlo: nessun utente, a nessun livello di piano, può oggi nascondere un proprio item (la lista intera
  sì, via `list-form.tsx`, il singolo item no).
  **Cosa fare**: aggiungere un toggle in `ItemCardDetails.tsx` (visibile/disabilitato in base al piano, come
  da T14), cablato in `list/[id].tsx` a `updateUserItem({ isHidden })`.
  **Fatto quando**: un utente con piano abilitato può nascondere/mostrare un singolo item dal suo dettaglio.

### T45
- [ ] [FIX] Icona categoria item non mostrata fuori dal picker
- 🏷️ Area: 📋 Liste e item
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`ItemCard.tsx`](../mobile/src/components/cards/ItemCard.tsx), [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx), [`CategoryPickerSheet.tsx`](../mobile/src/components/organisms/CategoryPickerSheet.tsx)
- **Problema**: confermato sul codice — l'icona di categoria (T10) compare solo dentro `CategoryPickerSheet`;
  `ItemCard.tsx` riceve `category` come stringa e la mostra come solo testo (nessuna prop icona), e
  `ItemCardDetails.tsx` fa lo stesso pur avendo già `categoryOptions`/`categoryId` (con `.icon`) disponibili.
  **Cosa fare**: passare/derivare l'icona della categoria anche in `ItemCard.tsx` e nella riga categoria di
  `ItemCardDetails.tsx`, riusando lo stesso `getLucideIcon` del picker.
  **Fatto quando**: l'icona della categoria di un item compare anche nella card lista e nel dettaglio, non
  solo nel picker.

### T46
- [ ] [FIX] Cambio di stato item percepito lento
- 🏷️ Area: 📋 Liste e item
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟡 · Rischio 🟡 · Effort 🟡
- [`useItemMutations.ts`](../mobile/src/utils/useItemMutations.ts) (`updateMutation`, nessun `optimisticResponse`), [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx) (`SegmentedControl` riflette lo `status` della query, non uno stato locale)
- **Problema**: confermato sul codice — il cambio di stato (Not started/In progress/Completed) aspetta la
  risposta completa della mutation prima che l'UI si aggiorni: nessun `optimisticResponse`, nessuno stato
  locale intermedio nel `SegmentedControl`. Non ci sono `refetchQueries` superflui (rimossi di proposito, per
  nota nel codice) — il collo di bottiglia è solo l'attesa del giro di rete.
  **Cosa fare**: aggiungere un `optimisticResponse` alla mutation di update status, così il `SegmentedControl`
  cambia subito e torna indietro solo in caso di errore reale.
  **Fatto quando**: toccando un nuovo stato, il controllo cambia visivamente subito, senza attesa percepibile.

### T47
- [ ] [TODO] Pagina/flusso unico di modifica item
- 🏷️ Area: 📋 Liste e item · 💳 Membership e pagamenti
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟡 · Rischio 🟡 · Effort 🟡
- [`ItemCardDetails.tsx`](../mobile/src/components/organisms/ItemCardDetails.tsx)
- **Problema**: confermato sul codice — oggi fra le icone Tag e Trash non c'è nessuna icona Pencil; nome,
  categoria (T16) e descrizione personale sono già modificabili, ma ognuno tramite un proprio micro-editor
  inline separato, senza un punto d'ingresso unico "modifica item". L'area upload immagine placeholder
  (visibile per tutti, bloccata/con lucchetto per chi non ha il piano, con suggerimento verso la pagina
  membership) **dipende da T03** (upload immagini item), ancora in attesa: la parte immagine di questo task
  non è sbloccabile finché T03 non è deciso.
  **Cosa fare**: aggiungere un'icona Pencil fra Tag e Trash che apra un'unica vista di modifica
  (nome/categoria/descrizione, riusando gli editor già esistenti) invece di pencil sparsi; aggiungere l'area
  placeholder immagine **solo dopo** che T03 definisce come gestire l'upload.
  **Fatto quando**: un'icona Pencil dedicata apre un'unica schermata/sheet con tutti i campi modificabili
  dell'item (l'immagine resta un placeholder visibile ma bloccato finché T03 non è implementato).

### T48
- [ ] [TODO] UI membership/upgrade deve usare l'accent Cyan
- 🏷️ Area: 💳 Membership e pagamenti · 🎨 UI/UX trasversale
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`settings.tsx`](../mobile/src/app/(app)/settings.tsx), [`colors-showcase.tsx`](../mobile/src/app/(app)/colors-showcase.tsx) (riferimento: blocco mockup membership con `colors.accent`)
- **Problema**: confermato sul codice — la UI membership reale in `settings.tsx` usa `colors.primary` per il
  badge "il tuo piano" e `colors.border`/`colors.foreground` per le card; non usa mai `colors.accent` (cyan),
  a differenza del blocco mockup "membership" già presente in `colors-showcase.tsx`.
  **Cosa fare**: riportare la palette cyan del mockup (badge, bordo card, bottoni) sulla UI reale di
  `settings.tsx` ovunque si parli di piano/upgrade.
  **Fatto quando**: badge piano, card e bottoni legati a membership/upgrade usano l'accent cyan, come nel
  mockup di colors-showcase.

### T49
- [ ] [TODO] Modalità "Carta Forbice Pietra" nel Randomizzatore
- 🏷️ Area: 🎲 Randomizzatore
- ⏳ Da fare (da [`altri-errori.md`](altri-errori.md), 25/11/2026) · Urgenza 🟢 · Rischio 🟢 · Effort 🟡
- [`random.ts`](../mobile/src/utils/random.ts), [`useRandomizer.ts`](../mobile/src/utils/useRandomizer.ts), [`randomizer.tsx`](../mobile/src/app/(app)/(tabs)/(home)/randomizer.tsx), [`ModeGrid.tsx`](../mobile/src/components/randomizer/ModeGrid.tsx)
- **Problema**: confermato sul codice — i modi disponibili sono numbers/letters/colors/dice/bottle/coin;
  nessuna modalità "sasso-carta-forbice" esiste. **Scope cambiato il 25/11/2026**: una collega ha nel
  frattempo spostato tutto il randomizzatore lato client (`random.ts`, commento esplicito: "risultati usa e
  getta, non passano dal backend") — niente più resolver GraphQL da scrivere, stesso pattern già usato per
  "coin" (riuso lato client, zero round-trip di rete).
  **Cosa fare**: funzione pura in `random.ts` (es. `randomChoice` su un array di 3 opzioni, o equivalente);
  wrapper in `useRandomizer.ts` (stesso pattern di `drawWinnerIndex`); nuova card in `ModeGrid`/`randomizer.tsx`,
  stessa struttura griglia→stage delle altre modalità.
  **Fatto quando**: dalla griglia del randomizzatore è selezionabile "Carta Forbice Pietra" e produce un
  risultato casuale fra le tre opzioni, calcolato sul device come le altre modalità.
