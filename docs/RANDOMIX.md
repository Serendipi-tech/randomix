# RandoMIX

## MVP

- Login
    - Credentials
    - Google Play
- Randomizzatore generale
    - Di numeri da X a Y
        - E voglio sorteggiarne 4
    - Di lettere dall’alfabeto
    - Di colori
- Generatore lancio di dadi
- Liste
    - Creazione
        - Nome customizzabile
        - Icone prese dal catalogo Lucide React
        - Colori scelti dall’utente
    - Scelta da elenco predefinito
    - Scelta se condividere con amici o no
    - Categoria
        - Booleano isGiftedAtRegistration
            - è una lista gratuita non modificabile in nome e categoria (che sono sorteggiati fra quelli presenti) regalata all’iscrizione in app. possono aggiungere e rimuovere elementi ma non cambiare la lista in sé.
- Elementi Lista
    - Selezione dagli amici
    - Creazione **[ * ]**
        - Nome customizzabile
        - Immagine (solo da API, non per categorie CUSTOM)
        - Id di riferimento facoltativo per collegamento con le API
        - Lista
        - Descrizione API (se collegato)
        - Descrizione personale (sostitutiva di eventuale API, ma solo visibile all’utente che la scrive — presente nella join elemento > lista)
        - Note ( join elemento > lista )
        - Tag custom
            - Scelta nome
            - Scelta colore
            - Suggerimento altri presenti per scelta standard
            - ( ereditabili fra liste ed elementi, collegati all’utente )
        - Scelta se condividere con amici o no
        - Modifica elemento
        - Eliminazione elemento
            - Elimina la join, non l’elemento vero e proprio
        - Sistema di rating
            - Valutazione a stelline 1-5
            - Nota opzionale
            - Non si può eliminare
            - Si può modificare
            - Rimane sempre presente anche se si elimina join elemento > lista
- Lista amici
    - Aggiunta amici
        - tramite nome utente o email
        - Possibilità di vedere i loro progressi
        - Possibilità di vedere le loro liste condivise
        - Possibilità di vedere i loro rating sui singoli elementi o pagina dedicata
        - Statistiche rating di elementi comuni
        - Pagina matching con riepilogo valutazioni in comune, ecc ecc
    - Rimozione amici
    - Gruppi
        - Possibilità di scegliere gli amici con cui far gruppo
            - Invio e ricezione invito gruppo
                - Accettazione
                - Rifiuto
            - Uscita dal gruppo
            - Rimozione di persona X dal gruppo
        - Scelta delle liste da condividere col gruppo
            - gli utenti membri scelgono QUALI liste per categoria condividere SE ne hanno più di una condivisa
            - Viene creata una lista fittizia che unisca le liste degli altri eliminando duplicati
                - NON è lista back-end
            - Progresso comune elementi in corso / completati
                - Ogni persona avrà lo status aggiornato singolarmente, non in gruppo, ma solo avanzando, es.
                Y ha già visto Harry Potter e lo sta riguardando. Lo status rimane completato, non “in corso”.
                X non ha mai visto Harry Potter e lo sta guardando con Y. Lo status va a “in corso”.
                Z stava già guardando Harry Potter e lo ha ricominciato con Y e X. Il suo status rimane “in corso”.
                - Possibilità dell’utente di decidere se aggiungere l’elemento in corso / completato nella propria lista se non presente ( Y e X guardano Harry Potter, che è nella lista di Y, ma X non lo vuole nella sua lista )
                - Se il gruppo segna “completato”, lo status si aggiorna a tutti coloro che non hanno l’elemento già “completato”.
            - Possibilità di importare la lista del gruppo nel proprio elenco di liste e/o di aggiornare la lista corrispettiva aggiungendo elementi
        - Scelta dell’obbiettivo giornaliero/settimanale/mensile/annuale del gruppo
            - Descrizione obiettivo
            - Elemento numerico per autocompilazione (opzionale, va spiegato bene)
            - Elemento categoria per autocompilazione (opzionale)
            - Elenco tag di riferimento per autocompilazione (opzionale)
            - Spunta che limita il progresso alle voci degli elementi nella lista condivisa nel gruppo stesso (opzionale)
            - Esempi pratici:
            1# “500 pagine lette questa settimana” > NON necessita di elemento numerico, né di elemento categoria, perché va spuntato a mano dai membri del gruppo per la propria compilazione.
            2# “3 libri romantici letti questo mese” > NECESSITA di elemento numerico ed elemento categoria perché può essere autocompilato, ma va richiesta la conferma all’utente per sicurezza (”vuoi aggiungere questo volume al progresso di gruppo?”)
- Profilo utente
    - Sezione obiettivi personali (tipo sopra ma meglio)
    - Avatar (icona standard fornita da noi)
    - Nome utente
    - Progressi
    - Lingua
    - Lista amici
    - Eliminazione account e dati
        - fermo restando che i rating NON vanno eliminati ma resi “Anonimi” o “Utente cancellato”

## SPECIFICHE DA CAPIRE QUANDO

- **RANDOMIZZAZIONE GRUPPO CON VALORE AGGIUNTO A ELEMENTI IN COMUNE**
Nello specifico: X Y e Z hanno Harry Potter nei libri in comune. Harry Potter vale 3 o vale 1 nella randomizzazione? Scelta utente.
- Estrazione / randomizzazione programmata.
    - Timing / countdown per l’estrazione.
    - Estrazione in tempo reale per tutti quelli che sono collegati e vogliono vedere.
    - Possibilità di randomizzare i membri del gruppo e non solo gli elementi di una o più liste.
        - Rivedere le limitazioni di UNLIMITED in merito ai membri max del gruppo.

## EXTRA FEATURES

- Collegamento con Extra App #1.

## EXTRA APP

1. App che ti aiuta a trovare film e serie tv e su quali piattaforme sono disponibili, ti crei la tua lista, rating ecc ecc ecc.

**[ * ]** Gli elementi vanno prima cercati in API (OpenLibrary, TMDb, etc) per trovare i corrispettivi in database più ampi (e possibilmente già forniti di traduzioni). L’utente sceglie prima la categoria, poi inserisce il nome e appare una finestra con query “Stai cercando…” e l’elenco di risultati. Se è 0, non appare proprio la finestra. Quando l’utente clicca su un elemento, succede una delle seguenti:

- se l’elemento è già nel DB, semplicemente crea la join e si aggancia;
- se l’elemento NON è nel DB, viene creato il record AL SALVATAGGIO DELL’UTENTE con tutte le info che è possibile recuperare dalle API e che ci servono (immagine, nome, traduzioni, etc etc). Poi si crea la join e l’utente si aggancia al nuovo record.

Questo significa che l’app ha un database **INCREMENTALE** che crescerà gradualmente con la sua utenza.

Bisogna però cercare bene quante categorie hanno cataloghi online affermati da cui poter prendere elenchi aggiornati.

## LIMITI PACCHETTI PAGAMENTO

### FREE

- 3 liste
    - per creare nuove liste l’utente deve “congelare” una delle precedenti. tuttavia NON è possibile scongelarla se non tramite pagamento PLUS. l’utente dev’essere informato.
    - è possibile CANCELLARE una lista ma i rating sopravvivono, la lista viene eliminata per sempre. l’utente deve essere informato
- 20 elementi per lista
    - da valutare con claude cosa succede raggiunto il limite
- creazione 1 gruppo
- partecipazione gruppi (incluso il proprio) max 3
- max membri gruppo proprio 15
- ad in app (bisogna capire come e dove)
- supporto standard
- possibilità di nascondere liste agli amici, ma non singoli item

### PLUS MESE 0,99€ — ANNO INTERO 9,99€

- 15 liste
    - se l’utente smette di pagare il plus, le liste si congelano e non possono toccare niente, ma solo vedere i progressi passati, aggiungere rating etc. non possono toccare proprio niente
- 100 elementi per lista
    - da valutare con claude cosa succede raggiunto il limite
- creazione 10 gruppi
- partecipazioni gruppi (inclusi i propri) max 30
- max membri gruppo proprio 15
- no ads
- supporto prioritario
- possibilità di nascondere liste e singoli item agli amici
- randomizzatore multiplo (non solo un risultato, ma scelta di quanti estrarne) limitato 1-10
- possibilità di randomizzare solo una categoria per lista (sia micro che macro)

### UNLIMITED 30€

- liste illimitate
- elementi illimitati
- creazione gruppi illimitata
- partecipazione gruppi illimitata
- max membri gruppo proprio 100
- no ads
- supporto prioritario+
- possibilità di nascondere liste e singoli item agli amici
- randomizzatore multiplo (non solo un risultato, ma scelta di quanti estrarne) non limitato
- possibilità di creare elementi privati non condivisi dalla community
- possibilità di randomizzare solo certe categorie delle liste (sia micro che macro)