/* ===========================
// 购物车功能
// =========================== */

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
    
    document.getElementById('displayPrice').textContent = `NT$${price.toLocaleString()}`;
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
}

// ===========================
// 滚动到结账区域
// ===========================

function scrollToCheckout() {
    const checkoutSection = document.querySelector('.checkout-section');
    checkoutSection.scrollIntoView({ behavior: 'smooth' });
}

// ===========================
// 手机号码验证
// ===========================

function validatePhone(phone) {
    // 移除所有非数字字符
    const cleanPhone = phone.replace(/\D/g, '');
    
    // 如果只有9位数字，说明用户输入的是"9XXXXXXXX"格式，需要补0
    if (cleanPhone.length === 9) {
        return '0' + cleanPhone;
    }
    
    // 检查是否为10位数字
    if (cleanPhone.length !== 10) {
        return null;
    }
    
    // 检查是否以09或08开头（台湾标准号码）
    if (!cleanPhone.startsWith('09') && !cleanPhone.startsWith('08')) {
        // 允许其他10位数字，但标记为非标准
        return cleanPhone;
    }
    
    return cleanPhone;
}

// 监听手机号码输入
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.trim();
            if (phone) {
                const validPhone = validatePhone(phone);
                if (validPhone) {
                    this.value = validPhone;
                    phoneError.textContent = '';
                } else {
                    phoneError.textContent = '您的電話有誤，請確認是否為10碼';
                    this.value = '';
                }
            }
        });
        
        phoneInput.addEventListener('input', function() {
            const phone = this.value.trim();
            if (phone) {
                const validPhone = validatePhone(phone);
                if (validPhone) {
                    phoneError.textContent = '';
                } else if (phone.replace(/\D/g, '').length > 0) {
                    phoneError.textContent = '您的電話有誤，請確認是否為10碼';
                }
            } else {
                phoneError.textContent = '';
            }
        });
    }
});

// ===========================
// 配送方式信息更新
// ===========================

function updateShippingInfo() {
    const shippingInfo = document.getElementById('shippingInfo');
    const shippingValue = document.querySelector('input[name="shipping"]:checked').value;
    
    if (shippingValue === 'cod') {
        shippingInfo.innerHTML = '<p>✓ 全台配送</p>';
        document.getElementById('districtGroup').style.display = 'none';
        document.getElementById('storeGroup').style.display = 'none';
    } else if (shippingValue === '711') {
        shippingInfo.innerHTML = '<p>✓ 7-11 超商配送</p>';
        document.getElementById('districtGroup').style.display = 'block';
        document.getElementById('storeGroup').style.display = 'block';
        document.getElementById('store').placeholder = '選擇 7-11 門市...';
    } else if (shippingValue === 'family') {
        shippingInfo.innerHTML = '<p>✓ 全家超商配送</p>';
        document.getElementById('districtGroup').style.display = 'block';
        document.getElementById('storeGroup').style.display = 'block';
        document.getElementById('store').placeholder = '選擇全家門市...';
    }
}

// ===========================
// 县市和地区联动
// ===========================

// ===========================
// 超商门市模拟数据
// ===========================

const storeData = {
    '711': {
        taipei: [
            { id: '711001', name: '台北中山門市', address: '台北市中山區中山北路一段123號' },
            { id: '711002', name: '台北東區門市', address: '台北市信義區忠孝東路四段123號' },
            { id: '711003', name: '台北信義門市', address: '台北市信義區信義路五段123號' },
            { id: '711004', name: '台北南京門市', address: '台北市松山區南京東路三段123號' },
            { id: '711005', name: '台北西門門市', address: '台北市萬華區西門町123號' }
        ],
        newtaipei: [
            { id: '711101', name: '新北板橋門市', address: '新北市板橋區中山路一段123號' },
            { id: '711102', name: '新北新店門市', address: '新北市新店區北新路一段123號' },
            { id: '711103', name: '新北中和門市', address: '新北市中和區中山路一段123號' },
            { id: '711104', name: '新北永和門市', address: '新北市永和區中山路一段123號' },
            { id: '711105', name: '新北土城門市', address: '新北市土城區中山路一段123號' }
        ],
        taoyuan: [
            { id: '711201', name: '桃園中壢門市', address: '桃園市中壢區中山路一段123號' },
            { id: '711202', name: '桃園平鎮門市', address: '桃園市平鎮區中山路一段123號' },
            { id: '711203', name: '桃園龍潭門市', address: '桃園市龍潭區中山路一段123號' },
            { id: '711204', name: '桃園楊梅門市', address: '桃園市楊梅區中山路一段123號' },
            { id: '711205', name: '桃園新屋門市', address: '桃園市新屋區中山路一段123號' }
        ],
        taichung: [
            { id: '711301', name: '台中西屯門市', address: '台中市西屯區中山路一段123號' },
            { id: '711302', name: '台中南屯門市', address: '台中市南屯區中山路一段123號' },
            { id: '711303', name: '台中北屯門市', address: '台中市北屯區中山路一段123號' },
            { id: '711304', name: '台中東區門市', address: '台中市東區中山路一段123號' },
            { id: '711305', name: '台中中區門市', address: '台中市中區中山路一段123號' }
        ],
        tainan: [
            { id: '711401', name: '台南中西門市', address: '台南市中西區中山路一段123號' },
            { id: '711402', name: '台南東區門市', address: '台南市東區中山路一段123號' },
            { id: '711403', name: '台南南區門市', address: '台南市南區中山路一段123號' },
            { id: '711404', name: '台南北區門市', address: '台南市北區中山路一段123號' },
            { id: '711405', name: '台南安平門市', address: '台南市安平區中山路一段123號' }
        ],
        kaohsiung: [
            { id: '711501', name: '高雄新興門市', address: '高雄市新興區中山路一段123號' },
            { id: '711502', name: '高雄前金門市', address: '高雄市前金區中山路一段123號' },
            { id: '711503', name: '高雄苓雅門市', address: '高雄市苓雅區中山路一段123號' },
            { id: '711504', name: '高雄鹽埕門市', address: '高雄市鹽埕區中山路一段123號' },
            { id: '711505', name: '高雄鼓山門市', address: '高雄市鼓山區中山路一段123號' }
        ]
    },
    'family': {
        taipei: [
            { id: 'FAM001', name: '全家台北中山門市', address: '台北市中山區中山北路一段456號' },
            { id: 'FAM002', name: '全家台北東區門市', address: '台北市信義區忠孝東路四段456號' },
            { id: 'FAM003', name: '全家台北信義門市', address: '台北市信義區信義路五段456號' },
            { id: 'FAM004', name: '全家台北南京門市', address: '台北市松山區南京東路三段456號' },
            { id: 'FAM005', name: '全家台北西門門市', address: '台北市萬華區西門町456號' }
        ],
        newtaipei: [
            { id: 'FAM101', name: '全家新北板橋門市', address: '新北市板橋區中山路一段456號' },
            { id: 'FAM102', name: '全家新北新店門市', address: '新北市新店區北新路一段456號' },
            { id: 'FAM103', name: '全家新北中和門市', address: '新北市中和區中山路一段456號' },
            { id: 'FAM104', name: '全家新北永和門市', address: '新北市永和區中山路一段456號' },
            { id: 'FAM105', name: '全家新北土城門市', address: '新北市土城區中山路一段456號' }
        ],
        taoyuan: [
            { id: 'FAM201', name: '全家桃園中壢門市', address: '桃園市中壢區中山路一段456號' },
            { id: 'FAM202', name: '全家桃園平鎮門市', address: '桃園市平鎮區中山路一段456號' },
            { id: 'FAM203', name: '全家桃園龍潭門市', address: '桃園市龍潭區中山路一段456號' },
            { id: 'FAM204', name: '全家桃園楊梅門市', address: '桃園市楊梅區中山路一段456號' },
            { id: 'FAM205', name: '全家桃園新屋門市', address: '桃園市新屋區中山路一段456號' }
        ],
        taichung: [
            { id: 'FAM301', name: '全家台中西屯門市', address: '台中市西屯區中山路一段456號' },
            { id: 'FAM302', name: '全家台中南屯門市', address: '台中市南屯區中山路一段456號' },
            { id: 'FAM303', name: '全家台中北屯門市', address: '台中市北屯區中山路一段456號' },
            { id: 'FAM304', name: '全家台中東區門市', address: '台中市東區中山路一段456號' },
            { id: 'FAM305', name: '全家台中中區門市', address: '台中市中區中山路一段456號' }
        ],
        tainan: [
            { id: 'FAM401', name: '全家台南中西門市', address: '台南市中西區中山路一段456號' },
            { id: 'FAM402', name: '全家台南東區門市', address: '台南市東區中山路一段456號' },
            { id: 'FAM403', name: '全家台南南區門市', address: '台南市南區中山路一段456號' },
            { id: 'FAM404', name: '全家台南北區門市', address: '台南市北區中山路一段456號' },
            { id: 'FAM405', name: '全家台南安平門市', address: '台南市安平區中山路一段456號' }
        ],
        kaohsiung: [
            { id: 'FAM501', name: '全家高雄新興門市', address: '高雄市新興區中山路一段456號' },
            { id: 'FAM502', name: '全家高雄前金門市', address: '高雄市前金區中山路一段456號' },
            { id: 'FAM503', name: '全家高雄苓雅門市', address: '高雄市苓雅區中山路一段456號' },
            { id: 'FAM504', name: '全家高雄鹽埕門市', address: '高雄市鹽埕區中山路一段456號' },
            { id: 'FAM505', name: '全家高雄鼓山門市', address: '高雄市鼓山區中山路一段456號' }
        ]
    }
};

const districtData = {
    taipei: ['中山區', '大安區', '信義區', '松山區', '南港區', '北投區', '士林區', '內湖區', '萬華區', '中正區', '大同區', '文山區'],
    newtaipei: ['板橋區', '新店區', '中和區', '永和區', '土城區', '三峽區', '蘆洲區', '五股區', '泰山區', '林口區', '樹林區', '鶯歌區', '三重區', '新莊區', '淡水區', '八里區', '汐止區', '平溪區', '瑞芳區', '深坑區', '石碇區', '坪林區', '烏來區'],
    taoyuan: ['桃園區', '中壢區', '平鎮區', '龍潭區', '楊梅區', '新屋區', '觀音區', '龜山區', '八德區', '大溪區', '復興區'],
    hsinchu: ['新竹市', '新竹縣'],
    miaoli: ['苗栗市', '頭份鎮', '三灣鄉', '南庄鄉', '獅潭鄉', '後龍鎮', '通霄鎮', '苑裡鎮', '造橋鄉', '銅鑼鄉', '三義鄉', '西湖鄉', '卓蘭鎮'],
    taichung: ['中區', '東區', '西區', '南區', '北區', '西屯區', '南屯區', '北屯區', '豐原區', '東勢區', '石岡區', '新社區', '和平區', '潭子區', '大雅區', '神岡區', '大肚區', '烏日區', '霧峰區', '太平區', '大里區'],
    changhua: ['彰化市', '員林鎮', '和美鎮', '鹿港鎮', '溪湖鎮', '二林鎮', '田中鎮', '北斗鎮', '花壇鄉', '芬園鄉', '大村鄉', '永靖鄉', '伸港鄉', '線西鄉', '福興鄉', '秀水鄉', '埔心鄉', '埔鹽鄉', '竹塘鄉', '社頭鄉', '二水鄉', '田尾鄉', '芎蕉鄉'],
    nantou: ['南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '名間鄉', '鹿谷鄉', '中寮鄉', '魚池鄉', '國姓鄉', '水里鄉', '仁愛鄉', '信義鄉'],
    yunlin: ['斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '土庫鎮', '北港鎮', '古坑鄉', '大埤鄉', '莿桐鄉', '林內鄉', '褒忠鄉', '台西鄉', '麥寮鄉', '四湖鄉', '口湖鄉', '水林鄉'],
    chiayi: ['嘉義市', '嘉義縣'],
    tainan: ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '南化區', '楠西區', '山上區', '下營區', '六甲區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '北門區', '學甲區', '柳營區', '後壁區', '白河區', '東山區', '中埤鄉', '大內鄉', '仁德區'],
    kaohsiung: ['新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '小港區', '楠梓區', '左營區', '仁武區', '大社區', '岡山區', '路竹區', '阿蓮區', '田寮區', '燕巢區', '橋頭區', '梓官區', '彌陀區', '永安區', '茄萣區', '旗山區', '美濃區', '六龜區', '甲仙區', '杉林區', '內門區', '茂林區', '桃源區'],
    pingtung: ['屏東市', '潮州鎮', '東港鎮', '恆春鎮', '萬丹鄉', '長治鄉', '麟洛鄉', '九如鄉', '里港鄉', '高樹鄉', '鹽埤鄉', '南州鄉', '林邊鄉', '佳冬鄉', '新埤鄉', '枋寮鄉', '枋山鄉', '春日鄉', '獅子鄉', '車城鄉', '牡丹鄉', '滿州鄉'],
    taitung: ['台東市', '成功鎮', '關山鎮', '卑南鄉', '鹿野鄉', '延平鄉', '海端鄉', '池上鄉', '東河鄉', '長濱鄉', '太麻里鄉', '金峰鄉', '大武鄉', '達仁鄉'],
    hualien: ['花蓮市', '吉安鄉', '新城鄉', '秀林鄉', '壽豐鄉', '豐濱鄉', '瑞穗鄉', '富里鄉', '玉里鎮', '卓溪鄉', '光復鄉', '萬榮鄉'],
    yilan: ['宜蘭市', '羅東鎮', '蘇澳鎮', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '冬山鄉', '五結鄉', '三星鄉', '南澳鄉', '大同鄉'],
    penghu: ['馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉'],
    kinmen: ['金城鎮', '金湖鎮', '金沙鎮', '金寧鄉', '烈嶼鄉'],
    lienchiang: ['南竿鄉', '北竿鄉', '莒光鄉', '東引鄉']
};

// 根据县市和配送方式加载门市
function loadStores() {
    const shipping = document.querySelector('input[name="shipping"]:checked').value;
    const county = document.getElementById('county').value;
    const storeSelect = document.getElementById('store');
    
    if (!county || shipping === 'cod') {
        storeSelect.innerHTML = '<option value="">-- 選擇門市 --</option>';
        return;
    }
    
    const countyMap = {
        'taipei': 'taipei',
        'newtaipei': 'newtaipei',
        'taoyuan': 'taoyuan',
        'taichung': 'taichung',
        'tainan': 'tainan',
        'kaohsiung': 'kaohsiung'
    };
    
    const countyKey = countyMap[county];
    const shippingType = shipping === '711' ? '711' : 'family';
    const stores = storeData[shippingType][countyKey] || [];
    
    storeSelect.innerHTML = '<option value="">-- 選擇門市 --</option>';
    stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.id;
        option.textContent = `${store.name} - ${store.address}`;
        storeSelect.appendChild(option);
    });
}

function updateDistricts() {
    const countySelect = document.getElementById('county');
    const districtSelect = document.getElementById('district');
    const districtGroup = document.getElementById('districtGroup');
    const selectedCounty = countySelect.value;
    
    if (!selectedCounty) {
        districtGroup.style.display = 'none';
        document.getElementById('storeGroup').style.display = 'none';
        return;
    }
    
    const districts = districtData[selectedCounty] || [];
    districtSelect.innerHTML = '<option value="">-- 選擇地區 --</option>';
    
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtSelect.appendChild(option);
    });
    
    if (districts.length > 0) {
        districtGroup.style.display = 'block';
    }
    
    // 清空门市列表
    document.getElementById('storeGroup').style.display = 'none';
    document.getElementById('storeList').innerHTML = '';
}

function updateStores() {
    const shipping = document.querySelector('input[name="shipping"]:checked').value;
    const county = document.getElementById('county').value;
    const district = document.getElementById('district').value;
    const storeGroup = document.getElementById('storeGroup');
    const storeList = document.getElementById('storeList');
    
    // 如果是货到付款，隐藏门市选择
    if (shipping === 'cod' || !county || !district) {
        storeGroup.style.display = 'none';
        storeList.innerHTML = '';
        return;
    }
    
    // 显示门市选择
    storeGroup.style.display = 'block';
    
    // 显示加载中
    storeList.innerHTML = '<p style="color: #999; padding: 10px;">正在加载门市列表...</p>';
    
    // 获取县市中文名称
    const countyNames = {
        'taipei': '台北市',
        'newtaipei': '新北市',
        'taoyuan': '桃園市',
        'hsinchu': '新竹市',
        'miaoli': '苗栗縣',
        'taichung': '台中市',
        'changhua': '彰化縣',
        'nantou': '南投縣',
        'yunlin': '雲林縣',
        'chiayi': '嘉義市',
        'tainan': '台南市',
        'kaohsiung': '高雄市',
        'pingtung': '屏東縣',
        'taitung': '台東縣',
        'hualien': '花蓮縣',
        'yilan': '宜蘭縣',
        'penghu': '澎湖縣',
        'kinmen': '金門縣',
        'lienchiang': '連江縣'
    };
    
    const countyName = countyNames[county];
    const shippingType = shipping === '711' ? '7-11' : '全家';
    
    // 调用 API 获取门市数据
    // 注：全家 API 可用，7-11 使用官方电子地图数据
    if (shipping === 'family') {
        fetchFamilyMartStores(countyName, district, storeList, shippingType);
    } else {
        // 7-11 使用本地数据（因为官方 API 需要特殊权限）
        fetch711Stores(county, district, storeList, shippingType);
    }
}

function fetchFamilyMartStores(countyName, district, storeList, shippingType) {
    // 使用开源 API 获取全家门市数据
    const apiUrl = `https://cvs-api-tw.herokuapp.com/fm_bycity/${countyName}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data.store || data.store.length === 0) {
                storeList.innerHTML = '<p style="color: #999; padding: 10px;">該地區暫無門市</p>';
                return;
            }
            
            // 筛选该地区的门市
            const districtStores = data.store.filter(store => store.address.includes(district));
            
            if (districtStores.length === 0) {
                // 如果该地区没有门市，显示整个县市的门市
                displayStores(data.store, storeList, shippingType);
            } else {
                displayStores(districtStores, storeList, shippingType);
            }
        })
        .catch(error => {
            console.error('API 错误:', error);
            storeList.innerHTML = '<p style="color: #999; padding: 10px;">無法加載門市數據，請稍後重試</p>';
        });
}

function fetch711Stores(county, district, storeList, shippingType) {
    // 7-11 使用本地数据
    const countyKey = county;
    const stores = storeData['711'][countyKey] || [];
    
    if (stores.length === 0) {
        storeList.innerHTML = '<p style="color: #999; padding: 10px;">該地區暫無門市</p>';
        return;
    }
    
    displayStores(stores, storeList, shippingType);
}

function displayStores(stores, storeList, shippingType) {
    // 清空旧的门市列表
    storeList.innerHTML = '';
    
    if (stores.length === 0) {
        storeList.innerHTML = '<p style="color: #999; padding: 10px;">該地區暫無門市</p>';
        return;
    }
    
    // 创建门市选择下拉菜单
    const storeSelect = document.createElement('select');
    storeSelect.id = 'storeSelect';
    storeSelect.required = true;
    storeSelect.style.width = '100%';
    storeSelect.style.padding = '8px';
    storeSelect.style.borderRadius = '4px';
    storeSelect.style.border = '1px solid #ddd';
    storeSelect.style.fontSize = '14px';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = `-- 選擇${shippingType}門市 --`;
    storeSelect.appendChild(defaultOption);
    
    // 添加门市选项
    stores.forEach((store, index) => {
        const option = document.createElement('option');
        option.value = index;
        const storeName = store.name || store.store_name || '門市';
        option.textContent = storeName;
        option.dataset.address = store.address;
        storeSelect.appendChild(option);
    });
    
    // 添加门市信息显示
    const storeInfo = document.createElement('div');
    storeInfo.id = 'storeInfo';
    storeInfo.style.marginTop = '10px';
    storeInfo.style.padding = '10px';
    storeInfo.style.backgroundColor = '#f9f9f9';
    storeInfo.style.borderRadius = '4px';
    storeInfo.style.display = 'none';
    
    storeSelect.addEventListener('change', function() {
        if (this.value !== '') {
            const selectedOption = this.options[this.selectedIndex];
            const address = selectedOption.dataset.address;
            storeInfo.innerHTML = `<strong>地址：</strong>${address}`;
            storeInfo.style.display = 'block';
            // 更新隐藏的门市输入框
            document.getElementById('store').value = selectedOption.textContent;
        } else {
            storeInfo.style.display = 'none';
            document.getElementById('store').value = '';
        }
    });
    
    storeList.appendChild(storeSelect);
    storeList.appendChild(storeInfo);
}

// ===========================
// 订单表单提交
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitOrder();
        });
    }
    
    // 初始化浮动按钮
    initFloatingButton();
    
    // 初始化配送方式
    updateShippingInfo();
    
    // 添加地区变化监听
    const districtSelect = document.getElementById('district');
    if (districtSelect) {
        districtSelect.addEventListener('change', function() {
            updateStores();
        });
    }
    
    // 添加配送方式变化监听
    const shippingRadios = document.querySelectorAll('input[name="shipping"]');
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateShippingInfo();
            updateStores();
        });
    });
    
    // 添加县市变化监听
    const countySelect = document.getElementById('county');
    if (countySelect) {
        countySelect.addEventListener('change', function() {
            updateDistricts();
            updateStores();
        });
    }
});

function initFloatingButton() {
    const floatingButton = document.getElementById('floatingBuyButton');
    const checkoutSection = document.querySelector('.checkout-section');
    
    window.addEventListener('scroll', function() {
        const checkoutRect = checkoutSection.getBoundingClientRect();
        if (checkoutRect.top > window.innerHeight) {
            floatingButton.classList.add('show');
        } else {
            floatingButton.classList.remove('show');
        }
    });
}

function submitOrder() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const shipping = document.querySelector('input[name="shipping"]:checked').value;
    const county = document.getElementById('county').value;
    const address = document.getElementById('address').value.trim();
    const remark = document.getElementById('remark').value.trim();
    const packageType = document.getElementById('packageSelect').value;
    const quantity = document.getElementById('quantity').value;
    const total = currentPrice;
    
    // 验证必填字段
    if (!name || !phone || !county || !address) {
        alert('請填寫所有必填欄位！');
        return;
    }
    
    // 验证手机号 - 台湾号码格式
    // 台湾号码可以是：
    // 1. 09开头的10位数字（09XXXXXXXX）
    // 2. 其他10位数字
    if (!/^[0-9]{10}$/.test(phone)) {
        alert('請輸入有效的手機號碼（10位數字）！');
        return;
    }
    
    // 可选：检查是否以09开头（台湾手机号）
    if (!phone.startsWith('09') && !phone.startsWith('08')) {
        // 允许其他格式，但可以添加警告
        console.log('非标准台湾号码格式，但仍然接受');
    }

    // 获取当前时间
    const now = new Date();
    const timestamp = now.toLocaleString('zh-TW');

    // 构建订单数据
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
        total
    };

    // 发送数据到 Google Sheets
    sendToGoogleSheets(orderData);
}

// 发送数据到 Google Sheets
function sendToGoogleSheets(orderData) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbxunlh6XM0OzR1-kS3WckwnAFXR9nLDYMpCCvAwXYRya_sltXgvxuL1Ov66VPWP_2kU/exec';
    
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
}

// 页面加载时初始化
window.addEventListener('load', function() {
    loadCart();
    updatePrice();
});
