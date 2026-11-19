# Modello di TODO.md: struttura e regole per un nuovo progetto

> Riassume il modello usato in [`TODO.md`](TODO.md) di questo progetto (dal 13/10/2026, 118 task, tre ondate di
> lavoro ad agenti). Serve a ripartire da zero su un altro progetto con lo stesso formato: cosa contiene ogni sezione,
> come si scrive un task, come cambia stato, come si rigenerano i riepiloghi.

---

## 1. Principi

1. **Solo task certi.** Un task entra solo se il problema è stato ricontrollato sul codice, o se è un'attività che di
   sicuro va fatta. Le segnalazioni non verificate restano nel report da cui vengono, finché qualcuno non le controlla.
2. **Una fonte dichiarata.** In testa al file c'è un riquadro che dice da dove nasce la lista: di solito un report di
   verifica del codice, con i codici dei rilievi (qui `SEC1`, `BIZ3`, `D5`…) che i task citano nel titolo.
3. **Id stabili.** `T01`, `T02`… non cambiano mai e non si riusano: un task rimosso resta con 🗑️ e il motivo. I task
   nuovi prendono il numero successivo all'ultimo, anche se nascono "in mezzo".
4. **Ordine di esecuzione.** I task iniziali sono numerati nell'ordine in cui conviene farli; quelli aggiunti dopo vanno
   in fondo e l'ordine lo danno urgenza e dipendenze.
5. **Niente si cancella.** Un task chiuso resta nel file con `[x]` e ✅, con l'ondata e il commit che lo hanno chiuso.
6. **Due viste sempre allineate.** Ogni cambio di stato si scrive nella tabella **e** nella scheda del task, poi si
   rigenerano i riepiloghi.

---

## 2. Anatomia del file (sezioni in quest'ordine)

| # | Sezione | Contenuto |
|---|---------|-----------|
| 1 | Titolo e riquadro d'origine | data di avvio, report di partenza, regola "solo task certi" |
| 2 | `## Prefazione: struttura e legenda` | struttura del file e le cinque legende (checkbox, tipo, stato, area, urgenza/rischio/effort) |
| 3 | `## Tabella riassuntiva` | una riga per task |
| 4 | `### Riepilogo per stato` | conteggi per stato e id raggruppati (generato) |
| 5 | `### Riepilogo per urgenza e rischio` | conteggi e incrocio urgenza × rischio (generato) |
| 6 | `## Elenco task` | una scheda `### Tnn` per task |

Le sezioni 4 e 5 stanno sotto la tabella perché ne sono un calcolo: si rigenerano con lo script del §8, mai a mano.

---

## 3. Le legende (da copiare nella prefazione)

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
| 🔄 | in corso | assegnato a un'ondata o a una sessione |
| 🔍 | da valutare | il problema è certo, la soluzione va scelta (la scheda elenca le opzioni) |
| ⏸️ | in attesa | di una decisione, di un dato o di un altro task (il motivo è fra parentesi) |
| 🧩 | da completare | iniziato, manca una parte dichiarata |
| 🧪 | da testare | fatto, manca la prova |
| ✅ | fatto | chiuso, con ondata e commit |
| 🗑️ | rimosso | con il motivo |

### Area

Le aree **dipendono dal progetto**: vanno scelte all'inizio (15-20 al massimo), ognuna con un'emoji e una riga
"Comprende". Ogni task indica una o più aree: la prima è la principale. Esempio di questo progetto:

| Area | Comprende |
|------|-----------|
| 🔐 Identità e accesso | login, SSO, inviti, sessioni, 2FA, profilo personale |
| 🛡️ Ruoli e permessi | ruoli, permessi, isolamento tra tenant, audit |
| 📁 File e upload | caricamento e accesso ai file |
| 🔌 API e integrazioni | REST, API key, webhook |
| 🗄️ Database | schema, migration, vincoli, permessi del ruolo DB |
| 🚀 Infrastruttura e deploy | ambienti, segreti, immagine, pipeline |
| 🧹 Codice e repository | codice morto, dipendenze, lint, pulizia |
| 📖 Documentazione | docs/, README, CLAUDE.md |
| 🧪 Test | test E2E e di guardia |

Le aree di dominio (qui pagamenti, licenze, iscrizioni, fruizione, quiz, corsi, organizzazioni, badge, report,
interfaccia, email) si aggiungono secondo il prodotto.

### Urgenza, rischio, effort

| | 🔴 | 🟡 | 🟢 |
|---|---|---|---|
| **Urgenza**: quanto presto va fatto | subito, prima del go-live | prima di attivare la funzione interessata | quando c'è tempo |
| **Rischio**: rischio dell'intervento (regressioni, dati, pagamenti) | tocca dati esistenti, schema o soldi | tocca un flusso importante, va testato bene | modifica circoscritta |
| **Effort**: lavoro stimato | più giorni | circa una giornata | qualche ora |

Il **rischio** è quello di fare la modifica, non la gravità del problema: la gravità sta nell'urgenza.

---

## 4. La tabella riassuntiva

```markdown
| ID  | Titolo | File di riferimento | Breve descrizione | Stato | Urgenza | Rischio | Effort |
| --- | ------ | ------------------- | ----------------- | ----- | ------- | ------- | ------ |
| T01 | Committare il lavoro in sospeso | — (tutto il repo) | 257 file non committati su `main` | ✅ | 🔴 | 🟢 | 🟢 |
```

- Una riga per task, nell'ordine degli id.
- **Titolo**: breve, con il codice del rilievo fra parentesi se c'è (`(SEC1)`).
- **File di riferimento**: uno o due percorsi in `codice`, il più specifico possibile.
- **Breve descrizione**: il problema in una frase, non la soluzione.
- Le colonne 5-8 contengono **solo l'emoji**: lo script del §8 le legge da lì.

---

## 5. La scheda del task

Ordine fisso delle righe:

```markdown
### T113
- [ ] [TODO] Quota dello spazio dei file per account
- 🏷️ Area: 📁 File e upload
- ⏳ Da fare (ondata dedicata) · decisione dell'utente da prendere: tetto uguale per tutti o per piano · Urgenza 🟡 · Rischio 🟡 · Effort 🟡
- [`src/lib/upload/local-storage.ts`](../src/lib/upload/local-storage.ts), [`src/lib/upload/disk-guard.ts`](../src/lib/upload/disk-guard.ts)
- **Problema**: parte di T72 tenuta fuori dall'ondata 3. I limiti esistenti riguardano i byte in volo; l'unico tetto
  sui file salvati è la guardia disco globale, che quando scatta blocca i caricamenti di tutti i tenant.
  **Cosa fare**: contare i byte per account sopra i due adapter, decrementare alle cancellazioni; migration con `down.sql`.
  **Fatto quando**: oltre il tetto un caricamento è rifiutato con un messaggio chiaro, con test.
```

1. **Checkbox, tipo, titolo** (il titolo può essere più lungo di quello della tabella).
2. **Area**: `🏷️ Area:` seguita dalle aree separate da ` · `.
3. **Stato e valutazioni**: emoji e nome dello stato, eventuale motivo fra parentesi, poi `Urgenza`, `Rischio`,
   `Effort`, separati da ` · `.
4. **File**: link relativi al file, con righe o simboli fra parentesi quando servono.
5. **Descrizione** in tre parti fisse:
   - **Problema**: cosa succede, verificato come (file, riga, prova), chi lo ha trovato e quando se è nato dopo;
   - **Cosa fare**: la soluzione; per 🔍 le opzioni `(a)`, `(b)`… con il titolo "Cosa fare (da scegliere)"; per una
     decisione dell'utente "Decisione da prendere" con il rimando al testo della domanda;
   - **Fatto quando**: il criterio verificabile di chiusura, quasi sempre un test o una prova.
6. **Aggiornamenti** in coda, datati: `**Aggiornamento 13/10**: …`. Non si riscrive il problema originale.

Regole di scrittura: frasi brevi, una informazione per frase, percorsi e identificatori in `codice`, nessun
riferimento a "sopra" o "prima" fuori dalla scheda (ogni scheda si legge da sola).

---

## 6. Ciclo di vita, anche con le ondate di lavoro

| Momento | Riga di stato della scheda | Tabella |
|---------|----------------------------|---------|
| Nasce | `⏳ Da fare` (o `🔍`, `⏸️` con motivo) | ⏳ |
| Entra in un'ondata | `🔄 In pianificazione (ondata 3, S1)` | 🔄 |
| Chiuso | `✅ Fatto (ondata 3, S1, su `main` il 14/10, commit `9badc4c6`)`, checkbox `[x]` | ✅ |
| Chiuso in parte | resta nello stato, con la nota: `⏳ Da fare (punto 3 fatto nell'ondata 3, commit 0d08d3b0; …)` | invariato |
| Diviso | la parte che resta diventa un task nuovo che cita l'originale ("seconda parte di T88") | nuova riga |
| Effetto dichiarato di un'ondata | task nuovo che lo descrive (es. T117: cosa i reseller non possono più fare) | nuova riga |
| Rimosso | `🗑️ Rimosso (motivo)`, checkbox `[-]` | 🗑️ |

**Motivi di attesa (⏸️)**, scritti fra parentesi con parole riconoscibili, così il riepilogo li può raggruppare:
- `rimandato dall'utente il gg/mm` (area messa da parte);
- `decisione del titolare` (business, legale, fiscale);
- `scelta o dato dell'utente` (con il testo della domanda);
- `dopo Tnn` (dipendenza da altri task).

**Task nati durante il lavoro**: si scrive chi li ha trovati e quando ("trovato dal supervisore dell'ondata 3,
14/10"), così si distinguono da quelli del report iniziale.

---

## 7. Checklist quando un task cambia

1. Riga della tabella: colonna Stato.
2. Scheda: checkbox, riga di stato (con ondata, data, commit se chiuso), eventuale aggiornamento datato.
3. Se nasce un task nuovo: riga in fondo alla tabella e scheda in fondo all'elenco, con il numero successivo.
4. Rigenerare i riepiloghi (§8).
5. Se il cambio viene da un'ondata: lo stesso esito va nel file dell'ondata (`ONDATA-N.md`).

---

## 8. Generatore dei riepiloghi

Le sezioni `### Riepilogo per stato` e `### Riepilogo per urgenza e rischio` si rigenerano dalla tabella. Lo script
sostituisce il testo fra `### Riepilogo per stato` e `---` + `## Elenco task`: quelle intestazioni devono esistere.
I fatti sono raggruppati per ondata leggendo la riga `✅ Fatto … ondata N` della scheda. Provato su questo TODO.md il
14/10/2026: stessi conteggi della versione mantenuta nel progetto.

Uso: `python3 riepiloghi.py TODO.md "14/10/2026"`.

```python
"""Rigenera "Riepilogo per stato" e "Riepilogo per urgenza e rischio" di TODO.md dalla tabella riassuntiva.
Uso: python3 riepiloghi.py TODO.md "14/10/2026"
"""
import collections
import re
import sys

STATI = [('✅', 'Fatti'), ('⏳', 'Da fare'), ('🔄', 'In corso'), ('🔍', 'Da valutare'), ('⏸️', 'In attesa'),
         ('🧩', 'Da completare'), ('🧪', 'Da testare'), ('🗑️', 'Rimossi')]
LIVELLI = ['🔴', '🟡', '🟢']
TITOLO_STATO = '### Riepilogo per stato'
TITOLO_URGENZA = '### Riepilogo per urgenza e rischio'
FINE = '---\n\n## Elenco task'


def leggi_righe(testo):
    righe = []
    for riga in testo.split('\n'):
        if re.match(r'^\| T\d+ \|', riga):
            c = [x.strip() for x in riga.strip().strip('|').split('|')]
            righe.append({'id': c[0], 'stato': c[4], 'urgenza': c[5], 'rischio': c[6]})
    return righe


def ondata_del_task(testo, task_id):
    scheda = re.search(rf'^### {task_id}\n(.*?)(?=^### |\Z)', testo, re.M | re.S)
    trovata = re.search(r'✅ Fatto[^\n]*?ondata (\d+)', scheda.group(1)) if scheda else None
    return f'Ondata {trovata.group(1)}' if trovata else 'Fuori dalle ondate'


def riepilogo_stato(testo, righe, data):
    per_stato = collections.defaultdict(list)
    for r in righe:
        per_stato[r['stato']].append(r)
    totale = len(righe)
    conta = lambda gruppo: ' · '.join(f"{u} {sum(1 for r in gruppo if r['urgenza'] == u)}" for u in LIVELLI)
    ids = lambda gruppo: ', '.join(r['id'] for r in gruppo) or '—'
    out = [TITOLO_STATO, '', f'Conteggio sui {totale} task della tabella (aggiornato al {data}).', '',
           '| Stato | Task | Urgenza 🔴 · 🟡 · 🟢 | Quota |', '|---|---:|---|---:|']
    for emoji, nome in STATI:
        gruppo = per_stato.get(emoji, [])
        out.append(f'| {emoji} {nome} | {len(gruppo)} | {conta(gruppo)} | {round(100 * len(gruppo) / totale)}% |')
    out += [f'| **Totale** | **{totale}** | {conta(righe)} | 100% |', '']
    fatti = collections.defaultdict(list)
    for r in per_stato.get('✅', []):
        fatti[ondata_del_task(testo, r['id'])].append(r)
    out.append(f"**✅ Fatti ({len(per_stato.get('✅', []))})**")
    out += [f'- {nome} ({len(gruppo)}): {ids(gruppo)}' for nome, gruppo in sorted(fatti.items())]
    out.append('')
    for emoji, nome in STATI[1:]:
        gruppo = per_stato.get(emoji, [])
        if not gruppo:
            continue
        out.append(f'**{emoji} {nome} ({len(gruppo)})**, per urgenza:')
        out += [f"- {u}: {ids([r for r in gruppo if r['urgenza'] == u])}" for u in LIVELLI]
        out.append('')
    return '\n'.join(out)


def riepilogo_urgenza(righe, data):
    totale = len(righe)
    u = collections.Counter(r['urgenza'] for r in righe)
    k = collections.Counter(r['rischio'] for r in righe)
    x = collections.Counter((r['urgenza'], r['rischio']) for r in righe)
    out = [TITOLO_URGENZA, '', f'Conteggio sui {totale} task della tabella (aggiornato al {data}).', '',
           '| | 🔴 | 🟡 | 🟢 | Totale |', '|---|---|---|---|---|',
           f"| **Urgenza** | {u['🔴']} | {u['🟡']} | {u['🟢']} | {totale} |",
           f"| **Rischio** | {k['🔴']} | {k['🟡']} | {k['🟢']} | {totale} |", '',
           'Incrocio urgenza × rischio (per l\'urgenza 🔴 sono indicati anche gli id):', '',
           '| Urgenza \\ Rischio | Rischio 🔴 | Rischio 🟡 | Rischio 🟢 | Totale |', '|---|---|---|---|---|']
    for liv in LIVELLI:
        celle = []
        for r in LIVELLI:
            cella = f'**{x[(liv, r)]}**'
            if liv == '🔴':
                cella += ' (' + (', '.join(t['id'] for t in righe if t['urgenza'] == liv and t['rischio'] == r) or '—') + ')'
            celle.append(cella)
        out.append(f"| **Urgenza {liv}** | {' | '.join(celle)} | **{u[liv]}** |")
    out += [f"| **Totale** | **{k['🔴']}** | **{k['🟡']}** | **{k['🟢']}** | **{totale}** |", '']
    return '\n'.join(out)


def main(percorso, data):
    testo = open(percorso, encoding='utf-8').read()
    righe = leggi_righe(testo)
    inizio, meta, fine = testo.index(TITOLO_STATO), testo.index(TITOLO_URGENZA), testo.index(FINE)
    nuovo = riepilogo_stato(testo, righe, data) + '\n' + riepilogo_urgenza(righe, data) + '\n'
    open(percorso, 'w', encoding='utf-8').write(testo[:inizio] + nuovo + testo[fine:])
    print(f'{len(righe)} task, riepiloghi aggiornati')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
```

Differenze rispetto alla versione usata qui, voluta più semplice: gli stati in attesa sono raggruppati per urgenza e
non per motivo, e non ci sono note specifiche dei singoli task.

---

## 9. Partire su un progetto nuovo

1. Verificare il codice e scrivere un report con i rilievi codificati (`SEC`, `BIZ`, …), separando i rilievi
   ricontrollati da quelli solo segnalati.
2. Scegliere le aree del progetto (§3).
3. Creare il file con lo scheletro: titolo e riquadro d'origine, prefazione con le legende, tabella vuota, le due
   intestazioni dei riepiloghi, `---`, `## Elenco task`.
4. Inserire solo i rilievi ricontrollati, numerati nell'ordine di esecuzione, con le tre parti della descrizione.
5. Rigenerare i riepiloghi.
6. Se il lavoro procede a ondate di agenti: per ogni ondata un file `ONDATA-N.md` (candidati, decisioni, verifiche,
   integrazione, esito) e la riga di stato `🔄 In pianificazione (ondata N, pacchetto)` sui task scelti. Il metodo
   è descritto in [`Metodo-Agenti.md`](Metodo-Agenti.md).
