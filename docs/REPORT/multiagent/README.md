# Indice — report sul metodo multiagente

Rapporti di verifica del metodo descritto in [`docs/metodo-agenti/`](../../metodo-agenti/), prodotti
applicandolo su lavoro reale in questo repository. Non riguardano il merito dei task eseguiti (quello vive
in `TODO.md`/`ONDATA-N.md`): servono solo a rimettere in discussione le regole del metodo con dati reali.

| Report | Data | Scala | Cosa ha dato al metodo |
|---|---|---|---|
| [`multiagent.md`](multiagent.md) | 18/09/2026 | n=2 foglie, 1 livello | Prima applicazione reale. Nota un caso non scritto: quando la verifica del padre trova un difetto minore su un figlio già estinto, si corregge direttamente (né sostituzione né risveglio) |
| [`ondata1-19-11-2026.md`](ondata1-19-11-2026.md) | 19/11/2026 | n≈19 lanci, 5-6 pacchetti, 1 livello | Prima conferma reale della soglia 6-8 figli per nodo. Trova un gap di metodo: la regola 10 (due controlli sulla base) va scritta in ogni mandato quando c'è rischio di base disallineata, non solo nei mandati giudicati a rischio — qui il giudizio del coordinatore si è sbagliato su 2 casi su 3. Rinforza con un meccanismo diverso (morte per tetto d'uso, non difetto su figlio vivo) il corollario già notato nel primo report. Osserva un possibile costo di latenza non proporzionale nei lanci molto larghi, non trattato nel documento (da confermare). |
