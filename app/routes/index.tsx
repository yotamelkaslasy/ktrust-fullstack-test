import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Layout } from "~/components/Layout";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request);

  return json({});
}

export default function Index() {
  return <Layout>Sorry, nothing to see here 👀</Layout>;
}
