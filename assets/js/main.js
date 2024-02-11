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

new Carousel(document.querySelector(".team__list"), {0: 2, 768: 3}, {arrows: false, nav: true});


