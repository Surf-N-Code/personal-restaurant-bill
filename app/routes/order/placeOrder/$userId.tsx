import { Form, useLoaderData } from "@remix-run/react";
import { getUser } from "~/models/users.server";
import type { OrderPosition, Position } from "~/models/position.server";
import { createPosition, getPositions } from "~/models/position.server";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { User } from "~/models/users.server";
import type { Product } from "~/models/product.server";
import { getProducts } from "~/models/product.server";
import type { ChangeEvent} from "react";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { v4 as uuidv4 } from 'uuid';

type LoaderData = {
  user: User;
  userBalance: number;
  products: Product[];
}

const getTotalForUser = (positions: Position[], user: User) => {
  if (!positions) return 0;
  let total = 0;
  positions.forEach((position) => {
    total += Object.keys(position.products)
      .reduce((previous, idx) => previous + position.products[idx].price, 0);
  });
  return total;
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.userId, "params.userId is required");
  const positions = await getPositions(params.userId);
  const user = await getUser(params.userId);
  invariant(user, `User with id: ${params.userId} was not found`);

  const products = await getProducts();
  invariant(products, `No products found`);

  const userBalance = getTotalForUser(positions, user);
  return json<LoaderData>({user, userBalance, products})
}

export const action = async ({ request }) => {
  const formData = await request.formData();

  const data = formData.get("position-details");
  console.log('data',data);
  await createPosition(JSON.parse(data));

  return redirect("/");
};


const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function PlaceOrder() {
  const [customProductTitle, setCustomProductTitle] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState(0);
  const [positions, setPositions] = useState<OrderPosition[] | null>();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [ formData, setFormData ] = useState<string>(null);
  const { user, userBalance, products } = useLoaderData() as LoaderData;

  useEffect(() => {
    if (selectedProduct === null || !positions) return;
    console.log('positions',positions);
    let newFormData = positions?.map((position) => {
      return {
        userId: user.id,
        product: {
          name: position.product.name,
          price: position.product.price,
          isCustom: position.product.isCustom,
        },
        quantity,
        totalPrice: quantity * selectedProduct.price
      }
    });
    setFormData(() => JSON.stringify(newFormData));
  }, [quantity, selectedProduct, user, positions, customProductTitle])

  const handleProductCountInput = (event: ChangeEvent<HTMLInputElement>) => {
    const quantity = +event.target.value;
    setQuantity(quantity);
  }

  const handleCustomProductTitleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedProduct(null);
    setCustomProductTitle(event.target.value);
  }

  const handleCustomProductPriceInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedProduct(null);
    setCustomProductPrice(+event.target.value);
  }

  const addProductToPosition = (event:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (selectedProduct) {
      const position = {
        id: uuidv4(),
        userId: user.id,
        product: {
          price: selectedProduct.price,
          name: selectedProduct.name,
          isCustom: !!(customProductTitle && customProductPrice),
        },
        quantity,
        totalPrice: quantity * selectedProduct.price
      }
      setPositions(positions => positions ? [...positions, position]: [position]);
    }
  }

  const removeProductFromPosition = (event:  React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    event.preventDefault()
    setPositions(positions => positions ? positions.filter(position => position.id !== id) : null);
  }

  return (
    <main>
      <Form method={"post"}>
        <section>
        {user &&
          <div>
            <div>{user.name}</div>
            <div>{userBalance}</div>
          </div>
        }
        </section>

        <section className={"grid grid-cols-4 px-4 gap-4"}>
        {
          products && products.map((product) => (
            <div
              className={
                clsx(
                  "cursor-pointer border-2 bg-gray-100 py-6 px-2 cursor-pointer flex justify-between",
                  {"bg-green-200": selectedProduct?.id === product.id}
                )
              }
              key={product.id}
              onClick={() => {setSelectedProduct(product)}}
            >
              <div>{product.name}</div>
              <div>{product.price} €</div>
            </div>
          ))
        }
        </section>

        <section className={"flex mt-4"}>
          <label>
            Anderes Produkt eingeben:
            <input
              type="text"
              name="custom-product-title"
              className={inputClassName}
              onInput={handleCustomProductTitleInput}
            />
          </label>
          <label>
            Preis:
            <input
              type="number"
              name="custom-product-price"
              className={inputClassName}
              onInput={handleCustomProductPriceInput}
            />
          </label>
        </section>

        <section>
          <label>
            Anzahl:
            <input
              type="number"
              name="product-count"
              className={inputClassName}
              onInput={handleProductCountInput}
            />
          </label>
          <button onClick={(event) => addProductToPosition(event)}>Hinzufügen</button>
        </section>

        <input
          type="text"
          name="position-details"
          hidden
          value={formData}
        />

        {positions &&
          <section className={"mt-4"}>
            <div className="grid grid-cols-5 gap-x-4">
              <div className={"font-bold"}>Produkt</div>
              <div className={"font-bold"}>Anazahl</div>
              <div className={"font-bold"}>Preis</div>
              <div className={"font-bold"}>Total</div>
              <div></div>
              {positions && positions.map((position: OrderPosition) => (
                <React.Fragment key={position.product.id}>
                  <div>{position.product.name}</div>
                  <div>{position.quantity}</div>
                  <div>{position.product.price} €</div>
                  <div>{position.totalPrice} €</div>
                  <button onClick={(event) =>removeProductFromPosition(event, position.id)}>löschen</button>
                </React.Fragment>
              ))}
            </div>
            <button type="submit" disabled={!selectedProduct}>Als bezahlt markieren!</button>
          </section>
        }
      </Form>
    </main>
  );
}
