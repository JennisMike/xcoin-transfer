import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { XcoinRequest } from "@/utils/types";
import { sampleTransactions } from "@/utils/data";

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<XcoinRequest | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const url = `${import.meta.env.VITE_ROOT_URL}/admin/transactions/${id}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setTransaction(response.data);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      } finally {
        if (import.meta.env.DEV && transaction == null) {
          const foundTransaction = sampleTransactions.find(
            (txn) => txn.id == id
          );
          console.log(foundTransaction);
          setTransaction(foundTransaction);
        }
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [id, transaction]);

  if (isLoading) return <p>Loading...</p>;

  if (!transaction) return <p>Transaction not found</p>;

  return (
    <div className="container mx-auto p-4 max-w-screen-md">
      <h1 className="text-2xl font-bold">Transaction Details</h1>
      <p>
        <strong>ID:</strong> {transaction.id}
      </p>
      <p>
        <strong>Amount:</strong> {transaction.amount}
      </p>
      <p>
        <strong>Status:</strong> {transaction.status}
      </p>
      <p>
        <strong>Date:</strong> {transaction.date}
      </p>
      <p>
        <strong>Type:</strong> {transaction.type}
      </p>
    </div>
  );
};

export default TransactionDetail;
