import { createContext, useReducer } from "react";

import { DUMMY_PRODUCTS } from "../../dummy-products";

interface CartContextType {
  items: CartItem[];
  addItemToCart: (productId: string) => void;
  updateItemQuantity: (productId: string, amount: number) => void;
}
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
interface CartState {
  items: CartItem[];
}
type CartAction =
  | { type: "ADD_ITEM"; payload: { productId: string } }
  | { type: "UPDATE_ITEM"; payload: { productId: string; amount: number } };
interface CartContextProviderProps {
  children: React.ReactNode;
}

function shoppingCartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload.productId
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload.productId
      );
      if (product)
        updatedItems.push({
          id: action.payload.productId,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
    }

    return { items: updatedItems };
  }

  if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount || 0;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return { items: updatedItems };
  }

  return state;
}

export const CartContext = createContext<CartContextType | null>(null);

export default function CartContextProvider({
  children,
}: CartContextProviderProps) {
  const [shoppingCartState, shoppingCartDispatch] = useReducer(
    shoppingCartReducer,
    { items: [] }
  );

  function handleAddItemToCart(productId: string) {
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: { productId },
    });
  }

  function handleUpdateCartItemQuantity(productId: string, amount: number) {
    shoppingCartDispatch({
      type: "UPDATE_ITEM",
      payload: {
        productId,
        amount,
      },
    });
  }

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  } as CartContextType;

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
