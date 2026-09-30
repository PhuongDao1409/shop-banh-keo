import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types/product';
import { createOrderApi } from '../services/api';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items: CartItem[];
  total_amount: number;
 status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELED';
  created_at: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (customerInfo: { name: string; phone: string; address: string; total: number }) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([
    // Đơn mẫu có sẵn để thầy mở tab Tôi lên là thấy ngay
    {
      id: '#ORD-1001',
      customer_name: 'Trần Thị Mai',
      customer_phone: '0977112233',
      delivery_address: 'Số 12 Chùa Bộc, Đống Đa, Hà Nội',
      items: [
        {
          product: {
            id: 1,
            name: 'Bánh ChocoPie Truyền Thống (Hộp 12 cái)',
            price: 65000,
            cover_image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
          },
          quantity: 1,
        },
      ],
      total_amount: 80000,
      status: 'PENDING',
      created_at: 'Hôm nay',
    },
  ]);

  // Tổng số lượng món trong giỏ
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Thêm vào giỏ
  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  // Tăng / giảm số lượng (về 0 thì tự xóa)
  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

 // Tạo đơn hàng mới và lưu thật vào MySQL
  const createOrder = async (info: { name: string; phone: string; address: string; total: number }) => {
    const newOrderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Chuẩn bị dữ liệu gửi lên API Backend
    const payload = {
      customer_name: info.name,
      customer_phone: info.phone,
      delivery_address: info.address,
      subtotal: info.total,
      total_amount: info.total,
      shipping_fee: 15000,
      payment_method: 'COD',
      items: cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };

    // 2. Gọi API bắn vào database MySQL
    const res = await createOrderApi(payload);
    const finalId = res?.order_id || newOrderId;

    // 3. Cập nhật vào danh sách đơn mua hiển thị trên app
    const newOrder: Order = {
      id: finalId,
      customer_name: info.name,
      customer_phone: info.phone,
      delivery_address: info.address,
      items: [...cart],
      total_amount: info.total,
      status: 'PENDING',
      created_at: 'Vừa xong',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        updateQuantity,
        clearCart,
        orders,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải được bọc trong CartProvider');
  }
  return context;
}