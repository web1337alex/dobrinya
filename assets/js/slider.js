class Carousel {
    constructor(element, configuration, options = {}) {
        const defaultOptions = {
            arrows: true,
            nav: true
        };

        this.options = {...defaultOptions, ...options};
        this.carouselElement = element;
        this.configuration = configuration;

        this.resizeHandler = this.onWindowResize.bind(this);
        window.addEventListener("resize", this.resizeHandler);

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        this.startX = 0;
        this.currentX = 0;

        this.init();
    }

    onWindowResize() {
        this.init();
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

            for (let i = 0; i < this.totalGroups; i++) {
                const indicator = document.createElement('div');
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
                if (index === this.currentSlide / this.slidesToShow) {
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
        this.slidesToShow = this.calculateSlidesToShow();
        this.currentSlide = (this.currentSlide + direction * this.slidesToShow + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }

    moveToGroup(groupIndex) {
        this.slidesToShow = this.calculateSlidesToShow();
        this.currentSlide = groupIndex * this.slidesToShow;
        this.updateCarousel();
    }

    handleTouchStart(event) {
        this.startX = event.touches ? event.touches[0].pageX : event.pageX;
        this.currentX = this.startX;

        this.carouselElement.addEventListener('touchmove', this.handleTouchMove);
        this.carouselElement.addEventListener('touchend', this.handleTouchEnd);
        this.carouselElement.addEventListener('mousemove', this.handleTouchMove);
        this.carouselElement.addEventListener('mouseup', this.handleTouchEnd);
    }

    handleTouchMove(event) {
        this.currentX = event.touches ? event.touches[0].pageX : event.pageX;
    }

    handleTouchEnd(event) {
        this.carouselElement.removeEventListener('touchmove', this.handleTouchMove);
        this.carouselElement.removeEventListener('touchend', this.handleTouchEnd);
        this.carouselElement.removeEventListener('mousemove', this.handleTouchMove);
        this.carouselElement.removeEventListener('mouseup', this.handleTouchEnd);

        let shift = this.startX - this.currentX;
        if (Math.abs(shift) > 30) {
            this.moveSlide(shift > 0 ? 1 : -1);
        }
    }

    init() {
        let check = document.querySelectorAll('.carousel__slides');
        if (check.length) {
            this.slides = this.carouselElement.querySelectorAll('.carousel__slide');
            this.totalSlides = this.slides.length;
            this.slidesToShow = this.calculateSlidesToShow();
            this.calculateTotalGroups();
            this.currentSlide = 0;

            if (this.options.arrows) {
                const leftButton = document.createElement('button');
                leftButton.className = 'carousel__button carousel__button--left';
                leftButton.innerHTML = '&#10094;';

                const rightButton = document.createElement('button');
                rightButton.className = 'carousel__button carousel__button--right';
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

            this.carouselElement.addEventListener('touchstart', this.handleTouchStart);
            this.carouselElement.addEventListener('mousedown', this.handleTouchStart);
        }
        }
}