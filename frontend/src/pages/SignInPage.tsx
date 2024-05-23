import { Link } from "react-router-dom";
import { SignInForm } from "../components/auth";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { AuroraBackground } from "@/components/aurora/aurora-bg";
import { motion } from "framer-motion";

export const SignInPage = () => {
  return (
    <>
      <div className="flex container relative h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center gap-2">
          <Link
            to="/signup"
            className={buttonVariants({ variant: "ghost" })}
          >
            Sign up
          </Link>
          <ModeToggle />
        </div>
        <div className="relative hidden h-full flex-col bg-muted text-white lg:flex dark:border-r">
          <AuroraBackground>
            <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="relative flex flex-col gap-4 items-center justify-center px-4"
            >
              <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                Welcome to Auth boilerplate
              </div>
              <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4 text-center">
                Install the boilerplate from  <a href="https://github.com/Tinkerbells/jwt-auth-boilerplate" className="underline">Github</a>
              </div>
            </motion.div>
          </AuroraBackground>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center items-center sm:w-[450px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter email and password to create your account
              </p>
            </div>
            <SignInForm />
            <p className="px-8 text-center text-sm text-muted-foreground mt-4 sm:w-[350px]">
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
    </>
  )
}
