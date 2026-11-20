import { prisma } from '../../builder';

// Stessa forma di MembershipLimitations in ./index.ts (non esportata da lì: duplicata qui
// per restare nel perimetro dei file consentiti per questo task, senza toccare index.ts).
export interface MembershipLimitations {
  maxLists?: number | null;
  maxItemsPerList?: number | null;
  hideItemsEnabled?: boolean | null;
  maxGroupsCreatable?: number | null;
  maxGroupsJoinable?: number | null;
  showAds?: boolean | null;
  supportPriority?: 'LOW' | 'MEDIUM' | 'HIGH' | null;
}

// Fallback estremo: nessuna subscription attiva per l'utente E nessun piano FREE configurato
// a DB. Non dovrebbe succedere in condizioni normali, ma trattiamo l'utente come il piano più
// restrittivo possibile (zero creazioni consentite) invece di concedere limiti illimitati per errore.
const NO_PLAN_FALLBACK: MembershipLimitations = {
  maxLists: 0,
  maxItemsPerList: 0,
  maxGroupsCreatable: 0,
  maxGroupsJoinable: 0,
  hideItemsEnabled: false,
  showAds: true,
  supportPriority: 'LOW',
};

// Un admin non è mai limitato dal piano: tutti i campi null/true = illimitato o abilitato,
// nella stessa convenzione usata altrove (null = nessun limite).
const ADMIN_UNLIMITED: MembershipLimitations = {
  maxLists: null,
  maxItemsPerList: null,
  maxGroupsCreatable: null,
  maxGroupsJoinable: null,
  hideItemsEnabled: true,
  showAds: false,
  supportPriority: 'HIGH',
};

/**
 * Ritorna i limiti del piano attivo dell'utente.
 *
 * Un utente con ruolo ADMIN salta del tutto la logica di piano: nessun limite si applica al
 * pannello admin né ai suoi account di test.
 *
 * Oggi la creazione di un utente (registerWithCredentials / loginWithGoogle in
 * user.mutations.ts) NON crea automaticamente una Subscription: non è garantito che ogni
 * utente ne abbia una ACTIVE. Fallback in due passi quando manca:
 * 1. Cerchiamo il piano FREE configurato a DB (il più restrittivo tra quelli reali) e usiamo i suoi limiti.
 * 2. Se neanche un piano FREE esiste a DB, usiamo NO_PLAN_FALLBACK (nessuna creazione consentita).
 */
export async function getActiveMembership(userId: string): Promise<MembershipLimitations | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role === 'ADMIN') {
    return ADMIN_UNLIMITED;
  }

  const activeSubscription = await prisma.subscription.findFirst({
    where: { userId, status: 'ACTIVE' },
    orderBy: { startDate: 'desc' },
    include: { membership: true },
  });

  if (activeSubscription?.membership) {
    return (activeSubscription.membership.limitations as MembershipLimitations | null) ?? {};
  }

  const freeMembership = await prisma.membership.findFirst({
    where: { plan: 'FREE', deletedAt: null },
  });

  if (freeMembership) {
    return (freeMembership.limitations as MembershipLimitations | null) ?? {};
  }

  return NO_PLAN_FALLBACK;
}
