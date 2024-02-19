document.querySelector(".header__burger--icon").addEventListener("click", function () {
  document.querySelector(".header__burger--icon").classList.toggle("active");
  document.querySelector(".header__nav").classList.toggle("active");
  document.querySelector("body").classList.toggle("lock");
});

document.addEventListener('DOMContentLoaded', function() {
    // Перенос заголовка для мобильных устройств
    const moveTitleForMobile = () => {
        const advantages = document.querySelector('.advantages');
        if (advantages && window.innerWidth < 768) {
            const advantagesTitle = advantages.querySelector('.advantages__content--title');
            if (advantagesTitle) {
                const newRow = document.createElement('div');
                newRow.classList.add('row');
                newRow.appendChild(advantagesTitle.cloneNode(true)); // Клонируем заголовок
                advantagesTitle.remove(); // Удаляем оригинальный заголовок после клонирования

                const container = advantages.querySelector('.container');
                if (container) {
                    container.insertBefore(newRow, container.firstChild);
                }
            }
        }
    };

    // Переносим заголовок при загрузке страницы
    moveTitleForMobile();

    // Обработчик кликов для переключения вкладок
    const tabsContainer = document.querySelector('.advantages');
    if (tabsContainer) {
        tabsContainer.addEventListener('click', function(e) {
            const target = e.target.closest('.tab-item'); // Используем closest для увеличения гибкости
            if (target) {
                const dataItem = target.getAttribute('data-item');
                const tabItems = document.querySelectorAll('.advantages .tab-item');
                const tabContents = document.querySelectorAll('.advantages .tab-content');

                tabItems.forEach(item => item.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                target.classList.add('active');
                document.querySelectorAll(`.advantages .tab-content[data-tab="${dataItem}"]`).forEach(item => item.classList.add('active'));
            }
        });
    }
});

new Carousel(document.querySelector(".team__list-1"), {0: 2, 768: 3}, {arrows: false, nav: true});
new Carousel(document.querySelector(".team__list-2"), {0: 2, 768: 2}, {arrows: true, nav: true});

document.addEventListener('DOMContentLoaded', () => {
    // Получаем контейнер для .reviews__box--row и прокручиваем его к середине
    let reviewsContainer = document.querySelector('.reviews__box--container');
    if (reviewsContainer) {
        let scrollTo = (reviewsContainer.scrollWidth - reviewsContainer.offsetWidth) / 2;
        reviewsContainer.scrollLeft = scrollTo;
    }

    // Добавляем обработчики событий для стрелок прокрутки
    document.querySelectorAll('.reviews__box--arrow').forEach(arrow => {
        arrow.addEventListener('click', function(e) {
            let scrollAmount = 70; // количество пикселей для прокрутки
            if (e.target.closest('.reviews__box--arrow').classList.contains('left')) {
                reviewsContainer.scrollLeft -= scrollAmount;
            } else if (e.target.closest('.reviews__box--arrow').classList.contains('right')) {
                reviewsContainer.scrollLeft += scrollAmount;
            }
        });
    });
});

document.querySelectorAll('.faqSec__items--item--title').forEach(item => {
    item.addEventListener('click', function() {
        item.closest('.faqSec__items--item').classList.toggle('active');
    });
});










