import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
import { RiNotionFill } from "react-icons/ri";

export default function LoginNotionButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("notion");
      }}
    >
      <Button className="w-full">
        <RiNotionFill className="mr-2" />
        <p className="text-sm font-medium">Login with Notion</p>
      </Button>
    </form>
  );
}
