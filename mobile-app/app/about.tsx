import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5D8F" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Quay lại</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Giới thiệu cửa hàng</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.logoBox}>
          <Text style={{ fontSize: 60 }}>🍬</Text>
          <Text style={styles.shopName}>Sweetie Shop</Text>
          <Text style={styles.shopSlogan}>Thiên đường bánh kẹo & đồ ngọt nhập khẩu</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧁 Câu chuyện thương hiệu</Text>
          <Text style={styles.cardBody}>
            Sweetie Shop ra đời với sứ mệnh mang đến những món bánh kẹo hảo hạng nhất từ các thương hiệu hàng đầu thế giới như Orion, Meiji, Lotte, Chupa Chups với chất lượng tuyệt hảo.
          </Text>

          <Text style={[styles.cardTitle, { marginTop: 16 }]}>🛡️ Cam kết của chúng tôi</Text>
          <Text style={styles.cardBody}>
            • 100% hàng chính hãng, hạn sử dụng rõ ràng.{"\n"}
            • Đạt tiêu chuẩn vệ sinh an toàn thực phẩm.{"\n"}
            • Đóng gói cẩn thận, chống va đập dẹp nát bánh.{"\n"}
            • Đổi trả 1-1 miễn phí nếu hàng bị lỗi hoặc cận date không đúng mô tả.
          </Text>
        </View>
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
  logoBox: { alignItems: 'center', marginVertical: 20 },
  shopName: { fontSize: 24, fontWeight: 'bold', color: '#FF5D8F', marginTop: 8 },
  shopSlogan: { color: '#777', fontSize: 13, marginTop: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, elevation: 1 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#2B2D42', marginBottom: 6 },
  cardBody: { fontSize: 13, color: '#555', lineHeight: 22 },
});