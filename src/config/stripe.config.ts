
import Stripe from "stripe";
import { envVars } from "./env";

const stripeSecret = process.env.STRIPE_SECRET_KEY ?? envVars?.STRIPE?.SECRET_KEY ?? "sk_test_placeholder";

export const stripe = new Stripe(stripeSecret);
