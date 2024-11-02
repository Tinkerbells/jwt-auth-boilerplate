import { Route, Routes } from "react-router-dom"

import ROUTES from "./consts/routes"
import {
  ForgotPasswordPage,
  Protected,
  ResetPasswordPage,
  SignInPage,
  SignUpPage,
  VerifyOtpPage,
  WelcomePage,
} from "./pages"

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
      <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
      <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
      <Route path={ROUTES.VERIFY + "/:type"} element={<VerifyOtpPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
    </Routes>
  )
}

export default App
