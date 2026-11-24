# ERRORI-APERTI.md — Randomix

> Errori noti e non ancora risolti, trovati fuori dalle ondate. Formato delle schede allineato a
> [`TODO-MODELLO.md`](TODO-MODELLO.md), così da poter essere spostate in [`TODO.md`](TODO.md) quando
> vengono assegnate a un'ondata. Legenda dei segni: vedi la prefazione di [`TODO.md`](TODO.md).

---

## E01

- [!] [FIX] `TagCreateSheet`: `setColor` tipizzato come unione di letterali invece di `string`
- 🏷️ Area: 📋 Liste e item
- ⏳ Da fare (trovato il 22/11/2026, durante il pull di allineamento a `origin/main`) · Urgenza 🟢 · Rischio 🟢 · Effort 🟢
- [`TagCreateSheet.tsx:49`](../mobile/src/components/organisms/TagCreateSheet.tsx#L49), [`TagCreateSheet.tsx:56`](../mobile/src/components/organisms/TagCreateSheet.tsx#L56), [`TagCreateSheet.tsx:109`](../mobile/src/components/organisms/TagCreateSheet.tsx#L109)
- **Problema**: 2 errori TypeScript in `npx tsc --noEmit` su `mobile/` (il progetto compila comunque:
  Metro non fa il typecheck, quindi l'errore non si vede a runtime).

  ```
  TagCreateSheet.tsx(56,14): error TS2345: Argument of type 'string' is not assignable to parameter
    of type 'SetStateAction<"rgb(255, 73, 90)" | ... | "#c1e63d">'.
  TagCreateSheet.tsx(109,9): error TS2322: Type 'Dispatch<SetStateAction<"rgb(255, 73, 90)" | ...>>'
    is not assignable to type '(color: string) => void'.
  ```

  **Causa radice**: `palette` nasce da `Object.values(colors.extraColors)`, dove `extraColors` ha valori
  tipizzati come letterali. Quindi `useState(palette[0])` (riga 49) non inferisce `string` ma l'unione
  dei 19 colori della palette. Da lì due conseguenze:
  - riga 56 — `setColor(editingTag?.color ?? palette[0])`: `editingTag.color` arriva dal backend come
    `string` generica, non assegnabile all'unione di letterali;
  - riga 109 — `onSelect={setColor}`: `ColorPickerSheet` dichiara `onSelect: (color: string) => void`,
    e `Dispatch<SetStateAction<unione>>` non è compatibile (parametro controvariante).

  **Cosa fare**: annotare esplicitamente lo stato — `useState<string>(palette[0])`. Da verificare che
  sia la scelta giusta e non il contrario (cioè restringere `ColorPickerSheet.onSelect` all'unione):
  `ColorPickerSheet` è un componente condiviso e riceve `colors` da più chiamanti, quindi `string` è
  probabilmente corretto, ma va confermato prima di toccare qualcosa.

  **Attenzione**: `ColorPickerSheet` è un componente esistente e condiviso — se la soluzione scelta
  richiede di modificarlo, serve il permesso esplicito del titolare (regola CLAUDE.md).

  **Fatto quando**: `cd mobile && npx tsc --noEmit` non riporta più errori su `TagCreateSheet.tsx`,
  e la scelta del colore funziona sia in creazione sia in modifica di un tag esistente.

- **Note**: errore **preesistente**, non introdotto dal pull del 22/11/2026 — `TagCreateSheet.tsx` non è
  stato toccato né dai 43 commit scaricati né dal lavoro locale in corso sul randomizer.
