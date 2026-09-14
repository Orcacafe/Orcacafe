/* =====================================================
   ORCA CAFE - POS
===================================================== */

let currentCategory = 0;
let order = [];


/* =====================================================
   تبدیل اعداد فارسی به انگلیسی
===================================================== */

function toEnglishNumber(str) {
    return String(str)
        .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}


/* =====================================================
   تبدیل اعداد انگلیسی به فارسی
===================================================== */

function toPersianNumber(str) {
    return String(str)
        .replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
}


/* =====================================================
   نمایش دسته بندی ها
===================================================== */

function renderCategories() {

    const container = document.getElementById("categoryTabs");

    container.innerHTML = "";

    categories.forEach((category, index) => {

        const button = document.createElement("button");

        button.className = "tab";
        
        if (index === currentCategory) {
            button.classList.add("active");
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
    });
}


/* =====================================================
   نمایش آیتم های منو
===================================================== */

function renderMenu() {

    const container = document.getElementById("menuContainer");

    const category = categories[currentCategory];

    container.innerHTML = "";

    const panel = document.createElement("div");

    panel.className = "order-panel";

    const title = document.createElement("div");

    title.className = "order-title";

    title.textContent =
        category.icon + "  " + category.title;

    panel.appendChild(title);


    category.items.forEach((item, index) => {

        const name = item[0];
        const price = item[1];
        const special = item[2];

        const row = document.createElement("div");

        row.className = "pos-item";

        row.innerHTML = `
            <div>
                <div class="pos-name">
                    ${name}
                    ${special ? `<span class="special-tag">${special}</span>` : ""}
                </div>
            </div>

            <div style="display:flex; align-items:center; gap:12px;">
                <span class="pos-price">
                    ${price}
                </span>

                <button class="add-btn">
                    +
                </button>
            </div>
        `;

        row.querySelector(".add-btn").onclick = () => {

            addToOrder(
                currentCategory,
                index
            );

        };

        panel.appendChild(row);

    });

    container.appendChild(panel);
}


/* =====================================================
   اضافه کردن آیتم به سفارش
===================================================== */

function addToOrder(categoryIndex, itemIndex) {

    const item =
        categories[categoryIndex].items[itemIndex];

    const name = item[0];
    const price = Number(
        toEnglishNumber(item[1])
    );

    const existing =
        order.find(
            x =>
                x.categoryIndex === categoryIndex &&
                x.itemIndex === itemIndex
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

    if (order[index].quantity > 1) {

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
        document.getElementById("orderPanel");

    container.innerHTML = "";

    const panel =
        document.createElement("div");

    panel.className = "order-panel";


    const title =
        document.createElement("div");

    title.className = "order-title";

    title.textContent = "🧾 سفارش جاری";

    panel.appendChild(title);


    if (order.length === 0) {

        const empty =
            document.createElement("div");

        empty.className = "empty-order";

        empty.textContent =
            "هنوز آیتمی به سفارش اضافه نشده است.";

        panel.appendChild(empty);

        container.appendChild(panel);

        return;
    }


    /* -----------------------------
       آیتم های سفارش
    ----------------------------- */

    order.forEach((item, index) => {

        const row =
            document.createElement("div");

        row.className = "pos-item";

        const itemTotal =
            item.price * item.quantity;

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

    });


    /* -----------------------------
       محاسبه مجموع
    ----------------------------- */

    const total =
        order.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    const totalRow =
        document.createElement("div");

    totalRow.className = "total-row";

    totalRow.innerHTML = `
        <span>مبلغ کل</span>
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

    buttons.className = "action-buttons";

    buttons.innerHTML = `

        <button
            class="action-btn print-btn"
            onclick="printReceipt()">
            🖨 چاپ فاکتور
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

    if (order.length === 0) {
        return;
    }

    if (
        confirm("آیا سفارش فعلی پاک شود؟")
    ) {

        order = [];

        renderOrder();

    }
}


/* =====================================================
   چاپ فاکتور
===================================================== */

function printReceipt() {

    if (order.length === 0) {

        alert("ابتدا حداقل یک آیتم به سفارش اضافه کنید.");

        return;
    }


    const total =
        order.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    let receiptHTML = `

        <div class="receipt">

            <div class="receipt-header">

                <img
                    src="assets/logo.png"
                    class="receipt-logo"
                    alt="ORCA">

                <div class="receipt-title">
                    ORCA CAFE
                </div>

                <div class="receipt-subtitle">
                    فاکتور فروش
                </div>

            </div>

            <div class="receipt-line"></div>

    `;


    order.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        receiptHTML += `

            <div class="receipt-item">

                <div>
                    ${item.name}
                </div>

                <div>
                    ${toPersianNumber(item.quantity)}
                    ×
                    ${toPersianNumber(item.price)}
                </div>

            </div>

            <div class="receipt-item-total">
                ${toPersianNumber(itemTotal)}
            </div>

        `;

    });


    receiptHTML += `

            <div class="receipt-line"></div>

            <div class="receipt-total">
                <span>مبلغ کل</span>
                <span>
                    ${toPersianNumber(total)}
                </span>
            </div>

            <div class="receipt-footer">
                از خرید شما سپاسگزاریم
            </div>

        </div>

    `;


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=400,height=600"
        );


    printWindow.document.write(`

        <!DOCTYPE html>

        <html lang="fa" dir="rtl">

        <head>

            <meta charset="UTF-8">

            <title>فاکتور ORCA CAFE</title>

            <link
                href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap"
                rel="stylesheet">

            <style>

                * {
                    box-sizing:border-box;
                }

                body {
                    margin:0;
                    padding:10px;
                    background:white;
                    color:#111;
                    font-family:Vazirmatn,Arial,sans-serif;
                }

                .receipt {
                    width:100%;
                    max-width:300px;
                    margin:auto;
                    font-size:13px;
                }

                .receipt-header {
                    text-align:center;
                }

                .receipt-logo {
                    width:70px;
                    height:auto;
                    margin-bottom:5px;
                }

                .receipt-title {
                    font-size:18px;
                    font-weight:700;
                }

                .receipt-subtitle {
                    font-size:13px;
                    margin-top:3px;
                }

                .receipt-line {
                    border-top:1px dashed #777;
                    margin:10px 0;
                }

                .receipt-item {
                    display:flex;
                    justify-content:space-between;
                    gap:10px;
                    margin-top:6px;
                }

                .receipt-item-total {
                    text-align:left;
                    margin-top:2px;
                    font-weight:600;
                }

                .receipt-total {
                    display:flex;
                    justify-content:space-between;
                    font-size:16px;
                    font-weight:700;
                    margin-top:8px;
                }

                .receipt-footer {
                    text-align:center;
                    margin-top:20px;
                    font-size:11px;
                }

                @media print {

                    body {
                        padding:0;
                    }

                    @page {
                        margin:4mm;
                    }

                }

            </style>

        </head>

        <body>

            ${receiptHTML}

        </body>

        </html>

    `);


    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {

        printWindow.print();

    }, 500);

}


/* =====================================================
   شروع برنامه
===================================================== */

renderCategories();

renderMenu();

renderOrder();
