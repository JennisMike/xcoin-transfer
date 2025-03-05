import axios, { AxiosError } from "axios";

async function getPaymentLink({
  amount,
  currency,
  description,
  redirectUrl,
}: {
  amount?: string;
  currency?: string;
  description?: string;
  redirectUrl?: string;
}): Promise<string | undefined> {
  try {
    console.log("Fetching payment link...");
    const url = import.meta.env.VITE_ROOT_URL;
    const response = await axios.post(
      `${url}/payments/payment-link`,
      {
        amount: amount,
        currency: currency || "XAF",
        description: description || "Test",
        redirect_url: redirectUrl || "http://localhost:5173/dashboard",
      },
      { withCredentials: true }
    );

    console.log("Payment link:", response.data);
    sessionStorage.setItem("transactionId", response.data.transaction.id);
    return response.data.link;
  } catch (error: unknown) {
    console.error(
      "Error fetching payment link:",
      error instanceof AxiosError ? error.response?.data : String(error)
    );
  }
}

export default getPaymentLink;
