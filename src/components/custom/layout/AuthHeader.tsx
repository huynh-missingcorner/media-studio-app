import { Link } from "react-router-dom";

export function AuthHeader() {
  return (
    <header className="py-2 px-4 z-30">
      <div className="mx-auto flex items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold">Media Studio</h1>
        </Link>
      </div>
    </header>
  );
}
