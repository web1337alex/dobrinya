class Carousel {
    constructor(element, configuration, options = {}) {
        // Проверяем, что элемент не null и не undefined
        if(element && element instanceof HTMLElement) {
            this.carouselElement = element;
            const defaultOptions = {
                arrows: true,
                nav: true
            };

            this.options = { ...defaultOptions, ...options };
            this.configuration = configuration;

            this.resizeHandler = this.onWindowResize.bind(this);
            window.addEventListener("resize", this.resizeHandler);

            this.handleTouchStart = this.handleTouchStart.bind(this);
            this.handleTouchMove = this.handleTouchMove.bind(this);
            this.handleTouchEnd = this.handleTouchEnd.bind(this);

            this.startX = 0;
            this.currentX = 0;
            this.isTouching = false;

            this.init();
        } else {
            // Если элемент не существует, не выполняем инициализацию
            console.log("Carousel element is not valid. Initialization aborted.");
            return;
        }
    }

    init() {
        // Проверяем, что .carousel__slides существует внутри элемента карусели
        let check = this.carouselElement.querySelector('.carousel__slides');
        if (check) {
            this.slides = this.carouselElement.querySelectorAll('.carousel__slide');
            this.totalSlides = this.slides.length;
            this.slidesToShow = this.calculateSlidesToShow();
            this.calculateTotalGroups();
            this.currentSlide = 0;

            if (this.options.arrows) {
                // Создание и добавление кнопок навигации
                const leftButton = document.createElement('button');
                leftButton.className = 'carousel__button carousel__button--left';
                leftButton.setAttribute('aria-label', 'Previous slide');
                leftButton.innerHTML = '&#10094;';

                const rightButton = document.createElement('button');
                rightButton.className = 'carousel__button carousel__button--right';
                rightButton.setAttribute('aria-label', 'Next slide');
                rightButton.innerHTML = '&#10095;';

                this.carouselElement.appendChild(leftButton);
                this.carouselElement.appendChild(rightButton);

                this.leftClickHandler = () => this.moveSlide(-1);
                this.rightClickHandler = () => this.moveSlide(1);

                leftButton.addEventListener('click', this.leftClickHandler);
                rightButton.addEventListener('click', this.rightClickHandler);
            }

            this.createIndicators();
            this.updateCarousel();

            this.carouselElement.addEventListener('touchstart', this.handleTouchStart, { passive: true });
            this.carouselElement.addEventListener('mousedown', this.handleTouchStart);
        } else {
            console.warn("Carousel slides element is not found. Initialization aborted.");
        }
    }

    onWindowResize() {
        this.slidesToShow = this.calculateSlidesToShow();
        this.updateCarousel();
    }

    calculateSlidesToShow() {
        const screenSizes = Object.keys(this.configuration).map(size => parseInt(size)).sort((a, b) => a - b);
        let currentScreenSize = screenSizes[0];
        for (let size of screenSizes) {
            if (window.innerWidth >= size) {
                currentScreenSize = size;
            }
        }
        this.slidesToShow = this.configuration[currentScreenSize];
        this.calculateTotalGroups();
        return this.slidesToShow;
    }

    calculateTotalGroups() {
        this.totalGroups = Math.ceil(this.totalSlides / this.slidesToShow);
    }

    createIndicators() {
        if (this.options.nav) {
            let indicateElements = this.carouselElement.querySelectorAll('.carousel__indicator');
            indicateElements.forEach(indicateElement => indicateElement.remove());

            this.indicatorsContainer = document.createElement('div');
            this.indicatorsContainer.className = 'carousel__indicators';
            this.indicatorsContainer.setAttribute('aria-label', 'Carousel Navigation');

            for (let i = 0; i < this.totalGroups; i++) {
                const indicator = document.createElement('button');
                indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
                indicator.classList.add('carousel__indicator');
                if (i === 0) indicator.classList.add('carousel__indicator--active');
                indicator.addEventListener('click', () => this.moveToGroup(i));
                this.indicatorsContainer.appendChild(indicator);
            }

            this.carouselElement.appendChild(this.indicatorsContainer);
        }
    }

    updateIndicators() {
        if (this.options.nav) {
            const indicators = this.indicatorsContainer.querySelectorAll('.carousel__indicator');
            indicators.forEach((indicator, index) => {
                if (index === Math.floor(this.currentSlide / this.slidesToShow)) {
                    indicator.classList.add('carousel__indicator--active');
                } else {
                    indicator.classList.remove('carousel__indicator--active');
                }
            });
        }
    }

    updateCarousel() {
        let newTransformValue = -100 * (this.currentSlide / this.slidesToShow);
        this.carouselElement.querySelector('.carousel__slides').style.transform = `translateX(${newTransformValue}%)`;
        this.updateIndicators();
    }

    moveSlide(direction) {
        this.currentSlide = (this.currentSlide + direction * this.slidesToShow + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }

    moveToGroup(groupIndex) {
        this.currentSlide = groupIndex * this.slidesToShow;
        this.updateCarousel();
    }

    handleTouchStart(event) {
        this.startX = event.touches ? event.touches[0].pageX : event.pageX;
        this.currentX = this.startX;
        this.isTouching = true;

        document.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        document.addEventListener('mousemove', this.handleTouchMove);
        document.addEventListener('mouseup', this.handleTouchEnd);
    }

    handleTouchMove(event) {
        if (!this.isTouching) return;
        this.currentX = event.touches ? event.touches[0].pageX : event.pageX;
        event.preventDefault(); // Prevent scrolling when touching
    }

    handleTouchEnd(event) {
        if (!this.isTouching) return;
        this.isTouching = false;

        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
        document.removeEventListener('mousemove', this.handleTouchMove);
        document.removeEventListener('mouseup', this.handleTouchEnd);

        let shift = this.startX - this.currentX;
        if (Math.abs(shift) > 30) {
            this.moveSlide(shift > 0 ? 1 : -1);
        }
    }

    // New method to safely destroy the carousel instance
    destroy() {
        window.removeEventListener("resize", this.resizeHandler);
        this.carouselElement.removeEventListener('touchstart', this.handleTouchStart);
        this.carouselElement.removeEventListener('mousedown', this.handleTouchStart);

        // Удаление обработчиков для кнопок, если они были созданы
        if (this.options.arrows) {
            const leftButton = this.carouselElement.querySelector('.carousel__button--left');
            const rightButton = this.carouselElement.querySelector('.carousel__button--right');
            if (leftButton) leftButton.removeEventListener('click', this.leftClickHandler);
            if (rightButton) rightButton.removeEventListener('click', this.rightClickHandler);
        }

        // Очистка созданных динамически элементов индикаторов и кнопок
        if (this.indicatorsContainer) {
            this.indicatorsContainer.remove();
        }
        const arrows = this.carouselElement.querySelectorAll('.carousel__button');
        arrows.forEach(arrow => arrow.remove());

        // Очистка ссылок на DOM элементы для предотвращения утечек памяти
        this.carouselElement = null;
        this.slides = null;
        this.indicatorsContainer = null;
    }
}