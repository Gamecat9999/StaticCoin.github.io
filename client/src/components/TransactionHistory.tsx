import { useState, useEffect } from 'react';
import { getWalletData } from '@/lib/storage';
import { Transaction, TransactionType, TransactionStatus } from '@/types/blockchain';
import { formatAddress } from '@/lib/crypto';
import { Badge } from '@/components/ui/badge';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const walletData = getWalletData();
    if (walletData && walletData.transactions) {
      // Sort transactions by timestamp (newest first)
      const sortedTransactions = [...walletData.transactions].sort(
        (a, b) => b.timestamp - a.timestamp
      );
      setTransactions(sortedTransactions);
    }
  }, []);

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get transaction type badge
  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case TransactionType.MINING_REWARD:
        return (
          <Badge variant="outline" className="bg-secondary bg-opacity-10 text-secondary">
            Mining Reward
          </Badge>
        );
      case TransactionType.RECEIVE:
        return (
          <Badge variant="outline" className="bg-primary bg-opacity-10 text-primary">
            Received
          </Badge>
        );
      case TransactionType.SEND:
        return (
          <Badge variant="outline" className="bg-accent bg-opacity-10 text-accent">
            Sent
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-200 text-gray-700">
            Transfer
          </Badge>
        );
    }
  };

  // Get status badge
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.CONFIRMED:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Confirmed
          </Badge>
        );
      case TransactionStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case TransactionStatus.FAILED:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  // Format amount with sign
  const formatAmount = (transaction: Transaction): string => {
    const isSend = transaction.type === TransactionType.SEND;
    const sign = isSend ? '-' : '+';
    return `${sign}${transaction.amount.toFixed(2)} BC`;
  };

  return (
    <div>
      <h4 className="font-medium mb-3">Recent Transactions</h4>
      <div className="overflow-x-auto">
        {transactions.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No transactions yet</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-4 py-3">
                    {getTypeBadge(tx.type)}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatAmount(tx)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs truncate max-w-xs">
                    {tx.type === TransactionType.SEND ? tx.toAddress : (tx.fromAddress || 'System')}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(tx.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(tx.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
