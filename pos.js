/* =====================================================
   ORCA CAFE - POS
===================================================== */


/* =====================================================
   تنظیمات ورود POS
===================================================== */

const POS_PIN = "2580";

const REMEMBER_DAYS = 30;

const REMEMBER_KEY =
    "orca_pos_remember_until";


/* =====================================================
   متغیرهای اصلی POS
===================================================== */

let currentCategory = 0;
let order = [];


/* =====================================================
   تبدیل اعداد فارسی به انگلیسی
===================================================== */

function toEnglishNumber(str) {

    return String(str)
        .replace(
            /[۰-۹]/g,
            d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)
        );
}


/* =====================================================
   تبدیل اعداد انگلیسی به فارسی
===================================================== */

function toPersianNumber(str) {

    return String(str)
        .replace(
            /\d/g,
            d => "۰۱۲۳۴۵۶۷۸۹"[d]
        );
}


/* =====================================================
   نمایش POS بعد از ورود
===================================================== */

function showPOS() {

    const lockScreen =
        document.getElementById("lockScreen");

    const posApp =
        document.getElementById("posApp");


    if (lockScreen) {

        lockScreen.style.display = "none";

    }


    if (posApp) {

        posApp.style.display = "block";

    }

}
/* =====================================================
   قفل کردن دستی صندوق
===================================================== */

function lockPOS() {

    const lockScreen = document.getElementById("lockScreen");
    const posApp = document.getElementById("posApp");
    const pinInput = document.getElementById("pinInput");

    /* فقط قفل موقت؛ اعتبار ۳۰ روزه حذف نمی‌شود */
    sessionStorage.setItem("orca_pos_locked", "1");

    posApp.style.display = "none";
    lockScreen.style.display = "flex";

    pinInput.value = "";
    pinInput.focus();

}

/* =====================================================
   ذخیره ورود برای ۳۰ روز
===================================================== */

function rememberDevice() {

    const expiresAt =
        Date.now() +
        REMEMBER_DAYS * 24 * 60 * 60 * 1000;


    try {

        localStorage.setItem(
            REMEMBER_KEY,
            String(expiresAt)
        );

    } catch (error) {

        console.warn(
            "امکان ذخیره ورود در این دستگاه وجود ندارد.",
            error
        );

    }

}


/* =====================================================
   بررسی ورود ذخیره شده
===================================================== */

function checkRememberedLogin() {
   if (sessionStorage.getItem("orca_pos_locked") === "1") {
    return false;
   }
    let expiresAt = null;


    try {

        expiresAt =
            Number(
                localStorage.getItem(
                    REMEMBER_KEY
                )
            );

    } catch (error) {

        expiresAt = null;

    }


    if (
        expiresAt &&
        Date.now() < expiresAt
    ) {

        showPOS();

        return true;

    }


    /* اگر زمان اعتبار تمام شده باشد */

    try {

        localStorage.removeItem(
            REMEMBER_KEY
        );

    } catch (error) {

        console.warn(error);

    }


    return false;

}


/* =====================================================
   ورود با PIN
===================================================== */

function unlockPOS() {

    const pinInput =
        document.getElementById("pinInput");


    if (!pinInput) {
        return;
    }


    const enteredPIN =
        pinInput.value.trim();


    if (enteredPIN === POS_PIN) {
         sessionStorage.removeItem("orca_pos_locked");
        rememberDevice();

        showPOS();

        pinInput.value = "";

        return;

    }


    alert(
        "PIN وارد شده صحیح نیست."
    );


    pinInput.value = "";

    pinInput.focus();

}


/* =====================================================
   فعال سازی صفحه ورود
===================================================== */

function initializeLockScreen() {

    const lockScreen = document.getElementById("lockScreen");
    const posApp = document.getElementById("posApp");
    const pinInput = document.getElementById("pinInput");
    const unlockBtn = document.getElementById("unlockBtn");
    const lockBtn = document.getElementById("lockBtn");

    if (!lockScreen || !posApp) return;

    /* دکمه قفل فقط یک بار */
    if (lockBtn) {
        lockBtn.addEventListener("click", lockPOS);
    }

    posApp.style.display = "none";

    /* ورود خودکار */
    if (checkRememberedLogin()) return;

    lockScreen.style.display = "flex";

    if (unlockBtn) {
        unlockBtn.addEventListener("click", unlockPOS);
    }

    if (pinInput) {

        pinInput.focus();

        pinInput.addEventListener("keydown", event => {

            if (event.key === "Enter") {
                unlockPOS();
            }

        });

    }

}

/* =====================================================
   نمایش دسته بندی ها
===================================================== */

function renderCategories() {

    const container =
        document.getElementById("categoryTabs");

    container.innerHTML = "";


    categories.forEach(
        (category, index) => {

            const button =
                document.createElement("button");


            button.className = "tab";


            if (
                index === currentCategory
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.innerHTML = `
                <span>${category.icon}</span>
                <span>${category.title}</span>
            `;


            button.onclick = () => {

                currentCategory = index;

                renderCategories();
                renderMenu();

            };


            container.appendChild(button);

        }
    );

}


/* =====================================================
   نمایش آیتم های منو
===================================================== */

function renderMenu() {

    const container =
        document.getElementById(
            "menuContainer"
        );


    const category =
        categories[currentCategory];


    container.innerHTML = "";


    const panel =
        document.createElement("div");


    panel.className =
        "order-panel";


    const title =
        document.createElement("div");


    title.className =
        "order-title";


    title.textContent =
        category.icon +
        "  " +
        category.title;


    panel.appendChild(title);


    category.items.forEach(
        (item, index) => {

            const name =
                item[0];

            const price =
                item[1];

            const special =
                item[2];


            const row =
                document.createElement("div");


            row.className =
                "pos-item";


            row.innerHTML = `
                <div>
                    <div class="pos-name">
                        ${name}
                        ${
                            special
                                ? `<span class="special-tag">${special}</span>`
                                : ""
                        }
                    </div>
                </div>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:12px;
                ">

                    <span class="pos-price">
                        ${price}
                    </span>

                    <button class="add-btn">
                        +
                    </button>

                </div>
            `;


            row.querySelector(
                ".add-btn"
            ).onclick = () => {

                addToOrder(
                    currentCategory,
                    index
                );

            };


            panel.appendChild(row);

        }
    );


    container.appendChild(panel);

}


/* =====================================================
   اضافه کردن آیتم به سفارش
===================================================== */

function addToOrder(
    categoryIndex,
    itemIndex
) {

    const item =
        categories[categoryIndex]
        .items[itemIndex];


    const name =
        item[0];


    const price =
        Number(
            toEnglishNumber(item[1])
        );


    const existing =
        order.find(
            x =>
                x.categoryIndex ===
                    categoryIndex &&
                x.itemIndex ===
                    itemIndex
        );


    if (existing) {

        existing.quantity++;

    } else {

        order.push({

            categoryIndex,
            itemIndex,
            name,
            price,
            quantity: 1

        });

    }


    renderOrder();

}


/* =====================================================
   حذف یک عدد از آیتم
===================================================== */

function decreaseItem(index) {

    if (
        order[index].quantity > 1
    ) {

        order[index].quantity--;

    } else {

        order.splice(index, 1);

    }


    renderOrder();

}


/* =====================================================
   اضافه کردن یک عدد
===================================================== */

function increaseItem(index) {

    order[index].quantity++;

    renderOrder();

}


/* =====================================================
   نمایش سفارش
===================================================== */

function renderOrder() {

    const container =
        document.getElementById(
            "orderPanel"
        );


    container.innerHTML = "";


    const panel =
        document.createElement("div");


    panel.className =
        "order-panel";


    const title =
        document.createElement("div");


    title.className =
        "order-title";


    title.textContent =
        "🧾 سفارش جاری";


    panel.appendChild(title);


    if (
        order.length === 0
    ) {

        const empty =
            document.createElement("div");


        empty.className =
            "empty-order";


        empty.textContent =
            "هنوز آیتمی به سفارش اضافه نشده است.";


        panel.appendChild(empty);


        container.appendChild(panel);


        return;

    }


    /* -----------------------------
       آیتم های سفارش
    ----------------------------- */

    order.forEach(
        (item, index) => {

            const row =
                document.createElement("div");


            row.className =
                "pos-item";


            const itemTotal =
                item.price *
                item.quantity;


            row.innerHTML = `

                <div>

                    <div class="pos-name">
                        ${item.name}
                    </div>

                    <div style="
                        color:#BFC7D4;
                        font-size:13px;
                        margin-top:4px;
                    ">

                        ${toPersianNumber(item.price)}
                        ×
                        ${toPersianNumber(item.quantity)}

                    </div>

                </div>


                <div style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                ">

                    <button
                        class="quantity-btn"
                        onclick="decreaseItem(${index})">

                        −

                    </button>


                    <span class="quantity">

                        ${toPersianNumber(item.quantity)}

                    </span>


                    <button
                        class="quantity-btn"
                        onclick="increaseItem(${index})">

                        +

                    </button>


                    <span class="pos-price">

                        ${toPersianNumber(itemTotal)}

                    </span>

                </div>

            `;


            panel.appendChild(row);

        }
    );


    /* -----------------------------
       محاسبه مجموع
    ----------------------------- */

    const total =
        order.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const totalRow =
        document.createElement("div");


    totalRow.className =
        "total-row";


    totalRow.innerHTML = `

        <span>
            مبلغ کل
        </span>

        <span>
            ${toPersianNumber(total)}
        </span>

    `;


    panel.appendChild(totalRow);


    /* -----------------------------
       دکمه ها
    ----------------------------- */

    const buttons =
        document.createElement("div");


    buttons.className =
        "action-buttons";


    buttons.innerHTML = `

        <button
            class="action-btn print-btn"
            onclick="printReceipt()">

            🖨 چاپ فاکتور

        </button>

        <button
            class="action-btn print-btn"
            onclick="sendDirectPrintToBridge()">
            🧪 چاپ مستقیم شبکه‌ای
        </button>

        <button
            class="action-btn print-btn"
            onclick="sendDirectPrintToESP32()">
            🖨 چاپ مستقیم با ESP32
        </button>

        <button
            class="action-btn pdf-btn"
            onclick="savePDF()">

            <span class="pdf-icon">📄</span>

            <span class="pdf-text">
                ذخیره PDF
                <small>نسخه دیجیتال</small>
            </span>

        </button>


        <button
            class="action-btn clear-btn"
            onclick="clearOrder()">

            پاک کردن سفارش

        </button>

    `;


    panel.appendChild(buttons);

    container.appendChild(panel);

}


/* =====================================================
   پاک کردن سفارش
===================================================== */

function clearOrder() {

    if (
        order.length === 0
    ) {

        return;

    }


    if (
        confirm(
            "آیا سفارش فعلی پاک شود؟"
        )
    ) {

        order = [];

        renderOrder();

    }

}


/* =====================================================
   ساخت محتوای رسید
===================================================== */

function createReceiptHTML() {

    const total =
        order.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    let itemsHTML = "";


    order.forEach(
        item => {

            const itemTotal =
                item.price *
                item.quantity;


            itemsHTML += `

                <div class="receipt-item">

                    <div class="item-name">
                        ${item.name}
                    </div>

                    <div class="item-qty">
                        ${toPersianNumber(item.quantity)}
                    </div>

                    <div class="item-price">
                        ${toPersianNumber(item.price)}
                    </div>

                    <div class="item-total">
                        ${toPersianNumber(itemTotal)}
                    </div>

                </div>

            `;

        }
    );


    const now =
        new Date();


    const date =
        toPersianNumber(
            now.toLocaleDateString(
                "fa-IR"
            )
        );


    const time =
        now.toLocaleTimeString(
            "fa-IR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    return `

        <div class="receipt">


            <div class="receipt-header">

                <div class="receipt-title">
                    ORCA CAFE
                </div>

                <div class="receipt-subtitle">
                    فاکتور
                </div>

            </div>


            <div class="receipt-info">

                <span>
                    تاریخ: ${date}
                </span>

                <span>
                    ساعت: ${time}
                </span>

            </div>


            <div class="receipt-line"></div>


            <div class="receipt-columns">

                <span class="column-name">
                    سفارش
                </span>

                <span>
                    تعداد
                </span>

                <span>
                    قیمت
                </span>

                <span>
                    مبلغ
                </span>

            </div>


            ${itemsHTML}


            <div class="receipt-line"></div>


            <div class="receipt-total">

                <span>
                    مبلغ کل
                </span>

                <span>
                    ${toPersianNumber(total)}
                </span>

            </div>


            <div class="receipt-line"></div>


            <div class="receipt-footer">

                از اینکه کافه اورکا را
                انتخاب کردید سپاسگزاریم

            </div>


        </div>

    `;

}


/* =====================================================
   چاپ فاکتور
===================================================== */

function printReceipt() {

    if (
        order.length === 0
    ) {

        alert(
            "ابتدا حداقل یک آیتم به سفارش اضافه کنید."
        );

        return;

    }


    openReceiptWindow();

}


/* =====================================================
   ذخیره / خروجی PDF
===================================================== */

function savePDF() {

    if (
        order.length === 0
    ) {

        alert(
            "ابتدا حداقل یک آیتم به سفارش اضافه کنید."
        );

        return;

    }


    openReceiptWindow();

}


/* =====================================================
   باز کردن رسید برای چاپ یا PDF
===================================================== */


function buildReceiptDocument() {
    return `
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>فاکتور ORCA CAFE</title>

            <style>
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap');

                * {
                    box-sizing: border-box;
                }

                html, body {
                    margin: 0;
                    padding: 0;
                    background: white;
                    color: #111;
                    font-family: "Vazirmatn", Arial, Tahoma, sans-serif;
                }

                body {
                    width: 100%;
                }

                .receipt {
                    width: 72mm;
                    margin: 0 auto;
                    padding: 1mm 2mm 4mm;
                    font-size: 11px;
                }

                .receipt-header {
                    text-align: center;
                    margin-bottom: 5mm;
                }

                .receipt-title {
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: .5px;
                }

                .receipt-subtitle {
                    font-size: 12px;
                    margin-top: 2mm;
                }

                .receipt-info {
                    display: flex;
                    justify-content: space-between;
                    gap: 5px;
                    font-size: 9px;
                    margin-bottom: 3mm;
                }

                .receipt-line {
                    border-top: 1px dashed #555;
                    margin: 3mm 0;
                }

                .receipt-columns,
                .receipt-item {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) 11mm 17mm 17mm;
                    column-gap: 1mm;
                    align-items: center;
                }

                .receipt-columns {
                    font-weight: 700;
                    font-size: 9px;
                    margin-bottom: 2mm;
                }

                .receipt-columns .column-name {
                    text-align: right;
                }

                .receipt-columns span:not(.column-name) {
                    text-align: center;
                }

                .receipt-item {
                    font-size: 10px;
                    margin-bottom: 2mm;
                }

                .item-name {
                    text-align: right;
                    overflow-wrap: anywhere;
                }

                .item-qty,
                .item-price,
                .item-total {
                    text-align: center;
                    white-space: nowrap;
                }

                .item-total {
                    font-weight: 600;
                }

                .receipt-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 700;
                }

                .receipt-footer {
                    text-align: center;
                    font-size: 10px;
                    line-height: 1.8;
                    margin-top: 6mm;
                }

                @page {
                    size: 80mm auto;
                    margin: 0;
                }

                @media print {
                    html, body {
                        width: 80mm;
                        margin: 0;
                        padding: 0;
                    }

                    .receipt {
                        width: 72mm;
                        margin: 0 auto;
                    }
                }
            </style>
        </head>
        <body>
            ${createReceiptHTML()}
        </body>
        </html>
    `;
}


function openReceiptWindow() {
    const printWindow = window.open("", "_blank", "width=420,height=700");

    if (!printWindow) {
        alert("پنجره چاپ توسط مرورگر مسدود شده است.");
        return;
    }

    printWindow.document.open();
    printWindow.document.write(buildReceiptDocument());
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
    }, 400);
}



async function sendDirectPrintToBridge() {
    if (!Array.isArray(order) || order.length === 0) {
        alert("ابتدا یک محصول به سفارش اضافه کنید.");
        return;
    }

    const BRIDGE_URL = "http://192.168.1.102:8766/print-image";
    const TEST_TOKEN = "orca-test-2026";

    try {
        // از همان قالب کامل چاپ معمولی استفاده می‌کنیم.
        const html = buildReceiptDocument();
        const chunkStartTime = performance.now();
        const response = await fetch(BRIDGE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Print-Token": TEST_TOKEN
            },
            body: JSON.stringify({ html })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "HTTP " + response.status);
        }

        console.log("Direct print result:", result);
        alert("درخواست چاپ مستقیم ارسال شد.");

    } catch (error) {
        console.error("Direct print failed:", error);
        alert(
            "چاپ مستقیم انجام نشد.\n" +
            "اتصال شبکه، پل چاپ و Console مرورگر را بررسی کنید."
        );
    }
}

async function sendDirectPrintToESP32() {
    if (!Array.isArray(order) || order.length === 0) {
        alert("ابتدا یک محصول به سفارش اضافه کنید.");
        return;
    }

    const ESP32_URL = "https://192.168.1.103";
    const MAX_ROWS_PER_CHUNK = 60;

    let iframe = null;

    try {
        // بارگذاری html2canvas در صورت نیاز
        if (typeof window.html2canvas !== "function") {
            await new Promise((resolve, reject) => {
                const script = document.createElement("script");

                script.src =
                    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

                script.onload = () => {
                    if (typeof window.html2canvas === "function") {
                        resolve();
                    } else {
                        reject(new Error(
                            "کتابخانه بارگذاری شد اما تابع آن در دسترس نیست."
                        ));
                    }
                };

                script.onerror = () => reject(new Error(
                    "بارگذاری html2canvas ناموفق بود."
                ));

                document.head.appendChild(script);
            });
        }

        // ساخت سند رسید با قالب فعلی
        iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.left = "-10000px";
        iframe.style.top = "0";
        iframe.style.width = "272px";
        iframe.style.height = "1000px";
        iframe.style.border = "0";
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument;
        doc.open();
        doc.write(buildReceiptDocument());
        doc.close();

        // منتظر آماده‌شدن فونت‌ها و محتوای رسید می‌مانیم
        if (doc.fonts && doc.fonts.ready) {
            await doc.fonts.ready;
        }

        const receipt = doc.querySelector(".receipt");

        if (!receipt) {
            throw new Error("بخش رسید در سند پیدا نشد.");
        }

        const canvas = await window.html2canvas(receipt, {
            backgroundColor: "#ffffff",
            scale: 2,
            useCORS: true,
            logging: false
        });

        console.log("Receipt element:", receipt.getBoundingClientRect());
        console.log("Canvas size:", canvas.width, canvas.height);
        
        const ctx = canvas.getContext("2d");
        const width = canvas.width;

        // افزودن فضای سفید در پایین رسید
        const EXTRA_BOTTOM_ROWS = 120;
        const height = canvas.height + EXTRA_BOTTOM_ROWS;
        const widthBytes = Math.ceil(width / 8);

        const extendedCanvas = document.createElement("canvas");
        extendedCanvas.width = width;
        extendedCanvas.height = height;

        const extendedCtx = extendedCanvas.getContext("2d");
        extendedCtx.fillStyle = "#ffffff";
        extendedCtx.fillRect(0, 0, width, height);
        extendedCtx.drawImage(canvas, 0, 0);

        const pixels = extendedCtx.getImageData(
            0, 0, width, height
        ).data;
        
        let firstInkRow = -1;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const p = (y * width + x) * 4;

                const gray =
                    0.299 * pixels[p] +
                    0.587 * pixels[p + 1] +
                    0.114 * pixels[p + 2];

                if (gray < 160) {
                    firstInkRow = y;
                    break;
                }
            }

            if (firstInkRow !== -1) break;
        }

        console.log("First printed content row:", firstInkRow);
        console.log(
            "Top white space:",
            firstInkRow / 2,
            "CSS pixels"
        );

        console.log("Suggested top crop:", Math.max(0, firstInkRow - 7));

        if (widthBytes > 255) {
            throw new Error("عرض تصویر برای این فرمان چاپ بیش از حد است.");
        }
        
        // حذف فضای سفید اضافی از بالای تصویر
        const TOP_CROP_ROWS = Math.max(0, firstInkRow - 7);
        const croppedHeight = height - TOP_CROP_ROWS;

        // تبدیل تصویر برش‌خورده به داده سیاه‌وسفید ESC/POS
        const raster = new Uint8Array(widthBytes * croppedHeight);

        for (let y = 0; y < croppedHeight; y++) {
            const sourceY = y + TOP_CROP_ROWS;

            for (let x = 0; x < width; x++) {
                const p = (sourceY * width + x) * 4;
                const gray =
                    0.299 * pixels[p] +
                    0.587 * pixels[p + 1] +
                    0.114 * pixels[p + 2];

                if (gray < 160) {
                    const index = y * widthBytes + (x >> 3);
                    raster[index] |= 0x80 >> (x & 7);
                }
            }
        }

        console.log("Top rows removed:", TOP_CROP_ROWS);
        console.log("New raster height:", croppedHeight);

        // شروع نشست چاپ در ESP32
        const printStartTime = performance.now();
        const startResponse = await fetch(
            `${ESP32_URL}/print-start`,
            { method: "POST" }
        );
        const startElapsed = Math.round(
             performance.now() - printStartTime
         );
       
        if (!startResponse.ok) {
            throw new Error(
                `خطا در شروع نشست چاپ: HTTP ${startResponse.status} — ` +
                await startResponse.text()
            );
        }

        // ارسال تصویر در قطعات کوچک‌تر از محدودیت ESP32
        const chunkTimings = [];
        for (let startY = 0; startY < croppedHeight; startY += MAX_ROWS_PER_CHUNK) {
            const rows = Math.min(
                MAX_ROWS_PER_CHUNK,
                croppedHeight - startY
            );

            const bytes = [
                0x1D, 0x76, 0x30, 0x00,
                widthBytes & 0xFF,
                (widthBytes >> 8) & 0xFF,
                rows & 0xFF,
                (rows >> 8) & 0xFF
            ];

            for (let y = startY; y < startY + rows; y++) {
                const offset = y * widthBytes;

                for (let x = 0; x < widthBytes; x++) {
                    bytes.push(raster[offset + x]);
                }
            }


            const hex = bytes
                .map(b => b.toString(16).padStart(2, "0"))
                .join("");
            console.log("HEX chunk length:", hex.length);
            const chunkStartTime = performance.now();
            const response = await fetch(
                ESP32_URL + "/print-hex",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: hex
                }
            );

            const result = await response.text();
            chunkTimings.push(
               Math.round(performance.now() - chunkStartTime)
            );
            console.log(
                "Chunk transfer time:",
                (performance.now() - chunkStartTime).toFixed(0),
                "ms"
            );
            if (!response.ok) {
                throw new Error(
                    "خطا در ارسال قطعه تصویر: HTTP " +
                    response.status + " — " + result
                );
            }

            console.log(
                "ESP32 image chunk sent:",
                startY, "/", croppedHeight
            );
        }

        
        const cutResponse = await fetch(
            ESP32_URL + "/print-end",
            {
                method: "POST"
            }
        );

        
        const cutResult = await cutResponse.text();

        if (!cutResponse.ok) {
            throw new Error(
                "خطا در پایان نشست و برش: HTTP " +
                cutResponse.status + " — " + cutResult
            );
        }


        alert(
             "چاپ به پایان رسید.\n\n" +
             "زمان شروع نشست: " + startElapsed + " ms\n\n" +
             "تعداد قطعات: " + chunkTimings.length + "\n" +
             "زمان ارسال هر قطعه (ms):\n" +
             chunkTimings.map((t, i) =>
                 (i + 1) + ": " + t + " ms"
             ).join("\n")
         );

    
    } catch (error) {
        console.error("ESP32 print failed:", error);

        // اگر چاپ شروع شده باشد، تلاش می‌کنیم نشست را لغو کنیم.
        try {
            await fetch(
                `${ESP32_URL}/print-abort`,
                { method: "POST" }
            );
        } catch (abortError) {
            console.error(
                "ESP32 print abort failed:",
                abortError
            );
        }

        alert(
            "چاپ با ESP32 انجام نشد.\n" +
            error.message +
            "\nConsole مرورگر را برای جزئیات بررسی کنید."
        );
    } finally {
        if (iframe) {
            iframe.remove();
        }
    }

}

/* =====================================================
   شروع برنامه
===================================================== */


/*
   ابتدا صفحه قفل را بررسی می‌کنیم.
*/

initializeLockScreen();


/*
   سپس محتوای POS آماده می‌شود.
   این بخش حتی هنگام قفل بودن اجرا می‌شود،
   اما خود POS تا زمان ورود نمایش داده نمی‌شود.
*/

renderCategories();

renderMenu();

renderOrder();
