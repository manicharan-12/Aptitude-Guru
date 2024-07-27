import { Route, Routes } from "react-router-dom";
import RegisterForm from "./components/Register";
import LoginForm from "./components/Login";
import Chatbot from "./components/ChatBot"

function App() {
  return (
    <>
    <Routes>
    <Route path="/register" element={ <RegisterForm/>}/>
    <Route path="/login" element={<LoginForm/>}/>
    <Route path="/" element={ <Chatbot/> }/>
    </Routes>
    </>
  );
}

export default App;