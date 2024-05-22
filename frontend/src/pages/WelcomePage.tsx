import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/loader"
import { useAuth } from "@/context"
import { useSecret } from "@/hooks"
import { Navigate } from "react-router-dom"

export const WelcomePage = () => {
  const { user, logout } = useAuth()
  const { mutate, data, isLoading, isError } = useSecret()
  if (!user || isError) {
    logout()
    return <Navigate to="/login" />
  }
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-10 h-[100vh]">
      <h1>Welcome {user.username}</h1>
      <Button onClick={() => mutate()}>
        {isLoading ? <Loader className="w-4 h-4" /> : (data?.message || "secret")}
      </Button>
    </div>
  )
}
