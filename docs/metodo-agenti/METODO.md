# Metodo di lavoro con gli agenti

**Versione 2.0** · 18/11/2026 · 19 regole · base: 54 applicazioni reali su prodotti diversi


> **Se sei un agente e stai leggendo questo file:** è il metodo operativo per organizzare
> lavoro su più agenti, **senza sprecare e senza sbagliare**.
>
> **Come leggerlo, in ordine:**
>
> 1. **«In una pagina»** — le tabelle delle decisioni, divise per momento. Bastano per operare.
> 2. **«Quali regole ti riguardano»** — quali valgono sempre e quali solo a certe condizioni.
>    Guardalo prima di applicare una regola che non ti torna.
> 3. **«Se puoi applicarne solo alcune»** — le stesse regole ordinate per rendimento, se non
>    hai tempo di adottarle tutte.
> 4. **«Cosa scrivere nel mandato»** e **«Unire il lavoro dei figli»** — le due operazioni
>    concrete che il metodo richiede, con l'elenco di cosa non dimenticare.
>
> **Questo file basta per operare.** Le prove — i casi reali, le misure, gli errori corretti,
> le aree non ancora verificate — stanno in [`PROVE.md`](PROVE.md), che è tre volte più
> grande. Aprilo **solo se una regola ti sembra sbagliata**: lì trovi su quanti casi si regge.
>
> **Portata.** Il metodo è indipendente dal prodotto: nessuna regola presuppone un linguaggio,
> uno strumento o un dominio. I **numeri** invece vengono da un ambiente solo — i rapporti fra
> le grandezze si trasportano, i valori assoluti no, e dove conta è scritto accanto.
>
> È nato come metodo per **risparmiare**. Cinquantaquattro applicazioni reali dopo, le lezioni
> più care sono di un altro tipo: un difetto nel piano che tutti i figli copiano, un
> comando che cancella il lavoro dei fratelli, un agente buttato via per la diagnosi
> sbagliata. Le regole 10-19 vengono da lì.

---
## In una pagina

Un albero. Chi sta in alto capisce il problema e lo divide, chi sta in basso esegue. Ogni
agente riceve **solo** il suo incarico, comunica **col genitore**, e viene **estinto**
appena consegna.

```
        radice              capisce il problema, decide la divisione
       /      |      \
   nodo    nodo    nodo      smistano, verificano, mettono in
    / \     / \     / \      comunicazione i fratelli
   f   f   f   f   f   f     eseguono 1-2 task e muoiono

   Il modello di ciascuno si sceglie dal COMPITO, non dalla posizione:
   il più economico che lo fa bene (regola 5).
```

### Prima di lanciare

| decisione | regola |
| --------- | ------ |
| Delego o faccio da solo? | **Delega**, sopra i 5-6 task. Non delegare costa fino a 16× (1, 9) |
| Ho riletto il piano? | **Il piano è codice.** Un difetto lì dentro lo copiano tutti i figli, e nessun cancello lo vede (15) |
| Chi rilegge il piano? | **Un revisore in sola lettura, non chi l'ha scritto.** Ha trovato 5 bloccanti prima che partisse un figlio (17) |
| L'ho riscritto dopo la revisione? | **Allora va riletto.** Due volte il difetto peggiore è entrato NELLA correzione (17) |
| Quanto durerà? | **Dividi la stima del figlio**: ÷2 sul modello grande, ÷6 su mandato chiuso (19) |
| Quanti figli per nodo? | **6-8.** Provato fino a 8: più largo e piatto costa meno |
| Quale modello? | **Il più economico che fa il lavoro bene.** Non il più economico in assoluto: un lavoro sbagliato costa più del risparmio (2, 5) |
| Quanto tetto d'uso mi resta? | **Contalo prima del turno**, e se non basta spezza in più turni — **non declassare** i compiti che richiedono il modello grande (2) |
| Devo dichiararlo? | **Sempre.** Se lo ometti, il figlio nasce col modello del padre (3) |
| Da dove parte il figlio? | Dalla **versione esatta che gli scrivi tu**, e digli se deve consegnare in modo durevole (10) |
| Cosa gli vieto? | **I comandi che azzerano la cartella di lavoro**: travolgono i fratelli (14) |
| Cosa scrivo nel mandato? | Vedi **«Cosa scrivere nel mandato»**: 9 voci, nessuna facoltativa |
| Gli chiedo di verificare? | Solo controlli che nel **suo** spazio possono passare, altrimenti è un rosso garantito |

### Mentre lavorano

| decisione | regola |
| --------- | ------ |
| Aspetto o controllo? | **Aspetta in silenzio.** Dieci «avete finito?» raddoppiano il tuo costo |
| Il figlio ha sbagliato? | Correggi. **Se sbaglia di nuovo, sostituiscilo** con un modello superiore — al primo fallimento, non al terzo (6) |
| Il figlio è morto? | **Guarda prima il suo spazio**: il lavoro sopravvive alla foglia (13). Poi distingui la causa fra le tre (11) |
| Devo correggerlo da vivo? | **Rilancialo**, non riprenderlo: i suoi comandi finirebbero nel TUO spazio (12) |

### Alla consegna

| decisione | regola |
| --------- | ------ |
| Devo controllarlo? | **Solo se sbagliare costa** — file condivisi, lavoro da cui dipendono altri. E subito, da vivo (8) |
| Tocca dati già raccolti? | Chiedi: **ripara il passato o ferma solo il futuro?** Tre esiti, e vanno distinti (8) |
| Le prove del figlio reggono? | **Rompi apposta il suo codice** e guarda se diventano rosse. Una su nove non se ne accorge (18) |
| C'è una superficie visibile? | **Guardala.** In 16 casi su 29 ha trovato ciò che nessun controllo vedeva (16) |
| Il figlio ha finito? | **Estinguilo.** Risvegliarlo dopo costa quanto crearne uno nuovo (7) |
| Come unisco i lavori? | **Uno alla volta, riverificando dopo ognuno.** Vedi «Unire il lavoro dei figli» |

### Casi a parte

| decisione | regola |
| --------- | ------ |
| Serve il contesto del padre? | Allora **fork**, non figlio. Costano uguale, cambia cosa ricevono |
| L'albero conviene davvero? | Quattro casi in cui **non** conviene: pochi task, task in catena, problema non ancora capito, tutti sullo stesso file |

---

## Quali regole ti riguardano

Non tutte valgono sempre. Prima di usarle, guarda qui: **ogni regola vale incondizionatamente
oppure ha una precondizione**, e se la precondizione non c'è la regola non si applica.

| vale SEMPRE | perché non dipende da nulla |
| ----------- | --------------------------- |
| 1, 9 — delegare sopra una certa soglia, non sotto | il costo cresce col quadrato dei passaggi: è una proprietà del lavorare per turni |
| 3 — dichiarare il modello dei figli | vale ovunque esista più di un modello |
| 6, 7, 11, 12, 13 — fallimenti, morti, estinzione, rilanci | riguardano il ciclo di vita di un agente |
| 15, 17 — il piano è codice, e passa da un revisore | un difetto nel mandato si moltiplica per il numero dei figli, sempre |
| 18 — rompere apposta il consegnato | un controllo che non discrimina è inutile in qualunque ambiente |
| 19 — dividere le stime dei figli | chi guarda un compito da dentro lo sovrastima, sempre |

| vale SE… | regola | se la condizione manca |
| -------- | ------ | ---------------------- |
| …esistono modelli di capacità diversa | 2, 4, 5 | scegli solo in base alla lunghezza del compito |
| …i figli hanno spazi di lavoro separati su una base versionata | 10 | salta la 10, ma **applica la 14**: senza separazione il rischio è molto più alto |
| …i figli condividono uno spazio di lavoro | 14 | non ti riguarda — ed è il motivo per cui conviene separarli |
| …il lavoro ha una superficie visibile | 16 | nessuna fotografia da guardare |
| …il lavoro tocca dati già raccolti | 8, parte finale | la domanda «ripara il passato?» non si pone |
| …i figli possono nascere da una copia del contesto del padre | «figlio o fork?» | esiste solo il figlio |
| …il tuo ambiente misura il consumo per turno | tutte le cifre | le **regole** reggono, i **numeri** vanno rimisurati |

**Come riconoscere quanto vale un'affermazione.** Il documento non etichetta ogni riga, ma la
distinzione si legge dal modo in cui è scritta:

| se leggi… | significa |
| --------- | --------- |
| un numero con **quanti casi** accanto («26 su 29», «8 su 72») | **misurato** |
| un rapporto senza casi, o una tabella derivata da formule | **calcolato** da misure, mai osservato direttamente |
| una riga della sezione «cosa non è mai stato messo alla prova» | **non verificato**, e dichiarato tale |

Dove un dato è fragile — pochi casi, una sola osservazione — è scritto accanto al dato, non in
fondo. Se una regola ti sembra sbagliata, **cerca quanti casi la sostengono** prima di seguirla
o scartarla.

## Se puoi applicarne solo alcune, parti da queste

Le regole sono numerate per argomento, non per importanza. Questa è la stessa lista ordinata
per **rendimento**: quanto spesso ha trovato un difetto vero, rispetto a quanto costa applicarla.

### Rendimento altissimo — trova molto, costa quasi nulla

| regola | cosa trova | costo |
| ------ | ---------- | ----- |
| **15** · il piano è codice | 12 occorrenze su 13 applicazioni. **Nessun cancello lo vede**: il figlio esegue bene un mandato sbagliato | una rilettura |
| **17** · due revisori sul piano | 5 bloccanti e un difetto già in produzione, **prima** che partisse un figlio | un agente in sola lettura |
| **18** · rompere apposta il consegnato | 26 applicazioni su 29; **un buco ogni nove rotture** | minuti |

Hanno in comune una cosa: **agiscono dove un difetto costa ancora uno invece di N.** Un errore
nel piano si moltiplica per il numero di figli; una prova che non discrimina lascia passare
tutto ciò che sorvegliava.

### Rendimento alto — poco costose, evitano danni grossi

| regola | cosa evita |
| ------ | ---------- |
| **14** · vietare i comandi che azzerano | dieci file di fratelli travolti, **irrecuperabili** |
| **16** · guardare il prodotto | 16 applicazioni su 29; tre difetti che sei revisioni non videro |
| **19** · dividere le stime dei figli | pianificazioni sbagliate di un fattore sei |
| **10** · versione di partenza e controllo | due agenti su tre fermi quando mancava |

### Rendimento medio — contano quando il caso si presenta

**11** (tre modi di morire) · **12** (rilanciare, non riprendere) · **13** (guardare l'albero del
morto) · **6** (promuovere al primo fallimento) · **8** (verificare dove sbagliare costa).

Sono diagnosi e reazioni: non si applicano tutti i giorni, ma quando servono **la scelta
sbagliata costa un agente intero**.

### Fondamento — non si applicano, si sanno

**1** e **9** (le soglie di delega) · **2** e **5** (quale modello) · **3** (dichiararlo) ·
**4** (il risparmio vale se arriva in fondo) · **7** (estinguere).

Decidono la forma dell'albero prima che esista. Sbagliarle non produce un difetto visibile:
produce un albero che costa di più del necessario, per sempre.

### Il limite di questa classifica, dichiarato

**Misura quanto spesso un cancello trova qualcosa, non quanto sarebbe costato non trovarlo.**

Nessuno dei 54 rapporti alla base di questo documento registra quali difetti sono poi arrivati
in produzione, né quale cancello avrebbe potuto vederli. Quindi:

- «un buco ogni nove rotture» dice la **frequenza**, non la gravità;
- una regola che trova un difetto raro ma distruttivo — la **14** — sta in seconda fascia solo
  perché il caso si è presentato una volta sola;
- l'ordine fra fasce è solido, quello **dentro** una fascia è opinabile.

**Come si colmerebbe:** tenere traccia, per un periodo, dei difetti scoperti *dopo* il rilascio
e risalire a quale cancello avrebbe potuto vederli. Finché non c'è, questa è una guida alla
priorità, non una misura di valore.

## Cosa scrivere nel mandato di un figlio

Le regole dicono *cosa decidere*. Questo è l'elenco di ciò che l'incarico deve **contenere**,
raccolto dalle regole sparse perché chi scrive un mandato ce l'abbia davanti tutto insieme.

| voce | perché | regola |
| ---- | ------ | ------ |
| **il compito**, delimitato: cosa fare e cosa NON toccare | un figlio che esonda tocca il lavoro dei fratelli | 14 |
| **la versione di partenza**, esatta — mai «l'ultima» né «la mia» | il suo spazio non eredita il tuo stato | 10 |
| **due controlli sulla base**, con «fermati se non li trovi» | senza, scopre la base sbagliata dopo aver prodotto | 10 |
| **se deve consegnare in modo durevole** o lasciare il lavoro dov'è | un figlio può morire fra lo scrivere e il consegnare | 10, 13 |
| **i divieti**: nessun comando che azzeri lo spazio di lavoro | dieci file di fratelli travolti, irrecuperabili | 14 |
| **quali verifiche deve lanciare lui**, scelte fra quelle che nel suo spazio possono passare | chiedere un controllo che fallirà sempre gli fa perdere passaggi | — |
| **quali verifiche NON sono sue** (le fa chi coordina) | due livelli che verificano la stessa cosa è lavoro doppio | — |
| **cosa fare se qualcosa non torna**: fermarsi e chiedere, mai decidere da solo | una fermata ha evitato che un figlio staccasse il ramo al padre | 12 |
| **se può lanciare agenti propri**, e con che budget | in due casi un figlio l'ha fatto senza che nessuno lo sapesse: utile, ma è costato più del padre | — |

**Il modello non va scritto nel mandato: si dichiara al lancio** (regola 3). Se lo ometti, il
figlio nasce col modello di chi lo lancia.

> Un mandato che contiene tutte queste voci è lungo. **È il punto giusto in cui essere
> prolissi:** ogni riga che manca qui diventa un difetto moltiplicato per il numero dei figli.

---

## Unire il lavoro dei figli

Il metodo dice come farli lavorare separati. Questa è la parte che li rimette insieme, ed è un
momento in cui si rompono cose: in un caso osservato, **la prima unione ha reso rosse 43
verifiche** che erano verdi in ogni singolo spazio.

**Chi unisce è chi coordina, mai i figli.** Un figlio che unisce da sé non vede gli altri e può
sovrascriverli.

**L'ordine di sicurezza:**

1. **Verifica ciascun figlio nel suo spazio** prima di unire. Un difetto trovato dopo l'unione
   non si sa più di chi sia.
2. **Unisci uno alla volta**, non tutti insieme. Se qualcosa si rompe, sai chi è stato.
3. **Ripeti le verifiche dopo ogni unione**, non solo alla fine. Due lavori corretti
   separatamente possono essere incompatibili insieme — ed è proprio ciò che le verifiche dei
   singoli non possono vedere.
4. **Verifica su ciò che è stato consegnato davvero**, non sullo spazio del figlio: un file
   scritto ma non consegnato risulta presente a lui e assente a tutti gli altri.

> Le verifiche di un figlio dicono che **il suo** lavoro è sano. Non dicono niente su cosa
> succede quando incontra quello degli altri: quella è una verifica a parte, e va rifatta ogni
> volta che si aggiunge un pezzo.

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

---

## Le diciannove regole, in una riga ciascuna

Ogni regola porta **da quante applicazioni reali viene**. Il perché, i casi e le misure stanno in [`PROVE.md`](PROVE.md), una sezione per regola.

### Costo (1-9) — non sprecare

| n | regola | base |
| - | ------ | ---- |
| **1** | **Delega** sopra i 5-6 task: un contesto unico costa fino a **16×**, perché cresce col quadrato dei passaggi | misurato |
| **2** | Il modello pesa sui **passaggi**, non sull'ingresso: l'ingresso è del progetto, uguale per tutti i modelli | 6 coppie su 7 |
| **3** | **Dichiara sempre** il modello dei figli: se lo ometti, nasce col modello del padre | 59 omissioni su 533 |
| **4** | Un modello economico che **non arriva in fondo** costa tutto quello che ha speso, più il sostituto | 2 agenti morti |
| **5** | Scegli **il più economico che fa il lavoro bene** — non il più economico in assoluto, non il più capace | misurato |
| **6** | Il figlio sbaglia due volte? **Sostituiscilo**, non cambiargli modello: non si può, e costerebbe di più | calcolato |
| **7** | **Estingui** i figli: risvegliarne uno costa quanto crearlo, la memoria temporanea è scaduta | 143.000 ricalcolati |
| **8** | **Verifica solo dove sbagliare costa** — e subito, col figlio ancora vivo | +50%, ma evita rifacimenti |
| **9** | **Non delegare sotto i 5 passaggi**: un agente minimo costa comunque 424.000 token | misurato |

### Correttezza (10-19) — non sbagliare

| n | regola | base |
| - | ------ | ---- |
| **10** | Dai al figlio **la versione esatta** di partenza e due controlli per accorgersene se è sbagliata | 2 agenti su 3 fermi |
| **11** | Si muore in **tre modi** — contesto pieno, tetto d'uso, connessione caduta — e le cure sono diverse | 3 osservati |
| **12** | Un figlio da correggere **si rilancia**, non si riprende: i suoi comandi finirebbero nel tuo spazio | 1 caso, grave |
| **13** | Prima di rilanciare un morto, **guarda cosa ha lasciato**: il lavoro sopravvive alla foglia | 7 file recuperati |
| **14** | **Vieta i comandi che azzerano** lo spazio di lavoro: travolgono i fratelli, e loro non se ne accorgono | 10 file travolti |
| **15** | **Il piano è codice**: un difetto lì dentro lo copiano tutti i figli, e nessun cancello lo vede | 12 occorrenze su 13 applicazioni |
| **16** | **Guarda il prodotto**: trova ciò che nessun controllo automatico vede | 16 su 29 applicazioni |
| **17** | Il piano passa da **due revisori**, prima di lanciare — e anche la sua riscrittura | 5 bloccanti prima del lancio |
| **18** | **Rompi apposta il consegnato** e guarda se le prove diventano rosse | 26 su 29; un buco ogni 9 |
| **19** | **Dividi la stima del figlio**: ÷2 sul modello grande, ÷6 su mandato chiuso | 34,5 ore stimate, 5 reali |

> Le regole **15, 17 e 18** sono quelle col rendimento più alto misurato: agiscono dove un
> difetto costa ancora uno invece di N. Se puoi applicarne solo tre, sono queste.

