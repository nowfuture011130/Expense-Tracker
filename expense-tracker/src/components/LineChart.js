import React, { useEffect } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useGetTransactions } from "../hooks/useGetTransactions";

function LineChart() {
  let { transactions } = useGetTransactions();
  console.log(transactions);
  let nearestTime = transactions[0] ? transactions[0].createdAt : null;
  let reverseTransactions = [...transactions];
  reverseTransactions = reverseTransactions.reverse();
  transactions = reverseTransactions;
  const getTheTime = (data) => {
    if (data.createdAt)
      return (
        data.createdAt.toDate().getFullYear().toString() +
        "/" +
        (data.createdAt.toDate().getMonth() + 1).toString() +
        "/" +
        data.createdAt.toDate().getDate().toString()
      );
    return "";
  };

  function isTimeDifferenceGreaterThanAMonth(date1, date2) {
    const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    const timeDifference = Math.abs(date2.getTime() - date1.getTime());

    return timeDifference > oneMonthInMilliseconds;
  }

  let incomeSum = [];
  let expenseSum = [];
  let monthLabels = [];
  transactions.map((transaction, id) => {
    const {
      description,
      transactionAmount,
      transactionClass,
      transactionType,
      createdAt,
    } = transaction;
    if (
      nearestTime &&
      createdAt &&
      !isTimeDifferenceGreaterThanAMonth(
        createdAt.toDate(),
        nearestTime.toDate()
      )
    ) {
      monthLabels.push(transaction);
      if (transactionType === "expense") {
        expenseSum.push({
          createdAt: transaction.createdAt,
          transactionAmount: {
            x: getTheTime(transaction),
            y: Number(transaction.transactionAmount),
            transactionClass: transactionClass,
          },
        });
      }
      if (transactionType === "income") {
        incomeSum.push({
          createdAt: transaction.createdAt,
          transactionAmount: {
            x: getTheTime(transaction),
            y: Number(transaction.transactionAmount),
            transactionClass: transactionClass,
          },
        });
      }
    }
  });

  const userData = {
    labels: monthLabels.map((data) => getTheTime(data)),
    datasets: [
      {
        label: "Month Income",
        data: incomeSum.map((data) => data.transactionAmount),
        borderColor: "green",
        borderWidth: 2,
      },
      {
        label: "Month Expense",
        data: expenseSum.map((data) => data.transactionAmount),
        borderColor: "red",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Line
      data={userData}
      options={{
        elements: {
          line: {
            tension: 0,
            fill: false,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                if (context.parsed.y !== null) {
                  return `${label}: $${context.parsed.y} - ${
                    context.dataset.data[context.dataIndex].transactionClass
                  }`;
                }
                return label;
              },
            },
          },
        },
      }}
    />
  );
}

export default LineChart;
