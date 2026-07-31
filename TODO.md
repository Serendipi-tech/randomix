# MODIFICHE GRAFICHE, UI / UX, TRANSIZIONI, ANIMAZIONI, ECC

[TODO] - Elementi da creare.
[FIX] - Elementi da sistemare (anche solo grafici).
[BUG] - Elementi da correggere.

- [ ] **#1 - [FIX] RatingStars -> Animazione**
      L'animazione delle icone stella del componente avviene in contemporanea su tutte quando si clicca un numero superiore. (Es. Da 1 stella passo a 4, le stelle in mezzo si animano nello stesso momento e nello stesso modo).
      Va trovata una soluzione elegante che attivi/disattivi le icone stella in modo fluido e sequenziale.

- [ ] **#2 - [FIX] Checkbox e Radio buttons -> Dimensioni**
      Ingrandire le dimensioni di entrambi i componenti, che al momento risultano molto piccole, anziché il solo *hitSlop* (ovvero la box di click).

- [ ] **#3 - [FIX] Switches -> Restyle grafico**
      Il componente è brutto come la fame. Va rifinito e pulito per emulare lo standard IOS, con il corpo sottile e la pallina che si muove fluidamente a destra e sinistra anziché avere il toggle classico Android.

- [ ] **#4 - [FIX] Loader -> Restyle grafico e Animazione**
      Al momento il componente è molto standard. Va migliorato l'aspetto e reso più "artistico", un po' come gli altri elementi dell'app (es. progress bar).

- [ ] **#5 - [FIX] Challenge Card Favorite Star -> Animazione**
      Metterci un effetto qualsiasi per animare il click della stella.

- [ ] **#6 - [FIX] Navbar - Animazioni**
      Bisogna aggiungere animazioni fluide/migliori al cambio active della navbar.

---

# FEATURES FUTURE

- [ ] **#1 - [NEW] Dati extra nella bottomsheet di dettaglio degli item**
    - "X dei tuoi amici hanno questo elemento nella loro lista"
    - Rating medio degli amici (generico)

- [ ] **#2 - [NEW] Obiettivi personali**
    - "Questa settimana voglio leggere N libri"