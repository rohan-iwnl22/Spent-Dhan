import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import SplitwiseCalculator from "./Splitwise";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Hardcoded data
  const [expenses, setExpenses] = useState([
    { id: 1, amount: 1500, description: "Groceries", date: "2024-01-15", mode: "CASH" },
    { id: 2, amount: 2500, description: "Restaurant", date: "2024-01-14", mode: "GPAY" },
    { id: 3, amount: 800, description: "Transportation", date: "2024-01-13", mode: "CASH" },
    { id: 4, amount: 3200, description: "Shopping", date: "2024-01-12", mode: "GPAY" },
    { id: 5, amount: 1200, description: "Entertainment", date: "2024-01-11", mode: "CASH" },
    { id: 6, amount: 1800, description: "Utilities", date: "2024-01-10", mode: "GPAY" }
  ]);

  const [budget, setBudget] = useState({
    amount: 15000,
    month: 1,
    year: 2024
  });

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSpent: 0,
    remainingBudget: 0,
    dailyAverage: 0
  });

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    mode: "CASH"
  });

  // Budget form state
  const [budgetForm, setBudgetForm] = useState({
    amount: budget?.amount.toString() || "",
    month: budget?.month || new Date().getMonth() + 1,
    year: budget?.year || new Date().getFullYear()
  });

  // Calculate statistics when expenses or budget change
  useEffect(() => {
    calculateStats();
  }, [expenses, budget,]);

  const calculateStats = () => {
    const totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const remainingBudget = budget ? budget.amount - totalSpent : 0;
    
    // Calculate daily average for current month
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() + 1 === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
    
    const monthSpent = currentMonthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const dailyAverage = monthSpent / new Date().getDate();

    setStats({
      totalSpent,
      remainingBudget,
      dailyAverage: dailyAverage || 0
    });
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const newExpense = {
        id: expenses.length + 1,
        amount: parseFloat(expenseForm.amount),
        description: expenseForm.description,
        date: expenseForm.date,
        mode: expenseForm.mode
      };

      setExpenses([...expenses, newExpense]);
      setExpenseForm({
        amount: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        mode: "CASH"
      });
      setShowExpenseForm(false);
      setLoading(false);
    }, 500);
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setBudget({
        amount: parseFloat(budgetForm.amount),
        month: parseInt(budgetForm.month),
        year: parseInt(budgetForm.year)
      });
      setShowBudgetForm(false);
      setLoading(false);
    }, 500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Chart data configurations
  const dailySpendingData = {
    labels: expenses.map(expense => formatDate(expense.date)),
    datasets: [
      {
        label: 'Daily Spending',
        data: expenses.map(expense => expense.amount),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const spendingByCategoryData = {
    labels: ['Groceries', 'Dining', 'Transport', 'Shopping', 'Entertainment', 'Utilities'],
    datasets: [
      {
        label: 'Amount Spent',
        data: [1500, 2500, 800, 3200, 1200, 1800],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const paymentMethodData = {
    labels: ['Cash', 'GPay'],
    datasets: [
      {
        data: [
          expenses.filter(e => e.mode === 'CASH').reduce((sum, e) => sum + e.amount, 0),
          expenses.filter(e => e.mode === 'GPAY').reduce((sum, e) => sum + e.amount, 0)
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expense Analysis',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Expense Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your spending and manage your budget
          </p>
        </div>
      </div>

      <div className="mt-10">
        <SplitwiseCalculator/> 
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Spent</h3>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
              {formatCurrency(stats.totalSpent)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Remaining Budget</h3>
            <p className={`text-3xl font-bold mt-2 ${
              stats.remainingBudget >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(stats.remainingBudget)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Daily Average</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {formatCurrency(stats.dailyAverage)}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily Spending Trend</h3>
            <Line data={dailySpendingData} options={chartOptions} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Spending by Category</h3>
            <Bar data={spendingByCategoryData} options={chartOptions} />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Methods</h3>
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut data={paymentMethodData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowExpenseForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add Expense
          </button>
          <button
            onClick={() => setShowBudgetForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {budget ? 'Update Budget' : 'Set Budget'}
          </button>
        </div>

        {/* Budget Display */}
        {budget && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Current Budget
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(budget.amount)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  For {new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Spent: {formatCurrency(stats.totalSpent)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Remaining: {formatCurrency(stats.remainingBudget)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Expenses
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {expenses.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No expenses recorded yet</p>
              </div>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {expense.description}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(expense.date)} • {expense.mode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        -{formatCurrency(expense.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add New Expense
            </h3>
            <form onSubmit={handleExpenseSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="What did you spend on?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Mode
                  </label>
                  <select
                    required
                    value={expenseForm.mode}
                    onChange={(e) => setExpenseForm({...expenseForm, mode: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="CASH">Cash</option>
                    <option value="GPAY">GPay</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowExpenseForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {budget ? 'Update Budget' : 'Set Budget'}
            </h3>
            <form onSubmit={handleBudgetSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Budget Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={budgetForm.amount}
                    onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Month
                  </label>
                  <select
                    required
                    value={budgetForm.month}
                    onChange={(e) => setBudgetForm({...budgetForm, month: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {new Date(2023, month - 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Year
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    required
                    value={budgetForm.year}
                    onChange={(e) => setBudgetForm({...budgetForm, year: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowBudgetForm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;