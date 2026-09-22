// ===============================================================
// MODAL TÓM TẮT CHI TIẾT ĐƠN HÀNG (KHÔNG CÓ ẢNH - XEM NHANH TIẾT KIỆM)
// ===============================================================

function initOrderDetailModal() {
  const modalHTML = `
    <div id="orderDetailModal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        <!-- Header Modal -->
        <div class="flex justify-between items-center border-b pb-3">
          <div>
            <h3 class="text-lg font-bold text-gray-800" id="modalOrderId">Chi Tiết Đơn Hàng #</h3>
            <p class="text-xs text-gray-400" id="modalOrderDate">Ngày đặt: --</p>
          </div>
          <button onclick="closeOrderDetailModal()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer">✕</button>
        </div>

        <!-- Thông tin người nhận -->
        <div class="bg-pink-50/60 rounded-xl p-4 border border-pink-100 text-sm space-y-1">
          <p><span class="text-gray-500">Người nhận:</span> <strong class="text-gray-800" id="modalCustomerName">--</strong> (<span id="modalCustomerPhone">--</span>)</p>
          <p><span class="text-gray-500">Địa chỉ:</span> <span class="text-gray-700" id="modalDeliveryAddress">--</span></p>
          <p><span class="text-gray-500">Trạng thái hiện tại:</span> <span id="modalOrderStatusBadge">--</span></p>
        </div>

        <!-- BẢNG TÓM TẮT CÁC SẢN PHẨM TRONG ĐƠN (KHÔNG CÓ HÌNH ẢNH) -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Danh sách sản phẩm trong đơn</h4>
          <div class="border border-gray-200 rounded-xl overflow-hidden">
            <table class="w-full text-left text-sm text-gray-600">
              <thead class="bg-slate-800 text-white text-xs uppercase font-bold">
                <tr>
                  <th class="px-4 py-2.5">STT</th>
                  <th class="px-4 py-2.5">Tên Sản Phẩm</th>
                  <th class="px-4 py-2.5 text-center">Khối Lượng</th>
                  <th class="px-4 py-2.5 text-center">Số Lượng</th>
                  <th class="px-4 py-2.5 text-right">Đơn Giá</th>
                  <th class="px-4 py-2.5 text-right">Thành Tiền</th>
                </tr>
              </thead>
              <tbody id="modalItemsTableBody" class="divide-y divide-gray-100">
                <!-- Render tự động -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bảng tính tổng tiền -->
        <div class="pt-3 border-t border-gray-100 flex justify-end">
          <div class="w-64 space-y-1 text-sm text-right">
            <p class="text-gray-500">Phí giao hàng: <span class="font-medium text-gray-700">15.000đ</span></p>
            <p class="text-base font-bold text-gray-900 pt-1 border-t">Tổng thanh toán: <span class="text-pink-600 font-extrabold" id="modalOrderTotal">0đ</span></p>
          </div>
        </div>

        <!-- Nút đóng -->
        <div class="flex justify-end pt-2">
          <button onclick="closeOrderDetailModal()" class="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition cursor-pointer">Đóng</button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeOrderDetailModal() {
  document.getElementById('orderDetailModal').classList.add('hidden');
}

// Hàm mở Modal và lấy danh sách sản phẩm từ API
async function showOrderDetail(orderId, customerName, phone, address, total, status, createdAt) {
  document.getElementById('modalOrderId').innerText = `Chi Tiết Đơn Hàng #ORD-${orderId}`;
  document.getElementById('modalOrderDate').innerText = `Ngày tạo: ${createdAt ? new Date(createdAt).toLocaleString('vi-VN') : 'Vừa xong'}`;
  document.getElementById('modalCustomerName').innerText = customerName;
  document.getElementById('modalCustomerPhone').innerText = phone;
  document.getElementById('modalDeliveryAddress').innerText = address;
  document.getElementById('modalOrderTotal').innerText = formatVND(total);

  const statusMap = {
    PENDING: '<span class="px-2 py-0.5 text-xs font-semibold rounded bg-pink-100 text-pink-700">Chờ xác nhận</span>',
    SHIPPING: '<span class="px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-700">Đang giao hàng</span>',
    COMPLETED: '<span class="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-700">Đã giao thành công</span>',
    CANCELED: '<span class="px-2 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-600">Đã hủy</span>',
  };
  document.getElementById('modalOrderStatusBadge').innerHTML = statusMap[status] || status;

  // Lấy các món từ API Backend
  const tbody = document.getElementById('modalItemsTableBody');
  tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-400">Đang tải danh sách món...</td></tr>';
  document.getElementById('orderDetailModal').classList.remove('hidden');

  try {
    const res = await fetch(`http://localhost:5000/api/orders/${orderId}/items`);
    const items = await res.json();

    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-400">Không có dữ liệu dòng hàng</td></tr>';
      return;
    }

    tbody.innerHTML = items.map((it, idx) => `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-2.5 font-bold text-gray-400">${idx + 1}</td>
        <td class="px-4 py-2.5 font-bold text-gray-800">${it.product_name}</td>
        <td class="px-4 py-2.5 text-center text-xs text-gray-500">${it.weight || '200g'}</td>
        <td class="px-4 py-2.5 text-center font-bold text-pink-600">${it.quantity}</td>
        <td class="px-4 py-2.5 text-right">${formatVND(it.price)}</td>
        <td class="px-4 py-2.5 text-right font-bold text-gray-900">${formatVND(it.price * it.quantity)}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Lỗi tải chi tiết: ${err.message}</td></tr>`;
  }
}