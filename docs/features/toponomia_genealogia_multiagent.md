# Metodo di lavoro con gli agenti

> **Se sei un agente e stai leggendo questo file:** è il metodo operativo da seguire per
> organizzare lavoro su più agenti. Il riquadro qui sotto e le nove regole bastano per
> operare. Il resto è la prova: leggilo solo se una regola ti sembra sbagliata.

---

## In una pagina

Un albero. Chi sta in alto capisce il problema e lo divide, chi sta in basso esegue. Ogni
agente riceve **solo** il suo incarico, comunica **col genitore**, e viene **estinto**
appena consegna.

```
        radice (Opus)       capisce il problema, decide la divisione
       /      |      \
   nodo    nodo    nodo     (Sonnet) smistano, verificano, mettono in
    / \     / \     / \              comunicazione i fratelli
   f   f   f   f   f   f    (Sonnet) eseguono 1-2 task e muoiono
```

| decisione                         | regola                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| Delego o faccio da solo?          | **Delega**, sopra i 5-6 task. Non delegare costa fino a 16×                                     |
| Quanti figli per nodo?            | **6-8**. Più largo e piatto costa meno                                                          |
| Quale modello al figlio?          | Dal **compito**, non dal listino. Meccanico → Haiku, normale → Sonnet, capire → Opus            |
| Devo dichiararlo?                 | **Sempre.** Se lo ometti, il figlio nasce col modello del padre                                 |
| Il figlio ha sbagliato due volte? | **Sostituiscilo** con uno di modello superiore. Non cambiargli modello: non si può              |
| Il figlio ha finito?              | **Estinguilo.** Risvegliarlo dopo costa quanto crearne uno nuovo                                |
| Devo controllarlo?                | **Solo se sbagliare costa** — file condivisi, lavoro da cui dipendono altri. E subito, non dopo |
| Aspetto i figli?                  | **Sì, in silenzio.** Dieci «avete finito?» raddoppiano il tuo costo                             |
| Serve il contesto del padre?      | Allora **fork**, non figlio. Costano uguale, cambia cosa ricevono                               |

---

## Le nove regole

### 1. Delegare, sempre. Il contesto unico è la cosa più cara che esista.

| lavoro  | tutto in un agente | con l'albero |
| ------- | ------------------ | ------------ |
| 8 task  | 2,8×               | 1,0×         |
| 32 task | 6,5×               | 1,0×         |
| 96 task | **16,4×**          | 1,0×         |

**Perché.** Il costo di un passaggio cresce con quanto l'agente ha già fatto: il 110° costa
il doppio del 1°. Un contesto unico che affronta 96 task cresce senza fermarsi, e il costo
cresce **col quadrato**. Molti contesti corti costano molto meno di uno lungo, a parità di
lavoro.

### 2. Il modello conta più della struttura dell'albero.

| modello | ingresso di un agente |
| ------- | --------------------- |
| Opus    | 125.000               |
| Sonnet  | 66.000                |
| Haiku   | 49.000                |

Stessa identica struttura: **tutto Opus = 2,1×**, **foglie Haiku = 1,0×**. Riorganizzare la
gerarchia vale il 2%; cambiare i modelli vale il 50%.

- **radice** → Opus: deve capire un problema che nessuno ha ancora capito
- **nodi intermedi** → Sonnet: smistano, poche decisioni
- **foglie** → Sonnet per il lavoro normale, Haiku per compiti meccanici

### 3. Dichiarare SEMPRE il modello dei figli. Mai ereditarlo.

Se il padre non lo dichiara, il figlio nasce **col modello del padre**. In un albero
ricorsivo una dimenticanza al secondo livello fa nascere **tutto il sottoalbero** sul
modello più caro, e nessuno se ne accorge.

Osservato: su 533 lanci reali, **59 non specificavano il modello**.

### 4. Il risparmio è vero solo se l'agente arriva in fondo.

Un modello economico ha meno spazio. Caso osservato: **due agenti Sonnet morti entrambi**
sullo stesso compito su materiale pesante, il secondo senza aver aperto un file grosso — il
contesto ricaricato a ogni compattazione non lasciava margine.

Un agente che muore a metà costa **tutto quello che ha speso, più il suo sostituto**.
Modello economico per compiti **corti e circoscritti**; modello grande dove il lavoro è
lungo o il materiale è pesante.

### 5. Il padre sceglie il modello dal COMPITO, non dal listino.

Prima di lanciare: **questo compito è meccanico o richiede giudizio?**

| il compito è…                                                     | modello |
| ----------------------------------------------------------------- | ------- |
| meccanico e circoscritto (rinominare, applicare uno schema noto)  | Haiku   |
| lavoro normale con qualche decisione                              | Sonnet  |
| capire qualcosa che nessuno ha ancora capito, o materiale pesante | Opus    |

**Dove sta il confine.** Se non sai in anticipo quali task siano difficili, provare tutti su
Haiku conviene **solo finché i difficili sono meno del 17-20%**. Sopra, i rifacimenti
costano più del risparmio.

Il risparmio di Haiku su un task è 0,32 M; una correzione più il rifacimento ne costa 1,9 M.
**Sei rifacimenti su cento annullano il vantaggio sugli altri novantaquattro.**

### 6. Se il figlio sbaglia, promuoverlo. Al PRIMO fallimento, non al secondo.

Il padre corregge, il figlio riprova. Se sbaglia di nuovo, **non si insiste**.

| probabilità che riesca al 2° tentativo | riprovare | promuovere |
| -------------------------------------- | --------- | ---------- |
| 50%                                    | 2,06 M    | **1,49 M** |
| 80%                                    | 1,52 M    | **1,49 M** |

Riprovare conviene solo con **oltre l'82%** di riuscita al secondo colpo. Ma un fallimento è
già la prova che il task era più difficile del previsto: se credessi all'82%, avresti scelto
quel modello con più convinzione la prima volta.

> **Un fallimento non è sfortuna: è informazione.** Dice che la stima di difficoltà era
> sbagliata. Ripetere lo stesso tentativo significa ignorare l'unica cosa che hai imparato.

**Si SOSTITUISCE il figlio, non si cambia il suo modello.** Sembra uno spreco — il figlio ha
appena finito, perché buttarlo? — ed è la prima obiezione che viene in mente. Ma cambiare
modello a un agente vivo **non è possibile** (su 3.251 agenti osservati, uno solo l'ha
fatto, per una sostituzione automatica), e se lo fosse costerebbe di più: al cambio di
modello **la cache si azzera** e si ripaga tutto il contesto accumulato — misurato su 19
casi, ~249.000 token ricalcolati da zero.

L'ingresso più basso di Sonnet vale **solo se l'agente nasce su Sonnet**. Chi ci passa a
metà vita paga il ricalcolo di tutto ciò che ha già fatto.

Il figlio nuovo riceve **la correzione del padre**: sa già cosa è andato storto, quindi non
rifà la strada sbagliata. È questo che rende la sostituzione economica invece che uno
spreco. In più nasce pulito, mentre quello vecchio si porterebbe dietro i tentativi
sbagliati che vogliamo dimenticare.

**Un gradino per volta:** Haiku → Sonnet → Opus. Saltare a Opus costa 2,60 M contro 1,49 M:
si giustifica solo se anche Sonnet ha fallito.

### 7. Estinguere i figli. Mai risvegliarli.

|                                               | costo   | di cui ricalcolato |
| --------------------------------------------- | ------- | ------------------ |
| passaggio normale                             | 180.000 | 2.200              |
| passaggio di **ripresa** dopo una pausa lunga | 143.000 | **143.000**        |

Un agente fermo **non consuma nulla** (osservato: 64,7 ore di pausa, zero token). Ma
risvegliarlo costa quanto crearne uno nuovo: la cache è scaduta e si ripaga tutto. In più
riparte dal punto in cui era, quindi ogni suo passaggio costa più di quelli di un agente
fresco.

**Nuovo compito → nuovo figlio.** Si conserva ciò che il figlio ha **prodotto** (file,
decisioni, note), non l'agente. Unica eccezione: la ripresa entro pochi minuti.

### 8. Verificare i figli, ma solo dove sbagliare costa.

La verifica del padre costa **1,8×** contro 1,2× senza controlli: il 50% in più.

Ma i token non sono l'unico costo. Se un figlio consegna un lavoro sbagliato e te ne accorgi
tre livelli più a valle, **rifare quel ramo costa più del 50% risparmiato**.

**Verifica** chi tocca file condivisi o produce qualcosa da cui dipendono i fratelli. Non
tutti.

**Verifica SUBITO**, col figlio ancora vivo: una correzione chiesta adesso costa pochi
passaggi caldi; scoperta dopo l'estinzione, costa un agente nuovo più la rispiegazione.

**Verifica il risultato, non il processo:** il file prodotto, le prove che passano, il
riassunto. Non riaprire la conversazione del figlio.

### 9. Non delegare un compito breve.

Un agente sotto i 5 passaggi costa comunque **424.000 token**. Sotto quella soglia, farlo
direttamente costa meno che spiegarlo a qualcuno.

**Se un nodo ha meno di 3-4 figli da coordinare, fa il lavoro lui** invece di dividerlo.

---

## Figlio o fork?

Un **figlio** nasce pulito e riceve solo l'incarico. Un **fork** eredita l'intera
conversazione del padre, già in cache.

|              | fork                                            | figlio                   |
| ------------ | ----------------------------------------------- | ------------------------ |
| riceve       | tutta la conversazione del padre                | solo l'incarico          |
| costo        | 0,31–0,39 M                                     | 0,31 M                   |
| serve quando | il lavoro **dipende** da ciò che si è già detto | il lavoro è **autonomo** |

**Costano quasi uguale: la scelta non è economica, è di contenuto.**

- Il compito ha bisogno di sapere _perché_ sono stati scartati tre approcci? → **fork**.
  Rispiegarglielo costerebbe di più che ereditarlo.
- Il compito è «applica questo schema a questi otto file»? → **figlio**. Il resto è zavorra
  che confonde.

**Un fork a catena non esplode.** La paura ragionevole è che un fork di 4ª generazione
erediti quattro vite intere. Non succede: il contesto viene compattato. Osservato su 3.247
agenti — contesto massimo 357.000 token (mediana), e il **75% subisce almeno una
compattazione**. Anche da un padre carico, un fork costa **1,3×** un figlio nuovo. Il costo
dipende da quanto è carico il padre _in quel momento_, non da quante generazioni ci sono
sopra.

**Il padre deve limitare ciò che il fork eredita?** No, e sarebbe controproducente: limitare
l'eredità significa selezionare a mano cosa passare, cioè fare il lavoro che un figlio già
fa meglio.

> Se stai pensando di limitare l'eredità di un fork, quello che ti serve è un figlio.

---

## Quattro domande frequenti

### Quanti figli per nodo?

| figli per nodo | nodi totali | livelli | costo       |
| -------------- | ----------- | ------- | ----------- |
| 2              | 63          | 5       | 0,075 G     |
| 4              | 43          | 3       | 0,058 G     |
| **8**          | **37**      | **2**   | **0,052 G** |
| 12             | 36          | 2       | 0,051 G     |

**Più larghi si sta, meno si spende.** Ogni livello in più è una fila di nodi che coordinano
senza produrre. Oltre 8 il guadagno si appiattisce.

Il limite non è di costo ma di **attenzione**: un padre con 12 figli deve tenere a mente 12
lavori. **6-8 è il compromesso.**

### Il padre che aspetta i figli: costa?

**Se aspetta davvero, no.** Ma se **sonda** — «avete finito?» — ogni sonda è un passaggio:

| sonde di attesa | costo del padre | in più    |
| --------------- | --------------- | --------- |
| 0               | 0,89 M          | —         |
| 10              | 1,77 M          | **+99%**  |
| 30              | 3,91 M          | **+339%** |

**Dieci sonde raddoppiano il costo di un coordinatore.** Farsi svegliare dai figli che
consegnano, non stare a guardarli.

### Quando NON usare l'albero

- **Meno di 5-6 task.** Il coordinamento costa più di quello che organizza.
- **Task in catena.** Se il secondo non può iniziare prima che il primo finisca, il
  parallelismo non esiste: una sequenza in un agente solo costa meno.
- **Quando non sai ancora dividere il problema.** Un albero costruito su una divisione
  sbagliata paga tutti i nodi e produce lavoro da buttare. Prima capire, poi diramare — è il
  motivo per cui la radice sta sul modello più capace.
- **Task che toccano tutti lo stesso file.** Il parallelismo diventa una fila d'attesa, con
  in più il rischio che due figli si sovrascrivano.

### Come si capisce se il metodo funziona

1. **Passaggi per agente.** Sopra 60-70 di mediana, gli agenti sono troppo lunghi: il costo
   cresce col quadrato. Spezzare.
2. **Quota di figli promossi** (regola 6). Sopra il 20%, il modello di partenza è troppo
   basso: alzarlo di un gradino.
3. **Rapporto coordinatori/esecutori.** Se i coordinatori superano un terzo dei nodi,
   l'albero è troppo profondo: allargarlo.

Un metodo che non si misura torna al punto di partenza in poche settimane. Nell'ambiente da
cui nasce questo documento, il carico d'ingresso di un agente è **raddoppiato in due mesi**
senza che nessuno se ne accorgesse.

---

## Due cose che il metodo previene, oltre al costo

**Nessuna eredità di contesto fra padre e figlio.** Verificato: figli di padri con 2.630
passaggi partono a 66.000 token, figli di padri giovani a 120.000. Se ereditassero sarebbe
il contrario. Ogni agente riceve **solo il suo incarico** — ~14.000 token, l'unica parte che
varia da agente ad agente.

**Comunicazione tramite il genitore.** Non è solo ordine: impedisce che due agenti
modifichino lo stesso file all'insaputa l'uno dell'altro. In un caso reale la mancanza di
questo vincolo ha lasciato **84 file non salvati** su un albero di lavoro condiviso, fra cui
due sotto-progetti collaudati esistenti in copia unica.

---

## Il costo che NON dipende dall'albero

Dei ~125.000 token d'ingresso di un agente:

| voce                        | ~token   | il padre può toglierla?                    |
| --------------------------- | -------- | ------------------------------------------ |
| descrizioni degli strumenti | ~100.000 | **no** — montate prima che l'agente esista |
| cataloghi e prompt di base  | ~11.000  | no                                         |
| l'incarico che gli dai      | ~14.000  | sì, ed è già minimo                        |

La voce grossa **non passa dall'albero**. Si riduce solo a monte: togliere i server esterni
non necessari, o definire tipi di agente con strumenti ristretti.

---

## Il tetto: quando fermarsi e chiedere

Un comando che genera decine di agenti va **fermato prima**, non spiegato dopo.

**Contare gli agenti nominati nel testo NON funziona.** Osservato: il rapporto fra agenti
_nominati_ e agenti _prodotti_ ha mediana **7,5×** e punte di **155×**, perché le chiamate
stanno dentro cicli sui dati. Una prima versione di questo controllo contava le menzioni e
lasciava passare **37 casi su 38**.

**La regola è rovesciata:** non si stima _quanti_, si guarda se il numero è **conoscibile**.
Un ciclo, una lista, un lavoro richiamato per nome che non si può leggere = numero ignoto =
**si chiede**.

> Non sapere quanti sono non è come sapere che sono pochi.

---

## Da dove vengono questi numeri, e cosa non provano

Tutti da trascrizioni reali: **3.245 agenti**, due mesi, quattro progetti diversi.

| dato                          | valore            | base                                |
| ----------------------------- | ----------------- | ----------------------------------- |
| costo del passaggio n         | 118.000 + 1.260·n | regressione, passaggi 1–110         |
| passaggi per agente           | 57 (mediana)      | 3.245 agenti                        |
| costo totale di un agente     | 9,4 M (mediana)   | 3.245 agenti                        |
| ingresso per modello          | vedi regola 2     | 3.245 agenti                        |
| tetto del contesto            | 357.000 (mediana) | 3.247 agenti                        |
| costo di ripresa              | ~143.000          | **5 casi**                          |
| soglia di promozione (17-20%) | calcolata         | **non osservata**                   |
| costo del fork                | 0,31–0,39 M       | **calcolato, nessun fork nei dati** |

**Come leggere le cifre.** Sono **token grezzi**, e i token grezzi non costano tutti uguale:
quelli riletti da cache valgono circa **un decimo** di quelli nuovi, e qui il **97,9%** del
traffico è cache-read. Il costo reale è quindi circa **un ottavo** delle cifre riportate.

**Le regole reggono lo stesso**, perché sono confronti fra metodi e la distorsione agisce su
entrambi i lati. **Gli assoluti no**: non usarli per stimare una spesa. Le regole 6 e 7
(sostituzione, risveglio) sono anzi **più forti** di come appaiono: lì la cache si azzera e
si paga tutto a prezzo pieno.

**Altri limiti, dichiarati:**

- oltre i 110 passaggi il modello **estrapola**, non misura
- il costo di ripresa poggia su **cinque casi soli**
- il simulatore modella la **struttura**, non il lavoro vero (leggere file, eseguire prove):
  confronta metodi fra loro, **non predice una bolletta**
- i numeri assoluti **invecchiano**: il carico d'ingresso è raddoppiato in due mesi. I
  rapporti fra metodi invecchiano molto più lentamente
- il metodo è misurato su **un solo ambiente**. Le forme delle curve dovrebbero valere
  altrove; i valori no

**Per rimisurare su un altro ambiente:** i dati stanno nelle trascrizioni degli agenti, una
per file, con il consumo di ogni passaggio. Il simulatore che confronta i metodi sta in
`tools/simulatore-agenti/`.
