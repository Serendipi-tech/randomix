# OBIETTIVO
Estrarre i componenti UI dal file `mobile/src/app/(app)/colors-showcase.tsx` e ricrearli come componenti indipendenti, atomici e riutilizzabili, dentro `mobile/src/components/`.
Tutti i componenti UI preesistenti nell'app non citati in questo documento vanno sostituiti e/o cancellati per uniformità (il nuovo set diventa l'unica fonte per quel tipo di elemento).

Fonte: `mobile/src/app/(app)/colors-showcase.tsx` — file lungo, i componenti sono funzioni dichiarate con `function NomeComponente(...)`. Non fare affidamento sui numeri di riga (cambiano ad ogni edit): cerca per nome funzione.

# STRUTTURA DI DESTINAZIONE
Il path di ogni componente riflette il suo livello nella categorizzazione Atomic Design (vedi tabella più sotto), **non** una cartella generica "ui":
- Atom → `mobile/src/components/atoms/NomeComponente.tsx`
- Molecule → `mobile/src/components/molecules/NomeComponente.tsx`
- Organism → `mobile/src/components/organisms/NomeComponente.tsx`
- **Eccezione esplicita**: tutte le varianti di Card (incluso `CardShell`) vivono in un'unica cartella dedicata `mobile/src/components/cards/`, indipendentemente dal loro livello atomico individuale (alcune sono Molecule, altre Organism — vedi tabella) — richiesto esplicitamente per tenere tutte le card insieme, non sparse tra `molecules/` e `organisms/`.
- Ogni componente ha la propria logica non banale (animazioni, misurazioni, hook custom) nello stesso file o in `mobile/src/utils/` se già esiste un hook riutilizzabile lì (es. `useDominantColor`) — non duplicare hook già presenti.
- TypeScript strict, niente `any`, niente stili inline hardcoded fuori dalla palette `ShowcaseColors`/tema (vedi sezione Palette Colori).

# ⚠️ PALETTE COLORI — NON NEGOZIABILE
I colori dell'app sono stati decisi e confermati in `colors-showcase.tsx` (costante `ShowcaseColors`). Questa è la fonte di verità definitiva.
**Non vanno cambiati i colori scelti in colors-showcase.tsx** — al contrario, è il tema reale dell'app (`constants/theme.ts`, `Colors`) a dover essere **sostituito/allineato** con quanto già confermato in `ShowcaseColors`, non viceversa. Durante l'estrazione dei componenti, nessun colore va reinventato, corretto o "migliorato": si porta pari pari quello già presente nello showcase.

# IGNORA I SEGUENTI COMPONENTI
Cioè, *non* componentizzarli e lasciali indietro:
- Bottone "Hide Colors Sections" (toggle interno alla pagina showcase, non un componente UI dell'app);
- `ShowColorPalette` (la griglia di swatch colore, è un tool da showcase, non un componente app);
- Bottoni "Load"/"Unload" (controlli interni alla pagina showcase per simulare stati di loading, non componenti app);
- `DiceLogoCopy`, `FeatureRowCopy`, `PasswordStrengthIndicatorCopy` — **attenzione, `PasswordStrengthIndicatorCopy` qui è la copia isolata usata solo per la sezione "Auth Components" del showcase**, diversa dal Password Strength Indicator che va invece estratto come parte del componente Input (vedi punto 3 sotto: quello va rinominato ed estratto sul serio). Queste tre copie sono repliche dei componenti reali dell'auth flow, usate solo per test grafico isolato in questa pagina — componentizzarle da qui creerebbe un duplicato di qualcosa che probabilmente esiste già altrove nell'app.

# COMPONENTI CON CARATTERISTICHE SPECIFICHE
Per ognuno: cosa passare da fuori tramite props, cosa resta fisso/interno all'implementazione.

1. **`Button`** *(→ `components/atoms/Button.tsx`)*
      Props:
            - `variant` (primary, secondary, ecc.);
            - `label` (testo);
            - `onPress` (action);
            - `disabled` (default `false` — se `true` forza la variante `ghost` indipendentemente da `variant`).
      Shell pulita e minimalista: in base a `variant` renderizza il tipo specifico di bottone. Componente unico, nessun effetto matrioshka (niente Button che wrappa altri Button).

2. **`PageHeader`** *(→ `components/molecules/PageHeader.tsx`)*
      Props:
            - `icon` (componente lucide-react-native);
            - `title`;
            - `onBack` (action per il back button — se assente, il bottone back non viene renderizzato affatto);
            - `subtitle` (opzionale).
      Il gradient di sfondo dietro l'icona è fisso, non parametrizzabile dall'esterno.

3. **`Input`** *(→ `components/molecules/Input.tsx`)*
      Props:
            - `variant` (`text` | `password` | `textarea`);
            - `value` / `onChangeText`;
            - `placeholder` (opzionale, altrimenti default per variant);
            - `disabled` (opzionale — attualmente assente nello showcase, va aggiunto).
      Lo stato di focus (bordo colorato `primary`) è gestito internamente. La variant `password` include internamente il toggle mostra/nascondi e l'indicatore di forza password.
      Quest'ultimo va estratto come componente separato **`PasswordStrengthIndicator`** (nome corretto, senza "Copy" — non confonderlo con `PasswordStrengthIndicatorCopy` della sezione IGNORA sopra, che è tutt'altra cosa). Al suo interno oggi trigger-icona e pannello flottante sono un blocco unico: vanno separati in un componente generico **`Tooltip`** (riceve trigger e contenuto come props/children) + `PasswordStrengthIndicator` che lo consuma passandogli le regole di validazione come contenuto.

4. **`Badge`** *(→ `components/atoms/Badge.tsx`)*
      Props:
            - `label`;
            - `color` (determina testo, bordo e sfondo tinto).
      Opacità sfondo (0.2), padding e border-radius fissi interni. Non interattivo (non è pressable).

5. **`Chip`** *(→ `components/atoms/Chip.tsx`)*
      Props:
            - `label`;
            - `selected`;
            - `disabled` (default `false`);
            - `onPress`.
      Scale-on-press e colori bordo/sfondo derivati da `selected` restano interni.

6. **`Checkbox`** *(→ `components/atoms/Checkbox.tsx`)*
      Props:
            - `checked`;
            - `indeterminate` (opzionale, default `false` — stato reale con glifo dedicato, es. trattino "−"; NON un terzo valore riciclato dallo stesso booleano di `checked`, come accade oggi nello showcase);
            - `onPress`;
            - `label` (opzionale).
      Riempimento sempre gradient `secondary → secondaryGradient`, transizione 150ms: fissi interni.

7. **`RadioGroup`** *(→ `components/molecules/RadioGroup.tsx`)*
      Props:
            - `options` (array `{ label, value }`);
            - `selectedValue`;
            - `onChange`.
      ⚠️ Bug da correggere in fase di estrazione: nello showcase il bordo attivo è `primary` ma il pallino interno è il gradient `secondary` — incoerenza cromatica, va uniformata a un'unica fonte di colore per lo stato attivo.

8. **`Switch`** *(→ `components/atoms/Switch.tsx`)*
      Props:
            - `value` (boolean);
            - `onChange`;
            - `disabled` (opzionale).
      Geometria (50×30 track, 24×24 thumb) e colori attivo/inattivo fissi interni. Nello showcase l'animazione esiste solo su web (gate `Platform.OS==='web'`): va estesa a un'animazione Animated cross-platform funzionante anche su nativo.

9. **`Tabs`** *(→ `components/molecules/Tabs.tsx`)*
      Props:
            - `items` (array label);
            - `activeIndex`;
            - `onChange`.
      Indicatore sempre underline `primary`, `minHeight: 48` fisso (target minimo di tocco), scale-on-press 0.96: fissi interni.

10. **`Pagination`** *(→ `components/molecules/Pagination.tsx`)*
      Props:
            - `totalPages`;
            - `currentPage`;
            - `onChange`.
      ⚠️ Nello showcase il numero di pagina non cambia colore sullo sfondo attivo `primary` (rischio contrasto insufficiente). **È VOLUTO. NON VA CAMBIATO**.

11. **`Divider`** *(→ `components/atoms/Divider.tsx`)*
      Props:
            - `label` (opzionale — se assente, linea piena senza testo).
      Colore sempre `colors.border` interno. Nessuna variante dashed/thickness.

12. **`Link`** *(→ `components/atoms/Link.tsx`)*
      Props:
            - `label`;
            - `onPress`;
            - `icon` (opzionale).
      Colore sempre `colors.accent`, sottolineatura via `borderBottom` (non `textDecoration`) interni. Feedback solo opacità (0.5) al press, nessuno scale/transition.

13. **`EmptyState`** *(→ `components/molecules/EmptyState.tsx`)*
      Props:
            - `icon` (componente lucide-react-native);
            - `title`;
            - `subtitle` (opzionale);
            - `actionLabel` / `onAction` (opzionali — CTA, attualmente assente del tutto nello showcase, va aggiunto come slot che usa internamente `Button`).
      Bordo dashed e badge icona 56px tinto `primary` al 12%: fissi interni.

14. **`ProgressBar`** *(→ `components/atoms/ProgressBar.tsx`)*
      Props:
            - `value` (0-100+, gestisce anche overflow oltre 100 con effetto dedicato).
      Colore fill dipende da soglie interne (error/warning/success). Le sparkle animate (funzioni `ProgressSparkles`, `ProgressSparkleField`, `ProgressSparkleFieldFlex` nel sorgente) sono dettagli implementativi privati, MAI esposte come props o file separati.

15. **`StatusBadge`** *(→ `components/atoms/StatusBadge.tsx`)*
      Props:
            - `label`;
            - `color`.
      ⚠️ Nel sorgente attuale è generico su un tipo TypeScript legato a `STATUS_ENUM_COLOR_MAP` (enum Prisma) — un componente UI riutilizzabile non deve conoscere gli enum di dominio. Il mapping enum→colore va spostato in un hook a parte (fuori da questo componente, lato chiamante in `web`/`mobile`) che associa nomi di stato a colori del tema; `StatusBadge` riceve solo `color` già risolto.

16. **`Tag`** *(→ `components/atoms/Tag.tsx`)*
      Props:
            - `name`;
            - `color`;
            - `compact` (default `false`);
            - `onRemove` (opzionale — se presente mostra la X di rimozione).
      Icona `Tag` (lucide) fissa interna, dimensioni derivate da `compact`.

17. **`TagList`** *(→ `components/molecules/TagList.tsx`, sorgente: funzione `TagOverflowRow`)*
      Props:
            - `tags` (array);
            - `expandable` (default `false`);
            - `onRemoveTag` / `onAddTag` (opzionali).
      Tutta la logica di misurazione/overflow (badge "+N", tap-to-expand) resta interna, mai esposta — altrimenti il componente non è più drop-in. Usa `Tag` internamente.

18. **`Spinner`** *(→ `components/atoms/Spinner.tsx`)*
      Props:
            - `color`;
            - `trackColor`.
      Animazione di rotazione (800ms lineare) fissa interna. Nota estetica: nello showcase l'aspetto è uno spinner circolare standard — l'estrazione è l'occasione per renderlo più distintivo/artistico, coerente con lo stile del resto del sistema (es. progress bar con sparkle), senza però aggiungere dipendenze pesanti.

19. **`Avatar`** *(→ `components/atoms/Avatar.tsx`, sorgente: funzione `ImageAvatar`)*
      Props:
            - `uri` (opzionale — se assente, mostra fallback);
            - `name` (opzionale — se assente, non renderizza alcuna label sotto);
            - `fallbackColor`;
            - `ring` (boolean, default `true` — attiva/disattiva il ring colorato intorno all'immagine).
      Il colore del testo del nome è sempre `colors.textColor` (non parametrizzabile). L'estrazione del colore dominante dall'immagine (hook `useDominantColor`, già presente in `mobile/src/utils/useDominantColor.ts` — riusare, non duplicare) resta interna, mai esposta come prop: è un dettaglio implementativo del ring.
      Uso duale obbligatorio: nell'elenco amici con nome visibile sotto l'immagine (`name` valorizzato), e dentro `FriendCard` (vedi sezione Card) SENZA nome (il nome in quel contesto è renderizzato dalla card stessa, non da Avatar — passare `name` assente/undefined lì).

20. **`SkeletonLine`** *(→ `components/atoms/SkeletonLine.tsx`)*
      Props:
            - `width` (opzionale, default 100%).
      Animazione pulse e colore (`colors.border`) fissi interni.

21. **`RatingStar`** *(→ `components/atoms/RatingStar.tsx`)*
      Unità atomica singola (una stella). Props:
            - `active`;
            - `color` / `inactiveColor`;
            - `onPress`.
      ⚠️ Bug da correggere durante l'estrazione: nello showcase, quando si passa da un valore basso a uno alto con un solo click (es. da 1 a 4 stelle), tutte le stelle intermedie si animano insieme nello stesso istante invece che in sequenza fluida una dopo l'altra — l'animazione va resa sequenziale.
      Un eventuale componente `RatingInput` (fila di 5 stelle, per form di voto) va costruito SOPRA `RatingStar`, non duplicandone la logica.

22. **`SectionLabel`** *(→ `components/atoms/SectionLabel.tsx`)*
      Props:
            - `children` (testo).
      Il componente più semplice di tutti — puro wrapper di stile per label uppercase secondarie (usato nella bottomsheet di dettaglio item, nei filtri, ecc.). È dipendenza di molti altri componenti: **va estratto per primo**.

23. **`Tooltip`** *(→ `components/molecules/Tooltip.tsx`, nuovo — non esiste ancora come funzione a parte nel sorgente, va isolato da dentro `PasswordStrengthIndicatorCopy`)*
      Props:
            - `trigger` (elemento/icona che apre il tooltip al tap);
            - `children` o `content` (contenuto del pannello flottante);
            - `visible`/`onToggle` (opzionale, se il controllo va lasciato al chiamante) oppure stato interno auto-gestito con solo `trigger`+`content` come props minime.
      Animazione fade/scale del pannello e posizionamento flottante restano interni. Nessuna conoscenza del contenuto (che sia un password-strength o altro): completamente agnostico rispetto al contenuto.

24. **`BottomSheet`** *(→ `components/organisms/BottomSheet.tsx`, nuovo — shell generica, non esiste ancora isolata: va estratta unificando `FilterBottomSheet` e `ItemDetailBottomSheet`, che nel sorgente replicano lo stesso identico pattern)*
      Props:
            - `visible`;
            - `onClose`;
            - `children` (contenuto, completamente a carico del chiamante).
      Interno e fisso: animazione slide-in/out (translateY o marginBottom animato — NON usare CSS `transform` per lo slide, causa testo sfocato su web a DPI frazionarie, problema già riscontrato e risolto nello showcase), backdrop con Pressable+fade, handle bar in cima, `boxShadow`+`borderRadius`+`overflow:hidden` sul contenitore, gestione tastiera se necessaria dal contenuto.
      **È il contenuto a essere specifico, mai il contenitore.** Nessun componente che usa `BottomSheet` deve reimplementare l'animazione o il backdrop.

25. **`FilterButton` + `FilterSheet`** *(coppia inseparabile → `components/atoms/FilterButton.tsx` + `components/organisms/FilterSheet.tsx`)*
      Props:
            - `groups` (array di gruppi/opzioni);
            - `selected` (array valori);
            - `visible` / `onClose`;
            - `onToggle`.
      Ricerca testuale, animazione slide-in, gestione tastiera: tutto interno. `FilterSheet` usa `BottomSheet` internamente (non reimplementa animazione/backdrop). Trigger (`FilterButton`) e contenuto (`FilterSheet`) restano due file separati ma concettualmente accoppiati: uno senza l'altro non ha senso d'uso.

26. **`ItemCardDetails`** *(→ `components/organisms/ItemCardDetails.tsx`, sorgente: funzione `ItemDetailBottomSheet`)*
      Props: dati completi dell'item (immagine, nome, categoria, descrizione, note personali, status, rating, tag) + callback per modifica status/rating/tag/note.
      Usa `BottomSheet` internamente per il contenitore. Usa `SectionLabel`, `StatusBadge`, `RatingStar`, `TagList` per il contenuto interno.
      Si apre quando si clicca una `ItemCard` (vedi sezione Card sotto) — è il componente "dettaglio" dedicato, separato dalla card stessa per evitare che `ItemCard` diventi un file enorme con dentro anche tutta la logica della sheet.

27. **`Card` — cartella dedicata `components/cards/`, non un singolo file**
      Nel sorgente è oggi un'unica funzione `Card` con 8 varianti (`outlined`, `filled`, `action`, `profile`, `item`, `challenge`, `notification`, `list`) e un prop-surface enorme — l'anti-pattern "effetto matrioshka" vietato dalla spec del `Button` (punto 1). Va spacchettato così:

      **`CardShell`** *(→ `components/cards/CardShell.tsx`)* — wrapper condiviso da tutte le varianti sotto (bordo, radius, ombra, background, `overflow:hidden`). Props: `borderColor`/`accentColor`, `backgroundColor` (opzionale, default `colors.foreground`), `borderWidth` (opzionale), `onPress` (opzionale — se presente il guscio diventa Pressable e l'intera area della card è cliccabile, non solo un eventuale bottone interno). Ogni variante sotto lo importa e lo usa internamente, **nessuna lo re-implementa**.

      Un file per variante dentro `components/cards/`, tutte importano `CardShell`:
            - **`ContentCard.tsx`** — unisce `outlined` + `filled` dello showcase: props `title`, `description` (opzionale), `variant: 'outlined' | 'filled'`. Differiscono solo nel trattamento sfondo (bordo vs gradient pieno), stessa struttura interna: non tenerle come componenti separati.
            - **`ActionCard.tsx`** — `title`, `description` (opzionale), `actionLabel`, `onAction` (usa `Button` internamente).
            - **`FriendCard.tsx`** *(nel sorgente: variant `profile`)* — `username`, `imageUri` (opzionale — in sua assenza usare un'icona lucide-react-native generica utente al posto di `Avatar`), `groupsInCommon` (opzionale), `onPress`. Usa `Avatar` internamente (senza `name`, vedi punto 19). Bordo e colore della freccia derivati dal colore dominante dell'immagine se `imageUri` presente, altrimenti fallback a `colors.border`/`colors.primary`.
            - **`ItemCard.tsx`** — unisce le due versioni con/senza immagine viste nello showcase in un solo componente: props `title`, `category` (opzionale), `status` (opzionale), `imageUri` (opzionale — se assente l'area immagine semplicemente non renderizza, non serve un componente separato), `rating` (opzionale), `tags` (opzionale, usa `TagList` internamente), `onPress`. Al click (su qualsiasi punto della card) apre `ItemCardDetails` — quella logica di apertura resta a carico del chiamante (screen/lista), `ItemCard` espone solo `onPress`.
            - **`ChallengeCard.tsx`** — `title`, `groupName` (opzionale), `timeframe` (opzionale), `progress`, `goal`, `favorite` / `onFavoriteToggle`, `status`. Bordo gradient `secondary→secondaryGradient` fisso interno. La stella preferiti nello showcase non ha alcuna animazione al click: va aggiunta in fase di estrazione (es. scale/bounce al toggle).
            - **`NotificationCard.tsx`** — `title`, `body` (opzionale), `time` (opzionale), `unread` (default `false`).
            - **`ListCard.tsx`** — `title`, `category` (opzionale), `icon` (lucide-react-native), `color`, `itemsCount` / `maxItems` (opzionali), `onPress`. Icona ruotata/ingrandita a riempimento dell'area, gradient di sfondo `transparent→color`: fissi interni.

      Regola generale per tutte le varianti con `onPress`: il click deve avere effetto su **qualsiasi punto** della card (tramite `CardShell` reso Pressable), mai solo su un bottone/icona interna isolata.
      Nessuna variante deve importare un'altra variante — solo `CardShell` in comune. Se in futuro emergono nuove varianti (es. una card "gruppo"), vanno aggiunte come nuovo file nella stessa cartella, mai come branch condizionale dentro un file esistente.

---

# CATEGORIZZAZIONE ATOMIC DESIGN

| Componente | Livello | Note |
|---|---|---|
| SectionLabel | **Atom** | Nessuna dipendenza, wrapper di stile puro |
| Badge | **Atom** | Non interattivo |
| Chip | **Atom** | Self-contained |
| Checkbox | **Atom** | Self-contained |
| RadioGroup | **Molecule** | Compone N opzioni radio (l'opzione singola è atom implicito, non esposto a parte) |
| Switch | **Atom** | Self-contained |
| Divider | **Atom** | Self-contained |
| Link | **Atom** | Self-contained |
| ProgressBar | **Atom** | Le sparkle interne sono implementazione privata, non sotto-componenti esposti |
| StatusBadge | **Atom** | Riceve solo `label`/`color` |
| Tag | **Atom** | Self-contained |
| Spinner | **Atom** | Self-contained |
| SkeletonLine | **Atom** | Self-contained |
| RatingStar | **Atom** | Unità singola per design esplicito |
| Button | **Atom** | Self-contained |
| Avatar | **Atom** | Nessuna composizione di altri componenti custom |
| CardShell | **Atom** | Puro guscio visivo (bordo/radius/ombra) |
| Tooltip | **Molecule** | Compone trigger + pannello posizionato |
| BottomSheet | **Organism** | Animazione + backdrop + gestione layout: complessità comportamentale alta pur essendo content-agnostico |
| Tabs | **Molecule** | Compone N tab item + indicatore |
| Pagination | **Molecule** | Compone N page item |
| FilterButton | **Atom** | Singolo bottone icona, solo il trigger |
| PageHeader | **Molecule** | Icona + titolo + subtitle + back button combinati |
| NavBar | **Organism** | Compone side-tab, home button, forma SVG, blur layer, theme toggle — sezione intera dell'interfaccia |
| EmptyState | **Molecule** | Icona + testo + Button (CTA) opzionale |
| TagList | **Molecule** | Compone N Tag + badge overflow |
| PasswordStrengthIndicator | **Molecule** | Compone Tooltip + lista regole |
| Input | **Molecule** | Text/textarea sono atom-level, ma la variant `password` compone PasswordStrengthIndicator → il componente unificato è Molecule |
| ContentCard | **Molecule** | CardShell + testo |
| ActionCard | **Molecule** | CardShell + testo + Button |
| FriendCard | **Molecule** | CardShell + Avatar + testo + bottone freccia |
| NotificationCard | **Molecule** | CardShell + icona + testo + badge unread |
| ListCard | **Molecule** | CardShell + icona + testo + bottone freccia |
| ChallengeCard | **Organism** | CardShell + ProgressBar + stella preferiti animata + gradient bordo — logica e stato non banali |
| FilterSheet | **Organism** | BottomSheet + Input (ricerca) + Checkbox list + FilterButton trigger |
| ItemCardDetails | **Organism** | BottomSheet + SectionLabel + StatusBadge + RatingStar + TagList + Tooltip di modifica |
| ItemCard | **Organism** | CardShell + Avatar/immagine + StatusBadge + RatingStar + TagList + apertura ItemCardDetails al click |

---

# SEQUENZA DI IMPLEMENTAZIONE (batch paralleli per subagent)

Ogni batch dipende **solo** da componenti già completati nei batch precedenti. Dentro lo stesso batch, i componenti non dipendono l'uno dall'altro: possono essere lanciati come subagent in parallelo senza rischio di conflitti d'importazione.

**Batch 1 — Fondamenta (zero dipendenze da altri componenti nuovi)**
SectionLabel, Badge, Chip, Checkbox, RadioGroup, Switch, Divider, Link, ProgressBar, StatusBadge, Tag, Spinner, SkeletonLine, RatingStar, Button, Avatar, CardShell, Tooltip, BottomSheet, Tabs, Pagination, FilterButton, PageHeader, NavBar
*(23 componenti — se la concorrenza dei subagent è limitata, spezzare in 3-4 wave da 6-8 senza cambiare l'ordine relativo: sono comunque tutti indipendenti tra loro)*

**Batch 2 — Dipendono solo da Batch 1**
- EmptyState *(← Button)*
- TagList *(← Tag)*
- PasswordStrengthIndicator *(← Tooltip)*
- ContentCard *(← CardShell)*
- ActionCard *(← CardShell, Button)*
- FriendCard *(← CardShell, Avatar)*
- NotificationCard *(← CardShell)*
- ListCard *(← CardShell)*
- ChallengeCard *(← CardShell, ProgressBar)*

**Batch 3 — Dipendono da Batch 2**
- Input *(← PasswordStrengthIndicator, per la variant `password`)*
- ItemCardDetails *(← BottomSheet, SectionLabel, StatusBadge, RatingStar, TagList)*

**Batch 4 — Dipendono da Batch 3**
- FilterSheet *(← BottomSheet, Input, Checkbox, FilterButton)*
- ItemCard *(← CardShell, TagList, ItemCardDetails)*

Nota: `Input` finisce in Batch 3 e non in Batch 1 perché la variant `password` dipende da `PasswordStrengthIndicator`, che a sua volta dipende da `Tooltip` (Batch 1) — va costruito nell'ordine corretto della catena, non nell'ordine in cui è descritto nella spec del punto 3.

---

# PROMPT DI ESECUZIONE

Prompt pronto da passare a un agente con contesto pulito per eseguire questo piano (una singola batch alla volta, o l'intero piano in sequenza):

```
Leggi per intero il file docs/componentRefactoring.md nella root del repository. Contiene il piano completo per estrarre i componenti UI da mobile/src/app/(app)/colors-showcase.tsx e ricrearli come componenti riutilizzabili in mobile/src/components/.

Prima di scrivere codice:
1. Apri mobile/src/app/(app)/colors-showcase.tsx e localizza, per nome funzione, il componente sorgente che devi estrarre (i nomi funzione sono indicati tra parentesi accanto a ogni voce del documento quando differiscono dal nome finale).
2. Leggi con attenzione la sezione "PALETTE COLORI" del documento: i colori vanno copiati esattamente da ShowcaseColors, mai reinventati.
3. Segui la sezione "STRUTTURA DI DESTINAZIONE" per decidere il path esatto del nuovo file.
4. Rispetta rigorosamente le props elencate per il componente assegnato: solo quelle vanno esposte esternamente, tutto il resto (animazioni, colori derivati, logica di misurazione) resta interno all'implementazione.
5. Se la voce del documento segnala un bug (⚠️) o un comportamento da correggere, correggilo durante l'estrazione: non portare il difetto nel nuovo componente.
6. Se il componente dipende da altri componenti già estratti (vedi "SEQUENZA DI IMPLEMENTAZIONE"), importali dal loro path in mobile/src/components/ — non duplicarne la logica.
7. Segui le convenzioni del progetto in mobile/CLAUDE.md (TypeScript strict, no any, NativeWind, naming PascalCase per componenti).

Componente/i da estrarre in questo passaggio: [INSERIRE QUI IL NOME DEL COMPONENTE O DEL BATCH DALLA SEZIONE "SEQUENZA DI IMPLEMENTAZIONE"]

Al termine, verifica che il nuovo componente non abbia errori TypeScript (tsc --noEmit) e non rompa l'import in colors-showcase.tsx se quest'ultimo viene aggiornato per usare il nuovo componente al posto della funzione inline.
```
