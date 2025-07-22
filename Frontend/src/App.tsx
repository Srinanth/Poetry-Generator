import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuth, AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/chat-context";
import { LoadingSpinner } from "./components/loading";

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <MainRoutes />
      </ChatProvider>
    </AuthProvider>
  );
};

const MainRoutes = () => {
  const auth = useAuth();
  if (!auth) return null;

  const { isLoggedIn, loading } = auth;

  if (loading) {
    return <LoadingSpinner/>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route
          path="/chat"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;