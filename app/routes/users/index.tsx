import {useLoaderData} from "@remix-run/react";
import {getUsers} from "~/models/users.server";
import {json} from "@remix-run/node";

type LoaderData = {
  users: Awaited<ReturnType<typeof getUsers>>;
}

export const loader = async () => {
  return json<LoaderData>({
    users: await getUsers(),
  })
}

export default function Users() {
  const {users} = useLoaderData() as LoaderData;
  return (
    <main>
      <h1 className={"text-4xl"}>Users</h1>
      <section className={"grid grid-cols-5 px-4"}>
        {users.map((user: User) => (
          <div className={"even:bg-gray-100 odd:bg-white py-6 px-2 cursor-pointer flex justify-between"} key={user.id}>
            <div>{user.name}</div>
            <div>{user.balance}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
