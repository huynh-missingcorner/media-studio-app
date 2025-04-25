import { Link } from "react-router-dom";
import { Logo } from "@/components/custom/icons/logo";

export function AuthHeader() {
  return (
    <header className="py-2 px-4 z-30">
      <div className="mx-auto flex items-center">
        <Link to="/" className="flex items-center gap-2 ml-20">
          <Logo className="h-20 w-auto" />
        </Link>
      </div>
    </header>
  );
}
