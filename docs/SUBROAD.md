# SUBITO

## MACRO CATEGORIE

- [ ] Grafica esterna
- [ ] Risistemare le logiche degli item (item copy.prisma) — ⚠️ file rinominato `item copy.prisma.draft`: bloccava tutto lo schema Prisma. Incompleto (referenzia `itemId` che non dichiara)
- [ ] Le categorie devono diventare dei Model — ⚠️ `categories.prisma.draft`, idem. `ListCategory` usa ancora l'enum `CATEGORY`, la conversione è a metà
- [x] Profilo
- [ ] Randomizzatore singolo
- [ ] Randomizzatore liste
- [ ] Inserire sistema feedback e bug — 🟡 UI mobile fatta (mock, vedi Pagina Profilo sotto), backend (`UserFeedback`, `createUserFeedback`/`myFeedbacks`) da fare
- [ ] Pagamenti — 🟡 entry point + placeholder "in arrivo" fatti, nessun backend (Fase 4)
- [ ] Amici
- [ ] Copia dagli amici
- [ ] Notifiche

### MICRO
- [x] Pagina Profilo — nucleo pagina completo; feedback e pagamenti restano 🟡 (solo mockup, vedi sotto)
    - [x] Togliere Colors
    - [x] Spostare Logout — icona in alto a destra + conferma
    - [x] Modifica avatar — resta nel Profilo (editing inline)
    - [x] Far sparire il page title "profile"
    - [x] Rendere la pagina bellì — direzione "Hero verticale" (avatar che sfonda la card, pannello statistiche a righe con bordo a gradiente)
    - [x] Aggiungere statistiche account — liste / completati / amici
    - [ ] Aggiungere sezione feedback e bug — 🟡 MOCKUP: schermata `mobile/src/app/(app)/feedback.tsx` con lista e form, dati finti in memoria (`useFeedbackMock.ts`), nessuna persistenza. Non è la feature, solo lo scaffolding UI — backend vero ancora da fare, vedi `docs/features/user_feedback/`
    - [x] Pagina Impostazioni → `mobile/src/app/(app)/settings.tsx`
        - [x] Modifica nome utente — già nel Profilo, non duplicata qui
        - [x] Modifica email — OTP di verifica sulla nuova casella
        - [x] Modifica password — vecchia + nuova + conferma
        - [ ] Pagamenti — 🟡 MOCKUP: bottone → bottom sheet con solo testo placeholder "in arrivo", nessun piano/prezzo/integrazione reale (Fase 4 non iniziata)
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
