/**
 * Add navigation buttons to scroll snap container
 *
 * @param {*} element The container element.
 */

let settings = {
    container: '.scroll-snap-container',
    wrapper: '.scroll-snap-wrapper',
    elementSelector: '.scroll-snap-container li',
    previousSelector: '.scroll-snap-nav-previous',
    nextSelector: '.scroll-snap-nav-next',
    addControls: true,
    paginated: true,
}

let elements = [];
let visibleElements = 0;
let activeIndex = 0;
let throttleTimer;

/*
 * A basic throttle function, used to limit function calls in resize event.
 */
const throttle = (callback, time) => {
    if (throttleTimer) return;
    throttleTimer = true;
    setTimeout(() => {
        callback();
        throttleTimer = false;
    }, time);
}

/*
 * Check if the passed element is currently visible in the viewport.
 */
const elementIsVisibleInViewport = (element) => {
    const { top, left, bottom, right } = element.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

/*
 * Set up initial functionality.
 */
const start = () => {
    elements = document.querySelectorAll(settings.elementSelector);

    if (settings.addControls) {
        setUpButtons();
    }

    attachNavHandlers();
    calculateVisibleElements();

    window.addEventListener('resize', () => {
        throttle(calculateVisibleElements, 250);
    }, true);
}

/*
 * Create and add navigation buttons to container.
 */
const setUpButtons = () => {
    const container = document.querySelector(settings.container);

    const navigation = document.createElement('div');
    navigation.classList.add('scroll-snap-nav');

    const previousButton = document.createElement('button');
    previousButton.setAttribute('type', 'button');
    previousButton.classList.add('scroll-snap-nav-previous');
    previousButton.textContent = 'Previous';

    const nextButton = document.createElement('button');
    nextButton.setAttribute('type', 'button');
    nextButton.classList.add('scroll-snap-nav-next');
    nextButton.textContent = "Next";

    navigation.appendChild(previousButton);
    navigation.appendChild(nextButton);

    container.appendChild(navigation);
}

/*
 * Give functionality to navigation buttons, whether default or custom.
 */
const attachNavHandlers = () => {
    document.querySelector(settings.previousSelector).addEventListener('click', scrollToPrevPage);
    document.querySelector(settings.nextSelector).addEventListener('click', scrollToNextPage);
}

/*
 * Determine if the user has reduced motion enabled.
 */
const hasReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/*
 * Check to see how many elements are currently visible in the viewport.
 */
const calculateVisibleElements = () => {
    let count = 0;

    elements.forEach((element) => {
        const isVisible = elementIsVisibleInViewport(element);
        if (isVisible) {
            count++;
        }
    });

    visibleElements = count;
}

/*
 * Scroll the container to the next set of elements.
 */
const scrollToNextPage = () => {
    if (activeIndex < elements.length - 1) {
        elements[Math.min(activeIndex + visibleElements, elements.length - 1)].scrollIntoView({
            // Only do smooth scroll if reduced motion is on
            behavior: hasReducedMotion() ? undefined : 'smooth',
            inline: 'start',
        })
        activeIndex = activeIndex + visibleElements;
    }
}

/*
 * Scroll the container to the previous set of elements.
 */
const scrollToPrevPage = () => {
    if (activeIndex > 0) {
        elements[Math.max(0, activeIndex - visibleElements)].scrollIntoView({
            // Only do smooth scroll if reduced motion is on
            behavior: hasReducedMotion() ? undefined : 'smooth',
            inline: 'start',
        })
        activeIndex = activeIndex - visibleElements;
    }
}

/*
 * Override any default settings.
 */
const updateSettings = (newSettings) => {
    if (newSettings && newSettings !== settings) {
        settings = {
            ...settings,
            ...newSettings,
        };
    }
}

/*
 * Get things going.
 */
const init = (settings) => {
    updateSettings(settings);

    start();
}

init();