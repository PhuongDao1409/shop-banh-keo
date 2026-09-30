import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../../components/Header';
import { getProducts } from '../../services/api';
import { Product } from '../../types/product';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 6,
    name: 'Socola Hạnh Nhân Meiji (Xả kho cận Date)',
    price: 39000,
    original_price: 78000,
    weight: '79g',
    brand_name: 'Meiji',
    cover_image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
    is_near_expiry: true,
  },
  {
    id: 1,
    name: 'Bánh ChocoPie Truyền Thống (Hộp 12 cái)',
    price: 65000,
    original_price: 75000,
    weight: '396g',
    brand_name: 'Orion',
    cover_image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
    is_featured: true,
  },
];

export default function DealScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'near_expiry' | 'discount'>('all');

  useEffect(() => {
    getProducts().then((data) => {
      if (data && data.length > 0) setProducts(data);
    });
  }, []);

  const displayList = products.length > 0 ? products : FALLBACK_PRODUCTS;

  const deals = displayList.filter((item) => {
    if (filter === 'near_expiry') return item.is_near_expiry;
    if (filter === 'discount') return item.original_price && item.original_price > item.price;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5D8F" />
      <Header />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>🔥 TRẠM SĂN DEAL BÁNH KẸO</Text>
          <Text style={styles.bannerSub}>Combo sốc, xả hàng cận date giá rẻ vô địch</Text>
        </View>

        {/* Các nút bấm lọc nhanh */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          <Pressable
            onPress={() => setFilter('all')}
            style={[styles.pill, filter === 'all' && styles.pillActive]}
          >
            <Text style={filter === 'all' ? styles.pillTextActive : styles.pillText}>Tất cả Deal</Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter('near_expiry')}
            style={[styles.pill, filter === 'near_expiry' && styles.pillActive]}
          >
            <Text style={filter === 'near_expiry' ? styles.pillTextActive : styles.pillText}>
              🏷️ Xả Cận Date (-50%)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter('discount')}
            style={[styles.pill, filter === 'discount' && styles.pillActive]}
          >
            <Text style={filter === 'discount' ? styles.pillTextActive : styles.pillText}>
              ⚡ Giảm giá sâu
            </Text>
          </Pressable>
        </ScrollView>

        {/* Danh sách các deal */}
        {deals.map((item) => (
          <Pressable
            key={item.id}
            style={styles.dealCard}
            onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } } as any)}
          >
            <Image source={{ uri: item.cover_image }} style={styles.dealImg} />
            <View style={{ flex: 1, marginLeft: 12, justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.dealTitle} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.dealMeta}>
                  Hãng: {item.brand_name || 'Nhập khẩu'} • ⚖️ {item.weight || '200g'}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.price}>
                  {Number(item.price).toLocaleString('vi-VN')}đ
                </Text>
                {item.original_price && (
                  <Text style={styles.originalPrice}>
                    {Number(item.original_price).toLocaleString('vi-VN')}đ
                  </Text>
                )}
              </View>
            </View>
          </Pressable>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF9FA' },
  container: { flex: 1, paddingHorizontal: 12 },
  banner: {
    backgroundColor: '#FFF0F3',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFCCD5',
  },
  bannerTitle: { color: '#D90429', fontWeight: 'bold', fontSize: 14 },
  bannerSub: { color: '#666', fontSize: 11, marginTop: 2 },
  pill: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FFD6E0',
  },
  pillActive: { backgroundColor: '#FF5D8F', borderColor: '#FF5D8F' },
  pillText: { fontSize: 11, color: '#555' },
  pillTextActive: { fontSize: 11, color: '#FFF', fontWeight: 'bold' },
  dealCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#FFB3C6',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  dealImg: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#FFE5EC' },
  dealTitle: { fontSize: 13, fontWeight: 'bold', color: '#2B2D42' },
  dealMeta: { fontSize: 11, color: '#888', marginTop: 3 },
  price: { fontSize: 14, fontWeight: 'bold', color: '#D90429' },
  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
});