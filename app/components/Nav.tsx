import { Form, NavLink } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Nav(): JSX.Element {
  const user = useOptionalUser();
  const activeClassName: string = "underline font-bold";
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex h-[75px] w-screen bg-slate-200 px-8 py-2">
      <div className="flex w-full items-center justify-between">
        <span>
          <span className="pr-2">Hi {isAdmin ? "Admin" : "User"},</span>
          <span className="underline">{`${user?.email}`}</span>
        </span>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            isActive ? `text-slate-600 ${activeClassName}` : "text-slate-600"
          }
        >
          Users
        </NavLink>
        <Form action="/logout" method="post">
          <button type="submit" className="text-blue-500 underline">
            Logout
          </button>
        </Form>
      </div>
    </div>
  );
}
