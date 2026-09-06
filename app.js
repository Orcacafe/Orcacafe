/* ======================================================
   ORCA CAFE
   App Controller
====================================================== */

const tabs = document.getElementById("categoryTabs");
const container = document.getElementById("menuContainer");

let activeIndex = 0;

/* ساخت دکمه‌های بالا */
function createTabs(){

    tabs.innerHTML = "";

    categories.forEach((cat,index)=>{

        const btn = document.createElement("button");

        btn.innerHTML = `${cat.icon} ${cat.title}`;

        if(index===activeIndex)
            btn.classList.add("active");

        btn.onclick = ()=>{

            activeIndex = index;

            createTabs();

            renderCategory();

        };

        tabs.appendChild(btn);

    });

}

/* ساخت کارت منو */
function renderCategory(){

    const cat = categories[activeIndex];

    let html = `

    <div class="menu-card">

        <div class="menu-title">

            ${cat.icon} ${cat.title}

        </div>

    `;

    cat.items.forEach(item=>{

        const name = item[0];

        const price = item[1];

        const badge = item[2] || "";

        html += `

        <div class="menu-row">

            <div class="item-name">

                ${
                    badge
                    ? `<span class="badge">${badge}</span>`
                    : ""
                }

                ${name}

            </div>

            <div class="price">${price}</div>

        </div>

        `;

    });

    html += "</div>";

    container.innerHTML = html;

}

/* شروع برنامه */
createTabs();

renderCategory();

/* اسکرول نرم تا دکمه فعال */
function scrollActiveTab(){

    const active = document.querySelector(".tabs .active");

    if(active){

        active.scrollIntoView({

            behavior:"smooth",

            inline:"center",

            block:"nearest"

        });

    }

}

/* هنگام تغییر دسته */
tabs.addEventListener("click",()=>{

    setTimeout(scrollActiveTab,50);

});