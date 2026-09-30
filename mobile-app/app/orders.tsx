import { useLocalSearchParams, useRouter } from 'expo-router';
import { getOrdersApi } from '../services/api';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCart } from '../context/CartContext';

const formatPrice = (price: any) => {
  const num = Number(price);
  if (isNaN(num)) return '0đ';
  return num.toLocaleString('vi-VN') + 'đ';
};

const TABS = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ xác nhận' },
  { key: 'SHIPPING', label: 'Đang giao' },
  { key: 'COMPLETED', label: 'Đã giao' },
  { key: 'CANCELED', label: 'Đã hủy' },
];

export default function OrdersScreen() {
  const router = useRouter();
  const { initialTab } = useLocalSearchParams();
  const { orders: localOrders } = useCart();

  const [activeTab, setActiveTab] = useState<string>((initialTab as string) || 'ALL');
  const [ordersList, setOrdersList] = useState<any[]>(localOrders);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // HÀM ĐỒNG BỘ ĐƠN HÀNG TỪ MYSQL
  const fetchLiveOrders = async () => {
    try {
      const data = await getOrdersApi();
      if (data && data.length > 0) {
        const formatted = data.map((d: any) => ({
          ...d,
          displayId: `#ORD-${d.id}`,
          items: d.items || [],
        }));
        setOrdersList(formatted);
      }
    } catch (err) {
      console.log('Lỗi:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Tự động tải từ MySQL khi vừa mở màn hình
  useEffect(() => {
    fetchLiveOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLiveOrders();
  };

  // Lọc theo tab đang chọn
  const filteredOrders = ordersList.filter((order) => {
    if (activeTab === 'ALL') return true;
    return order.status === activeTab;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { text: 'Chờ xác nhận', color: '#FF5D8F' };
      case 'SHIPPING':
        return { text: 'Chờ giao hàng', color: '#E65100' };
      case 'COMPLETED':
        return { text: 'Đã giao thành công', color: '#2E7D32' };
      case 'CANCELED':
        return { text: 'Đã hủy', color: '#888' };
      default:
        return { text: 'Chờ xác nhận', color: '#FF5D8F' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5D8F" />

      {/* Header chuẩn Shopee */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Đơn đã mua</Text>
        <Pressable onPress={fetchLiveOrders}>
          <Text style={{ color: '#FFF', fontSize: 13, fontWeight: 'bold' }}>Làm mới 🔄</Text>
        </Pressable>
      </View>

      {/* Thanh gạt trạng thái */}
      <View style={styles.tabBarWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Danh sách đơn hàng từ MySQL */}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <ActivityIndicator size="large" color="#FF5D8F" />
            <Text style={{ marginTop: 10, color: '#777' }}>Đang đồng bộ trạng thái đơn từ hệ thống...</Text>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 50 }}>📦</Text>
            <Text style={styles.emptyText}>Chưa có đơn hàng nào trong mục này.</Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusLabel(order.status);
            const items = order.items || [];
            const totalQuantity = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
            const firstItem = items[0];

            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.shopRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.favoriteBadge}>
                      <Text style={styles.favoriteText}>Yêu thích</Text>
                    </View>
                    <Text style={styles.shopName}>Sweetie Shop 🍬</Text>
                  </View>
                  <Text style={[styles.statusText, { color: statusInfo.color }]}>
                    {statusInfo.text}
                  </Text>
                </View>

                {firstItem ? (
                  <View style={styles.productRow}>
                    <Image
                      source={{ uri: firstItem.product?.cover_image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500' }}
                      style={styles.productImg}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.productName} numberOfLines={2}>
                        {firstItem.product?.name || 'Sản phẩm bánh kẹo'}
                      </Text>
                      <Text style={styles.productWeight}>
                        Hộp tiêu chuẩn • ⚖️ {firstItem.product?.weight || '200g'}
                      </Text>
                      <View style={styles.productPriceRow}>
                        <Text style={styles.productQty}>x{firstItem.quantity || 1}</Text>
                        <Text style={styles.productPrice}>
                          {formatPrice(firstItem.price || firstItem.product?.price || order.total_amount)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={{ paddingVertical: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Mã đơn: {order.displayId || `#ORD-${order.id}`}</Text>
                    <Text style={{ color: '#666', fontSize: 12 }}>Người nhận: {order.customer_name} ({order.customer_phone})</Text>
                  </View>
                )}

                {items.length > 1 && (
                  <Text style={styles.moreItemsText}>
                    và {items.length - 1} sản phẩm khác trong đơn...
                  </Text>
                )}

                <View style={styles.totalRow}>
                  <Text style={styles.totalText}>
                    Tổng thanh toán: <Text style={styles.totalHighlight}>{formatPrice(order.total_amount)}</Text>
                  </Text>
                </View>

                <View style={styles.deliveryBox}>
                  <Text style={styles.deliveryStatus}>
                    🚚 {order.status === 'COMPLETED' ? 'Đơn hàng đã được giao thành công' : (order.status === 'SHIPPING' ? 'Shipper đang trên đường giao hàng' : 'Đang chờ cửa hàng chuẩn bị bánh kẹo')}
                  </Text>
                  <Text style={styles.deliverySub}>
                    Giao tới: {order.delivery_address}
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.trackBtn}
                    onPress={() =>
                      Alert.alert(
                        `Chi tiết đơn ${order.displayId || `#ORD-${order.id}`}`,
                        `Khách hàng: ${order.customer_name}\nSĐT: ${order.customer_phone}\nĐịa chỉ: ${order.delivery_address}\nTrạng thái: ${statusInfo.text}`
                      )
                    }
                  >
                    <Text style={styles.trackBtnText}>Theo dõi đơn</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#FF5D8F',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { paddingRight: 10 },
  backIcon: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },

  tabBarWrap: { backgroundColor: '#FFF', borderBottomWidth: 0.5, borderBottomColor: '#E0E0E0' },
  tabScroll: { paddingHorizontal: 6 },
  tabItem: { paddingVertical: 12, paddingHorizontal: 14 },
  tabItemActive: { borderBottomWidth: 2.5, borderBottomColor: '#FF5D8F' },
  tabLabel: { fontSize: 13, color: '#555' },
  tabLabelActive: { color: '#FF5D8F', fontWeight: 'bold' },

  container: { flex: 1, padding: 10 },
  emptyWrap: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#888', marginTop: 10, fontSize: 14 },

  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  shopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  favoriteBadge: {
    backgroundColor: '#EE4D2D',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 6,
  },
  favoriteText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  shopName: { fontWeight: 'bold', fontSize: 13, color: '#333' },
  statusText: { fontSize: 12, fontWeight: '600' },

  productRow: { flexDirection: 'row', marginTop: 10 },
  productImg: { width: 75, height: 75, borderRadius: 6, backgroundColor: '#FFE5EC' },
  productName: { fontSize: 13, fontWeight: 'bold', color: '#333', lineHeight: 18 },
  productWeight: { fontSize: 11, color: '#888', marginVertical: 3 },
  productPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productQty: { fontSize: 12, color: '#777' },
  productPrice: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  moreItemsText: { fontSize: 11, color: '#888', fontStyle: 'italic', marginVertical: 4 },

  totalRow: {
    alignItems: 'flex-end',
    borderTopWidth: 0.5,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
    marginTop: 8,
  },
  totalText: { fontSize: 13, color: '#333' },
  totalHighlight: { fontSize: 15, fontWeight: 'bold', color: '#EE4D2D' },

  deliveryBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
    padding: 8,
    marginVertical: 8,
    borderWidth: 0.5,
    borderColor: '#DCFCE7',
  },
  deliveryStatus: { fontSize: 11, color: '#15803D', fontWeight: 'bold' },
  deliverySub: { fontSize: 11, color: '#555', marginTop: 2 },

  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  trackBtn: {
    borderWidth: 1,
    borderColor: '#EE4D2D',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
  },
  trackBtnText: { color: '#EE4D2D', fontSize: 12, fontWeight: 'bold' },
});