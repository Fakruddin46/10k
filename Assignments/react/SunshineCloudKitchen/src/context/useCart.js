import { useContext } from 'react';
import { CartContext } from './CartContextInstance';

export const useCart = () => useContext(CartContext);
