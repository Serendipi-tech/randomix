
# OBIETTIVO
Estrarre i componenti dal file colors-showcase e inserirli nella cartella components, atomizzandoli e rendendoli il più possibile riutilizzabili.
Tutti i componenti precedenti (non citati) vanno sostituiti e/o cancellati per uniformità.

# ⚠️ PALETTE COLORI — NON NEGOZIABILE
I colori dell'app sono stati decisi e confermati in `colors-showcase.tsx` (costante `ShowcaseColors`). Questa è la fonte di verità definitiva.
**Non vanno cambiati i colori scelti in colors-showcase.tsx** — al contrario, è il tema reale dell'app (`constants/theme.ts`, `Colors`) a dover essere **sostituito/allineato** con quanto già confermato in `ShowcaseColors`, non viceversa. Durante l'estrazione dei componenti, nessun colore va reinventato, corretto o "migliorato": si porta pari pari quello già presente nello showcase.

# IGNORA I SEGUENTI COMPONENTI
Cioè, *non* componentizzarli e lasciali indietro:
- Bottone "Hide Colors Sections";
- ColorPaletteShowcase;
- Load/Unload
- DiceLogoCopy, FeatureRowCopy, PasswordStrengthIndicatorCopy — sono copie dei componenti reali dell'auth flow (usate solo per test grafico isolato in questa pagina). Componentizzarli da qui creerebbe un duplicato di qualcosa che probabilmente esiste già altrove nell'app.

# I SEGUENTI COMPONENTI HANNO CARATTERISTICHE SPECIFICHE
1. **Componente *PageHeader***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Icona (lucide react);
            - Titolo;
            - Action trigger per il back button (in sua assenza, il bottone non si vede);
            - Subtitle (opzionale).
      I colori dell'icona hanno il gradient fisso che non può essere alterato dall'esterno.
2. **Componente *Button***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Variant (primary, secondary, ecc);
            - Testo
            - Action
            - Disabled (default false, se true attiva la variante ghost di default);
      Il bottone dev'essere una shell pulita e minimalista. In base alla prop variant deve renderizzare il tipo specifico di bottone. Il componente è unico, senza effetto matrioshka.
3. **Componente *Input***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Variant (text, password, textarea);
            - Value / OnChangeText;
            - Placeholder (opzionale, altrimenti default per variant);
            - Disabled (opzionale, attualmente assente — da aggiungere).
      Lo stato di focus (bordo `primary`) è gestito internamente. La variant `password` include internamente il toggle mostra/nascondi e l'indicatore di forza password — quest'ultimo (`PasswordStrengthIndicatorCopy`) resta come sotto-componente interno, non esposto, ma dev'essere rinominato in "PassWordStrenghtIndicator" e la tootip con l'icona che la triggera (passata come props) dev'essere un componente riutilizzabile esterno.
4. **Componente *Badge***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Label;
            - Color (determina testo, bordo e sfondo tinto).
      Opacità sfondo (0.2), padding e border-radius fissi interni. Nessuna interattività: non è pressable.
5. **Componente *Chip***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Label;
            - Selected;
            - Disabled (default false);
            - Action.
      Scale-on-press e colori bordo/sfondo derivati da `selected` restano interni.
6. **Componente *Checkbox***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Checked;
            - Action;
            - Label (opzionale).
      Riempimento sempre gradient `secondary → secondaryGradient`, transizione 150ms: fissi interni.
7. **Componente *RadioButton* / *RadioGroup***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Options (array label/value);
            - Selected value;
            - Action (onChange).
8. **Componente *Switch/Toggle***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Value (boolean);
            - Action;
            - Disabled (opzionale).
      Geometria (50×30 track, 24×24 thumb) e colori attivo/inattivo fissi interni.
9. **Componente *Tabs***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Items (array label);
            - Active index;
            - Action (onChange).
      Indicatore sempre underline `primary`, minHeight 48 fisso (target di tocco), scale-on-press 0.96 interni.
10. **Componente *Pagination***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Total pages;
            - Current page;
            - Action (onChange).
11. **Componente *Divider***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Label (opzionale — se assente, linea piena senza testo).
      Colore sempre `colors.border` interno. Nessuna variante dashed/thickness.
12. **Componente *Link***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Label;
            - Action;
            - Icon (opzionale).
      Colore sempre `colors.accent`, sottolineatura via `borderBottom` (non `textDecoration`) interni. Feedback solo opacità (0.5), nessuno scale/transition.
13. **Componente *EmptyState***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Icona (lucide react);
            - Title;
            - Subtitle (opzionale);
            - Action/CTA (opzionale — attualmente assente del tutto nello showcase, da aggiungere come slot).
      Bordo dashed e badge icona 56px tinto `primary` al 12% fissi interni.
14. **Componente *ProgressBar***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Value (0-100+, gestisce anche overflow oltre 100).
      Colore fill dipende da soglie interne (error/warning/success). Le sparkle animate (`ProgressSparkles`, `ProgressSparkleField`, `ProgressSparkleFieldFlex`) sono dettagli implementativi interni, MAI esposte come props.
15. **Componente *StatusBadge***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Label;
            - Color.
      ⚠️ Attenzione in fase di estrazione: oggi è generico su un tipo TypeScript legato a `STATUS_ENUM_COLOR_MAP` (enum Prisma) — un componente UI riutilizzabile non deve conoscere gli enum di dominio. Il mapping enum→colore resta a carico del chiamante (in `web`/`mobile`), il componente accetta solo `color` diretto.
      Dev'essere sostituito da hook esterno che associa nomi a colori del tema.
16. **Componente *Tag***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Name;
            - Color;
            - Compact (default false);
            - OnRemove (opzionale — se presente mostra la X).
      Icona `Tag` fissa interna, dimensioni derivate da `compact`.
17. **Componente *TagList* (ex `TagOverflowRow`)**
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Tags (array);
            - Expandable (default false);
            - OnRemoveTag / OnAddTag (opzionali).
      Tutta la logica di misurazione/overflow (+N, tap-to-expand) resta interna — non esposta, altrimenti il componente non è più "drop-in".
18. **Componente *Spinner***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Color;
            - Track color.
      Animazione di rotazione (800ms lineare) fissa interna. Vedi anche #4 nella sezione FIX qui sopra (restyle più "artistico").
19. **Componente *Avatar* (ex `ImageAvatar`)**
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Uri;
            - Name;
            - Fallback color;
            - Ring (booleano di attivazione ring intorno all'elemento)
      Il colore del testo è sempre textColor.
      L'estrazione del colore dominante (`useDominantColor`, già in `utils/useDominantColor.ts`) resta interna al componente, mai esposta come prop — è un dettaglio implementativo del ring.
      Questo componente dev'essere usato sia nell'elenco di amici con nome sotto, sia nella card che elenca gli amici. Ma in quest'ultima NON deve includere il nome, sarà nella card stessa.
20. **Componente *SkeletonLine***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Width (opzionale, default 100%).
      Animazione pulse e colore (`colors.border`) fissi interni.
21. **Componenti *FilterButton* + *FilterSheet* (coppia inseparabile)**
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Groups (array di gruppi/opzioni);
            - Selected (array valori);
            - Visible / OnClose;
            - OnToggle.
      Ricerca testuale, animazione slide-in, gestione tastiera: tutto interno. Non vanno trattati come due componenti scollegati — il trigger senza la sheet (o viceversa) non ha senso da solo.
      **LA BOTTOM SHEET DEV'ESSERE UN COMPONENTE RIUTILIZZABILE, SOLO RICHIAMATO DA QUESTA SEZIONE. E' IL CONTENUTO A ESSERE SPECIFICO, NON IL CONTENITORE.**
22. **Componente *RatingStar* (unità atomica singola)**
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Active;
            - Color / inactiveColor;
            - Action.
      Nota: un eventuale componente `RatingInput` (fila di 5 stelle) va costruito SOPRA questo, non duplicandolo.
23. **Componente *SectionLabel***
      I seguenti elementi vanno passati dall'esterno tramite props:
            - Children (testo).
      Il più semplice di tutti — puro wrapper di stile per label uppercase secondarie (usato nella bottomsheet di dettaglio, nei filtri, ecc). È dipendenza di molti altri componenti: va estratto per primo.
24. **Componente *Card* — cartella dedicata, non un singolo file**
      Nello showcase è oggi un'unica funzione con 8 varianti (`outlined`, `filled`, `action`, `profile`, `item`, `challenge`, `notification`, `list`) e un prop-surface enorme — esattamente l'anti-pattern "effetto matrioshka" vietato dalla spec del Button (#2). Va spacchettato così:

      **`CardShell`** — wrapper condiviso da tutte le varianti (bordo, radius, ombra, background, `overflow:hidden`). Props: `borderColor`/`accentColor`, `backgroundColor` (opzionale, default `colors.foreground`), `borderWidth` (opzionale), `onPress` (opzionale — se presente il guscio diventa Pressable). Ogni variante sotto lo usa internamente, non lo re-implementa.

      Cartella `components/cards/`, un file per variante (import di `CardShell` in ognuna):
            - **`ContentCard`** — unisce `outlined` + `filled`: props `title`, `description` (opzionale), `variant: 'outlined' | 'filled'`. Differiscono solo per trattamento sfondo (bordo vs gradient pieno), stessa struttura interna: non serve tenerle separate.
            - **`ActionCard`** — `title`, `description` (opzionale), `actionLabel`, `onAction`.
            - **`FriendCard`** (*Ex ProfileCard*) — `username`, `imageUri` (opzionale, in sua assenza usare icona lucide react generica per uno user), `groupsInCommon` (opzionale), `onPress`. Bordo e colore freccia derivati dal colore dominante dell'immagine (interno, via `useDominantColor`) se `imageUri` presente, altrimenti fallback a `colors.border`/`colors.primary`.
            - **`ItemCard`** — unisce le due versioni con/senza immagine viste nello showcase: props `title`, `category` (opzionale), `status` (opzionale), `imageUri` (opzionale — se assente l'area immagine semplicemente non renderizza, niente componente separato), `rating` (opzionale), `tags` (opzionale, usa `TagList` internamente), `onPress`.
            - **`ChallengeCard`** — `title`, `groupName` (opzionale), `timeframe` (opzionale), `progress`, `goal`, `favorite` / `onFavoriteToggle`, `status`. Bordo gradient `secondary→secondaryGradient` e stella preferiti fissi interni (vedi anche #5 nella sezione FIX qui sopra — l'animazione del click sulla stella va aggiunta qui).
            - **`NotificationCard`** — `title`, `body` (opzionale), `time` (opzionale), `unread` (default false).
            - **`ListCard`** — `title`, `category` (opzionale), `icon` (lucide react), `color`, `itemsCount` / `maxItems` (opzionali), `onPress`. Icona ruotata/ingrandita a riempimento, gradient di sfondo `transparent→color`: fissi interni.
            Tutte le card con onPress su un singolo bottone, devono avere effetto quando il click è in *qualsiasi punto* della card stessa, non solo sul bottone in sé.

      Nessuna variante deve importare le altre — solo `CardShell` in comune. Se in futuro emergono altre varianti (es. una card "gruppo"), vanno aggiunte come nuovo file nella stessa cartella, mai come branch dentro un file esistente.

Per quanto riguarda BottomSheet:
      - componente riutilizzabile shell;
      - il contenuto viene passato dagli altri componenti.

Per quanto riguarda ItemCard:
      - quando si clicca la card, i dettagli vengono visualizzati dentro la BottomSheet. Per evitare casino, serve un componente a parte ItemCardDetails.

---

# CATEGORIZZAZIONE ATOMIC DESIGN

Due componenti impliciti nelle spec sopra, non ancora elencati esplicitamente, verificati contro il codice reale prima di aggiungerli:
- **Tooltip** — richiesto da #3 (Input): il trigger icona + pannello flottante dentro `PasswordStrengthIndicatorCopy` va splittato in un Tooltip generico (icon trigger + content passati come props) + un `PassWordStrengthIndicator` che lo consuma.
- **BottomSheet** — richiesto dalla nota in fondo al file: shell generica (animazione slide, backdrop, handle, safe area) condivisa da `FilterSheet` e `ItemCardDetails`, verificata: entrambe oggi replicano lo stesso pattern quasi identico (mount/visible, translateY/marginBottom animato, Pressable backdrop, boxShadow+borderRadius+overflow).

| # | Componente | Livello | Note |
|---|---|---|---|
| 1 | SectionLabel | **Atom** | Nessuna dipendenza, wrapper di stile puro |
| 2 | Badge | **Atom** | Non interattivo |
| 3 | Chip | **Atom** | Self-contained |
| 4 | Checkbox | **Atom** | Self-contained |
| 5 | RadioGroup | **Molecule** | Compone N "opzioni" radio (l'opzione singola è l'atom implicito, non esposto a parte) |
| 6 | Switch/Toggle | **Atom** | Self-contained |
| 7 | Divider | **Atom** | Self-contained |
| 8 | Link | **Atom** | Self-contained |
| 9 | ProgressBar | **Atom** | Le sparkle interne sono implementazione privata, non sotto-componenti esposti |
| 10 | StatusBadge | **Atom** | Riceve solo `label`/`color` |
| 11 | Tag | **Atom** | Self-contained |
| 12 | Spinner | **Atom** | Self-contained |
| 13 | SkeletonLine | **Atom** | Self-contained |
| 14 | RatingStar | **Atom** | Unità singola, per design esplicito nella spec |
| 15 | Button | **Atom** | Self-contained |
| 16 | Avatar | **Atom** | Nessuna composizione di altri componenti |
| 17 | CardShell | **Atom** | Puro guscio visivo (bordo/radius/ombra) |
| 18 | Tooltip | **Molecule** | Compone trigger + pannello posizionato |
| 19 | BottomSheet (shell) | **Organism** | Animazione + backdrop + gestione layout: complessità comportamentale alta pur essendo content-agnostic |
| 20 | Tabs | **Molecule** | Compone N tab item + indicatore |
| 21 | Pagination | **Molecule** | Compone N page item |
| 22 | FilterButton | **Atom** | Singolo bottone icona, solo il trigger |
| 23 | NavBar | **Organism** | Compone side-tab, home button, forma SVG, blur layer, theme toggle — sezione intera dell'interfaccia |
| 24 | EmptyState | **Molecule** | Icona + testo + Button (CTA) opzionale |
| 25 | TagList | **Molecule** | Compone N Tag + badge overflow |
| 26 | PassWordStrengthIndicator | **Molecule** | Compone Tooltip + lista regole |
| 27 | Input | **Molecule** | Text/textarea semplici sono atom-level, ma la variant `password` compone PassWordStrengthIndicator — il componente unificato è quindi Molecule |
| 28 | ContentCard | **Molecule** | CardShell + testo |
| 29 | ActionCard | **Molecule** | CardShell + testo + Button |
| 30 | FriendCard | **Molecule** | CardShell + Avatar + testo + bottone freccia |
| 31 | NotificationCard | **Molecule** | CardShell + icona + testo + badge unread |
| 32 | ListCard | **Molecule** | CardShell + icona + testo + bottone freccia |
| 33 | ChallengeCard | **Organism** | CardShell + ProgressBar + stella preferiti animata + gradient bordo — logica e stato non banali |
| 34 | FilterSheet | **Organism** | BottomSheet + Input (ricerca) + Checkbox list + FilterButton trigger |
| 35 | ItemCardDetails | **Organism** | BottomSheet + SectionLabel + StatusBadge + RatingStar + TagList + Tooltip di modifica |
| 36 | ItemCard | **Organism** | CardShell + Avatar/immagine + StatusBadge + RatingStar + TagList + apertura ItemCardDetails al click |

---

# SEQUENZA DI IMPLEMENTAZIONE (batch paralleli per subagent)

Ogni batch dipende **solo** da componenti già completati nei batch precedenti. Dentro lo stesso batch, i componenti non dipendono l'uno dall'altro: possono essere lanciati come subagent in parallelo senza rischio di conflitti d'importazione.

**Batch 1 — Fondamenta (zero dipendenze da altri componenti nuovi)**
SectionLabel, Badge, Chip, Checkbox, RadioGroup, Switch/Toggle, Divider, Link, ProgressBar, StatusBadge, Tag, Spinner, SkeletonLine, RatingStar, Button, Avatar, CardShell, Tooltip, BottomSheet, Tabs, Pagination, FilterButton, NavBar
*(23 componenti — se la concorrenza dei subagent è limitata, spezzare in 3-4 wave da 6-8 senza cambiare l'ordine relativo: sono comunque tutti indipendenti tra loro)*

**Batch 2 — Dipendono solo da Batch 1**
- EmptyState *(← Button)*
- TagList *(← Tag)*
- PassWordStrengthIndicator *(← Tooltip)*
- ContentCard *(← CardShell)*
- ActionCard *(← CardShell, Button)*
- FriendCard *(← CardShell, Avatar)*
- NotificationCard *(← CardShell)*
- ListCard *(← CardShell)*
- ChallengeCard *(← CardShell, ProgressBar)*

**Batch 3 — Dipendono da Batch 2**
- Input *(← PassWordStrengthIndicator, per la variant `password`)*
- ItemCardDetails *(← BottomSheet, SectionLabel, StatusBadge, RatingStar, TagList)*

**Batch 4 — Dipendono da Batch 3**
- FilterSheet *(← BottomSheet, Input, Checkbox, FilterButton)*
- ItemCard *(← CardShell, TagList, ItemCardDetails)*

Nota: `Input` finisce in Batch 3 e non in Batch 1 perché la variant `password` dipende da `PassWordStrengthIndicator` — dipendenza inversa rispetto a quanto potrebbe sembrare leggendo la spec #3 in isolamento (dove PassWordStrengthIndicator è descritto come "sotto-componente interno" di Input, ma quel sotto-componente a sua volta dipende da Tooltip, quindi va costruito prima).