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

export default function ContactScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5D8F" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Quay lại</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Liên hệ & Hỗ trợ</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📞 Kênh chăm sóc khách hàng</Text>
          <Text style={styles.cardBody}>
            • Hotline tư vấn: <Text style={styles.boldText}>1900 8888</Text> (8h00 - 21h30){"\n"}
            • Zalo hỗ trợ: <Text style={styles.boldText}>0988.888.888</Text>{"\n"}
            • Email góp ý: <Text style={styles.boldText}>hotro@sweetieshop.vn</Text>
          </Text>

          <Text style={[styles.cardTitle, { marginTop: 18 }]}>📍 Hệ thống cửa hàng</Text>
          <Text style={styles.cardBody}>
            • Chi nhánh 1: Số 12 Chùa Bộc, Đống Đa, Hà Nội{"\n"}
            • Chi nhánh 2: 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM{"\n"}
            • Giờ mở cửa: 08:00 - 22:00 tất cả các ngày trong tuần.
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
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginTop: 10, elevation: 1 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#2B2D42', marginBottom: 8 },
  cardBody: { fontSize: 13, color: '#555', lineHeight: 22 },
  boldText: { fontWeight: 'bold', color: '#FF5D8F' },
});