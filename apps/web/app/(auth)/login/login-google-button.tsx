import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { FaGoogle } from "react-icons/fa";

export default function LoginGoogleButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button className="w-full">
        <FaGoogle className="mr-2" />
        <p className="text-sm font-medium">Login with Google</p>
      </Button>
    </form>
  );
}
