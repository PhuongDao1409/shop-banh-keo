import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useCart } from '../../context/CartContext';

const formatPrice = (price: any) => {
  const num = Number(price);
  if (isNaN(num)) return '0đ';
  return num.toLocaleString('vi-VN') + 'đ';
};

export default function ProfileScreen() {
  const router = useRouter();
  const { orders } = useCart();
  const [phone, setPhone] = useState('');

  const handleTrackOrder = () => {
    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại để tra cứu!');
      return;
    }
    const found = orders.filter((o) => o.customer_phone.includes(phone.trim()));
    if (found.length > 0) {
      router.push({ pathname: '/orders', params: { initialTab: 'ALL' } } as any);
    } else {
      Alert.alert('Thông báo', `Không tìm thấy đơn hàng nào với số điện thoại: ${phone}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5D8F" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trang Cá Nhân</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Thẻ người dùng */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 32 }}>🍬</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.userName}>Khách Mua Hàng</Text>
            <Text style={styles.userSub}>Đăng nhập để nhận voucher tích điểm</Text>
          </View>
          <Pressable style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </Pressable>
        </View>

        {/* KHỐI ĐƠN MUA CHUẨN SHOPEE */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>📦 Đơn mua của tôi</Text>
            <Pressable onPress={() => router.push({ pathname: '/orders', params: { initialTab: 'ALL' } } as any)}>
              <Text style={styles.linkText}>Tất cả ({orders.length}) &gt;</Text>
            </Pressable>
          </View>

          {/* 4 Nút trạng thái Shopee */}
          <View style={styles.statusRow}>
            <Pressable
              style={styles.statusItem}
              onPress={() => router.push({ pathname: '/orders', params: { initialTab: 'PENDING' } } as any)}
            >
              <Text style={{ fontSize: 24 }}>⏳</Text>
              <Text style={styles.statusLabel}>Chờ xác nhận</Text>
            </Pressable>

            <Pressable
              style={styles.statusItem}
              onPress={() => router.push({ pathname: '/orders', params: { initialTab: 'SHIPPING' } } as any)}
            >
              <Text style={{ fontSize: 24 }}>📦</Text>
              <Text style={styles.statusLabel}>Chờ lấy hàng</Text>
            </Pressable>

            <Pressable
              style={styles.statusItem}
              onPress={() => router.push({ pathname: '/orders', params: { initialTab: 'SHIPPING' } } as any)}
            >
              <Text style={{ fontSize: 24 }}>🚚</Text>
              <Text style={styles.statusLabel}>Chờ giao hàng</Text>
            </Pressable>

            <Pressable
              style={styles.statusItem}
              onPress={() => router.push({ pathname: '/orders', params: { initialTab: 'COMPLETED' } } as any)}
            >
              <Text style={{ fontSize: 24 }}>⭐</Text>
              <Text style={styles.statusLabel}>Đánh giá</Text>
            </Pressable>
          </View>

          {/* Hiển thị tóm tắt đơn gần nhất */}
          {orders.length > 0 && (
            <Pressable
              style={styles.recentOrderBox}
              onPress={() => router.push({ pathname: '/orders', params: { initialTab: 'ALL' } } as any)}
            >
              <Text style={styles.recentOrderTitle}>Đơn hàng gần nhất: {orders[0].id}</Text>
              <Text style={styles.recentOrderSub} numberOfLines={1}>
                {orders[0].items[0]?.product.name || 'Bánh kẹo'} • {formatPrice(orders[0].total_amount)}
              </Text>
            </Pressable>
          )}
        </View>

        {/* TRA CỨU ĐƠN BẰNG SĐT */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🔍 Tra cứu đơn hàng bằng SĐT</Text>
          <Text style={styles.helperText}>
            Không cần tài khoản, nhập số điện thoại đặt hàng để xem lộ trình:
          </Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại..."
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <Pressable style={styles.trackBtn} onPress={handleTrackOrder}>
              <Text style={styles.trackBtnText}>Tra cứu</Text>
            </Pressable>
          </View>
        </View>

        {/* MENU ĐIỀU HƯỚNG */}
        <View style={styles.menuCard}>
          <Pressable style={styles.menuItem} onPress={() => router.push('/about' as any)}>
            <Text style={styles.menuLabel}>ℹ️ Giới thiệu về Sweetie Shop</Text>
            <Text style={styles.arrow}>&gt;</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={() => router.push('/contact' as any)}>
            <Text style={styles.menuLabel}>📞 Liên hệ & Hỗ trợ khách hàng</Text>
            <Text style={styles.arrow}>&gt;</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <Text style={styles.menuLabel}>🎟️ Kho Voucher của tôi</Text>
            <Text style={styles.arrow}>&gt;</Text>
          </Pressable>

          <Pressable style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <Text style={styles.menuLabel}>📍 Sổ địa chỉ nhận hàng</Text>
            <Text style={styles.arrow}>&gt;</Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF9FA' },
  header: { backgroundColor: '#FF5D8F', padding: 16, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  container: { flex: 1, paddingHorizontal: 12 },

  userCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE5EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#2B2D42' },
  userSub: { fontSize: 11, color: '#777', marginTop: 2 },
  loginBtn: {
    backgroundColor: '#FF5D8F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  loginBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },

  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontWeight: 'bold', fontSize: 13, color: '#2B2D42' },
  linkText: { fontSize: 11, color: '#FF5D8F', fontWeight: 'bold' },

  statusRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statusItem: { alignItems: 'center' },
  statusLabel: { fontSize: 10, color: '#555', marginTop: 4 },

  recentOrderBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 0.5,
    borderColor: '#DCFCE7',
  },
  recentOrderTitle: { fontSize: 12, fontWeight: 'bold', color: '#15803D' },
  recentOrderSub: { fontSize: 11, color: '#555', marginTop: 2 },

  helperText: { fontSize: 12, color: '#777', marginVertical: 4 },
  searchRow: { flexDirection: 'row', marginTop: 6 },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  trackBtn: {
    backgroundColor: '#FF5D8F',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 8,
    marginLeft: 6,
  },
  trackBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

  menuCard: { backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 12, elevation: 1 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },
  menuLabel: { fontSize: 14, color: '#333' },
  arrow: { color: '#999', fontSize: 14 },
});