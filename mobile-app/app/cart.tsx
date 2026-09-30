import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useCart } from '../context/CartContext';

const formatPrice = (price: any) => {
  const num = Number(price);
  if (isNaN(num)) return '0đ';
  return num.toLocaleString('vi-VN') + 'đ';
};

export default function CartScreen() {
  const router = useRouter();
  // Lấy giỏ hàng thật từ bộ nhớ chung
  const { cart, updateQuantity, createOrder } = useCart();

  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState(0);

  // Form đặt hàng cho khách vãng lai
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Áp dụng mã giảm giá
  const handleApplyVoucher = () => {
    const code = voucher.trim().toUpperCase();
    if (code === 'SWEET10') {
      setDiscount(10000);
      Alert.alert('Thành công', 'Đã áp dụng mã SWEET10 (-10.000đ)!');
    } else if (code === 'FREESHIP') {
      setDiscount(15000);
      Alert.alert('Thành công', 'Đã áp dụng mã FREESHIP (-15.000đ phí ship)!');
    } else {
      Alert.alert('Thông báo', 'Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = cart.length > 0 ? 15000 : 0;
  const totalAmount = Math.max(0, subtotal + shippingFee - discount);

  // Xử lý xác nhận đặt hàng
  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Lỗi', 'Giỏ hàng của bạn đang trống!');
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
      return;
    }

    // Lưu đơn hàng thật sang mục Đơn mua ở tab Tôi
    createOrder({
      name,
      phone,
      address,
      total: totalAmount,
    });

    Alert.alert(
      'Đặt hàng thành công 🎉',
      `Cảm ơn bạn ${name}!\nĐơn hàng trị giá ${formatPrice(totalAmount)} đã được ghi nhận.\nBạn có thể vào tab "Tôi" để theo dõi đơn mua.`,
      [
        {
          text: 'Xem đơn mua',
          onPress: () => {
            router.replace('/(tabs)/profile' as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5D8F" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Tiếp tục mua</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Giỏ hàng ({cart.length})</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {cart.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 50 }}>🛒</Text>
            <Text style={{ color: '#888', marginTop: 10, fontSize: 15 }}>
              Giỏ hàng của bạn đang trống.
            </Text>
            <Pressable
              style={styles.shopNowBtn}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Mua sắm ngay</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Danh sách các món thật trong giỏ */}
            {cart.map((item) => (
              <View key={item.product.id} style={styles.itemCard}>
                <Image source={{ uri: item.product.cover_image }} style={styles.itemImg} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.product.price)}</Text>
                  <View style={styles.qtyRow}>
                    <Pressable
                      onPress={() => updateQuantity(item.product.id, -1)}
                      style={styles.qtyBtn}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>-</Text>
                    </Pressable>
                    <Text style={{ marginHorizontal: 12, fontWeight: 'bold' }}>
                      {item.quantity}
                    </Text>
                    <Pressable
                      onPress={() => updateQuantity(item.product.id, 1)}
                      style={styles.qtyBtn}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}

            {/* Ô nhập mã giảm giá */}
            <View style={styles.voucherBox}>
              <TextInput
                style={styles.voucherInput}
                placeholder="Nhập mã SWEET10 hoặc FREESHIP..."
                value={voucher}
                onChangeText={setVoucher}
                autoCapitalize="characters"
              />
              <Pressable style={styles.voucherBtn} onPress={handleApplyVoucher}>
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>Áp dụng</Text>
              </Pressable>
            </View>

            {/* Form đặt hàng nhanh không cần tài khoản */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>📋 Thông tin giao hàng (Không cần tài khoản)</Text>

              <TextInput
                style={styles.input}
                placeholder="Họ và tên người nhận *"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại nhận hàng *"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ giao hàng chi tiết *"
                value={address}
                onChangeText={setAddress}
              />

              {/* Bảng tính tiền chi tiết */}
              <View style={styles.calcBox}>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Tiền hàng:</Text>
                  <Text style={styles.calcVal}>{formatPrice(subtotal)}</Text>
                </View>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Phí vận chuyển:</Text>
                  <Text style={styles.calcVal}>{formatPrice(shippingFee)}</Text>
                </View>
                {discount > 0 && (
                  <View style={styles.calcRow}>
                    <Text style={styles.calcLabel}>Giảm giá voucher:</Text>
                    <Text style={[styles.calcVal, { color: '#2E7D32' }]}>
                      -{formatPrice(discount)}
                    </Text>
                  </View>
                )}
                <View style={[styles.calcRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                  <Text style={styles.totalVal}>{formatPrice(totalAmount)}</Text>
                </View>
              </View>

              <Pressable style={styles.checkoutBtn} onPress={handleCheckout}>
                <Text style={styles.checkoutBtnText}>XÁC NHẬN ĐẶT HÀNG (COD)</Text>
              </Pressable>
            </View>
          </>
        )}
        <View style={{ height: 40 }} />
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
  emptyWrap: { alignItems: 'center', marginTop: 80 },
  shopNowBtn: {
    backgroundColor: '#FF5D8F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 1,
  },
  itemImg: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#FFE5EC' },
  itemName: { fontSize: 14, fontWeight: 'bold', color: '#2B2D42' },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: '#D90429', marginVertical: 3 },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voucherBox: { flexDirection: 'row', marginVertical: 8 },
  voucherInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#FFD6E0',
    fontSize: 13,
  },
  voucherBtn: {
    backgroundColor: '#FF5D8F',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    elevation: 1,
  },
  formTitle: { fontSize: 14, fontWeight: 'bold', color: '#2B2D42', marginBottom: 12 },
  input: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    fontSize: 13,
  },
  calcBox: { borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10, marginTop: 4 },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  calcLabel: { fontSize: 13, color: '#666' },
  calcVal: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 8, marginTop: 6 },
  totalLabel: { fontSize: 15, fontWeight: 'bold', color: '#2B2D42' },
  totalVal: { fontSize: 18, fontWeight: 'bold', color: '#D90429' },
  checkoutBtn: {
    backgroundColor: '#D90429',
    borderRadius: 10,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  checkoutBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
});