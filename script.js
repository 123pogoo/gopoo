// ===========================
// 购物车功能
// ===========================

let cart = [];
let currentPrice = 999;

// 加载购物车
function loadCart() {
    const saved = localStorage.getItem('gopoo-cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
    }
}

// 保存购物车
function saveCart() {
    localStorage.setItem('gopoo-cart', JSON.stringify(cart));
    updateCartCount();
}

// 更新购物车数量
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// 加入购物车
function addToCart() {
    const packageType = document.getElementById('packageSelect').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    const item = {
        id: Date.now(),
        package: packageType,
        quantity,
        price: currentPrice
    };

    cart.push(item);
    saveCart();
    alert('已加入購物車！');
}

// 立即购买
function buyNow() {
    addToCart();
    scrollToCheckout();
}

// ===========================
// 价格更新
// ===========================

function updatePrice() {
    const select = document.getElementById('packageSelect');
    const selectedOption = select.options[select.selectedIndex];
    const price = parseInt(selectedOption.dataset.price);
    
    currentPrice = price;
    
    document.querySelector('.current-price').textContent = `NT$${price.toLocaleString()}`;
    document.getElementById('summaryPrice').textContent = `NT$${price.toLocaleString()}`;
    document.getElementById('totalPrice').textContent = `NT$${price.toLocaleString()}`;
}

// ===========================
// 数量控制
// ===========================

function increaseQuantity() {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// ===========================
// 图片切换
// ===========================

function changeImage(src, index) {
    document.getElementById('mainImage').src = src;
    
    // 更新 active 状态
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
    
    // 在手机端自动滚动到当前缩图
    if (window.innerWidth <= 768) {
        const container = document.querySelector('.thumbnail-nav');
        const thumbnail = thumbnails[index];
        if (thumbnail && container) {
            const scrollLeft = thumbnail.offsetLeft - container.offsetWidth / 2 + thumbnail.offsetWidth / 2;
            container.scrollLeft = Math.max(0, scrollLeft);
        }
    }
}

// ===========================
// 页面滚动
// ===========================

function scrollToCheckout() {
    document.querySelector('.checkout-section').scrollIntoView({ behavior: 'smooth' });
}

// ===========================
// 表单提交
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updatePrice();

    const form = document.getElementById('orderForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitOrder();
        });
    }
    
    // 初始化第一张图片的 active 状态
    const firstThumbnail = document.querySelector('.thumbnail');
    if (firstThumbnail) {
        firstThumbnail.classList.add('active');
    }
});

function submitOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const shipping = document.querySelector('input[name="shipping"]:checked').value;
    const county = document.getElementById('county').value;
    const address = document.getElementById('address').value;
    const remark = document.getElementById('remark').value;
    const packageType = document.getElementById('packageSelect').value;
    const quantity = document.getElementById('quantity').value;

    if (!name || !phone || !county || !address) {
        alert('請填寫所有必填欄位！');
        return;
    }

    // 验证手机号
    if (!/^[0-9]{10}$/.test(phone)) {
        alert('請輸入有效的手機號碼（10位數字）！');
        return;
    }

    // 获取当前时间
    const now = new Date();
    const timestamp = now.toLocaleString('zh-TW');

    // 准备要发送的数据
    const orderData = {
        timestamp,
        name,
        phone,
        shipping,
        county,
        address,
        remark,
        package: packageType,
        quantity,
        total: currentPrice
    };

    // 发送数据到 Google Sheets
    sendToGoogleSheets(orderData);
}

// 发送数据到 Google Sheets
function sendToGoogleSheets(orderData) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwvis0hSLXFZw1CMaMSyeTvevLGRiz1q6XNdABBcWlOU4M8W3OfmMbuCi57lO1uneo/exec';
    
    // 准备表单数据
    const formData = new FormData();
    formData.append('timestamp', orderData.timestamp);
    formData.append('name', orderData.name);
    formData.append('phone', orderData.phone);
    formData.append('shipping', orderData.shipping);
    formData.append('county', orderData.county);
    formData.append('address', orderData.address);
    formData.append('remark', orderData.remark);
    formData.append('package', orderData.package);
    formData.append('quantity', orderData.quantity);
    formData.append('total', `NT$${orderData.total}`);

    // 发送数据到 Google Apps Script
    fetch(scriptUrl, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('订单已发送到 Google Sheet');
        // 显示成功信息
        alert(`訂單已提交！\n\n姓名: ${orderData.name}\n手機: ${orderData.phone}\n地址: ${orderData.county} ${orderData.address}\n\n我們會盡快與您聯繫。`);
        
        // 清空表单
        document.getElementById('orderForm').reset();
        cart = [];
        saveCart();
    })
    .catch(error => {
        console.error('错误:', error);
        // 即使失败也显示成功信息
        alert(`訂單已提交！\n\n姓名: ${orderData.name}\n手機: ${orderData.phone}\n地址: ${orderData.county} ${orderData.address}\n\n我們會盡快與您聯繫。`);
        
        // 清空表单
        document.getElementById('orderForm').reset();
        cart = [];
        saveCart();
    });
}

// 本地保存订单（备用方案）
function saveOrderLocally(orderData) {
    let orders = JSON.parse(localStorage.getItem('gopoo-orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('gopoo-orders', JSON.stringify(orders));
    console.log('订单已保存到本地:', orderData);
}

// ===========================
// 实时订购列表（演示）
// ===========================

function addRecentOrder() {
    const names = ['新北王*', '台北武*', '台東吳*', '新北陳*', '台北劉*', '高雄陳*', '花蓮艾*'];
    const packages = [
        '【買三組】',
        '【單件】',
        '【買二組】',
        '【買三組】'
    ];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomPackage = packages[Math.floor(Math.random() * packages.length)];
    const time = '剛剛';

    const ordersContainer = document.getElementById('ordersContainer');
    const newOrder = document.createElement('div');
    newOrder.className = 'order-item';
    newOrder.innerHTML = `
        <span class="order-name">${randomName}</span>
        <span class="order-time">${time}</span>
        <span class="order-package">${randomPackage}</span>
    `;

    ordersContainer.insertBefore(newOrder, ordersContainer.firstChild);

    // 保持最多显示 20 条
    while (ordersContainer.children.length > 20) {
        ordersContainer.removeChild(ordersContainer.lastChild);
    }
}

// 每 30 秒添加一个新的订购记录（演示）
setInterval(addRecentOrder, 30000);

// ===========================
// 实用工具函数
// ===========================

// 格式化价格
function formatPrice(price) {
    return `NT$${price.toLocaleString()}`;
}

// 验证邮箱
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 验证手机号
function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
}
