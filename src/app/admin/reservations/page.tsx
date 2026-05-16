import { requireAdmin } from "@/lib/admin";
import { formatDate } from "@/lib/format";

type ReservationRow = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  status: "pending" | "confirmed" | "refused" | "cancelled" | "completed";
  cash_payment_received: boolean;
  cars: {
    brand: string;
    model: string;
  } | null;
};

const statusLabels: Record<ReservationRow["status"], string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  refused: "Refusée",
  cancelled: "Annulée",
  completed: "Terminée",
};

export default async function AdminReservationsPage() {
  const { supabase } = await requireAdmin();
  const { data: reservations, error } = await supabase
    .from("reservations")
    .select(
      "id,customer_name,customer_email,customer_phone,start_date,end_date,status,cash_payment_received,cars(brand,model)",
    )
    .order("created_at", { ascending: false })
    .returns<ReservationRow[]>();

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b45309]">
          Gestion
        </p>
        <h1 className="mt-2 text-3xl font-black">Réservations</h1>
      </div>

      {error ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          Impossible de charger les réservations.
        </div>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-[#f9fafb] text-xs uppercase tracking-[0.14em] text-[#6b7280]">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Voiture</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Paiement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {(reservations ?? []).map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-4 py-4">
                    <p className="font-bold">{reservation.customer_name}</p>
                    <p className="text-[#6b7280]">{reservation.customer_email}</p>
                    <p className="text-[#6b7280]">{reservation.customer_phone}</p>
                  </td>
                  <td className="px-4 py-4">
                    {reservation.cars
                      ? `${reservation.cars.brand} ${reservation.cars.model}`
                      : "Voiture supprimée"}
                  </td>
                  <td className="px-4 py-4">
                    {formatDate(reservation.start_date)} -{" "}
                    {formatDate(reservation.end_date)}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-md bg-[#f3f4f6] px-2 py-1 text-xs font-bold">
                      {statusLabels[reservation.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {reservation.cash_payment_received ? "Reçu" : "Non reçu"}
                  </td>
                </tr>
              ))}
              {!reservations?.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-[#6b7280]" colSpan={5}>
                    Aucune réservation pour le moment.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
