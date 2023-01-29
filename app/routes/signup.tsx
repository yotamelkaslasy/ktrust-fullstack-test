import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import { useRef, useEffect, useState } from "react";

import { getUserId, createUserSession } from "~/session.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";
import { InputField } from "~/components/InputField";
import { SelectField } from "~/components/SelectField";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null, role: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required", role: null } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      {
        errors: { email: null, password: "Password is too short", role: null },
      },
      { status: 400 }
    );
  }

  if (!!role && role.length === 0) {
    return json(
      { errors: { email: null, password: null, role: "Role is required" } },
      { status: 400 }
    );
  }

  if (role !== "admin" && role !== "user") {
    return json(
      {
        errors: {
          email: null,
          password: null,
          role: "Role must be either 'admin' or 'user'",
        },
      },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
          role: null,
        },
      },
      { status: 400 }
    );
  }

  const user = await createUser(email, password, role);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Signup() {
  const [role, setRole] = useState("admin");
  const [searchParams] = useSearchParams();
  const transition = useTransition();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);
  const busy = transition.submission;

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.role) {
      roleRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-4 py-32">
      <h2 className="text-5xl font-extrabold text-blue-400">Welcome</h2>
      <p className="font-semibold text-slate-600">Please signup to continue</p>

      <Form method="post" className="w-1/2 max-w-lg">
        <InputField
          ref={emailRef}
          htmlFor="email"
          type="email"
          label="Email"
          required
          autoFocus
          autoComplete="email"
          aria-invalid={actionData?.errors?.email ? true : undefined}
          aria-describedby="email-error"
        />
        {actionData?.errors?.email && (
          <div className="pt-1 text-red-700" id="email-error">
            {actionData.errors.email}
          </div>
        )}

        <InputField
          ref={passwordRef}
          htmlFor="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          required
          aria-invalid={actionData?.errors?.password ? true : undefined}
          aria-describedby="password-error"
        />
        {actionData?.errors?.password && (
          <div className="pt-1 text-red-700" id="password-error">
            {actionData.errors.password}
          </div>
        )}

        <SelectField
          ref={roleRef}
          htmlFor="role"
          label="Role"
          value={role}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            setRole(event.target.value);
          }}
          aria-invalid={actionData?.errors?.role ? true : undefined}
          aria-describedby="role-error"
        />
        {actionData?.errors?.role && (
          <div className="pt-1 text-red-700" id="role-error">
            {actionData.errors.role}
          </div>
        )}

        <input type="hidden" name="redirectTo" value={redirectTo} />

        <button
          type="submit"
          className="mt-4 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          {busy ? "Signing up..." : "Signup"}
        </button>

        <div className="mt-4 flex items-center justify-center">
          <div className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link className="text-blue-500 underline" to="/login">
              Login
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
