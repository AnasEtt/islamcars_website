"use client";

import { useState } from "react";
import { createReservationAction } from "./actions";

type ReservationFormProps = {
  carId: string;
  carSlug: string;
  carLabel: string;
};

export function ReservationForm({
  carId,
  carSlug,
  carLabel,
}: ReservationFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);
    
    // Reset end date if it's now before the new start date
    if (endDate && value && endDate < value) {
      setEndDate("");
    }
    
    // Clear error when user changes input
    if (error) setError(null);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (startDate && value < startDate) {
      setError("tu dois choisir une date après ta date de début");
    } else {
      setError(null);
      setEndDate(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!startDate || !endDate) return;

    if (startDate < today) {
      e.preventDefault();
      setError("tu ne peux pas reservé dans le passé");
      return;
    }

    if (endDate < startDate) {
      e.preventDefault();
      setError("tu dois choisir une date après ta date de début");
      return;
    }
  };

  return (
    <form action={createReservationAction} onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input name="car_id" type="hidden" value={carId} />
      <input name="car_slug" type="hidden" value={carSlug} />
      <input name="car_label" type="hidden" value={carLabel} />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <Field label="Nom complet" name="customer_name" required />
      <Field label="Email" name="customer_email" required type="email" />
      <Field label="Téléphone" name="customer_phone" required />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Date de début
          <input
            className="mt-2 h-11 w-full rounded-md border border-black/15 px-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
            name="start_date"
            required
            type="date"
            min={today}
            value={startDate}
            onChange={handleStartDateChange}
          />
        </label>
        <label className="block text-sm font-semibold">
          Date de fin
          <input
            className="mt-2 h-11 w-full rounded-md border border-black/15 px-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
            name="end_date"
            required
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={handleEndDateChange}
          />
        </label>
      </div>

      <label className="block text-sm font-semibold">
        Message
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-black/15 px-3 py-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
          name="message"
          placeholder="Lieu de livraison, heure souhaitée, question..."
        />
      </label>

      <button
        className="h-12 w-full rounded-md bg-[#3a444b] font-bold text-white transition hover:bg-[#4b5660]"
        type="submit"
      >
        Demander une réservation
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-md border border-black/15 px-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}
