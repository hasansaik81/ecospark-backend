


import Stripe from "stripe";
import { envVars } from "./env";

// Prefer using process.env as a fallback in case envVars isn't initialized yet
const stripeSecret = process.env.STRIPE_SECRET_KEY ?? envVars?.STRIPE?.SECRET_KEY;
if (!stripeSecret) {
	throw new Error("Stripe secret key is missing. Set STRIPE_SECRET_KEY in your environment.");
}

export const stripe = new Stripe(stripeSecret, {
	// apiVersion: "2024-06-20",
});
