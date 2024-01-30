import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useGetTransactions } from "../hooks/useGetTransactions";

const API_KEY = "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";

function Chat() {
  function isTimeDifferenceGreaterThanAMonth(date1, date2) {
    const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
    const timeDifference = Math.abs(date2.getTime() - date1.getTime());

    return timeDifference > oneMonthInMilliseconds;
  }
  let { transactions } = useGetTransactions();
  let nearestTime = transactions[0] ? transactions[0].createdAt : null;

  let newTransactions = transactions
    .map((transaction) => {
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
        return {
          createdAt: createdAt.toDate(),
          description: description,
          transactionAmount: transactionAmount,
          transactionClass: transactionClass,
          transactionType: transactionType,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
  let transactionString = JSON.stringify(newTransactions);
  let systemContent =
    "You will be provided with a dataset containing a user's this-month-expenses. Each data entry includes a timestamp (createdAt), description (description), transaction amount in dollars (transactionAmount), transaction class (transactionClass), and transaction type (transactionType). Your task is to analyze this data and respond to user queries regarding their expenses. This may include summarizing total expenses, categorizing expenses by type (e.g., Housing, Food), identifying trends or unusual transactions, and comparing expenses across different periods. Please maintain confidentiality and handle the data securely. The analysis should be clear, concise, and actionable, providing insights that can help the user understand and manage their financial habits more effectively. Below is the dataset:" +
    transactionString;
  console.log(systemContent);
  let systemMessage = {
    role: "system",
    content: systemContent,
  };

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: `Welcome to our Expense Analysis Service! Here, you can use ChatGPT to gain a deeper understanding of your spending over this month. We have collected your consumption data, including the time of expenditure, description, amount, and category. You can ask ChatGPT questions at any time, such as:

- How much did I spend on dining this month?
- Which was my largest expense?
- What is the proportion of my spending on transportation and entertainment?

Feel free to ask any questions. Our AI assistant will provide personalized analysis and insights based on your data. Please note that all your data will be kept strictly confidential. When asking questions, please avoid sharing overly sensitive personal information.

We look forward to helping you better manage and understand your financial situation!`,
      sender: "ChatGPT",
    },
  ]);
  const handelSend = async (message) => {
    if (typing) {
      alert("ChatGPT is typing, please wait");
      return;
    }
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await processMessagetoChatGPT(newMessages);
  };

  async function processMessagetoChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObj) => {
      let role = "";
      if (messageObj.sender === "user") {
        role = "user";
      } else {
        role = "assistant";
      }
      return { role: role, content: messageObj.message };
    });
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setTyping(false);
      });
  }

  return (
    <div style={{ height: "410px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={
              typing ? <TypingIndicator content="ChatGPT is typing" /> : null
            }
          >
            {messages.map((message, i) => {
              return <Message key={i} model={message} />;
            })}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handelSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default Chat;
