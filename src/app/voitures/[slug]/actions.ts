"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sendReservationNotification } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

const reservationSchema = z.object({
  car_id: z.string().uuid(),
  car_slug: z.string().trim().min(1),
  car_label: z.string().trim().min(1),
  customer_name: z.string().trim().min(2),
  customer_email: z.string().trim().email(),
  customer_phone: z.string().trim().min(6),
  start_date: z.string().trim().min(1),
  end_date: z.string().trim().min(1),
  message: z.string().trim().optional(),
});

export async function createReservationAction(formData: FormData) {
  const parsed = reservationSchema.safeParse({
    car_id: formData.get("car_id"),
    car_slug: formData.get("car_slug"),
    car_label: formData.get("car_label"),
    customer_name: formData.get("customer_name"),
    customer_email: formData.get("customer_email"),
    customer_phone: formData.get("customer_phone"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    redirect("?reservation=validation");
  }

  const reservation = parsed.data;
  const today = new Date().toISOString().split("T")[0];

  if (reservation.start_date < today) {
    redirect("?reservation=past");
  }

  if (reservation.end_date < reservation.start_date) {
    redirect("?reservation=dates");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reservations").insert({
    car_id: reservation.car_id,
    customer_name: reservation.customer_name,
    customer_email: reservation.customer_email,
    customer_phone: reservation.customer_phone,
    start_date: reservation.start_date,
    end_date: reservation.end_date,
    message: reservation.message || null,
    status: "pending",
    cash_payment_received: false,
    manager_note: null,
  });

  if (error) {
    redirect("?reservation=error");
  }

  const notification = await sendReservationNotification({
    carLabel: reservation.car_label,
    customerName: reservation.customer_name,
    customerEmail: reservation.customer_email,
    customerPhone: reservation.customer_phone,
    startDate: reservation.start_date,
    endDate: reservation.end_date,
    message: reservation.message,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/reservations");
  redirect(
    `/voitures/${reservation.car_slug}?reservation=success${
      notification.sent ? "" : "&notification=failed"
    }`,
  );
}
