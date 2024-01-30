import React from "react";
import { useGetTransactions } from "../hooks/useGetTransactions";

function Transactions() {
  const { transactions } = useGetTransactions();
  const categories = [
    { name: "Entertainment", color: "#FF5733" }, // 红色
    { name: "Groceries", color: "#33FF57" }, // 绿色
    { name: "Transportation", color: "#5733FF" }, // 蓝色
    { name: "Housing", color: "#FF33E6" }, // 粉红色
    { name: "Healthcare", color: "#33E6FF" }, // 青色
    { name: "Clothing", color: "#FFC933" }, // 橙色
    { name: "Dining", color: "#33FFB2" }, // 青绿色
    { name: "Education", color: "#B233FF" }, // 紫色
    { name: "Travel", color: "#FF339C" }, // 深粉红色
    { name: "Personal Care", color: "#339CFF" }, // 浅蓝色
    { name: "Salary", color: "#FF3333" }, // 深红色
    { name: "Investment", color: "#33FF33" }, // 鲜绿色
    { name: "Part-time Job", color: "#3333FF" }, // 深蓝色
    { name: "Bonus", color: "#FF9933" }, // 橘色
    { name: "Sponsorship", color: "#33FF99" }, // 鲜绿蓝色
    { name: "Rent", color: "#9933FF" }, // 深紫色
    { name: "Sales", color: "#FF3399" }, // 浅粉红色
    { name: "Interest", color: "#3399FF" }, // 浅蓝绿色
    { name: "Gift", color: "#FF66CC" }, // 粉紫色
    { name: "Other", color: "#66CCFF" }, // 浅蓝色
  ];

  function darkenColor(color, amount) {
    // 将输入的颜色字符串转换为 RGB 数组
    const rgb = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    const r = parseInt(rgb[1], 16);
    const g = parseInt(rgb[2], 16);
    const b = parseInt(rgb[3], 16);

    // 减少 RGB 分量的值来加深颜色
    const newR = Math.max(0, r - amount);
    const newG = Math.max(0, g - amount);
    const newB = Math.max(0, b - amount);

    // 将新的 RGB 分量值转换为十六进制表示
    const newColor = `#${newR.toString(16)}${newG.toString(16)}${newB.toString(
      16
    )}`;

    return newColor;
  }

  return (
    <div>
      <h3>Transactions</h3>
      <ul>
        {transactions.map((transaction, id) => {
          const {
            description,
            transactionAmount,
            transactionClass,
            transactionType,
            createdAt,
          } = transaction;
          const categoryColor = categories.find(
            (cat) => cat.name === transactionClass
          )?.color;
          const darkerColor = darkenColor(categoryColor, 35);
          return (
            <li key={id}>
              <h4>
                {createdAt
                  ? description +
                    " " +
                    createdAt.toDate().getFullYear().toString() +
                    "/" +
                    (createdAt.toDate().getMonth() + 1).toString() +
                    "/" +
                    createdAt.toDate().getDate().toString()
                  : description}
              </h4>
              <div>
                ${transactionAmount} •{" "}
                <label
                  style={{
                    color: transactionType === "expense" ? "red" : "green",
                  }}
                >
                  {transactionType}
                </label>
                {" • "}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "130px",
                    height: "30px",
                    borderRadius: "5px",
                    marginLeft: "5px",

                    backgroundColor: `${categoryColor}80`,
                  }}
                >
                  <span style={{ color: darkerColor }}>{transactionClass}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Transactions;
