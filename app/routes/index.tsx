import { Form, Link } from "@remix-run/react";
import { useMatchesData } from "~/utils";
import { Layout } from "~/components/Layout";

export default function Index() {
  const data = useMatchesData("root") as any;
  console.log(data);

  return (
    <Layout>
      <div className="">
        {data && data.user ? (
          <div className="user-info">
            <span>{`Hi ${data.user.email}`}</span>
            <Form action="/logout" method="post">
              <button type="submit" className="text-blue-500 underline">
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <div className="flex">
            <Link to="/login" className="mr-4 text-blue-500 underline">
              Login
            </Link>
            <Link to="/signup" className="text-blue-500 underline">
              Signup
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
