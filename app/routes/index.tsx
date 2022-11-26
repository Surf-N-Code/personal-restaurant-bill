import { Link, useLoaderData } from "@remix-run/react";
import { getUsers } from "~/models/users.server";
import { json } from "@remix-run/node";
import type { User } from "app/models/users.server";

type LoaderData = {
  users: Awaited<ReturnType<typeof getUsers>>;
}

export const loader = async () => {
  return json<LoaderData>({
    users: await getUsers(),
  })
}


export default function Index() {
  const { users } = useLoaderData() as unknown as LoaderData;
  return (
    <main>
      <section className={"grid grid-cols-5 px-4"}>
        {users.map((user: User) => (
          <Link className={"border-2 even:bg-gray-100 odd:bg-white py-6 px-2 cursor-pointer flex"} key={user.id} to={`order/placeOrder/${user.id}`}>
            <div>{user.name}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
