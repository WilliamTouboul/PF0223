const cursor = document.getElementById('cursor');
const brand = document.querySelector('.brand');
const nav_items = document.querySelectorAll('.nav_item');
const navbar_plus = document.querySelector('#navbar_plus')

/* --------------------------------- CURSOR --------------------------------- */
window.addEventListener('mousemove', function (e) {
    let x = e.pageX;
    let y = e.pageY;

    cursor.style.top = y + 'px';
    cursor.style.left = x + 'px';
})


/* ---------------------------------- HOVER --------------------------------- */
brand.addEventListener('mouseover', function () {
    reduce_cursor();
})

brand.addEventListener('mouseout', function () {
    reset_cursor()
})

nav_items.forEach((item, index) => {
    item.addEventListener('mouseover', function () {
        reduce_cursor();
    })

    item.addEventListener('mouseout', function () {
        reset_cursor()
    })
})

navbar_plus.addEventListener('mouseover', function () {
    reduce_cursor();
})
navbar_plus.addEventListener('mouseout', function () {
    reset_cursor();
})

function reduce_cursor() {
    cursor.style.height = 0 + 'px';
    cursor.style.width = 0 + 'px';
}

function reset_cursor() {
    cursor.style.height = 2 + 'rem';
    cursor.style.width = 2 + 'rem';
    cursor.style.backgroundColor = 'var(--black)';
}




/* ---------------------------------- CLOCK --------------------------------- */
function updateClock() {
    const hour = document.querySelector('.hour')
    const today = document.querySelector('.today')
    const now = new Date();
    hour.innerHTML = now.toLocaleTimeString();
    today.innerHTML = now.toLocaleDateString();
}

setInterval(updateClock, 1000);