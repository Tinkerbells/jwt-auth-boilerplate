import { Routes, Route } from "react-router-dom";
import { Protected, SignInPage, SignUpPage, WelcomePage } from "./pages";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Protected>
            <WelcomePage />
          </Protected>
        }
      />
      <Route path="/login" element={<SignInPage />} />
      <Route path="/register" element={<SignUpPage />} />
    </Routes>
  );
}

export default App;
