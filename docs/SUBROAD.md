# SUBITO

## MACRO CATEGORIE

- [ ] Grafica esterna
- [ ] Risistemare le logiche degli item (item copy.prisma) — ⚠️ file rinominato `item copy.prisma.draft`: bloccava tutto lo schema Prisma. Incompleto (referenzia `itemId` che non dichiara)
- [ ] Le categorie devono diventare dei Model — ⚠️ `categories.prisma.draft`, idem. `ListCategory` usa ancora l'enum `CATEGORY`, la conversione è a metà
- [ ] Profilo
- [ ] Randomizzatore singolo
- [ ] Randomizzatore liste
- [ ] Inserire sistema feedback e bug
- [ ] Pagamenti
- [ ] Amici
- [ ] Copia dagli amici
- [ ] Notifiche

### MICRO
- [ ] Pagina Profilo
    - [x] Togliere Colors
    - [x] Spostare Logout — icona in alto a destra + conferma
    - [x] Modifica avatar — resta nel Profilo (editing inline)
    - [x] Far sparire il page title "profile"
    - [ ] Rendere la pagina bellì ← **unico punto rimasto, da definire insieme**
    - [x] Aggiungere statistiche account — liste / completati / amici
    - [ ] Aggiungere sezione feedback e bug — rimandato, vedi `docs/features/user_feedback/`
    - [x] Pagina Impostazioni → `mobile/src/app/(app)/settings.tsx`
        - [x] Modifica nome utente — già nel Profilo, non duplicata qui
        - [x] Modifica email — OTP di verifica sulla nuova casella
        - [x] Modifica password — vecchia + nuova + conferma
        - [ ] Pagamenti — voce nascosta, Fase 4 non iniziata
- [ ] Pagina Home
    - [ ] Refactor completo di item/useritem
    - [ ] Customizzare il randomizer singolo
    - [ ] Customizzare il randomizer delle liste
    - [ ] Statistiche nell'header
    - [ ] Pagina Lista
        - [ ] Sistemare Dettaglio > Ratings
- [ ] Login
    - [ ] Recupero Password
    - [ ] Imposta birthday (non modificabile)
- [ ] Grafica esterna

---
---

---
---

# DISABILITARE • FARE IN FUTURO

## MACRO CATEGORIE

- [ ] Gruppi
- [ ] Challenge
