import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ẩn header mặc định để dùng Header riêng của chúng ta
        tabBarActiveTintColor: '#FF5D8F', // Màu hồng ngọt ngào khi đang chọn
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: '#FFF',
          borderTopColor: '#FFD6E0',
          borderTopWidth: 0.8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {/* Tab 1: Trang chủ */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>🏠</Text>
          ),
        }}
      />

      {/* Tab 2: Deal Sốc */}
      <Tabs.Screen
        name="deal"
        options={{
          title: 'Deal Sốc',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>🔥</Text>
          ),
        }}
      />

      {/* Tab 3: Tôi (Cá nhân) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tôi',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}