import axios, { AxiosError } from "axios";

async function getPaymentLink(
  amount: number,
  currency: string,
  description: string,
  redirectUrl: string
) {
  try {
    const response = await axios.post("http://localhost:3000/payment-link", {
      amount: amount || "5",
      currency: currency || "XAF",
      description: description || "Test",
      redirect_url: redirectUrl || "http://localhost:5173/dashboard",
    });

    console.log("Payment link:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error(
      "Error fetching payment link:",
      error instanceof AxiosError ? error.response?.data : String(error)
    );
  }
}

export default getPaymentLink;
