# ItemCardDetails — considerazioni & piano

Stato e decisioni sul bottomsheet di dettaglio item (`mobile/src/components/organisms/ItemCardDetails.tsx`).

## Contesto

- **Creazione** item → schermata dedicata `item-form.tsx` (solo: nome, categoria dalla lista padre, descrizione personale).
- **Ogni modifica successiva** avviene **solo** dentro `ItemCardDetails`. Non esiste altra schermata di edit.
- La card apre sempre il bottomsheet corrispondente (regola fissa: `ItemCard` possiede e apre `ItemCardDetails`).

## Stato attuale delle modifiche (dentro ItemCardDetails)

| Azione | Stato | Come |
| --- | --- | --- |
| Stato (NOT_STARTED/IN_PROGRESS/COMPLETED) | ✅ inline | `SegmentedControl` → `updateUserItem({ status })` |
| Rating (voto) | ✅ inline | tap stelle → `rateItem(itemId, value)` |
| Rimuovi tag (dall'item) | ✅ inline | `updateUserItem({ tagIds })` |
| Rimuovi item dalla lista | ✅ inline | ConfirmSheet → `removeItemFromList` |
| **Modifica nota personale** | ✅ inline | +/matita → input → ✓/✗; vuoto = cancella (`updateUserItem({ note })`) |
| **Aggiunta tag** | ⛔ da fare | vedi sotto |
| **Rating note (giudizio)** | ⛔ da fare (sola lettura) | vedi sotto |
| **Modifica descrizione personale** | ⛔ da fare | ora sola lettura |

## 1. Aggiunta tag (da fare)

Requisiti noti:

- I tag sono **condivisi tra tutte le liste/item** dell'utente.
- Esistono **tag di sistema** e **tag personali** (`Tag.isSystem`).
- Sorgente: `useTags().myTags` (sistema + personali). Creazione: `createTag(name, color)`. Assegnazione: `updateUserItem({ tagIds })`.
- `TagList` ha già il gancio `onAddTag` e il bottone "+ Tag".

Modalità scelta: **bottomsheet annidato** (`TagPickerSheet`).

- La `BottomSheet` è un `Modal` nativo → un secondo sheet si impila sopra con backdrop indipendente. Nesting sicuro. (Caveat: Modal annidati trasparenti su Android a volte fanno i capricci → piano B: cambiare *contenuto* dentro lo stesso sheet.)
- Contenuto: ricerca + lista di tutti i tag (sistema con badge, personali), tap = toggle assegna/rimuovi; se la ricerca non trova, riga "Crea «testo»".
- **Colore del nuovo tag**: da decidere → palette automatica o scelta manuale.

## 2. Rating note / giudizio (da fare)

- Sotto le stelle, campo editabile per il **giudizio testuale**.
- Salvataggio: `rateItem(itemId, value, note)`. Compare solo con voto ≥ 1 (il rating richiede un valore).

## 3. Altre cose da considerare (gap)

1. ~~**Modifica nota personale**~~ — ✅ fatto (editing inline).
2. **Modifica descrizione personale** — idem alla nota, ora sola lettura → da rendere editabile con lo stesso pattern.
3. **`completedAt`** — quando lo stato diventa COMPLETED, il backend deve settare la data così compare "Completato il…". Da verificare nel resolver (probabile gap).
4. **Colore nuovo tag** — vedi punto 1 (aggiunta tag).
5. ~~**i18n `ItemCardDetails` / `TagList`**~~ — ✅ fatto (namespace `lists`, sezione `itemDetail`). Resta l'i18n del resto dell'app dove ancora hardcoded.
6. **Feedback errori** — le modifiche inline (stato/rating/tag/nota) sono ora silenziose: nessun toast/indicatore in caso di errore.

## Gestione immagini (in valutazione)

- `Item.imageUrl` è opzionale (da API o, in futuro, manuale).
- Senza immagine, la card mostra un placeholder (icona). **In fase di test** è stato inserito un **placeholder image statico** (`assets/images/placeholder-item.png`, esposto da `src/constants/placeholders.ts`) usato da `ItemCard` e dalla copertina di `ItemCardDetails`, per ragionare sul layout con copertine reali.
- **Da decidere**: da dove arrivano le immagini degli item (fetch da API esterna per categoria? upload utente? nessuna?) e la strategia di caching/fallback.

## Decisioni ancora aperte

- [ ] Colore del nuovo tag: automatico vs manuale.
- [ ] Includere subito nota + descrizione editabili?
- [ ] `completedAt`: settato dal backend su COMPLETED?
- [ ] Strategia immagini item.
- [ ] i18n di `ItemCardDetails`.
