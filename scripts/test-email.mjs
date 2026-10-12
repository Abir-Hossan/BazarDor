
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM_EMAIL || "BazarDor <onboarding@resend.dev>";
const to = process.env.RESEND_TEST_TO;

if (!apiKey) {
  console.error("RESEND_API_KEY is missing in .env.local");
  process.exit(1);
}

if (!to) {
  console.error("Add RESEND_TEST_TO to .env.local");
  process.exit(1);
}

const resend = new Resend(apiKey);

const { data, error } = await resend.emails.send({
  from,
  to,
  subject: "BazarDor - Resend Test",
  html: "<p>This is a test email from BazarDor.</p>",
});

if (error) {
  console.error("Resend test failed:", error);
  process.exit(1);
}

console.log("Resend accepted the test email.");
console.log("Email ID:", data?.id);
