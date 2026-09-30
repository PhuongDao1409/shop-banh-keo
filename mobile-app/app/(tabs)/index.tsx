import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import ProductCard from '../../components/ProductCard';
import { getProducts } from '../../services/api';
import { Product } from '../../types/product';

// Dữ liệu dự phòng nếu chưa kết nối được mạng
const FALLBACK_PRODUCTS: Product[] = [
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
  {
    id: 2,
    name: 'Kẹo Dẻo Chupa Chups Cầu Vồng (Gói lớn)',
    price: 28000,
    original_price: 35000,
    weight: '120g',
    brand_name: 'Chupa Chups',
    cover_image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=500',
    is_featured: true,
  },
  {
    id: 3,
    name: 'Socola Meiji Black Chocolate Đen 70%',
    price: 45000,
    original_price: 52000,
    weight: '50g',
    brand_name: 'Meiji',
    cover_image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
    is_featured: true,
  },
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
];

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  // --- ĐỒNG HỒ ĐẾM NGƯỢC THỜI GIAN THỰC ---
  const [secondsLeft, setSecondsLeft] = useState(2 * 3600 + 45 * 60 + 12); // 02:45:12

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 9912));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h} : ${m} : ${s}`;
  };
  // ------------------------------------------

  // Tải dữ liệu từ MySQL qua API
  useEffect(() => {
    getProducts()
      .then((data) => {
        if (data && data.length > 0) setProducts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const displayList = products.length > 0 ? products : FALLBACK_PRODUCTS;

  // Lọc theo tìm kiếm
  const filteredProducts = displayList.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const flashSaleItems = displayList.filter(
    (p) => p.original_price && p.original_price > p.price
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5D8F" />

      {/* Header tái sử dụng */}
      <Header searchValue={search} onSearchChange={setSearch} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Banner Quảng Cáo */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTag}>🔥 ĐẠI TIỆC BÁNH KẸO</Text>
            <Text style={styles.bannerTitle}>Giảm Đến 50% Toàn Bộ Kẹo Nhập Khẩu</Text>
            <Text style={styles.bannerSub}>Freeship đơn từ 99k • Giao nhanh 2h</Text>
          </View>
          <Text style={{ fontSize: 40 }}>🍭</Text>
        </View>

        {/* FLASH SALE - ĐẾM NGƯỢC */}
        <View style={styles.flashSale}>
          <View style={styles.flashSaleHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.flashSaleTitle}>⚡ FLASH SALE</Text>
              <View style={styles.countdownBadge}>
                  <Text style={styles.countdownText}>{formatCountdown(secondsLeft)}</Text>
              </View>         
            </View>
            <Text style={styles.seeAllText}>Xem tất cả &gt;</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {flashSaleItems.map((item) => (
              <Pressable
                key={item.id}
                style={styles.flashCard}
                onPress={() => router.push({ pathname: '/product-detail', params: { id: item.id } } as any)}
              >
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-30%</Text>
                </View>
                <Image source={{ uri: item.cover_image }} style={styles.flashImg} />
                <Text style={styles.flashPrice}>
                  {Number(item.price).toLocaleString('vi-VN')}đ
                </Text>
                <View style={styles.soldBar}>
                  <Text style={styles.soldText}>ĐÃ BÁN 24</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* LƯỚI SẢN PHẨM 2 CỘT */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionHeading}>GỢI Ý HÔM NAY ⭐</Text>
          {loading && <ActivityIndicator size="small" color="#FF5D8F" />}
        </View>

        <View style={styles.gridContainer}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push({ pathname: '/product-detail', params: { id: product.id } } as any)}
            />
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF9FA' },
  container: { flex: 1, paddingHorizontal: 12 },
  banner: {
    backgroundColor: '#FFE5EC',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  bannerTag: { color: '#FF5D8F', fontWeight: 'bold', fontSize: 11 },
  bannerTitle: { fontSize: 15, fontWeight: 'bold', color: '#2B2D42', marginVertical: 3 },
  bannerSub: { fontSize: 11, color: '#666' },

  flashSale: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },
  flashSaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flashSaleTitle: { fontSize: 14, fontWeight: 'bold', color: '#D90429' },
  countdownBadge: {
    backgroundColor: '#2B2D42',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  countdownText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  seeAllText: { fontSize: 11, color: '#777' },

  flashCard: { width: 95, marginRight: 8, alignItems: 'center' },
  discountBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    zIndex: 2,
    backgroundColor: '#D90429',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  discountText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  flashImg: { width: 85, height: 85, borderRadius: 8, backgroundColor: '#FFE5EC' },
  flashPrice: { fontSize: 12, fontWeight: 'bold', color: '#D90429', marginTop: 4 },
  soldBar: {
    backgroundColor: '#FFCCD5',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 2,
    alignItems: 'center',
    marginTop: 2,
  },
  soldText: { fontSize: 8, fontWeight: 'bold', color: '#D90429' },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  sectionHeading: { fontSize: 14, fontWeight: 'bold', color: '#2B2D42' },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});