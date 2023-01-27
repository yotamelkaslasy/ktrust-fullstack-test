import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";

import { prisma } from "~/db.server";
import { getAllUsers } from "~/models/users.server";
import { requireUserId } from "~/session.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { useIsAdminUser, validateEmail } from "~/utils";
import { Layout } from "~/components/Layout";
import { InputField } from "~/components/InputField";
import { SelectField } from "~/components/SelectField";

type actionData = {
  errors: {
    email: String | null;
    password: String | null;
    role: String | null;
  };
};

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);

  return json({
    users: await getAllUsers(request),
  });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  const _action = formData.get("_action");
  const userId = formData.get("id");

  if (_action === "create") {
    if (!validateEmail(email)) {
      return json(
        { errors: { email: "Email is invalid", password: null, role: null } },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length === 0) {
      return json(
        {
          errors: { email: null, password: "Password is required", role: null },
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return json(
        {
          errors: {
            email: null,
            password: "Password is too short",
            role: null,
          },
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

    return createUser(email, password, role);
  }

  if (_action === "delete") {
    return await prisma.user.delete({
      where: {
        id: userId?.toString(),
      },
    });
  }
}

export const meta: MetaFunction = () => {
  return {
    title: "Users",
  };
};

export default function Users() {
  const usersData = useLoaderData<typeof loader>();
  const actionData = useActionData<actionData>();
  const isAdmin = useIsAdminUser();
  const [role, setRole] = useState("admin");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);

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
    <Layout>
      <div className="flex w-full flex-col">
        <h2 className="mt-4 flex justify-start px-8 font-bold">
          All users ({usersData.users?.length})
        </h2>
        <ul className="p-8">
          {(usersData.users?.length &&
            usersData.users?.map((user, index) => {
              return (
                <li
                  key={user.id}
                  className={`mb-4 border p-4 ${
                    index % 2 == 1 ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <span>#{index + 1}</span>
                  <div>Email: {user.email}</div>
                  <div>Role: {user.role}</div>
                  {isAdmin && (
                    <span>
                      {/* <Form method="post" className="inline">
                        <input type="hidden" name="id" value={user.id} />
                        <button
                          type="submit"
                          name="_action"
                          value="edit"
                          disabled
                          className="mt-2 ml-2 rounded bg-purple-500 py-1 px-2 text-xs text-white hover:bg-purple-600 focus:bg-purple-400"
                        >
                          Edit User
                        </button>
                      </Form> */}
                      <Form method="post" className="inline">
                        <input type="hidden" name="id" value={user.id} />
                        <button
                          type="submit"
                          name="_action"
                          value="delete"
                          className="mt-2 rounded bg-red-500 py-1 px-2 text-xs text-white hover:bg-red-600 focus:bg-red-400"
                        >
                          Delete User
                        </button>
                      </Form>
                    </span>
                  )}
                </li>
              );
            })) ||
            "Sorry, no users exists 👀"}
          {isAdmin && (
            <li className="flex flex-col">
              <div>Admins can create new users.</div>
              <Form
                method="post"
                className="mt-4 flex flex-col items-center border p-2"
                style={{ maxWidth: "500px" }}
              >
                <InputField
                  ref={emailRef}
                  htmlFor="email"
                  type="email"
                  label="Email"
                  required
                  autoFocus
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
                <button
                  type="submit"
                  name="_action"
                  value="create"
                  className="mt-4 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                  Create User
                </button>
              </Form>
            </li>
          )}
        </ul>
      </div>
    </Layout>
  );
}
