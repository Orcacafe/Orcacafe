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

    const container =
        document.getElementById("categoryTabs");

    container.innerHTML = "";

    categories.forEach((category, index) => {

        const button =
            document.createElement("button");

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

    const container =
        document.getElementById("menuContainer");

    const category =
        categories[currentCategory];

    container.innerHTML = "";

    const panel =
        document.createElement("div");

    panel.className = "order-panel";


    const title =
        document.createElement("div");

    title.className = "order-title";

    title.textContent =
        category.icon + "  " + category.title;

    panel.appendChild(title);


    category.items.forEach((item, index) => {

        const name = item[0];
        const price = item[1];
        const special = item[2];

        const row =
            document.createElement("div");

        row.className = "pos-item";

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

    const name =
        item[0];

    const price =
        Number(
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

    title.textContent =
        "🧾 سفارش جاری";

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
            class="action-btn pdf-btn"
            onclick="savePDF()">

            📄 ذخیره PDF

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
   ساخت محتوای رسید
===================================================== */

function createReceiptHTML() {

    const total =
        order.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    let itemsHTML = "";


    order.forEach(item => {

        const itemTotal =
            item.price * item.quantity;


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

    });


    const now =
        new Date();


    const date =
        toPersianNumber(
            now.toLocaleDateString("fa-IR")
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
                    فاکتور فروش
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
                    کالا
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

    if (order.length === 0) {

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

    if (order.length === 0) {

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

function openReceiptWindow() {

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=420,height=700"
        );


    if (!printWindow) {

        alert(
            "پنجره چاپ توسط مرورگر مسدود شده است."
        );

        return;
    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html lang="fa" dir="rtl">

        <head>

            <meta charset="UTF-8">
            <link
               href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap"
               rel="stylesheet">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0">


            <title>
                فاکتور ORCA CAFE
            </title>


            <style>
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap');
                * {
                    box-sizing:border-box;
                }


                html,
                body {

                    margin:0;
                    padding:0;

                    background:white;

                    color:#111;

                    font-family:
                        "Vazirmatn",
                        Arial,
                        Tahoma,
                        sans-serif;

                }


                body {
                    width:100%;
                }


                .receipt {

                    width:72mm;

                    margin:0 auto;

                    padding:4mm 2mm;

                    font-size:11px;

                }


                .receipt-header {

                    text-align:center;

                    margin-bottom:5mm;

                }


                .receipt-title {

                    font-size:20px;

                    font-weight:700;

                    letter-spacing:.5px;

                }


                .receipt-subtitle {

                    font-size:12px;

                    margin-top:2mm;

                }


                .receipt-info {

                    display:flex;

                    justify-content:space-between;

                    gap:5px;

                    font-size:9px;

                    margin-bottom:3mm;

                }


                .receipt-line {

                    border-top:
                        1px dashed #555;

                    margin:
                        3mm 0;

                }


                .receipt-columns,
                .receipt-item {

                    display:grid;

                    grid-template-columns:
                        minmax(0, 1fr)
                        11mm
                        17mm
                        17mm;

                    column-gap:1mm;

                    align-items:center;

                }


                .receipt-columns {

                    font-weight:700;

                    font-size:9px;

                    margin-bottom:2mm;

                }


                .receipt-item {

                    font-size:10px;

                    margin-bottom:2mm;

                }


                .item-name {

                    text-align:right;

                    overflow-wrap:anywhere;

                }


                .item-qty,
                .item-price,
                .item-total {

                    text-align:center;
                    white-space:nowrap;

                }


                .item-total {

                    font-weight:600;

                }


                .receipt-total {

                    display:flex;

                    justify-content:space-between;

                    align-items:center;

                    font-size:14px;

                    font-weight:700;

                }


                .receipt-footer {

                    text-align:center;

                    font-size:10px;

                    line-height:1.8;

                    margin-top:6mm;

                }


                @page {

                    size:80mm auto;

                    margin:0;

                }


                @media print {

                    html,
                    body {

                        width:80mm;

                        margin:0;

                        padding:0;

                    }


                    .receipt {

                        width:72mm;

                        margin:0 auto;

                    }

                }

            </style>

        </head>


        <body>

            ${createReceiptHTML()}

        </body>

        </html>

    `);


    printWindow.document.close();

    printWindow.focus();


    setTimeout(() => {

        printWindow.print();

    }, 400);

}


/* =====================================================
   شروع برنامه
===================================================== */

renderCategories();

renderMenu();

renderOrder();
