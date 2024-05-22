import { SiteHeader } from "@/components/navbar/site-header"
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
    <>
      <SiteHeader />
      <main className="flex flex-col items-center justify-center gap-6 p-10 h-[calc(100vh_-_66px)]">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">Welcome Message</h1>
        <Button onClick={() => mutate()} variant={"outline"}>
          {isLoading ? <Loader className="w-4 h-4" /> : (data?.message || "Get auth secret message")}
        </Button>
      </main>
    </>
  )
}
