// "use client";

import LoadingDots from "@/components/icons/loading-dots";
import { signIn } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
export default function LoginGoogleButton() {
  // const [loading, setLoading] = useState(false);

  // // Get error message added by next/auth in URL.
  // const searchParams = useSearchParams();
  // const error = searchParams?.get("error");

  // useEffect(() => {
  //   const errorMessage = Array.isArray(error) ? error.pop() : error;
  //   errorMessage && toast.error(errorMessage);
  // }, [error]);

  return (
    <form
      action={async () => {
        "use server"
        await signIn('notion')
      }}
    >
      <Button>Sign In</Button>
    </form>
    // <button
    //   disabled={loading}
    //   onClick={() => {
    //     setLoading(true);
    //     signIn("notion");
    //   }}
    //   className={`${
    //     loading
    //       ? "cursor-not-allowed bg-stone-50 dark:bg-stone-800"
    //       : "bg-white hover:bg-stone-50 active:bg-stone-100 dark:bg-black dark:hover:border-white dark:hover:bg-black"
    //   } group my-2 flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-stone-200 transition-colors duration-75 focus:outline-none dark:border-stone-700`}
    // >
    //   {loading ? (
    //     <LoadingDots color="#A8A29E" />
    //   ) : (
    //     <>
    //       <FaGoogle  />
    //       <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
    //         Login with Google
    //       </p>
    //     </>
    //   )}
    // </button>
  );
}
