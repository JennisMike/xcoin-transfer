import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { Transaction } from "../types";
import { mockTransactions } from "../data";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function TransactionHistoryPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isExporting, setIsExporting] = useState(false);

  // Helper function for status filter styling
  const getStatusFilterClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "failed":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  // Simulated API call to get transactions
  const applyFilters = useCallback(() => {
    let filtered = [...transactions];

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (tx) =>
          tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.reference.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date range filter
    if (dateRange.from) {
      filtered = filtered.filter(
        (tx) => new Date(tx.date) >= new Date(dateRange.from)
      );
    }
    if (dateRange.to) {
      filtered = filtered.filter(
        (tx) => new Date(tx.date) <= new Date(dateRange.to + "T23:59:59")
      );
    }

    // Apply transaction type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((tx) => selectedTypes.includes(tx.type));
    }

    // Apply status filter
    if (selectedStatus.length > 0) {
      filtered = filtered.filter((tx) => selectedStatus.includes(tx.status));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "amount") {
        return sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      return 0;
    });

    setFilteredTransactions(filtered);
    setTotalTransactions(filtered.length);
  }, [
    transactions,
    searchQuery,
    dateRange,
    selectedTypes,
    selectedStatus,
    sortBy,
    sortDirection,
  ]);

  // Handle filter changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      // Mock data - in a real app, this would be an API call

      setTimeout(() => {
        setTransactions(mockTransactions);
        setTotalTransactions(mockTransactions.length);
        applyFilters();
        setIsLoading(false);
      }, 1000);
    };

    fetchTransactions();
  }, [applyFilters]);

  // Apply filters, search, and sorting to transactions

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle date range changes
  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, from: e.target.value });
    setCurrentPage(1);
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({ ...dateRange, to: e.target.value });
    setCurrentPage(1);
  };

  // Handle transaction type filter changes
  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
    setCurrentPage(1);
  };

  // Handle status filter changes
  const handleStatusChange = (status: string) => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter((s) => s !== status));
    } else {
      setSelectedStatus([...selectedStatus, status]);
    }
    setCurrentPage(1);
  };

  // Handle sort changes
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  // Handle export to CSV
  const handleExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      setIsExporting(false);
      // TODO: generate the CSV
      alert("Transaction history exported successfully");
    }, 1500);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalTransactions / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
            Failed
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  // Get type badge based on transaction type
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "buy":
        return (
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-medium">
            Buy
          </span>
        );
      case "sell":
        return (
          <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-md text-xs font-medium">
            Sell
          </span>
        );
      case "convert":
        return (
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-xs font-medium">
            Convert
          </span>
        );
      case "deposit":
        return (
          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-xs font-medium">
            Deposit
          </span>
        );
      case "withdraw":
        return (
          <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-md text-xs font-medium">
            Withdraw
          </span>
        );
      default:
        return (
          <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">
            {type}
          </span>
        );
    }
  };

  // Calculate pagination
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-50 max-sm:p-3 max-sm:mt-6">
      <Sidebar />
      <div className="flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-screen-xl mx-auto">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-1">
                  Transaction History
                </h1>
                <p className="text-gray-600">
                  View and manage your complete transaction record
                </p>
              </div>
              <div className="flex gap-3 mt-4 sm:mt-0">
                <button
                  onClick={handleExport}
                  disabled={isExporting || isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm ${
                    isExporting || isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {isExporting ? "Exporting..." : "Export CSV"}
                </button>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                >
                  <ArrowLeft />
                  Back to Dashboard
                </button>
              </div>
            </header>
            {/* Filters Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Search */}
                <div>
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Search Transaction ID or Reference
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                {/* Date Range - From */}
                <div>
                  <label
                    htmlFor="dateFrom"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date From
                  </label>
                  <input
                    type="date"
                    id="dateFrom"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={dateRange.from}
                    onChange={handleDateFromChange}
                  />
                </div>
                {/* Date Range - To */}
                <div>
                  <label
                    htmlFor="dateTo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date To
                  </label>
                  <input
                    type="date"
                    id="dateTo"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={dateRange.to}
                    onChange={handleDateToChange}
                  />
                </div>
                {/* Sort By */}
                <div>
                  <label
                    htmlFor="sortBy"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Sort By
                  </label>
                  <div className="flex space-x-2">
                    <select
                      id="sortBy"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date">Date</option>
                      <option value="amount">Amount</option>
                    </select>
                    <button
                      className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
                      onClick={() =>
                        setSortDirection(
                          sortDirection === "asc" ? "desc" : "asc"
                        )
                      }
                    >
                      {sortDirection === "asc" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {/* Type and Status Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transaction Types */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Transaction Type
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["buy", "sell", "convert", "deposit", "withdraw"].map(
                      (type) => (
                        <button
                          key={type}
                          onClick={() => handleTypeChange(type)}
                          className={`px-3 py-1 rounded-md text-xs font-medium ${
                            selectedTypes.includes(type)
                              ? "bg-blue-100 text-blue-700 border border-blue-300"
                              : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </div>
                {/* Transaction Status */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Status
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["completed", "pending", "processing", "failed"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`px-3 py-1 rounded-md text-xs font-medium ${
                            selectedStatus.includes(status)
                              ? getStatusFilterClass(status)
                              : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Transaction Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-16">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    No transactions found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleSortChange("date")}
                          >
                            <span>Date & Time</span>
                            {sortBy === "date" && (
                              <span>
                                {sortDirection === "asc" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 15l7-7 7 7"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                )}
                              </span>
                            )}
                          </button>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Transaction ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <button
                            className="flex items-center space-x-1"
                            onClick={() => handleSortChange("amount")}
                          >
                            <span>Amount</span>
                            {sortBy === "amount" && (
                              <span>
                                {sortDirection === "asc" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 15l7-7 7 7"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                )}
                              </span>
                            )}
                          </button>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Fee
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Reference
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {transaction.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getTypeBadge(transaction.type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.amount.toFixed(2)}{" "}
                              {transaction.currency}
                            </div>
                            {transaction.targetAmount && (
                              <div className="text-xs text-gray-500 mt-1">
                                → {transaction.targetAmount.toFixed(2)}{" "}
                                {transaction.targetCurrency}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.fee.toFixed(2)} {transaction.currency}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(transaction.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.reference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-800">
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
        {/* Pagination */}
        {!isLoading && filteredTransactions.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalTransactions)} of{" "}
                {totalTransactions} transactions
              </span>
              <div className="ml-4">
                <select
                  title="items-per-page"
                  className="border border-gray-300 rounded-md py-1 pl-2 pr-8 text-sm"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                Previous
              </button>
              {totalPages <= 5 ? (
                // Show all pages if 5 or fewer
                [...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                // Show limited pages with ellipsis for many pages
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === 1
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    1
                  </button>
                  {currentPage > 3 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  {currentPage > 2 && currentPage < totalPages && (
                    <>
                      {currentPage > 2 && (
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="px-3 py-1 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        >
                          {currentPage - 1}
                        </button>
                      )}
                      <button className="px-3 py-1 rounded-md text-sm bg-blue-500 text-white">
                        {currentPage}
                      </button>
                      {currentPage < totalPages - 1 && (
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="px-3 py-1 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        >
                          {currentPage + 1}
                        </button>
                      )}
                    </>
                  )}
                  {currentPage < totalPages - 2 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === totalPages
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionHistoryPage;
