import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { FaGithub } from "react-icons/fa";

export default function LoginGithubButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", {
          callbackUrl: "http://app.localhost:3000/",
        });
      }}
    >
      <Button className="w-full">
        <FaGithub className="mr-2 size-5" />
        <p className="text-sm font-medium">Login with Github</p>
      </Button>
    </form>
  );
}
