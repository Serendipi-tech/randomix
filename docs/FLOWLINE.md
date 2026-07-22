# SPIEGAZIONE

Questo file spiega il funzionamento previsto, non definitivo, dei flussi interni dell'app.

# LEGENDA

[F] - funzionalità
[.../] - pagina
[M] - modale / bottom sheet
[B] - bottone

**randomix**

- (auth) <- _sezione esterna dell'app, non protetta_
  - landing page
  - login/
    - registrazione [F]
    - recupero password [F]
    - (app)/ <- _sezione interna dell'app protetta da login_
      - home/
        - randomizzatore [M]
          - numeri [F]
          - colori [F]
          - lettere alfabeto [F]
        - elenco liste [B]
          - lista/
            - modifica lista [M]
            - aggiungi nuovo item [B]
              - dettagli item come sotto, riutilizzabile [M]
            - elenco item [B]
              - dettaglio item [M]
                - nome
                - categoria
                - tag
                - rating
                - mostra / nascondi item agli amici
        - "aggiungi nuova lista" [B]
          - dettaglio lista [M]
            - nome
            - listcategory
            - colore
            - icona (scelte da lucide react)
            - mostra / nascondi lista agli amici
      - profilo
        - immagine del profilo (scelta da elenco statico)
        - nome utente (modificabile?)
        - statistiche dell'account
        - impostazioni
          - logout
          - scelta della lingua (per ora no)
          - tema
          - in futuro: scelta sulle notifiche, ecc
      - notifiche
        - elenco inviti gruppi
        - elenco inviti amicizie
        - status di tutte le richieste di entrambe le categorie
      - amici
        - elenco amici
          - amico/
            - liste dell'amico
            - statistiche singole dell'amico
        - statistiche generali condivise con amici
      - gruppi
        - elenco membri
        - impostazioni gruppo (se si è admin o amministratori)
          - area gestione dei membri
        - elenco liste condivise
          - tasto "partecipa alla lista"
          - randomizzatore della lista
        - elenco challenge
          - ogni challenge ha il suo progresso singolo per utente che partecipa
