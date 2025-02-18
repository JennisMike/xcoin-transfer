import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { FiArrowDownCircle, FiArrowUpCircle } from "react-icons/fi";

function UserDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [walletBalance, setWalletBalance] = useState(5000); // Example balance in XCoin
  const transactions = [
    { id: 1, type: "Deposit", amount: 2000, date: "2025-02-18" },
    { id: 2, type: "Withdrawal", amount: 1500, date: "2025-02-17" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{walletBalance} XCoin</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Exchange Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">1 XCoin = 6.5 RMB</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex space-x-4">
              <Button variant="default" className="flex items-center">
                <FiArrowUpCircle className="mr-2" /> Buy XCoin
              </Button>
              <Button variant="outline" className="flex items-center">
                <FiArrowDownCircle className="mr-2" /> Convert to RMB
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>{txn.type}</TableCell>
                  <TableCell>{txn.amount} XCoin</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
