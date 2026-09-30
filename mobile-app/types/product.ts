export interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  weight?: string;
  expiry_date?: string;
  flavor?: string;
  packaging?: string;
  ingredients?: string;
  cover_image: string;
  brand_name?: string;
  brand_origin?: string;
  category_name?: string;
  is_featured?: boolean;
  is_near_expiry?: boolean;
  reviews?: Array<{
    id: number;
    customer_name: string;
    rating: number;
    comment: string;
  }>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}