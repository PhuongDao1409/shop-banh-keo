import { Stack } from 'expo-router';
import React from 'react';
import { CartProvider } from '../context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 3 Tab chính dưới đáy */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Các màn hình con */}
        <Stack.Screen name="about" options={{ headerShown: false }} />
        <Stack.Screen name="contact" options={{ headerShown: false }} />
        <Stack.Screen name="product-detail" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        
        {/* ĐĂNG KÝ TRANG ĐƠN ĐÃ MUA */}
        <Stack.Screen name="orders" options={{ headerShown: false }} />
      </Stack>
    </CartProvider>
  );
}