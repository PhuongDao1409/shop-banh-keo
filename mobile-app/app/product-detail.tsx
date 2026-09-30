import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { getProductById } from '../services/api';
import { Product } from '../types/product';

const formatPrice = (price: any) => {
  const num = Number(price);
  if (isNaN(num)) return '0đ';
  return num.toLocaleString('vi-VN') + 'đ';
};

// Dữ liệu dự phòng chuẩn để không bao giờ bị trắng trang
const FALLBACK_MAP: { [key: string]: Product } = {
  '1': {
    id: 1,
    name: 'Bánh ChocoPie Truyền Thống (Hộp 12 cái)',
    price: 65000,
    original_price: 75000,
    weight: '396g',
    expiry_date: '12 tháng',
    flavor: 'Socola & Marshmallow',
    packaging: 'Hộp giấy',
    ingredients: 'Bột mì, đường mía, siro glucose, bột cacao, sữa bột nguyên kem, trứng gà tươi.',
    brand_name: 'Orion',
    brand_origin: 'Hàn Quốc',
    cover_image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
    reviews: [
      { id: 1, customer_name: 'Lê Hoàng Nam', rating: 5, comment: 'Bánh mềm ngon, date xa, đóng gói cẩn thận!' },
    ],
  },
  '2': {
    id: 2,
    name: 'Kẹo Dẻo Chupa Chups Cầu Vồng (Gói lớn)',
    price: 28000,
    original_price: 35000,
    weight: '120g',
    expiry_date: '18 tháng',
    flavor: 'Trái cây nhiệt đới',
    packaging: 'Túi zip',
    ingredients: 'Đường, siro mạch nha, gelatin, hương dâu, cam, táo tự nhiên.',
    brand_name: 'Chupa Chups',
    brand_origin: 'Tây Ban Nha',
    cover_image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=500',
    reviews: [
      { id: 2, customer_name: 'Thu Trang', rating: 5, comment: 'Chua chua ngọt ngọt rất vừa miệng.' },
    ],
  },
  '3': {
    id: 3,
    name: 'Socola Meiji Black Chocolate Đen 70%',
    price: 45000,
    original_price: 52000,
    weight: '50g',
    expiry_date: '12 tháng',
    flavor: 'Cacao 70% Đậm Vị',
    packaging: 'Thanh giấy bạc',
    ingredients: 'Cacao mass nguyên chất, bơ cacao, đường, lecithin đậu nành.',
    brand_name: 'Meiji',
    brand_origin: 'Nhật Bản',
    cover_image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
    reviews: [
      { id: 3, customer_name: 'Minh Đức', rating: 5, comment: 'Socola đắng nhẹ thơm lừng chuẩn Meiji.' },
    ],
  },
  '6': {
    id: 6,
    name: 'Socola Hạnh Nhân Meiji (Xả kho cận Date)',
    price: 39000,
    original_price: 78000,
    weight: '79g',
    expiry_date: 'Còn 25 ngày',
    flavor: 'Hạnh nhân bọc socola',
    packaging: 'Hộp kéo',
    ingredients: 'Hạnh nhân sấy giòn, socola sữa nhập khẩu.',
    brand_name: 'Meiji',
    brand_origin: 'Nhật Bản',
    cover_image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
    is_near_expiry: true,
  },
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Lấy hàm addToCart từ bộ nhớ chung
  const { addToCart } = useCart();

  const productId = String(id || '1');
  const defaultProduct = FALLBACK_MAP[productId] || FALLBACK_MAP['1'];
  
  const [product, setProduct] = useState<Product>(defaultProduct);
  const [quantity, setQuantity] = useState(1);

  // Gọi API lấy dữ liệu mới nhất từ MySQL nếu có
  useEffect(() => {
    if (id) {
      getProductById(id as string).then((data) => {
        if (data && data.name) {
          setProduct(data);
        }
      });
    }
  }, [id]);

  // Xử lý thêm vào giỏ hàng thật
  const handleAddToCart = () => {
    // 1. Gửi sản phẩm và số lượng vào bộ nhớ giỏ hàng
    addToCart(product, quantity);

    // 2. Hiện thông báo cho người dùng
    Alert.alert(
      'Thành công 🎉',
      `Đã thêm ${quantity} x "${product.name}" vào giỏ hàng!`,
      [
        { text: 'Tiếp tục mua', style: 'cancel' },
        { text: 'Xem giỏ hàng', onPress: () => router.push('/cart' as any) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5D8F" />

      {/* Header Quay lại */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Quay lại</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Chi tiết sản phẩm</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Ảnh to sản phẩm */}
        <View style={styles.imageWrap}>
          {product.cover_image ? (
            <Image source={{ uri: product.cover_image }} style={styles.image} resizeMode="cover" />
          ) : (
            <Text style={{ fontSize: 80 }}>🍬</Text>
          )}
        </View>

        <Text style={styles.title}>{product.name}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {product.original_price && Number(product.original_price) > Number(product.price) && (
            <Text style={styles.originalPrice}>{formatPrice(product.original_price)}</Text>
          )}
        </View>

        {/* Bảng thông số kỹ thuật chuẩn bánh kẹo */}
        <View style={styles.specsBox}>
          <Text style={styles.specItem}>
            🏷️ Thương hiệu: <Text style={styles.bold}>{product.brand_name || 'Nhập khẩu'} ({product.brand_origin || 'Quốc tế'})</Text>
          </Text>
          <Text style={styles.specItem}>
            🍓 Hương vị: <Text style={styles.bold}>{product.flavor || 'Thơm ngon hảo hạng'}</Text>
          </Text>
          <Text style={styles.specItem}>
            ⚖️ Khối lượng: <Text style={styles.bold}>{product.weight || '200g'}</Text>
          </Text>
          <Text style={styles.specItem}>
            📦 Đóng gói: <Text style={styles.bold}>{product.packaging || 'Hộp tiêu chuẩn'}</Text>
          </Text>
          <Text style={styles.specItem}>
            ⏳ Hạn sử dụng: <Text style={styles.bold}>{product.expiry_date || '12 tháng'}</Text>
          </Text>
        </View>

        {/* Thành phần dinh dưỡng */}
        <Text style={styles.sectionHeading}>Thành phần & Cảnh báo dị ứng</Text>
        <Text style={styles.desc}>
          {product.ingredients || 'Nguyên liệu an toàn, thơm ngon tự nhiên, đạt chuẩn vệ sinh thực phẩm.'}
        </Text>

        {/* Chọn số lượng */}
        <View style={styles.qtyRow}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Số lượng mua:</Text>
          <View style={styles.qtyControls}>
            <Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
            </Pressable>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 16 }}>{quantity}</Text>
            <Pressable onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Nút bấm Thêm giỏ hàng */}
        <Pressable style={styles.addBtn} onPress={handleAddToCart}>
          <Text style={styles.addBtnText}>
            Thêm vào giỏ hàng • {formatPrice(Number(product.price || 0) * quantity)}
          </Text>
        </Pressable>

        {/* Đánh giá của khách hàng */}
        {product.reviews && product.reviews.length > 0 && (
          <View style={{ marginTop: 20, marginBottom: 30 }}>
            <Text style={styles.sectionHeading}>Đánh giá của khách hàng ⭐</Text>
            {product.reviews.map((rev) => (
              <View key={rev.id} style={styles.reviewCard}>
                <Text style={styles.reviewAuthor}>
                  {rev.customer_name} ({rev.rating}⭐)
                </Text>
                <Text style={styles.reviewComment}>"{rev.comment}"</Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF9FA' },
  header: {
    backgroundColor: '#FF5D8F',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { paddingRight: 12 },
  backText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  container: { flex: 1, padding: 14 },
  imageWrap: {
    height: 240,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: { width: '100%', height: '100%' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2B2D42' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 8 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#D90429' },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  specsBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#FFE5EC',
  },
  specItem: { fontSize: 13, color: '#555', marginVertical: 3 },
  bold: { fontWeight: 'bold', color: '#2B2D42' },
  sectionHeading: { fontSize: 15, fontWeight: 'bold', color: '#2B2D42', marginTop: 12 },
  desc: { fontSize: 13, color: '#555', lineHeight: 20, marginTop: 4 },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  addBtn: {
    backgroundColor: '#FF5D8F',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  addBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  reviewCard: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  reviewAuthor: { fontWeight: 'bold', color: '#333' },
  reviewComment: { color: '#666', marginTop: 4, fontStyle: 'italic', fontSize: 13 },
});