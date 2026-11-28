import { useQuery } from '@apollo/client';
import { MembershipQueries } from '@randomix/graphql-schema';
import { apolloClient } from '@/lib/apollo';
import type { MembershipPlanId } from './membershipFormat';

const { MY_PLAN } = MembershipQueries;

interface MyPlanQuery {
  myMembership: { id: string; plan: MembershipPlanId } | null;
}

/** Carica il tipo di piano e lo lascia in cache. Va chiamata appena la sessione è valida (accesso
 *  e riapertura dell'app), così `useMyPlan` risponde dalla cache e i banner non compaiono a pagina
 *  già disegnata. Gli errori sono volutamente ignorati: senza il piano l'app resta usabile. */
export async function prefetchMyPlan(): Promise<void> {
  try {
    await apolloClient.query<MyPlanQuery>({ query: MY_PLAN, fetchPolicy: 'network-only' });
  } catch {
    // nessun piano in cache: i banner restano in attesa, niente di bloccante
  }
}

/** Tipo di account, da sola. Query leggera (nessun prezzo, nessun limite) e `cache-first`: dopo il
 *  prefetch dell'accesso risponde senza rete. Per i dettagli del piano c'è `useMyMembership`. */
export function useMyPlan() {
  const { data } = useQuery<MyPlanQuery>(MY_PLAN, { fetchPolicy: 'cache-first' });

  // Nessuna subscription attiva = piano FREE implicito (stessa convenzione del pannello admin)
  const currentPlan: MembershipPlanId = data?.myMembership?.plan ?? 'FREE';
  const planKnown = data !== undefined;

  return {
    currentPlan,
    // Distingue "piano noto" da "ancora in attesa": finché è false chi mostra proposte di upgrade
    // può riservare lo spazio invece di inserirle di colpo
    planKnown,
    isFreePlan: planKnown && currentPlan === 'FREE',
    // Piano acquistato: il trial non conta, è gratuito a tempo
    hasPaidPlan: planKnown && currentPlan !== 'FREE' && currentPlan !== 'FREE_TRIAL',
  };
}
