/**
 * Add navigation buttons to scroll snap container
 *
 * @param {*} element The container element.
 */
class ScrollSnapControls {
    constructor(container) {
        this.activeIndex = 0;
        this.rowLength = 0;
        this.galleryWrapper = container.querySelector(".gallery-wrapper");
        this.elements = [...this.galleryWrapper.querySelectorAll("li")];

        // Establish initial row length value.
        this.calculateRowLength();

        // Apply event listener to recalculate row length if the viewport width changes.
        window.addEventListener('resize', this.calculateRowLength.bind(this));

        // Set up observer.
        this.setUpObserver();

        // Apply event listeners to navigation buttons.
        container.querySelector('.gallery-nav-previous').addEventListener('click', this.scrollToPrevPage.bind(this));
        container.querySelector('.gallery-nav-next').addEventListener('click', this.scrollToNextPage.bind(this));
    }

    setUpObserver() {
        const observer = new IntersectionObserver(this.handleIntersect.bind(this), {
            root: galleryWrapper,
            rootMargin: "0px",
            threshold: 0.75
        });

        // Add event listener to each element.
        this.elements.forEach(el => {
            observer.observe(el);
        });
    }

    calculateRowLength() {
        this.rowLength = Math.floor(
            this.galleryWrapper.clientWidth /
            this.elements[0].clientWidth
        );
    };

    handleIntersect(entries) {
        const entry = entries.find(e => e.isIntersecting);
        if (entry) {
            const index = this.elements.findIndex(
                e => e === entry.target
            );
            this.activeIndex = index;
        }
    }

    scrollToNextPage() {
        if (this.activeIndex < this.elements.length - 1) {
            this.elements[Math.min(this.activeIndex + (this.rowLength * 2), this.elements.length - 1)].scrollIntoView({
                behavior: 'smooth'
            })
        }
    }

    scrollToPrevPage() {
        if (this.activeIndex > 0) {
            this.elements[Math.max(0, this.activeIndex - (this.rowLength * 2))].scrollIntoView({
                behavior: 'smooth'
            })
        }
    }
}
