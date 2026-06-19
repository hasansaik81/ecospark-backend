export type TPaymentIntent = {
  userId: string;
  ideaId: string;
  amount?: number;
};

export type TIPaymentResult = {
  clientSecret: string;
  transactionId: string;
  amount: number;
};

export type TPaymentConfirmation = {
  userId: string;
  ideaId: string;
  transactionId: string;
  amount: number;
  status: "succeeded" | "failed" | string;
};
