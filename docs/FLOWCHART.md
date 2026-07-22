# FLOWCHART

Versione "leggibile" di [FLOWLINE.md](FLOWLINE.md): stessa logica, riscritta pagina per pagina con diagrammi ASCII per visualizzare i flussi di navigazione.

> Nota di correzione logica: in FLOWLINE.md `(app)/` risultava indentato come figlio di `login/`. In realtà sono due route group **fratelli** (`(auth)` e `(app)`, coerente con `mobile/src/app/`): il login non "contiene" l'app, ma **reindirizza** ad essa dopo autenticazione riuscita.

## Legenda

| Simbolo | Significato |
| --- | --- |
| `[.../]` | pagina |
| `[M]` | modale / bottom sheet |
| `[B]` | bottone |
| `[F]` | funzionalità |
| `→` | navigazione verso altra pagina |
| `⤷` | apertura modale/bottom sheet (resta sulla stessa pagina) |
| `◆` | decisione / stato condizionale |

---

## 1. Flusso macro

```text
┌──────────────┐
│ landing page │
└──────────────┘
        │ →
        ▼
┌────────┐
│ login/ │
├────────┤
│        │ ⤷ registrazione [F]
│        │ ⤷ recupero password [F]
└────────┘
     │ ◆ auth riuscita
     ▼
┌────────────────────────────┐
│ (app)/                     │
├────────────────────────────┤
│ home · profilo · notifiche │
│ · amici · gruppi           │
└────────────────────────────┘
```

---

## 2. Home

```text
┌────────────────────┐
│ home/              │
├────────────────────┤
│ [B] randomizzatore ┼─⤷ [M] randomizzatore di:
│                    │     ├─ numeri [F]
│                    │     ├─ colori [F]
│                    │     └─ lettere alfabeto [F]
│                    │
│ [B] elenco liste   ┼─→ vedi § 2.1 lista/
│                    │
│ [B] randomizzatore ┼─→ di elementi di più liste insieme (premium?)
│                    │
│ [B] aggiungi lista ┼─⤷ [M] dettaglio lista
│                    │     ├─ nome
│                    │     ├─ listcategory
│                    │     ├─ colore
│                    │     ├─ icona (lucide react)
│                    │     └─ mostra/nascondi agli amici
└────────────────────┘
```

### 2.1 Lista (dettaglio)

```text
┌────────────────────┐
│ lista/             │
├────────────────────┤
│ [B] modifica lista ┼─⤷ [M] modifica lista
│                    │
│ [B] randomizza     |
│                    │
│ [B] aggiungi item  ┼─⤷ [M] dettaglio item (nuovo)
│                    │
│ [B] elenco item    │
│   └─ item          ┼─⤷ [M] dettaglio item
│                    │     ├─ nome
│                    │     ├─ categoria
│                    │     ├─ tag
│                    │     ├─ rating
│                    │     └─ mostra/nascondi agli amici
└────────────────────┘
```
`[M] dettaglio item` è lo stesso componente sia in creazione che in modifica → riusabile.

---

## 3. Profilo

```text
┌───────────────────────────────────┐
│ profilo/                          │
├───────────────────────────────────┤
│ immagine profilo (elenco statico) │
│ nome utente (modificabile?)       │
│ statistiche account               │
│                                   │
│ [B] impostazioni                  ┼─⤷ [M] impostazioni
│                                   │     ├─ logout
│                                   │     ├─ lingua (per ora no)
│                                   │     ├─ tema
│                                   │     └─ (futuro) impostazioni notifiche
└───────────────────────────────────┘
```

---

## 4. Notifiche

```text
┌───────────────────────────────────────────────┐
│ notifiche/                                    │
├───────────────────────────────────────────────┤
│ elenco inviti gruppi                          │
│   └─ stato: in attesa / accettato / rifiutato │
│                                               │
│ elenco inviti amicizie                        │
│   └─ stato: in attesa / accettato / rifiutato │
└───────────────────────────────────────────────┘
```
Un'unica pagina, due sezioni parallele, stesso pattern di stato.

---

## 5. Amici

```text
┌────────────────────────────────┐
│ amici/                         │
├────────────────────────────────┤
│ statistiche generali condivise │
│                                │
│ elenco amici                   │
│   └─ amico/                    ┼─→ vedi sotto
└────────────────────────────────┘
```

```text
┌─────────────────────┐
│ amico/              │
├─────────────────────┤
│ liste dell'amico    │
│ statistiche singole │
└─────────────────────┘
```

---

## 6. Gruppi

```text
┌─────────────────────────────────────┐
│ gruppi/                             │
├─────────────────────────────────────┤
│ elenco membri                       │
│                                     │
│ ◆ se admin/amministratore           │
│   └─ impostazioni gruppo            ┼─⤷ [M] gestione membri
│                                     │
│ elenco liste condivise              │
│   ├─ [B] partecipa alla lista       │
│   └─ [B] randomizzatore della lista │
│                                     │
│ elenco challenge                    │
│   └─ progresso singolo per utente ◆ │
└─────────────────────────────────────┘
```
Ogni challenge tiene uno stato di progresso **per utente**, anche condiviso a livello di gruppo.
