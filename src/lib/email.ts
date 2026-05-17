type ReservationEmailInput = {
  carLabel: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  message?: string | null;
};

export async function sendReservationNotification({
  carLabel,
  customerName,
  customerEmail,
  customerPhone,
  startDate,
  endDate,
  message,
}: ReservationEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESERVATION_NOTIFICATION_EMAIL;
  const from = process.env.EMAIL_FROM ?? "Islamcars <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return { sent: false, reason: "missing_config" };
  }

  const plainText = [
    "Nouvelle demande de reservation - Islamcars",
    "",
    `Voiture : ${carLabel}`,
    `Dates : ${startDate} au ${endDate}`,
    "",
    "Client :",
    `Nom : ${customerName}`,
    `Email : ${customerEmail}`,
    `Telephone : ${customerPhone}`,
    "",
    "Message :",
    message?.trim() || "Aucun message.",
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Nouvelle reservation - ${carLabel}`,
      text: plainText,
      reply_to: customerEmail,
    }),
  });

  if (!response.ok) {
    return { sent: false, reason: "resend_error" };
  }

  return { sent: true };
}
