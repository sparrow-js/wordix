import Image from "next/image";
import { Suspense } from "react";
import LoginGithubButton from "./login-git-button";
import LoginGoogleButton from "./login-google-button";

export default function LoginPage() {
  return (
    <div className="mx-5 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md p-4">
      <Image
        alt="wordix logo"
        width={100}
        height={100}
        className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
        src="/star-pen.png"
      />
      <h1 className="mt-6 text-center font-cal text-3xl dark:text-white">Wordix, let's get started!</h1>
      <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
        Welcome to Wordix, please log in to continue.
      </p>

      <div className="mx-auto mt-4 w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <LoginGoogleButton />
        </Suspense>
      </div>

      <div className="mx-auto mt-4 w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <LoginGithubButton />
        </Suspense>
      </div>

      {/* <div className="mx-auto mt-2 w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <LoginNotionButton />
        </Suspense>
      </div> */}
    </div>
  );
}
