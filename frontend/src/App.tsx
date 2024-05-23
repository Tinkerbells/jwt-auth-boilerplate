import { Routes, Route } from "react-router-dom";
import { Protected, SignInPage, SignUpPage, VerifyOtpPage, WelcomePage } from "./pages";

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
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verify-email" element={<VerifyOtpPage />} />
    </Routes>
  );
}

export default App;
