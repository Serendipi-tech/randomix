# Report — metodo multiagente (test parziale)

> Prima applicazione reale di `docs/features/toponomia_genealogia_multiagent.md` nel repo.
> Oggetto di questo report è **solo il metodo** (struttura, regole, consumi) — non i task
> del Profilo, trattati altrove (`docs/PLANES/PROFILO.md`, `PROFILO_AGENT_SPEC.md`).

## Scala del test — caveat da tenere sempre presente

Il documento di riferimento è calibrato su **3.245 agenti**, alberi larghi 6-8 e profondità
multiple. Qui l'albero aveva **2 figli, un solo livello**. Quasi tutte le regole sulla
_scala_ (larghezza ottimale, promozione a cascata, soglia Haiku 17-20%, costo di risveglio)
**non sono state messe alla prova** — non c'era volume sufficiente perché potessero
manifestarsi. Quello che segue è verificabile solo sulle regole che riguardano
_comportamento di un singolo nodo_, non l'ottimizzazione di un albero grande.

## Struttura genealogica usata

```
me (radice, Sonnet)
 ├─ fa direttamente: pulizia header (1 file, sotto soglia di delega)
 ├─ Nodo A — Backend    (Sonnet, foglia — nessun figlio sotto di sé)
 └─ Nodo B — Mobile     (Sonnet, foglia — nessun figlio sotto di sé)
```

Nessun livello intermedio. Decisione presa applicando due regole del documento insieme:

- **Regola 9** ("sotto i 3-4 figli, fa il lavoro lui"): con solo 2 workstream sostanziali +
  1 task banale, un coordinatore intermedio non si giustificava — la radice ha gestito
  direttamente lo smistamento.
- **Task in catena → non spezzare oltre**: ogni nodo aveva ~4 passi ma tutti sequenziali
  sugli stessi pochi file (schema → mutation → template → gql_crud da un lato; hook → hook
  → schermata → i18n dall'altro). Il documento sconsiglia di frammentare ulteriormente una
  catena: ogni nodo ha eseguito la propria sequenza per intero, senza deleghe interne.

Il criterio "figlio vs fork" (§ Figlio o fork?) è stato applicato correttamente in modo
esplicito: entrambi i nodi erano task autonomi specificabili per iscritto ("applica questo
schema a questi file"), non avevano bisogno del perché delle decisioni prese nella
conversazione — quindi **figli freschi**, non fork. Nessun fork usato in questo giro.

## Regole osservabili a questa scala — esito

| Regola                                                                   | Applicata?                    | Esito                                                                                                                                                                                                             |
| ------------------------------------------------------------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #3 Dichiarare sempre il modello                                          | ✅                            | `model: "sonnet"` esplicito su entrambi i lanci, nessuna ereditarietà lasciata al caso                                                                                                                            |
| Comunicazione tramite il genitore                                        | ✅                            | I due nodi non si sono mai parlati direttamente. Il contratto (nomi mutation, campi, error code) è stato fissato **a priori** in un file scritto (`PROFILO_AGENT_SPEC.md`), non solo nel prompt — vedi nota sotto |
| "Il padre aspetta in silenzio"                                           | ✅                            | Zero sonde manuali; risposta solo alle notifiche di completamento                                                                                                                                                 |
| #7 Estinguere, mai risvegliare                                           | ✅                            | Nessun figlio riattivato. I due bug trovati in verifica sono stati corretti dalla radice, non rispedendo il figlio                                                                                                |
| #8 Verificare chi tocca un contratto condiviso, subito                   | ✅                            | Verifica fatta appena arrivate le notifiche: letto il file di giunzione (`gql_crud`), confrontati nomi/argomenti, poi `tsc --noEmit` su entrambi i progetti                                                       |
| #6 Promuovere al primo fallimento, non correggere lo stesso figlio       | ⚠️ non direttamente testabile | Vedi sotto — il caso reale non rientra esattamente nella casistica della regola                                                                                                                                   |
| Larghezza 6-8 figli, promozione a cascata, soglia Haiku, costo risveglio | ⛔ non testabile              | Servono più nodi/più fallimenti di quanti ne genera un albero di 2                                                                                                                                                |

## Un caso non coperto esplicitamente dal documento

La regola 6 parla di un figlio che **fallisce e lo sa** (task ripreso, esito negativo
riconosciuto): lì la prescrizione è sostituirlo, non correggerlo in vita.

Qui è successo altro: entrambi i nodi hanno **dichiarato successo**, ma la verifica della
radice (regola 8) ha trovato due difetti reali:

1. un bug del Nodo B (`emailError?.message` su un valore già stringa — `tsc` lo ha
   individuato subito);
2. un problema d'ambiente non imputabile a nessuno dei due nodi (client Prisma non
   rigenerato dopo `db push`, quindi i nuovi campi non erano ancora visibili ai tipi).

In nessuno dei due casi ha senso "sostituire il figlio" (regola 6): il figlio è già
estinto, il difetto è puntuale (1-2 righe), e ricrearlo per una correzione da due minuti
violerebbe la regola 9 (sotto soglia, costa più che farlo direttamente). La radice ha
corretto in prima persona. Il documento non tratta esplicitamente questo terzo caso
("il figlio ha consegnato, la verifica del padre trova un difetto minore") — sembra un
corollario naturale della regola 9 applicato al risultato della regola 8, ma non è scritto
da nessuna parte come regola a sé. Vale la pena annotarlo se il metodo verrà esteso.

## Adattamento: contratto scritto su file, non solo nel prompt

Il documento descrive la comunicazione-tramite-il-genitore come un vincolo di processo
(niente scambi diretti fra fratelli). In pratica qui è stata implementata scrivendo il
contratto condiviso in un file (`docs/PLANES/PROFILO_AGENT_SPEC.md`) letto da entrambi i
nodi all'avvio, invece di ripeterlo per esteso in ciascun prompt. Effetto collaterale
positivo non menzionato nel documento: il contratto è rimasto **ispezionabile da un umano**
indipendentemente dagli agenti, ed è il primo artefatto che ho riletto io stesso in fase di
verifica — coerente con la regola "si conserva ciò che il figlio ha prodotto, non l'agente"
(qui esteso a "si conserva anche ciò che il padre ha prodotto per i figli").

## Consumi osservati

Dati reali dalle due `task-notification` di chiusura (non stimati):

| Nodo        | Token (subagent) | Tool call | Durata |
| ----------- | ---------------: | --------: | -----: |
| A — Backend |           66.651 |        25 | 4m 53s |
| B — Mobile  |           99.139 |        31 | 3m 07s |

Non comparabile direttamente con le cifre del documento (mediana 9,4 M/agente, 57
passaggi): quei numeri derivano da 3.245 agenti su task ben più lunghi. Qui il campione è
n=2 e i task erano deliberatamente piccoli (4-5 passi l'uno, come da spec). Il dato utile
non è il valore assoluto ma la **conferma di ordine di grandezza**: due task da "poche
decine di migliaia di token" ciascuno, eseguiti in parallelo in ~5 minuti, contro un
ipotetico singolo agente che avrebbe dovuto caricare in sequenza schema Prisma + resolver

- email template + gql_crud + hook + schermata + i18n nello stesso contesto.

Costo della radice (io) non misurabile da questo lato: non ho un contatore token
self-reported nella stessa unità delle notifiche dei figli, quindi il "totale albero" non è
calcolabile con dati reali — solo i due rami lo sono.

## Un allineamento non pianificato con la regola 2/5

Durante questa sessione l'utente ha cambiato manualmente il modello della radice: Opus 5
nella fase di lancio/verifica degli agenti (il momento con più decisioni: gap da colmare,
contratto da fissare, debug del blocco Prisma), poi di nuovo Sonnet 5 per un compito
meccanico successivo (scrivere questo report). Non è stata una policy applicata da me — è
stata una scelta manuale dell'utente — ma il risultato riproduce esattamente il criterio
della regola 5 ("il compito è capire qualcosa di non ancora capito, o materiale pesante" →
modello più capace). Non prova che il criterio sia automatizzabile qui, ma è un indizio
concreto che la soglia "compito normale vs compito che richiede giudizio" percepita
dall'utente coincide con quella del documento.

## Limiti di questo test

- n=2 figli: non dice nulla su larghezza ottimale, promozione a cascata, costo di
  risveglio, soglia di convenienza di Haiku — servono alberi più larghi e più fallimenti
  per osservarli.
- Nessun fallimento vero di un figlio (solo difetti minori trovati in verifica): la regola
  6 (sostituzione) resta non esercitata.
- Nessun uso di Haiku (escluso su richiesta esplicita) e nessun fork: due rami del
  documento non toccati da questo test.
- Costo della radice non misurato: manca la metà dei dati per un bilancio economico
  completo dell'albero.

## In sintesi

Sulle regole che _si potevano_ osservare a questa scala (dichiarazione modello,
comunicazione solo tramite il genitore, attesa silenziosa, verifica immediata su ciò che è
condiviso, niente risvegli) il metodo si è comportato come descritto, senza attriti. Il
punto più utile emerso non è nel documento originale: quando la verifica del padre trova un
difetto minore su un figlio già estinto, non si applica né "sostituire" né "risvegliare" —
si corregge direttamente, per lo stesso motivo (soglia di convenienza) della regola 9.
