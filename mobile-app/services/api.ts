
const API_URL = 'http://172.20.10.5:5000';

// 1. Lấy danh sách bánh kẹo (hỗ trợ lọc theo danh mục / tìm kiếm)
export async function getProducts(params?: { category_id?: number; search?: string }) {
  try {
    let url = `${API_URL}/api/products`;
    const queryParts: string[] = [];

    if (params?.category_id) queryParts.push(`category_id=${params.category_id}`);
    if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);

    if (queryParts.length > 0) {
      url += `?${queryParts.join('&')}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Lỗi lấy danh sách bánh kẹo');
    return await res.json();
  } catch (error) {
    console.error('Lỗi getProducts:', error);
    return [];
  }
}

// 2. Lấy chi tiết 1 món bánh kẹo kèm đánh giá
export async function getProductById(id: number | string) {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`);
    if (!res.ok) throw new Error('Lỗi lấy chi tiết bánh kẹo');
    return await res.json();
  } catch (error) {
    console.error('Lỗi getProductById:', error);
    return null;
  }
}

// 3. Lấy danh sách danh mục bánh kẹo
export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/categories`);
    if (!res.ok) throw new Error('Lỗi lấy danh mục');
    return await res.json();
  } catch (error) {
    console.error('Lỗi getCategories:', error);
    return [];
    
  }
}

// 4. Gọi API lưu đơn hàng mới vào MySQL
export async function createOrderApi(orderData: any) {
  try {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return await res.json();
  } catch (error) {
    console.error('Lỗi createOrderApi:', error);
    return null;
  }
}
// 5. Lấy danh sách đơn hàng từ MySQL (có ngắt sau 3 giây để không bao giờ bị xoay đơ)
export async function getOrdersApi() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // Tối đa 3 giây

    const res = await fetch(`${API_URL}/api/orders`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Lỗi lấy đơn');
    return await res.json();
  } catch (error) {
    console.log('Không lấy được đơn từ server, dùng dữ liệu trên máy');
    return [];
  }
}