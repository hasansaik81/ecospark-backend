// import Stripe from "stripe";
// import { envVars } from "./env";

// export const stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY)


import Stripe from "stripe";
import { envVars } from "./env";

export const stripe = new Stripe(envVars.STRIPE.SECRET_KEY, {
  apiVersion: "2024-06-20",
});