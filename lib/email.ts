const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendContactEmail({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  if (!RESEND_API_KEY) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Construction Company <onboarding@resend.dev>",
      to: [process.env.ADMIN_EMAIL || "admin@example.com"],
      subject: `New Contact Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    }),
  });

  if (!res.ok) {
    console.error("Failed to send email:", await res.text());
  }
}
