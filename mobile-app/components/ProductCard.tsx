import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types/product';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2;

const formatPrice = (price: any) => {
  const num = Number(price);
  if (isNaN(num)) return '0đ';
  return num.toLocaleString('vi-VN') + 'đ';
};

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.cover_image }} style={styles.image} resizeMode="cover" />
        {product.is_near_expiry && (
          <View style={styles.nearExpiryTag}>
            <Text style={styles.nearExpiryText}>CẬN DATE -50%</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandText}>{product.brand_name || 'Nhập khẩu'}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.weight}>⚖️ {product.weight || '200g'}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {product.original_price && Number(product.original_price) > Number(product.price) && (
            <Text style={styles.originalPrice}>{formatPrice(product.original_price)}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#FFCCD5',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrap: {
    width: '100%',
    height: 135,
    backgroundColor: '#FFE5EC',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  nearExpiryTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#D90429',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nearExpiryText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  info: {
    padding: 8,
  },
  brandBadge: {
    backgroundColor: '#FFF0F3',
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  brandText: {
    color: '#FF5D8F',
    fontSize: 9,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2B2D42',
    height: 34,
  },
  weight: {
    fontSize: 10,
    color: '#888',
    marginVertical: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D90429',
  },
  originalPrice: {
    fontSize: 10,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
});