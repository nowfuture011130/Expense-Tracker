import { useState } from "react";
import Select from "react-select";
import { useAddTransactions } from "../../hooks/useAddTransactions";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import "./styles.css";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import Transactions from "../../components/Transactions";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import Chat from "../../components/Chat";
export const ExpenseTracker = () => {
  const { addTransactions } = useAddTransactions();
  const { transactionTotals } = useGetTransactions();
  const { name, profilePhoto } = useGetUserInfo();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionClass, setTransactionClass] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [activeTab, setActiveTab] = useState("transactions");

  const { balance, income, expenses } = transactionTotals;
  const optionsForExpense = [
    { value: "Entertainment", label: "Entertainment" },
    { value: "Groceries", label: "Groceries" },
    { value: "Transportation", label: "Transportation" },
    { value: "Housing", label: "Housing" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Clothing", label: "Clothing" },
    { value: "Dining", label: "Dining" },
    { value: "Education", label: "Education" },
    { value: "Travel", label: "Travel" },
    { value: "Other", label: "Other" },
  ];
  const optionsForIncome = [
    { value: "Salary", label: "Salary" },
    { value: "Investment", label: "Investment" },
    { value: "Bonus", label: "Bonus" },
    { value: "Sponsorship", label: "Sponsorship" },
    { value: "Rent", label: "Rent" },
    { value: "Sales", label: "Sales" },
    { value: "Interest", label: "Interest" },
    { value: "Gift", label: "Gift" },
    { value: "Other", label: "Other" },
  ];

  const onSubmit = (e) => {
    e.preventDefault();
    if (!transactionAmount) {
      alert("Amount should be greater than zero");
      return;
    }

    addTransactions({
      description: description,
      transactionAmount: transactionAmount,
      transactionClass: transactionClass.value,
      transactionType: transactionType,
    });

    setDescription("");
    setTransactionClass("");
    setTransactionAmount(0);
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="expense-tracker">
        <div className="container">
          <h1> {name}'s Expense Tracker</h1>
          <div className="balance">
            <h3> Your Balance</h3>
            {balance >= 0 ? <h2>${balance}</h2> : <h2>-${balance * -1}</h2>}
          </div>
          <div className="summary">
            <div className="income">
              <h4> Income</h4>
              <p>${income}</p>
            </div>
            <div className="expenses">
              <h4> Expenses</h4>
              <p>${expenses}</p>
            </div>
          </div>
          <form className="add-transaction" onSubmit={onSubmit}>
            <input
              className="inputField"
              type="text"
              placeholder="Description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="inputField"
              type="number"
              placeholder="Amount"
              value={transactionAmount}
              required
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
            <div
              style={{
                width: "200px",
              }}
            >
              <Select
                options={
                  transactionType === "expense"
                    ? optionsForExpense
                    : optionsForIncome
                }
                value={transactionClass}
                required
                onChange={setTransactionClass}
                menuPlacement="auto"
                menuPosition="fixed"
              />
            </div>
            <input
              type="radio"
              id="expense"
              value="expense"
              checked={transactionType === "expense"}
              onChange={(e) => {
                setTransactionType(e.target.value);
                setTransactionClass("");
              }}
            />
            <label htmlFor="expense">Expense</label>
            <input
              type="radio"
              id="income"
              value="income"
              checked={transactionType === "income"}
              onChange={(e) => {
                setTransactionType(e.target.value);
                setTransactionClass("");
              }}
            />
            <label htmlFor="income"> Income</label>

            <button type="submit" className="submitBtn">
              {" "}
              Add Transaction
            </button>
          </form>
        </div>
        {profilePhoto && (
          <div className="profile">
            {" "}
            <img className="profile-photo" src={profilePhoto} />
            <button className="sign-out-button" onClick={signUserOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
      <div className="buttomContainer">
        <div className="sidebar">
          <button
            onClick={() => setActiveTab("transactions")}
            style={{
              backgroundColor: activeTab === "transactions" ? "#ccc" : "#ddd",
            }}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab("line chart")}
            style={{
              backgroundColor: activeTab === "line chart" ? "#ccc" : "#ddd",
            }}
          >
            Line chart
          </button>
          <button
            onClick={() => setActiveTab("pie chart")}
            style={{
              backgroundColor: activeTab === "pie chart" ? "#ccc" : "#ddd",
            }}
          >
            Pie chart
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            style={{
              backgroundColor: activeTab === "chat" ? "#ccc" : "#ddd",
            }}
          >
            ChatBox
          </button>
        </div>

        <div className="transactions">
          <div className="content">
            {activeTab === "transactions" && <Transactions />}
            {activeTab === "line chart" && <LineChart />}
            {activeTab === "pie chart" && <PieChart />}
            {activeTab === "chat" && <Chat />}
            {/* 在这里添加其他选项的内容 */}
          </div>
        </div>
      </div>
    </>
  );
};
