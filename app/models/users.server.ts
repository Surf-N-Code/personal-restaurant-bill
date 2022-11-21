import {json} from "@remix-run/node";

type User = {
  id: number;
  name: string;
  balance: number;
}

export const getUsers = async (): Promise<User[]> => {
  return [
      {
        id: 1,
        name: "Anna",
        balance: 0
      },
      {
        id: 2,
        name: "Norman",
        balance: 0
      },
      {
        id: 3,
        name: "Tobi",
        balance: 0
      },
      {
        id: 4,
        name: "Alex",
        balance: 0
      },
      {
        id: 5,
        name: "Mona",
        balance: 0
      },
      {
        id: 6,
        name: "Evi",
        balance: 0
      },
      {
        id: 7,
        name: "Mari",
        balance: 0
      },
      {
        id: 8,
        name: "Birdy",
        balance: 0
      },
    ]
}
