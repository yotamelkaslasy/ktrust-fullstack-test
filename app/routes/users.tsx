import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getAllUsers, deleteUserByEmail } from "~/models/users.server";
import { requireUserId } from "~/session.server";
import { useIsAdminUser } from "~/utils";
import { Layout } from "~/components/Layout";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);

  return json({
    users: await getAllUsers(request),
  });
}

export default function Users() {
  const usersData = useLoaderData<typeof loader>();
  const isAdmin = useIsAdminUser();
  console.log(usersData);
  console.log("isAdmin", isAdmin);

  return (
    <Layout>
      <div className="flex w-full flex-col">
        <h2 className="mt-4 flex justify-start px-8 font-bold">
          All users ({usersData.users?.length})
        </h2>
        <ul className="p-4">
          {usersData.users?.length &&
            usersData.users?.map((user, index) => {
              return (
                <li
                  key={user.id}
                  className={`mb-4 p-4 ${
                    index % 2 == 1 ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <span>#{index + 1}</span>
                  <div>Email: {user.email}</div>
                  <div>Role: {user.role}</div>
                  {isAdmin && (
                    <span
                      className="cursor-pointer py-2"
                      onClick={async () => {
                        await deleteUserByEmail(user.email);
                      }}
                    >
                      x
                    </span>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    </Layout>
  );
}
