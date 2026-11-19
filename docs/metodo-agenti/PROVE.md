# Le prove dietro il metodo

**Versione 2.0** · 18/11/2026 · riferita a [`METODO.md`](METODO.md) della stessa versione


> **Questo file non serve per operare.** Le regole e le tabelle decisionali stanno in
> [`METODO.md`](METODO.md), che basta da solo ed è tre volte più piccolo.
>
> **Aprilo in tre casi, e in nessun altro:**
>
> 1. **una regola non ti torna** — qui trovi su quanti casi si regge, e se è il caso di
>    disapplicarla;
> 2. **devi applicare una regola delicata e non sai come** — la riga in `METODO.md` dice
>    *cosa* fare, qui c'è *come*, *dove* e *chi*;
> 3. **lavori in un ambiente diverso** da quello in cui il metodo è nato — la sezione «il
>    metodo fuori dall'ambiente in cui è nato» distingue ciò che si trasporta da ciò che va
>    rimisurato.
>
> **Se stai eseguendo un compito, non ti serve.** Chiudi questo file e apri `METODO.md`.
>
> **Com'è organizzato:** le 19 regole per esteso, con i casi reali che le hanno prodotte;
> i difetti ricorrenti di chi coordina; le aree che nessuno ha ancora messo alla prova;
> e in fondo, da dove vengono tutti i numeri e cosa non provano.
>
> **Tre errori corretti** sono documentati qui dentro, con cosa dicevano prima e perché erano
> sbagliati. Non sono un residuo: servono a chi legge per sapere che le misure hanno smentito
> dei calcoli, e possono smentirne altri.

---

## Versioni

Il numero cambia secondo **cosa è successo alle regole**, non secondo quanto testo è cambiato:

- **cifra maggiore** — una regola è stata aggiunta, tolta, o ne è cambiata la sostanza; oppure
  cambia la struttura dei file
- **cifra minore** — si aggiungono prove a regole esistenti, si correggono numeri, si riscrive
  per chiarezza

| versione | data | cosa è cambiato |
| -------- | ---- | --------------- |
| **1.0** | 10/09/2026 | prima stesura: 9 regole, tutte di costo, da 3.245 agenti misurati |
| **1.1** | 29/09/2026 | regole 10-13 dalle prime 8 applicazioni reali; i difetti ricorrenti di chi coordina |
| **1.2** | 13/10/2026 | regole 14-16 da altre 13 applicazioni, più 11 di prodotti diversi |
| **1.3** | 13/11/2026 | regola 17 (il revisore del piano); sezione «il metodo fuori dall'ambiente in cui è nato» |
| **2.0** | 18/11/2026 | regole 18-19 da 29 ondate consecutive; **separazione in `METODO.md` e `PROVE.md`** |

**Tre correzioni di sostanza**, tutte da misure che hanno smentito calcoli precedenti:

| quando | diceva | dice |
| ------ | ------ | ---- |
| 1.2 | il modello grande costa il doppio a entrare | l'ingresso **non dipende** dal modello: è del progetto |
| 1.2 | il modello economico conviene sotto il 17-20% di fallimenti | **sotto il 72%** |
| 1.1 | promuovere dopo 2-3 tentativi falliti | **al primo** fallimento |

Sono dentro il documento, nelle regole che riguardano. Non sono un residuo: servono a ricordare
che le misure smentiscono i calcoli, e possono smentirne altri.

---
## Le diciannove regole, per esteso

> La versione in una riga sta in [`METODO.md`](METODO.md). Qui c'è il **perché**: i casi reali
> che hanno prodotto ogni regola, le misure, e dove un errore precedente è stato corretto.


> **La numerazione segue l'argomento, non l'importanza.** Per sapere da quali partire, vedi la
> sezione precedente.


### Regole di costo (1-9) — non sprecare

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

### 2. Il modello pesa sui PASSAGGI, non sull'ingresso. L'ingresso è del progetto.

**Il costo d'entrata di un agente non dipende dal modello.** Misurato con un confronto
appaiato — stesso progetto, stesso mese, per eliminare le due variabili che confondono:

| progetto / mese | modello grande | modello intermedio | scarto |
| --------------- | -------------- | ------------------ | ------ |
| A, agosto | 125.000 | 126.000 | **1,0×** |
| A, ottobre | 37.000 | 37.000 | **1,0×** |
| B, settembre | 137.000 | 134.000 | **1,0×** |
| C, ottobre | 24.000 | 24.000 | **1,0×** |
| D, ottobre | 38.000 | 37.000 | **1,0×** |
| E, ottobre | 30.000 | 25.000 | 1,2× |
| A, settembre | 133.000 | 102.000 | 1,3× (unica eccezione) |

**Sei coppie su sette identiche.** Chi entra paga il contesto che quel progetto monta —
descrizioni degli strumenti, istruzioni, cataloghi — e quella roba è uguale per tutti.

> Una versione precedente di questa regola diceva «il modello grande costa il doppio a
> entrare». **Era un artefatto:** confrontava modelli diversi misurati in periodi e progetti
> diversi. Due variabili confuse in una.

**Dove il modello pesa davvero: nei passaggi.** Su incarichi dello stesso tipo, il modello
economico ha usato **47 passaggi di mediana contro 111** dell'intermedio. Poiché il costo
cresce col quadrato dei passaggi, lì la differenza è reale e grossa.

> Un confronto fra modelli fatto sul costo d'ingresso misura la cosa sbagliata. **Conta quanti
> passaggi impiegano a finire.**

**La leva vera sul costo d'ingresso è il progetto, non il modello.** Varia da **24.000 a
143.000 token**, sei volte, e dipende da quanta attrezzatura è montata. Nello stesso prodotto:

| mese | ingresso, tutti i modelli |
| ---- | ------------------------- |
| agosto | 125.000 |
| settembre | 133.000 |
| **ottobre** | **37.000** |

Qualcuno ha tolto attrezzatura inutile e ha diviso il carico per tre e mezzo — **per tutti i
modelli insieme**. Nessuna scelta di modello avvicina quel risultato.

**Come scegliere, allora: il criterio è uno solo — il modello più economico che fa il lavoro
bene.**

Non «il più economico». Non «il più capace». **Il più economico fra quelli che non rischiano
un lavoro sporco o sbagliato.** Se quattro figli hanno quattro compiti complessi — o devono a
loro volta coordinare agenti — serve il modello grande per tutti e quattro, e si usa quello.
Se gli stessi quattro compiti sono fattibili con l'intermedio, si usa l'intermedio.

Il motivo per cui questa è l'unica formulazione corretta sta nella regola 4: **un lavoro
sbagliato costa più di quanto si sia risparmiato scegliendolo.** Un agente che non ce la fa
costa tutto quello che ha speso, più il suo sostituto, più il tempo di accorgersene.

> Risparmiare sul modello dove serviva capacità non è un risparmio: è un acconto su un
> rifacimento.

**Come viene di solito**, applicando il criterio a un albero tipico — ma è una conseguenza,
non una prescrizione: se i compiti sono diversi, l'assegnazione cambia.

- **radice** → grande: deve capire un problema che nessuno ha ancora capito
- **nodi intermedi** → dipende da cosa fanno: se smistano, intermedio; **se coordinano figli
  propri, grande come la radice**
- **foglie** → intermedio per il lavoro normale, economico per compiti meccanici (regola 5)

**Il tetto d'uso cambia la pianificazione, non la scelta.**

Molti ambienti impongono un tetto periodico sul modello più capace, **condiviso fra tutti gli
agenti**: i figli lo consumano insieme al padre. Osservato almeno tre volte su 29 applicazioni
consecutive — tre figli fermati insieme a metà lavoro, un revisore interrotto a metà, un figlio
fermo con una modifica scritta per metà.

Questo **non** è un motivo per scegliere un modello più debole di quello che serve. È un motivo
per sapere quanto tetto resta **prima** di lanciare:

> **Il tetto d'uso è una risorsa del piano, non un incidente.** Si conta prima, come si conta
> quanti agenti girano insieme.

Se il tetto non basta per i compiti che richiedono il modello grande, la risposta non è
declassarli — è **spezzare il lavoro in turni** e lanciarne meno per volta. Il lavoro resta
fatto bene, in più tempo. Declassarlo lo fa male, e in tempo uguale.

**Attenzione a non curarlo con la regola 6.** Un figlio fermato dal tetto non va promosso: un
modello più capace consuma di più, ed è esattamente la risorsa che manca (regola 11).

La ragione non è il prezzo d'ingresso — è **quanti passaggi serviranno**, e quanto costa
sbagliare (regola 4).

### 3. Dichiarare SEMPRE il modello dei figli. Mai ereditarlo.

Se il padre non lo dichiara, il figlio nasce **col modello del padre**. In un albero
ricorsivo una dimenticanza al secondo livello fa nascere **tutto il sottoalbero** sul
modello più caro, e nessuno se ne accorge.

Osservato: su 533 lanci reali, **59 non specificavano il modello**.

### 4. Il risparmio è vero solo se l'agente arriva in fondo.

Un modello economico ha meno spazio. Caso osservato: **due agenti su modello MEDIO morti entrambi**
sullo stesso compito su materiale pesante, il secondo senza aver aperto un file grosso — il
contesto ricaricato a ogni compattazione non lasciava margine.

Un agente che muore a metà costa **tutto quello che ha speso, più il suo sostituto**.
Modello economico per compiti **corti e circoscritti**; modello grande dove il lavoro è
lungo o il materiale è pesante.

### 5. Il padre sceglie il modello dal COMPITO, non dal listino.

**Il criterio, in una riga: il più economico fra quelli che fanno il lavoro bene.** Un compito
che richiede capacità la ottiene, quanti che siano i figli in quel turno. Un compito meccanico
non la spreca.

Prima di lanciare: **questo compito è meccanico o richiede giudizio?**

| il compito è…                                                     | modello |
| ----------------------------------------------------------------- | ------- |
| meccanico e circoscritto (rinominare, applicare uno schema noto)  | PICCOLO |
| lavoro normale con qualche decisione                              | MEDIO   |
| capire qualcosa che nessuno ha ancora capito, o materiale pesante | GRANDE  |

**Dove sta il confine — misurato, dopo una correzione.** Provare tutti sul modello più
economico conviene **finché fallisce meno del 72% delle volte**. Il margine è enorme:
dovrebbe sbagliare due task su tre per non convenire.

| quota che fallisce | tutti sul modello intermedio | economico + rifacimenti |
| ------------------ | ---------------------------- | ----------------------- |
| 30%                | 14,0 M                       | **8,0 M**               |
| 50%                | 14,0 M                       | **10,8 M**              |
| 70%                | 14,0 M                       | **13,8 M**              |
| 90%                | 14,0 M                       | 16,6 M                  |

**Una versione precedente di questa regola diceva 17-20%, ed era sbagliata.** Guardava il
solo costo d'ingresso, che si è poi rivelato **uguale fra i modelli** (regola 2): quel calcolo
confrontava una differenza che non esiste. Il risparmio vero sta altrove: il modello economico
**fa meno
della metà dei passaggi** — 47 contro 111 di mediana, su incarichi dello stesso tipo. E
poiché il costo cresce col quadrato dei passaggi, quattro volte meno anziché il 26%.

> Un confronto fra modelli fatto sul costo d'ingresso misura la cosa sbagliata. Quello che
> conta è **quanti passaggi impiegano a finire.**

**Limiti di questa misura, dichiarati:** il campione è di 16 agenti sul modello economico
contro 70 sull'intermedio. E soprattutto **non è stato possibile verificare che la qualità
fosse pari**: 47 passaggi contro 111 può significare «più efficiente» oppure «ha verificato
meno». È la domanda che decide, e non ha ancora risposta.

**Perciò la raccomandazione operativa è più stretta del numero:** usa il modello economico
dove **il fallimento si vede subito** — un compito con un cancello che risponde sì o no
senza ambiguità. Lì un lavoro sbagliato non sfugge e il margine copre ampiamente. Evitalo
dove la qualità si giudica leggendo: là un lavoro mediocre passa, e il risparmio diventa un
costo differito che nessuno attribuirà alla scelta del modello.

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

L'ingresso più basso di un modello vale **solo se l'agente ci nasce**. Chi ci passa a
metà vita paga il ricalcolo di tutto ciò che ha già fatto.

Il figlio nuovo riceve **la correzione del padre**: sa già cosa è andato storto, quindi non
rifà la strada sbagliata. È questo che rende la sostituzione economica invece che uno
spreco. In più nasce pulito, mentre quello vecchio si porterebbe dietro i tentativi
sbagliati che vogliamo dimenticare.

**Un gradino per volta:** PICCOLO → MEDIO → GRANDE. Saltare direttamente al più grande è
costato, nelle misure, quasi il doppio del passaggio intermedio: si giustifica solo se anche
quello di mezzo ha fallito.

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

**Se il lavoro tocca dati già raccolti, una domanda in più, sempre:**

> **La correzione ripara il danno già fatto, o ferma solo quello futuro?**

Un figlio che consegna «difetto corretto, prove verdi» ha risposto su cosa succede **da
adesso**. Sui dati già scritti non ha detto niente, e quasi mai gliel'hanno chiesto. Tre
esiti possibili, e vanno distinti:

| esito                        | come si riconosce                                            | cosa resta da fare                                                         |
| ---------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **si ripara da solo**        | il dato era giusto, sbagliava chi lo leggeva                 | niente: appena la correzione è viva, anche lo storico torna a dire il vero |
| **distrutto**                | il dato corretto è stato sovrascritto e non esiste una copia | niente da recuperare: va **dichiarato**, non lasciato credere riparato     |
| **corrotto e ancora attivo** | i dati guasti esistono e qualcuno può ancora usarli          | **questo è il caso che chiede una decisione**, e non è del figlio          |

Il terzo è quello che sfugge: la correzione impedisce di produrne altri, ma quelli già fatti
restano lì e continuano a fare danno finché qualcuno non li tocca. **Chi coordina lo porta a
chi decide** — non lo sana di propria iniziativa, perché intervenire su dati reali è una
scelta che non spetta a chi ha scritto la correzione.

> Un difetto sui dati ha due vittime: quelli che verranno e quelli che ci sono già. Una
> correzione ne salva una sola, e non dice quale.

### 9. Non delegare un compito breve.

Un agente sotto i 5 passaggi costa comunque **424.000 token**. Sotto quella soglia, farlo
direttamente costa meno che spiegarlo a qualcuno.

**Se un nodo ha meno di 3-4 figli da coordinare, fa il lavoro lui** invece di dividerlo.

### Regole di correttezza (10-19) — non sbagliare

Nate tutte dall'uso reale, non dal calcolo. **Sono quelle che hanno evitato i danni
peggiori**: lavoro distrutto, difetti copiati in N esemplari, agenti buttati via per la
diagnosi sbagliata.

### 10. Dare al figlio il commit di partenza, e dirgli se deve committare.

Due cose che l'incarico deve contenere sempre, misurate il 21/09/2026 su sette agenti.

**Lo spazio di lavoro del figlio NON eredita il tuo stato.** Nasce dalla base comune. Se il
lavoro su cui deve appoggiarsi vive solo sul ramo del padre, il figlio **non lo vede**: si
ritrova un albero senza le fondamenta e o si ferma, o — peggio — le ricostruisce a modo suo.
Nell'incarico va scritta **la versione esatta** da cui partire, non «l'ultima» né «la mia»,
più **un controllo che renda evidente lo sbaglio**: due verifiche su cose che a quella versione
devono esistere, con l'istruzione di fermarsi se non le trova. Senza il controllo, il figlio
scopre la base sbagliata quando ha già prodotto qualcosa.

Costo reale quando manca: due agenti su tre fermi nella stessa ondata, uno dei quali stava
generando una modifica ai dati calcolata sulla differenza sbagliata — un risultato plausibile
a leggersi e destinato a fallire.

> **Quando si applica:** ovunque i figli lavorino su copie separate di una base versionata. Se
> il tuo ambiente non ha versioni o i figli condividono un unico spazio, questa regola non ti
> riguarda — ma allora ti riguarda la 14, che è peggio.

**Dire se il commit fa parte della consegna.** La regola di casa è «commit solo quando l'utente
lo chiede». Applicata alla lettera da un figlio che lavora su un ramo isolato, produce lavoro
che resta nel suo albero e muore con lui: due agenti su sette hanno finito senza committare, e
il recupero è stato a mano. Non è colpa loro — la prudenza è giusta — ma il padre deve dirlo
esplicitamente, e chiedere che l'assenza di commit venga **dichiarata** invece che taciuta.

> Un figlio che si ferma e te lo dice ti è costato un turno. Un figlio che tace ti costa il
> tempo di scoprirlo, più il recupero.

---

### 11. Si muore in TRE modi, e le cure sono diverse.

La regola 4 tratta un tipo solo di morte: il **contesto saturo**, che si cura con un modello più
grande. Ne esistono altri due, e lì quella cura è inutile o dannosa.

| tipo di morte       | causa                             | cura                                             |
| ------------------- | --------------------------------- | ------------------------------------------------ |
| **contesto saturo** | materiale pesante, compito lungo  | modello più grande (regole 4 e 6)                |
| **quota esaurita**  | spesa cumulata di tutto il lavoro | **recuperare e finire da soli** — mai promuovere |
| **trasporto interrotto** | caduta di connessione, niente a che vedere col lavoro | **rilanciare identico** — ma prima guarda cosa ha già fatto (regola 13) |

Un modello più grande consuma **di più**, e quando manca la quota è esattamente ciò che non
serve. Applicare la regola 6 a una morte per quota aggrava il problema che dovrebbe risolvere.

**Come si distinguono:** il contesto saturo muore _lavorando_, e di solito su materiale pesante;
la quota muore _a orologio_, e il messaggio lo dice; il trasporto muore **senza motivo
apparente**, spesso presto, e un rilancio identico subito dopo riesce. Leggere il motivo prima
di reagire.

La terza è la più facile da scambiare per le altre due, e le loro cure sono entrambe sbagliate:
promuovere spreca, «finire da soli» butta via un figlio che avrebbe funzionato al secondo colpo.

### 12. Un figlio da correggere si RILANCIA. Non si riprende.

La regola 7 dice che risvegliare costa quanto creare. È vero, ma **non è il motivo principale**.

> **Quando riprendi un agente isolato con un messaggio, i suoi comandi possono girare
> nell'albero di lavoro del padre, non nel suo.**

Misurato: ripreso un figlio per correggerlo, il suo `pwd` era diventato quello del padre, mentre
al primo turno era nel proprio. Se avesse eseguito il comando che gli era stato dato — creare un
ramo — avrebbe staccato il ramo sotto i piedi alla sessione padre, mentre in produzione girava
lavoro vero.

Non è successo perché **la foglia si è fermata e ha chiesto**, invece di eseguire un ordine di
chi ha autorità su di lei. Vale la pena notarlo: la fermata non ha evitato uno spreco, ha evitato
un danno.

**Per correggere un figlio isolato: se ne lancia uno nuovo col mandato corretto.** La ripresa non
è solo cara — è pericolosa per l'albero di chi la richiede.

### 13. Prima di rilanciare un figlio morto, confronta il suo albero col tuo.

**Il lavoro di una foglia sopravvive nel suo albero anche quando la foglia no.**

Caso misurato: una foglia morta per quota aveva **scritto tutto e non committato** — morta
esattamente nella finestra che la regola 10 cerca di chiudere. Invece di rilanciarla, il padre ha
confrontato i due alberi e ha recuperato **sette file in quattro passaggi**, contro i milioni di
una foglia nuova.

Chiudere quella finestra con l'istruzione di committare **non basta**: un agente può morire
dentro la finestra anche avendo ricevuto l'istruzione.

> Prima di rilanciare, guarda cosa c'è nell'albero del morto. Costa quattro passaggi e può
> restituire tutto.

---

### 14. Un figlio può distruggere il lavoro dei fratelli. Vietare i comandi che azzerano.

Il caso più pericoloso raccolto finora, e viene da un progetto diverso: un figlio ha usato un
comando che **azzera l'intera cartella di lavoro** per provare la propria build. Ha travolto il
lavoro non committato di **tutti gli altri agenti attivi — dieci file**, compreso quello appena
consegnato da un fratello.

Due cose lo rendono peggiore di un errore qualunque:

- **il fratello non poteva accorgersene.** Aveva già consegnato ed era terminato: credeva in
  buona fede di aver lasciato su disco file che non c'erano più;
- **la traccia inganna.** Chi indagava ha attribuito il fatto al figlio sbagliato, perché il
  registro mostrava un'operazione che quel comando compie *internamente*. L'attribuzione è stata
  corretta solo quando una prova l'ha contraddetta.

**Nel mandato di ogni figlio che lavora su uno spazio condiviso:**

> Nessun comando che azzeri o riporti indietro la cartella di lavoro. Nemmeno per provare la
> build, nemmeno se lo rimetti a posto subito. Se ti serve un albero pulito, chiedi al padre uno
> spazio separato.

**La difesa strutturale è più forte della regola:** uno spazio di lavoro proprio per ogni figlio.
Allora un comando distruttivo colpisce solo chi lo lancia. È il motivo per cui il metodo li
prescrive — e questo caso mostra cosa succede quando si condivide.

### 15. Il piano è codice. Va riletto come codice, prima del lancio.

**È il difetto più frequente osservato: 12 occorrenze in 5 applicazioni su 13.** E ha una
proprietà che lo rende diverso da tutti gli altri:

> **Nessun cancello può vederlo.** Il figlio esegue il piano alla lettera; i controlli
> provano che l'ha eseguito bene. Il difetto era nel mandato, e passa intatto fino in fondo.

Casi osservati:

- un piano conteneva, nel codice d'esempio, due difetti veri. Le foglie li hanno **copiati
  fedelmente**, i cancelli sono passati, la revisione del ramo li ha trovati dopo;
- un piano non copriva una superficie che il committente aveva nominato a voce. Tre giri di
  cancelli verdi, due prove end-to-end verdi venti volte su venti: **nessun controllo la
  cercava, perché nessun incarico la nominava**;
- una specifica conteneva un'affermazione falsa sul codice esistente, che nessun test poteva
  sfidare.

**Cosa fare, in ordine di efficacia:**

1. **Il codice dentro un piano si rilegge come codice**, non come documentazione. Se contiene
   una riga sbagliata, diventa N righe sbagliate — una per figlio.
2. **Dalla richiesta all'elenco dei pezzi toccati, prima di scrivere gli incarichi.** Il
   secondo caso si chiudeva così: la superficie mancante sarebbe comparsa in un elenco, non
   in un piano.
3. **I controlli scritti dentro un piano vanno provati prima di scriverli.** Più volte si
   sono rivelati comandi che non discriminavano, o che non compilavano.
4. **Una specifica riscritta dopo una revisione si fa rileggere.** Due applicazioni su tredici
   hanno introdotto affermazioni false **nella riscrittura**, cioè nel momento in cui tutti la
   davano per sistemata.

### 16. Una verifica che i cancelli non sanno fare: guardare il prodotto.

Il difetto della regola 15 non si vede dai controlli automatici — ma **si vede guardando**.

In due applicazioni il difetto principale è emerso da una **fotografia dello schermo**: un
campo rosso dopo un'azione riuscita, dei bottoni vecchi in un pannello che nessuno aveva
toccato. Entrambi invisibili a tutto il resto.

> La fotografia è un cancello, non un abbellimento.

**Confermata su larga scala: 16 applicazioni su 29** di una serie consecutiva. Due casi dicono
quanto pesa:

- una revisione visiva ha trovato **tre difetti che sei revisioni di codice, la suite intera e
  le prove end-to-end non avevano visto**: un conteggio sbagliato in un'anteprima, un avviso
  che ignorava una casella, una colonna troppo stretta;
- un'altra ha trovato un difetto che **nessun controllo vedeva**: due ruoli leggevano «zero»
  per un utente che invece aveva il dato. Nessuna prova automatica lo cercava.

E in un terzo caso ha trovato qualcosa che tre revisioni avevano mancato: una configurazione
globale che **annullava una protezione promessa dal piano, dal codice e dalla documentazione**.
Tutti e tre dichiaravano la protezione presente; solo guardando si vedeva che non c'era.

Vale solo per lavori con una superficie visibile, e **non sostituisce i controlli automatici**:
vede cose che loro non vedono, e non vede quello che loro vedono.

---

### 17. Il piano passa da un revisore PRIMA di lanciare. E anche la sua riscrittura.

La regola 15 dice che il piano va riletto come codice. **Questa dice da chi**, e la risposta
misurata è: non da chi l'ha scritto.

**Quanto rende.** Dove è stata usata, una revisione del piano in sola lettura — un agente
dedicato, prima di generare i figli — ha trovato:

| applicazione | cosa ha trovato prima che partisse un solo figlio |
| ------------ | ------------------------------------------------- |
| una | **5 bloccanti**, 6 rilievi minori, e **1 difetto già in produzione** che nessuno aveva segnalato |
| un'altra | 4 bloccanti, che hanno **cambiato il piano**, non solo il testo |

> Osservato: **la revisione del piano rende più di quella del lavoro finito.** Un difetto nel
> mandato costa N volte — una per figlio — e nessun cancello lo vede. Trovarlo prima costa un
> agente in sola lettura.

**Dove va messa:** fra il piano e il lancio. È l'unico punto in cui quel difetto costa ancora
uno invece di N.

**Due revisori indipendenti, non uno.** Pratica consolidata in due progetti diversi: in
un'applicazione **entrambe** le revisioni hanno trovato difetti bloccanti, e **diversi fra
loro**. Un revisore solo trova la metà di quello che c'è.

**I rilievi vanno in un elenco che prevale sul piano**, non corretti dentro il testo. Così chi
esegue vede il difetto *e* la correzione, invece di una versione riscritta che sembra sempre
stata giusta — ed è anche la difesa contro il caso qui sotto, dove la riscrittura ne introduce
di nuovi.

**E la parte che quasi tutti saltano.** In due applicazioni la revisione ha fatto il suo lavoro,
la radice ha corretto il piano — e **nella correzione ha introdotto affermazioni false che
nessuno ha più riletto**. In un caso il difetto peggiore non era nella versione revisionata: è
entrato *dopo*, nella riscrittura.

> **Una spec riscritta dopo una revisione va riletta.** La radice che corregge da sola, senza
> una seconda lettura, è il punto più fragile dell'albero: tutti la credono già verificata.

Basta una rilettura breve, mirata alle sole parti cambiate.

**Cosa chiedere al revisore**, perché una revisione generica trova poco:

1. le affermazioni sul codice esistente **portano file e riga?** (una falsa ha superato ogni test)
2. il codice d'esempio **compila e fa quello che dice?** (ne sono stati copiati di rotti)
3. i controlli scritti nel piano **discriminano?** (più volte erano comandi che non potevano fallire)
4. c'è una superficie che il committente ha nominato e **il piano non copre?** (è il caso in cui
   tre giri di cancelli verdi non hanno visto nulla)

### 18. Rompere apposta il codice consegnato: il cancello che rende di più.

Prendi il lavoro consegnato, **rompilo di proposito in un punto preciso** — togli un filtro,
inverti una condizione, cancella un controllo — e guarda se le prove diventano rosse. Se
restano verdi, quelle prove non sorvegliavano niente.

**Quanto rende, misurato su 29 applicazioni consecutive dello stesso prodotto:**

| | |
| --- | --- |
| applicazioni in cui è stato usato | **26 su 29** |
| rotture sopravvissute (= buco nei controlli) | **8 su 72** |
| tasso | **una su nove** |

Due osservazioni che vengono da chi l'ha usato per un mese:

> «La rottura fatta da chi coordina è il cancello che ha reso di più»: in un'applicazione ha
> trovato un buco in **9 consegne su 19**, con la stessa forma ogni volta.

> In un'altra, **quattro figli su quattro** avevano un buco che la rottura ha trovato e le
> prove del figlio no.

**Chi la fa conta.** Il figlio non sa cosa non ha verificato: il buco sta proprio dove non ha
guardato. Chi coordina arriva da fuori, e rompe in punti che il figlio non ha considerato.

**Dove va messa:** alla consegna, prima di accettare. È l'unico momento in cui una prova inutile
costa ancora poco.

> Un verde dice «ho eseguito». Solo una rottura dice «**e se ne sarebbe accorto**».

### 19. La stima di un figlio sul proprio lavoro va divisa, non corretta.

Un figlio che stima il proprio compito sbaglia **sistematicamente per eccesso**, e il fattore è
misurabile:

| modello del figlio | fattore osservato |
| ------------------ | ----------------- |
| grande | stima ÷ 2 |
| intermedio | stima ÷ 1, ma su mandato chiuso **÷ 6 o 7** |

Caso misurato: 34,5 ore stimate dai figli, **circa 5 effettive**. L'applicazione successiva ha
usato quel rapporto per pianificare, e il cammino critico è tornato.

**Non serve chiedere stime migliori.** Serve sapere di quanto sbagliano: è una proprietà di chi
guarda un compito da dentro, non un difetto da correggere.

> Emerso in 15 applicazioni su 29. Un fattore stabile **si applica**, non si discute.

## I difetti ricorrenti di chi coordina

> Questi non sono difetti della struttura: sono di chi la governa, e **si ripetono**. Il primo
> da solo vale 12 occorrenze su 24 applicazioni. Se hai tempo per una contromisura sola, è la
> regola 17: un revisore sul piano, prima di lanciare.

Non sono difetti della struttura: sono **di chi la governa**, e si ripetono. Raccolti da otto
applicazioni reali del metodo, in ordine di frequenza.

### Ricordare invece di misurare

La forma più comune. Schede di allestimento che dichiarano due file di configurazione quando sono
tre; tabelle che dicono «il file esiste» quando non esiste; elenchi di cosa tocca un compito
compilati a memoria.

**Il costo non è l'errore: è che il figlio lo eredita.** Un mandato scritto su un ricordo sbagliato
produce un lavoro sbagliato che passa tutti i cancelli.

> Ogni affermazione che finisce in un mandato va misurata nel momento in cui si scrive.

### Sonde che non discriminano

Un controllo che dice «a posto» senza saper dire «non a posto». Si è ripetuto in tre applicazioni
su otto, sempre nella stessa forma: il controllo passa, nessuno lo mette alla prova, e passerebbe
anche col difetto dentro.

> Prima di credere a un controllo, rompi apposta ciò che deve sorvegliare. Se resta verde, non
> stava misurando niente.

**Una forma che sfugge anche a chi applica la regola.** Quando due protezioni diverse ottengono
lo stesso effetto, un controllo che misura **l'effetto finale** non distingue quale delle due ha
agito. Toglierne una lascia tutto verde — e la protezione rimasta nasconde che l'altra non era
sorvegliata da nessuno.

Caso reale: due guardie impedivano la stessa cosa; il controllo contava **quante volte l'azione
partiva**. Rimossa una guardia, i conteggi restavano identici perché l'altra bastava a fermare
l'azione. Restava però un temporizzatore attivo che non doveva esistere: invisibile a un
controllo che guardava i lanci.

**Si chiude cambiando cosa si conta**, non aggiungendo casi: contare il temporizzatore, cioè la
traccia che _solo_ quella guardia lascia.

> Se due cose impediscono lo stesso guaio, un controllo sull'effetto ne sorveglia una sola — e
> non dice quale. Cerca la traccia che una lascia e l'altra no.

### Modificare l'albero mentre i cancelli lo misurano

Un controllo lanciato su un albero che cambia sotto non misura né il prima né il dopo. Produce
rossi inspiegabili, o peggio verdi che non valgono.

> Mentre i cancelli girano, l'albero è fermo. Nessuna eccezione.

### Cancelli che non coprono tutto

Il caso più grave osservato: controlli «per pacchetto» che ne saltavano uno intero — **28 file e
297 prove mai eseguite**, con il verde che diceva tutto a posto. Scoperto da un conteggio dei
file, non dal verde.

> Un cancello va verificato contro l'elenco di ciò che doveva coprire, non contro il proprio esito.

---

## Le previsioni dichiarate prima

Pratica non prevista dal metodo originale, nata dall'uso e **da adottare**: prima di lanciare, chi
coordina scrive cosa si aspetta — quali superfici saranno condivise, quale figlio è più a rischio,
dove arriverà il primo conflitto.

Serve a una cosa sola: **a fine lavoro si vede quali erano sbagliate.**

In un'applicazione reale, tre previsioni su quattro si sono rivelate sbagliate — e **tutte e tre
sono state scoperte da una misura, nessuna da un verde**. Senza averle scritte prima, sarebbero
passate per intuizioni giuste.

Una previsione smentita è il risultato migliore che questa pratica possa dare: significa che una
convinzione sbagliata è stata trovata prima di costare.

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
passaggi partono **più leggeri** di figli di padri giovani. Se ereditassero sarebbe il
contrario — un padre carico produrrebbe figli enormi. Ogni agente riceve **solo il suo incarico** — ~14.000 token, l'unica parte che
varia da agente ad agente.

**Comunicazione tramite il genitore.** Non è solo ordine: impedisce che due agenti
modifichino lo stesso file all'insaputa l'uno dell'altro. In un caso reale la mancanza di
questo vincolo ha lasciato **84 file non salvati** su un albero di lavoro condiviso, fra cui
due sotto-progetti collaudati esistenti in copia unica.

---

## Il costo che NON dipende dall'albero

Del costo d'ingresso di un agente — che varia da 24.000 a 143.000 secondo il progetto, e **non**
secondo il modello (regola 2):

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

## Cosa del metodo non è mai stato messo alla prova

Otto applicazioni reali, misurate. Queste parti **non le ha esercitate nessuna**: non sono
sbagliate, sono **non provate**, e vanno usate sapendolo.

### L'albero profondo — ora osservato una volta, e con una sorpresa

**Un nipote esiste e funziona.** Un nodo intermedio ha lanciato tre figli nei loro spazi di
lavoro, li ha verificati, fusi e consegnati come un risultato solo. Tutti al primo tentativo.

**Ma il nodo intermedio non è economico come il calcolo prometteva.** Il metodo lo immagina
come uno smistatore che costa poco; nella misura ha pesato **più di ciascuna delle sue foglie**
(0,92 milioni contro 0,36 della più cara). Il costo non viene dal ragionamento: viene
dall'**attesa** e dai **cancelli rifatti** — il nodo ha ripetuto verifiche che faceva già la
radice.

> Nel mandato di un nodo intermedio va scritto **quali cancelli fa lui e quali la radice**. Due
> livelli che verificano lo stesso ramo sono lavoro doppio, ed è la voce che lo rende caro.

**La parte alta dell'intervallo ora è provata, e in un altro prodotto.** Quattro applicazioni
consecutive con **7, 7, 7 e 8 figli** per nodo, tutte riuscite. La raccomandazione «6-8» regge
anche al limite superiore, e non solo sull'ambiente da cui il metodo è nato.

### La comunicazione fra fratelli

Il documento la presenta come una garanzia: i figli parlano col genitore, che li mette in
comunicazione quando serve.

**Non è mai servita.** In tutti gli alberi osservati, chi coordina ha reso le foglie **disgiunte
prima di lanciarle** — separando i file, assegnando ambiti che non si toccano. Il conflitto non è
stato gestito: è stato reso impossibile.

È una strategia migliore, ma va detto che è **un'altra strategia**. Il meccanismo descritto nel
metodo non ha dati a supporto.

### Il modello economico sulle foglie

La tabella dei tre modelli è esercitata **per due terzi**: radice sul più capace, foglie su quello
intermedio, in ogni singola applicazione.

**Ora provato: otto foglie sul modello economico, otto consegne al primo tentativo.** Una ha
perfino trovato una controprova sbagliata nel piano che la guidava. **La qualità, sui compiti
meccanici per cui era stato scelto, ha retto.**

**Ma il risparmio è più piccolo di quanto dicesse il calcolo.** Su un'applicazione misurata, le
foglie economiche hanno usato **71, 79 e 96 passaggi contro una mediana di 19** delle foglie
intermedie, su compiti scelti apposta per essere più semplici. Le letture di contesto seguono:
4,8 milioni in media contro 1,1.

> Costa meno per passaggio, ma ne fa di più. **Il vantaggio esiste e non è quello promesso dalla
> sola tariffa.**

Questo **non smentisce** la soglia del 72% — che resta il confronto giusto — ma mostra che il
margine reale è più stretto di quanto la differenza di tariffa lasci credere.

### La promozione al primo fallimento

In otto applicazioni c'è stata **una sola sostituzione**, e per una morte da contesto saturo, non
per un errore ripetuto.

Quindi la regola 6 nella sua forma vera — _il figlio sbaglia, il padre corregge, il figlio sbaglia
ancora, si sostituisce_ — **non è mai stata applicata.** Il ciclo correggi-riprova-promuovi è
teoria.

### Il fork

**Mai usato, nemmeno una volta.** Tutta la sezione «figlio o fork» poggia su un calcolo, e lo
dichiara già. Otto applicazioni dopo, resta così.

### Cosa farne

Nessuna di queste è un motivo per cambiare il metodo: sono le parti su cui **non si hanno prove**,
e vanno distinte da quelle misurate. Chi le usa per primo dovrebbe scriverne l'esito — e se
qualcuna si rivela sbagliata, è meglio saperlo da un rapporto che da un lavoro perduto.

Il modo più rapido per esercitarne tre insieme: **un lavoro abbastanza grande da richiedere tre
livelli**, con le foglie sul modello economico. Metterebbe alla prova l'albero profondo, i nodi
intermedi e la soglia di promozione nello stesso colpo.

## Il metodo fuori dall'ambiente in cui è nato

Undici applicazioni su **prodotti diversi** — un'app mobile, un sistema di codici a barre, una
migrazione di componenti — sulla stessa macchina. Serve a distinguere ciò che è del metodo da
ciò che era dell'ambiente.

**Cosa ha retto senza adattamenti:** la struttura ad albero, gli spazi di lavoro separati, la
verifica col figlio ancora vivo, il recupero dall'albero del morto, la soglia «6-8 figli»
(provata quattro volte a 7 e 8, sempre riuscita).

**Cosa è stato adattato, e la ragione è generalizzabile:**

- **Il contratto scritto su file, non solo nell'incarico.** Quando più figli devono rispettare
  la stessa convenzione, metterla in un file che tutti leggono costa meno che ripeterla in ogni
  mandato — e non diverge.
- **Non chiedere a un figlio verifiche che falliranno sempre.** In quell'ambiente gli spazi di
  lavoro non avevano le dipendenze installate: chiedere il controllo dei tipi produceva un rosso
  garantito, e il figlio ci perdeva passaggi. Il principio: **prima di scrivere una verifica nel
  mandato, chiediti se in quello spazio può passare.**
- **Committare i prerequisiti prima di lanciare, non solo scriverli.** Un file scritto ma non
  committato è **invisibile** agli spazi dei figli. Imparato una volta a caro prezzo, poi
  applicato sistematicamente per tre applicazioni di fila.

**Un caso in cui il metodo è stato rifiutato, correttamente.** Chi coordinava ha valutato
l'albero due volte e due volte ha deciso di non usarlo, verificando i criteri di «quando NON
usare l'albero»: tre su quattro erano soddisfatti. È il primo caso documentato in cui la sezione
dei limiti ha funzionato **come sezione dei limiti**, impedendo un uso sbagliato invece di
guidarne uno giusto.

## Da dove vengono questi numeri, e cosa non provano

Tutti da trascrizioni reali: **3.245 agenti**, due mesi, quattro progetti diversi.

| dato                               | valore                    | base                                |
| ---------------------------------- | ------------------------- | ----------------------------------- |
| costo del passaggio n              | 118.000 + 1.260·n         | regressione, passaggi 1–110         |
| passaggi per agente                | 57 (mediana)              | 3.245 agenti                        |
| costo totale di un agente          | 9,4 M (mediana)           | 3.245 agenti                        |
| ingresso: NON dipende dal modello  | 6 coppie su 7 identiche   | confronto appaiato, stesso progetto e mese |
| tetto del contesto                 | 357.000 (mediana)         | 3.247 agenti                        |
| costo di ripresa                   | ~143.000                  | **5 casi**                          |
| soglia del modello economico (72%) | misurata, 16 vs 70 agenti | **qualità non confrontata**         |
| costo del fork                     | 0,31–0,39 M               | **calcolato, nessun fork nei dati** |

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

**Dove stanno le prove.** Ogni numero di questo documento viene da un rapporto di
applicazione reale: **54 rapporti**, ciascuno marcato con cosa ha prodotto. Nel repository da
cui nasce questo documento stanno accanto a esso, con un indice. Se stai leggendo il solo
metodo, quei rapporti non ti servono per applicarlo — servono solo per rimettere in discussione
un numero.

**Metà circa viene da prodotti diversi** da quello in cui il metodo è nato, e sono i più utili:
distinguono ciò che è del metodo da ciò che era dell'ambiente. Da lì arrivano la terza modalità
di morte, i comandi che azzerano, la soglia «6-8» provata al limite, il caso in cui il metodo è
stato correttamente rifiutato, e le due pratiche più redditizie — rompere il consegnato e
dividere le stime.

**Undici di quei rapporti non esistono più**, archiviati dopo l'estrazione su richiesta di chi
li aveva prodotti. I loro contributi sono qui dentro con i numeri, ma le misure originali non
sono più riverificabili: regole buone, numeri da rimisurare se contano davvero.

**Per rimisurare su un altro ambiente:** i dati stanno nelle trascrizioni degli agenti — una
per agente, con il consumo di ogni passaggio. Da lì si ricavano tutte le cifre di questo
documento: costo del passaggio n-esimo, passaggi per agente, ingresso per modello, tetto del
contesto.

Nel repository da cui nasce questo documento esiste anche uno strumento che confronta i metodi
a costo zero — calcola invece di lanciare agenti. Non è necessario: serve a provare una
configurazione prima di spendere, e si riscrive in un centinaio di righe partendo dalle formule
di questa sezione.

