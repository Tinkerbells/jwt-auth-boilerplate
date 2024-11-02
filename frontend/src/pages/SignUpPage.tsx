import { motion } from "framer-motion"
import { Link } from "react-router-dom"

import { buttonVariants } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Toaster } from "@/components/ui/toaster"
import { AuroraBackground } from "@/components/aurora/aurora-bg"

import { SignUpForm } from "../components/auth"

export const SignUpPage = () => {
  return (
    <>
      <div className="container relative flex h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute right-4 top-4 flex items-center gap-2 md:right-8 md:top-8">
          <Link to="/sign-in" className={buttonVariants({ variant: "ghost" })}>
            Sign in
          </Link>
          <ModeToggle />
        </div>
        <div className="relative hidden h-full flex-col bg-muted text-white dark:border-r lg:flex">
          <AuroraBackground>
            <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="relative flex flex-col items-center justify-center gap-4 px-4"
            >
              <div className="text-center text-3xl font-bold dark:text-white md:text-7xl">
                Welcome to Auth boilerplate
              </div>
              <div className="py-4 text-center text-base font-extralight dark:text-neutral-200 md:text-4xl">
                Install the boilerplate from{" "}
                <a
                  href="https://github.com/Tinkerbells/jwt-auth-boilerplate"
                  className="underline"
                >
                  Github
                </a>
              </div>
            </motion.div>
          </AuroraBackground>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col items-center justify-center sm:w-[450px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your information to create an account
              </p>
            </div>
            <SignUpForm />
            <p className="mt-4 px-8 text-center text-sm text-muted-foreground sm:w-[350px]">
              By clicking continue, you agree to our{" "}
              <Link
                to="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
