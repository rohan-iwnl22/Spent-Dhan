import React, { useState } from "react";

const SplitwiseCalculator = () => {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState("equal"); // 'equal', 'percentage', 'exact'
  const [friends, setFriends] = useState([]);
  const [newFriendName, setNewFriendName] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({}); // Track balances between friends

  // Add a new friend
  const addFriend = () => {
    if (!newFriendName.trim()) return;
    
    const newFriend = {
      id: Date.now(),
      name: newFriendName.trim(),
      amount: 0,
      percentage: 0
    };
    
    setFriends([...friends, newFriend]);
    setNewFriendName("");
  };

  // Remove a friend
  const removeFriend = (id) => {
    setFriends(friends.filter(friend => friend.id !== id));
  };

  // Update friend name
  const updateFriendName = (id, name) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, name } : friend
    ));
  };

  // Update friend amount for exact split
  const updateFriendAmount = (id, amount) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, amount: parseFloat(amount) || 0 } : friend
    ));
  };

  // Update friend percentage for percentage split
  const updateFriendPercentage = (id, percentage) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, percentage: parseFloat(percentage) || 0 } : friend
    ));
  };

  // Calculate equal split
  const calculateEqualSplit = () => {
    if (!expenseAmount || friends.length === 0) return;
    
    const amountPerPerson = parseFloat(expenseAmount) / friends.length;
    setFriends(friends.map(friend => ({
      ...friend,
      amount: parseFloat(amountPerPerson.toFixed(2))
    })));
  };

  // Calculate percentage split
  const calculatePercentageSplit = () => {
    if (!expenseAmount || friends.length === 0) return;
    
    const totalPercentage = friends.reduce((sum, friend) => sum + (parseFloat(friend.percentage) || 0), 0);
    
    if (Math.abs(totalPercentage - 100) > 0.01) {
      alert(`Total percentage must be 100%. Current total: ${totalPercentage}%`);
      return;
    }

    setFriends(friends.map(friend => ({
      ...friend,
      amount: parseFloat(((parseFloat(expenseAmount) * (parseFloat(friend.percentage) || 0)) / 100).toFixed(2))
    })));
  };

  // Update balances after adding an expense
  const updateBalances = (expense) => {
    const newBalances = { ...balances };
    
    // Initialize balances if they don't exist
    if (!newBalances[expense.paidBy]) {
      newBalances[expense.paidBy] = {};
    }
    
    expense.splits.forEach(split => {
      if (split.name !== expense.paidBy) {
        // Initialize payer's balance with this friend if it doesn't exist
        if (!newBalances[expense.paidBy][split.name]) {
          newBalances[expense.paidBy][split.name] = 0;
        }
        
        // The friend owes the payer this amount
        newBalances[expense.paidBy][split.name] += split.amount;
        
        // Initialize friend's balance with payer if it doesn't exist
        if (!newBalances[split.name]) {
          newBalances[split.name] = {};
        }
        if (!newBalances[split.name][expense.paidBy]) {
          newBalances[split.name][expense.paidBy] = 0;
        }
        
        // The friend owes the payer, so it's a negative amount from friend's perspective
        newBalances[split.name][expense.paidBy] -= split.amount;
      }
    });
    
    setBalances(newBalances);
  };

  // Calculate splits based on selected type
  const calculateSplits = () => {
    if (!expenseAmount || !expenseName || !paidBy || friends.length === 0) {
      alert("Please fill all required fields and add at least one friend");
      return;
    }

    switch (splitType) {
      case "equal":
        calculateEqualSplit();
        break;
      case "percentage":
        calculatePercentageSplit();
        break;
      case "exact":
        // For exact split, we assume user has already entered amounts
        const totalEntered = friends.reduce((sum, friend) => sum + (parseFloat(friend.amount) || 0), 0);
        if (Math.abs(totalEntered - parseFloat(expenseAmount)) > 0.01) {
          alert(`Total amounts must equal expense amount. Current total: ${totalEntered}`);
          return;
        }
        break;
      default:
        break;
    }

    // Add to expenses history
    const newExpense = {
      id: Date.now(),
      name: expenseName,
      amount: parseFloat(expenseAmount),
      paidBy,
      splits: friends.map(friend => ({
        name: friend.name,
        amount: friend.amount
      })),
      date: new Date().toLocaleDateString()
    };

    setExpenses([newExpense, ...expenses]);
    updateBalances(newExpense);
    
    // Reset form
    setExpenseName("");
    setExpenseAmount("");
    setPaidBy("");
  };

  // Calculate net balances for each person
  const calculateNetBalances = () => {
    const netBalances = {};
    
    // Initialize with all friends
    friends.forEach(friend => {
      netBalances[friend.name] = 0;
    });
    
    // Calculate net balances
    Object.keys(balances).forEach(person => {
      Object.keys(balances[person]).forEach(otherPerson => {
        netBalances[person] += balances[person][otherPerson];
      });
    });
    
    return netBalances;
  };

  // Simplify balances to show who owes whom
  const simplifyBalances = () => {
    const netBalances = calculateNetBalances();
    const creditors = [];
    const debtors = [];
    
    // Separate into creditors and debtors
    Object.keys(netBalances).forEach(person => {
      if (netBalances[person] > 0) {
        creditors.push({ name: person, amount: netBalances[person] });
      } else if (netBalances[person] < 0) {
        debtors.push({ name: person, amount: -netBalances[person] });
      }
    });
    
    // Sort by amount
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);
    
    // Calculate transactions
    const transactions = [];
    let i = 0;
    let j = 0;
    
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      
      const amount = Math.min(creditor.amount, debtor.amount);
      
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: parseFloat(amount.toFixed(2))
      });
      
      creditor.amount -= amount;
      debtor.amount -= amount;
      
      if (creditor.amount < 0.01) i++;
      if (debtor.amount < 0.01) j++;
    }
    
    return transactions;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Get simplified balances
  const simplifiedBalances = simplifyBalances();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Expense Split Calculator</h2>
      
      {/* Expense Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Expense Name *
          </label>
          <input
            type="text"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            placeholder="Dinner, Rent, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Amount (₹) *
          </label>
          <input
            type="number"
            step="0.01"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paid By *
          </label>
          <input
            type="text"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            placeholder="Who paid for this?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Split Type *
          </label>
          <select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="equal">Equal Split</option>
            <option value="percentage">Percentage Split</option>
            <option value="exact">Exact Amounts</option>
          </select>
        </div>
      </div>

      {/* Add Friends Section */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            placeholder="Enter friend's name"
            onKeyPress={(e) => e.key === 'Enter' && addFriend()}
          />
          <button
            onClick={addFriend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add Friend
          </button>
        </div>
      </div>

      {/* Friends List */}
      {friends.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Friends</h3>
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <input
                  type="text"
                  value={friend.name}
                  onChange={(e) => updateFriendName(friend.id, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
                />
                
                {splitType === "percentage" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={friend.percentage}
                      onChange={(e) => updateFriendPercentage(friend.id, e.target.value)}
                      className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
                      placeholder="%"
                    />
                    <span className="text-gray-600 dark:text-gray-300">%</span>
                  </div>
                )}
                
                {splitType === "exact" && (
                  <input
                    type="number"
                    step="0.01"
                    value={friend.amount}
                    onChange={(e) => updateFriendAmount(friend.id, e.target.value)}
                    className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-white"
                    placeholder="Amount"
                  />
                )}
                
                <button
                  onClick={() => removeFriend(friend.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          {(splitType === "equal" || splitType === "percentage") && (
            <button
              onClick={splitType === "equal" ? calculateEqualSplit : calculatePercentageSplit}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Calculate {splitType === "equal" ? "Equal" : "Percentage"} Split
            </button>
          )}
        </div>
      )}

      {/* Calculate Button */}
      <button
        onClick={calculateSplits}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium mb-6"
      >
        Add Expense
      </button>

      {/* Results */}
      {friends.some(friend => friend.amount > 0) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Split Results</h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            {friends.map((friend) => (
              <div key={friend.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                <span className="text-gray-900 dark:text-white">{friend.name}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(friend.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simplified Balances */}
      {simplifiedBalances.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Simplified Balances</h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            {simplifiedBalances.map((transaction, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                <span className="text-gray-900 dark:text-white">
                  {transaction.from} owes {transaction.to}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense History */}
      {expenses.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Expense History</h3>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{expense.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Paid by {expense.paidBy} • {expense.date}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {expense.splits.map((split, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{split.name}</span>
                      <span>{formatCurrency(split.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitwiseCalculator;