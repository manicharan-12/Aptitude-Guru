import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Typography, Card } from "antd";
import { SendOutlined, LogoutOutlined } from "@ant-design/icons";
import styled from "styled-components";
import axios from "axios";
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Text } = Typography;

const predefinedOptions = [
  {
    question: "What is aptitude?",
    answer: "Aptitude is a natural ability to do something well.",
  },
  {
    question: "How can I improve my teaching skills?",
    answer: "Practice regularly and seek feedback from peers and students.",
  },
  {
    question: "What resources can help with teaching?",
    answer:
      "There are many online courses, books, and workshops available to help improve teaching skills.",
  },
];

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  padding: 16px;
  background-color: #f0f2f5;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
`;

const ChatBox = styled(Card)`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const OptionButton = styled(Button)`
  flex: 1 1 auto;
  margin: 4px 0;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const BotMessage = styled.div`
  padding: 12px 20px;
  background: #e6f7ff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  margin-bottom: 8px;
  align-self: flex-start;
  max-width: 80%;
  text-align: left;
`;

const UserMessage = styled.div`
  padding: 12px 20px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  margin-bottom: 8px;
  align-self: flex-end;
  max-width: 80%;
  text-align: right;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const userId = Cookies.get('user_id');

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/conversation/${userId}`);
        if (response.data && response.data.messages) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionClick = (option) => {
    const newMessages = [
      ...messages,
      { text: option.question, isBot: false },
      { text: option.answer, isBot: true },
    ];
    setMessages(newMessages);
    saveConversation(newMessages);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = async () => {
    if (inputValue.trim() === "") return;
    const userMessage = { text: inputValue, isBot: false };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages)
    setInputValue("")

    try {
      const ticketResponse = await axios.post("http://localhost:8000/ticket", {
        userId,
        message: inputValue,
      });
      console.log(ticketResponse);
      const botResponse = { text: `Your ticket has been raised. we will get back to you soon.`, isBot: true };
      const updatedMessages = [...newMessages, botResponse];
      setMessages(updatedMessages);
      saveConversation(updatedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const saveConversation = async (newMessages) => {
    try {
      await axios.post("http://localhost:8000/conversation", {
        userId,
        messages: newMessages,
      });
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  const handleLogout = async () => {
    await saveConversation(messages);
    Cookies.remove("jwt_token");
    Cookies.remove("user_id");
    navigate("/login");
  };

  const handleBeforeUnload = async () => {
    await saveConversation(messages);
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [messages]);

  const token = Cookies.get("jwt_token");
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <ChatContainer>
      <Header>
        <Typography.Title level={2}>Chatbot</Typography.Title>
        <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </Header>
      <ChatBox>
        <MessageContainer>
          {messages.map((item, index) =>
            item.isBot ? (
              <BotMessage key={index}>
                <Text>{item.text}</Text>
              </BotMessage>
            ) : (
              <UserMessage key={index}>
                <Text>{item.text}</Text>
              </UserMessage>
            )
          )}
          <div ref={chatEndRef} />
        </MessageContainer>
      </ChatBox>
      <OptionsContainer>
        {predefinedOptions.map((option, index) => (
          <OptionButton key={index} onClick={() => handleOptionClick(option)}>
            {option.question}
          </OptionButton>
        ))}
      </OptionsContainer>
      <InputContainer>
        <TextArea
          value={inputValue}
          onChange={handleInputChange}
          maxLength={250}
          placeholder="Enter your message here..."
          autoSize={{ minRows: 1, maxRows: 3 }}
        />
        <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
          Send
        </Button>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chatbot;
