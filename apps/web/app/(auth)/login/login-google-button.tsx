import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { FcGoogle } from "react-icons/fc";

export default function LoginGoogleButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button className="w-full">
        <FcGoogle className="mr-2 size-5" />
        <p className="text-sm font-medium">Login with Google</p>
      </Button>
    </form>
  );
}
