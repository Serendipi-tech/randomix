# 16/07/2026

## Sezione 1 - Verifiche

- [ ] **Confermare la chiamata/risposta univoca per mobile e web.**
    *Nello specifico*: le chiamate API alla piattaforma Next devono essere sicure. Gli unici che possono usarle sono i possessori di una specifica password che va impostata. Ergo - bisogna assicurarsi che sia impossibile fare chiamate agli endpoint esposti di Next, a meno che non si abbia la password che sfrutteremo da mobile. Così nessun malintenzionato può sballarci niente.

## Sezione 2 - Setup mancanti

- [ ] **Upload dell'app Next su Vercel.**
    *Nello specifico*: l'app Next, standalone, dev'essere messa su Vercel in modo da ottenere un indirizzo web specifico al quale poter fare le chiamate da mobile. Al momento si riferisce sempre al localhost, ma non va bene perché ogni volta siamo costretti a fare il run dev sul backend.
    Con il backend sempre attivo su Vercel, invece, questo step si risolve da solo. Bisognerà poi ricordarci di fare sempre il push del backend sul main così l'app online sarà sempre disponibile e aggiornata.

- [ ] **Aggiornamento link d'indirizzo sull'env Mobile.**
    *Nello specifico*: al momento nell'env c'è l'indirizzo del localhost. Una volta connesso Next a Vercel, quell'indirizzo andrà cambiato.

## Sezione 3 - Features mancanti
- [ ] **Recupero password.**
    *Manca proprio l'intera sezione, ma va inserita.*

## Sezione 4 - Solo se c'è tempo
- [ ] **Creazione sezioni interne vuote.**
    *Nello specifico*:
        - **Home** con elenco liste.
        - **Social** con sezione profilo e amici all'interno.
        - **Settings** autoesplicativo.
        In basso c'è la navbar per muoversi in giro.
        Non c'è bisogno di inserire nulla all'interno delle pagine, per ora.
- [ ] **Creazione objects per task di domani:**
    - List
    - ListCategory
    - Item
    - User_Item
    - List_UserItem
    - Tag
    - Rating