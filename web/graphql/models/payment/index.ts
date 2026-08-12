import { builder } from '../../builder';

interface PaymentsByStatusShape {
  status: string;
  count: number;
}

interface RevenuePointShape {
  date: Date;
  totalAmount: number;
}

interface AdminPaymentStatsShape {
  totalRevenue: number;
  paymentsByStatus: PaymentsByStatusShape[];
  revenueByDay: RevenuePointShape[];
}

export const PaymentsByStatusRef = builder.objectRef<PaymentsByStatusShape>('PaymentsByStatus');
PaymentsByStatusRef.implement({
  fields: (t) => ({
    status: t.exposeString('status'),
    count: t.exposeInt('count'),
  }),
});

export const RevenuePointRef = builder.objectRef<RevenuePointShape>('RevenuePoint');
RevenuePointRef.implement({
  fields: (t) => ({
    date: t.field({ type: 'DateTime', resolve: (p) => p.date }),
    totalAmount: t.exposeFloat('totalAmount'),
  }),
});

export const AdminPaymentStatsRef = builder.objectRef<AdminPaymentStatsShape>('AdminPaymentStats');
AdminPaymentStatsRef.implement({
  fields: (t) => ({
    totalRevenue: t.exposeFloat('totalRevenue'),
    paymentsByStatus: t.field({ type: [PaymentsByStatusRef], resolve: (s) => s.paymentsByStatus }),
    revenueByDay: t.field({ type: [RevenuePointRef], resolve: (s) => s.revenueByDay }),
  }),
});
