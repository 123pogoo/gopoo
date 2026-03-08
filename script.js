// 全局變數
let cart = [];
let selectedColor = '黑色';
let selectedPackage = '單件';
let selectedPrice = 899;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updatePurchaseRecords();
    setInterval(updatePurchaseRecords, 30000); // 每30秒更新一次購買記錄
});

// 初始化事件監聽器
function initializeEventListeners() {
    // 顏色選擇
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.dataset.color;
            document.querySelector('.selected-color').textContent = `已選擇：${selectedColor}`;
        });
    });

    // 套餐選擇
    document.querySelectorAll('.package-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.package-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedPackage = this.dataset.package;
            selectedPrice = parseInt(this.dataset.price);
        });
    });

    // 標籤頁切換
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            switchTab(e, this.textContent.trim().split('\n')[0]);
        });
    });
}

// 改變主圖片
function changeImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = thumbnail.src;
    
    // 更新縮圖選中狀態
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

// 增加數量
function increaseQty() {
    const qty = document.getElementById('quantity');
    qty.value = parseInt(qty.value) + 1;
}

// 減少數量
function decreaseQty() {
    const qty = document.getElementById('quantity');
    if (parseInt(qty.value) > 1) {
        qty.value = parseInt(qty.value) - 1;
    }
}

// 加入購物車
function addToCart() {
    const quantity = parseInt(document.getElementById('quantity').value);
    
    const cartItem = {
        id: Date.now(),
        package: selectedPackage,
        color: selectedColor,
        price: selectedPrice,
        quantity: quantity,
        total: selectedPrice * quantity
    };
    
    cart.push(cartItem);
    updateCartCount();
    
    // 顯示提示
    showNotification(`已加入購物車！${selectedPackage} x ${quantity}`);
    
    // 重置數量
    document.getElementById('quantity').value = 1;
}

// 立即購買
function buyNow() {
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (quantity === 0) {
        showNotification('請選擇數量', 'error');
        return;
    }
    
    // 跳轉到購買頁面
    const orderData = {
        package: selectedPackage,
        color: selectedColor,
        price: selectedPrice,
        quantity: quantity,
        total: selectedPrice * quantity
    };
    
    // 保存到 localStorage
    localStorage.setItem('orderData', JSON.stringify(orderData));
    
    // 跳轉到訂單頁面
    window.location.href = '#checkout';
    showNotification('正在跳轉到結帳頁面...');
}

// 更新購物車數量
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

// 標籤頁切換
function switchTab(event, tabName) {
    // 隱藏所有內容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 移除所有按鈕的活躍狀態
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 顯示選中的內容
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // 標記按鈕為活躍
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// 更新購買記錄
function updatePurchaseRecords() {
    const names = ['林', '王', '陳', '黃', '李', '張', '劉', '楊', '周', '吳'];
    const genders = ['女士', '先生'];
    const packages = ['單件', '買一送一', '三件組', '四件組'];
    const times = ['剛剛', '1分鐘前', '5分鐘前', '12分鐘前', '18分鐘前', '25分鐘前', '35分鐘前', '45分鐘前'];
    
    const recordsList = document.querySelector('.records-list');
    recordsList.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const name = names[Math.floor(Math.random() * names.length)] + '*' + genders[Math.floor(Math.random() * genders.length)];
        const time = times[Math.floor(Math.random() * times.length)];
        const pkg = packages[Math.floor(Math.random() * packages.length)];
        
        const recordItem = document.createElement('div');
        recordItem.className = 'record-item';
        recordItem.innerHTML = `
            <span class="record-name">${name}</span>
            <span class="record-time">${time}</span>
            <span class="record-package">購買了 ${pkg}</span>
        `;
        recordsList.appendChild(recordItem);
    }
}

// 顯示通知
function showNotification(message, type = 'success') {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // 3秒後移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 購物車浮窗點擊事件
document.addEventListener('DOMContentLoaded', function() {
    const cartFloat = document.getElementById('cartFloat');
    if (cartFloat) {
        cartFloat.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('購物車為空', 'error');
            } else {
                showCartSummary();
            }
        });
    }
});

// 顯示購物車摘要
function showCartSummary() {
    let summary = '購物車商品：\n\n';
    let total = 0;
    
    cart.forEach((item, index) => {
        summary += `${index + 1}. ${item.package} (${item.color})\n`;
        summary += `   數量：${item.quantity} × NT$${item.price}\n`;
        summary += `   小計：NT$${item.total}\n\n`;
        total += item.total;
    });
    
    summary += `\n總計：NT$${total}`;
    
    alert(summary);
}

// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 圖片延遲加載
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// 頁面離開時保存購物車
window.addEventListener('beforeunload', function() {
    if (cart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
});

// 頁面加載時恢復購物車
window.addEventListener('load', function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
});
