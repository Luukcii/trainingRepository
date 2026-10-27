// Email sending via Resend. Server-only: the API key must never reach the browser.
import "server-only";
import { Resend } from "resend";

// No custom domain yet, so Resend only allows sending from its test address,
// and only to the Resend account owner's inbox. Swap this once a domain is verified.
export const EMAIL_FROM = "Max's Portfolio <onboarding@resend.dev>";

let client: Resend | undefined;

// Created on first use, so pages that never send email don't need the key.
export function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}
