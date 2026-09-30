import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  searchValue?: string;
  onSearchChange?: (text: string) => void;
}

export default function Header({ searchValue = '', onSearchChange }: HeaderProps) {
  const router = useRouter();
  const { cartCount } = useCart(); // Lấy số lượng giỏ hàng thực tế từ bộ nhớ chung

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Text style={styles.logo}>Sweetie Shop 🍬</Text>

        {/* Bấm vào icon giỏ hàng để chuyển sang trang Cart */}
        <Pressable style={styles.cartBtn} onPress={() => router.push('/cart' as any)}>
          <Text style={{ fontSize: 22 }}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Thanh tìm kiếm */}
      <View style={styles.searchWrap}>
        <Text style={{ marginRight: 8, fontSize: 16 }}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm ChocoPie, socola, kẹo dẻo..."
          placeholderTextColor="#A0A0A0"
          value={searchValue}
          onChangeText={onSearchChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FF5D8F',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cartBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#D90429',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchWrap: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
});