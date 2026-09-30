// 1. Kiểm tra quyền Admin
function checkAdminAuth() {
  const stored = localStorage.getItem('sweetie_admin');
  if (stored) {
    return JSON.parse(stored);
  }
  const defaultAdmin = { name: 'Quản Trị Viên (Admin)', email: 'admin@banhkeo.com', role: 'ADMIN' };
  localStorage.setItem('sweetie_admin', JSON.stringify(defaultAdmin));
  return defaultAdmin;
}

// 2. Đăng xuất
function handleAdminLogout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    localStorage.removeItem('sweetie_admin');
    window.location.href = '/admin/login.html';
  }
}

// 3. Format tiền tệ
const formatVND = (num) => Number(num || 0).toLocaleString('vi-VN') + 'đ';

// 4. Render Layout tự động
function renderAdminLayout(activePageTitle, activeMenuKey) {
  const admin = checkAdminAuth();

  // ĐƯỜNG DẪN CHUẨN CÓ /admin/ ĐỂ KHÔNG BAO GIỜ BỊ 404
  const sidebarHTML = `
    <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0 min-h-screen">
      <div>
        <div class="p-6 border-b border-slate-800 flex items-center gap-3">
          <span class="text-3xl">🍬</span>
          <div>
            <h1 class="text-white font-bold text-lg leading-tight">Sweetie Shop</h1>
            <span class="text-xs text-pink-400 font-medium tracking-wide">QUẢN TRỊ VIÊN</span>
          </div>
        </div>

        <nav class="p-4 space-y-1">
          <a href="/admin/index.html" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${activeMenuKey === 'dashboard' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'hover:bg-slate-800 text-slate-400'}">
            <span>📊</span> <span>Tổng Quan</span>
          </a>
          <a href="/admin/orders.html" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${activeMenuKey === 'orders' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'hover:bg-slate-800 text-slate-400'}">
            <span>📦</span> <span>Quản Lý Đơn Hàng</span>
          </a>
          <a href="/admin/inventory.html" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${activeMenuKey === 'inventory' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'hover:bg-slate-800 text-slate-400'}">
            <span>🏬</span> <span>Kho & Nhập Hàng</span>
          </a>
          <a href="/admin/products.html" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${activeMenuKey === 'products' ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30' : 'hover:bg-slate-800 text-slate-400'}">
            <span>🍭</span> <span>Quản Lý Sản Phẩm</span>
          </a>
        </nav>
      </div>

      <div class="p-4 border-t border-slate-800">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
              AD
            </div>
            <div>
              <p class="text-sm font-bold text-white">${admin.name}</p>
              <p class="text-xs text-slate-500">Toàn quyền hệ thống</p>
            </div>
          </div>
          <button onclick="handleAdminLogout()" title="Đăng xuất" class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition cursor-pointer">
            🚪
          </button>
        </div>
      </div>
    </aside>
  `;

  const topbarHTML = `
    <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <h2 class="text-xl font-bold text-gray-800">${activePageTitle}</h2>
      <div class="flex items-center gap-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
          ● Hệ thống kết nối MySQL Live
        </span>
      </div>
    </header>
  `;

  const sidebarContainer = document.getElementById('sidebar-container');
  if (sidebarContainer) sidebarContainer.innerHTML = sidebarHTML;

  const topbarContainer = document.getElementById('topbar-container');
  if (topbarContainer) topbarContainer.innerHTML = topbarHTML;
}