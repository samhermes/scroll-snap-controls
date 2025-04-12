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
let intersectionObserver = null;
let activeIndex = 1;
let throttleTimer;

const throttle = (callback, time) => {
    if (throttleTimer) return;
    throttleTimer = true;
    setTimeout(() => {
        callback();
        throttleTimer = false;
    }, time);
}

const start = () => {
    intersectionObserver = new IntersectionObserver(handleIntersect, {
        root: document.querySelector(settings.selector),
        rootMargin: "0px",
        threshold: 1.0,
    });

    elements = document.querySelectorAll(settings.elementSelector);

    elements.forEach(el => {
        intersectionObserver.observe(el);
    });

    if (settings.addControls) {
        setUpButtons();
    }

    attachNavHandlers();

    window.addEventListener('resize', () => {
        throttle(handleResizeEvent, 250);
    }, true);
}

// Set up buttons, if enabled
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

const attachNavHandlers = () => {
    document.querySelector(settings.previousSelector).addEventListener('click', scrollToPrevPage);
    document.querySelector(settings.nextSelector).addEventListener('click', scrollToNextPage);
}

// Determine if user has reduced motion enabled.
const hasReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const handleIntersect = (entries) => {
    const entry = entries.find(e => e.isIntersecting);
    const elementsArray = Array.from(elements);

    const allIntersecting = entries.filter(e => e.isIntersecting === true);
    if (visibleElements === 0) {
        visibleElements = allIntersecting.length - 1;
    }

    if (entry) {
        const index = elementsArray.findIndex(
            e => e === entry.target
        );
        activeIndex = index === 0 ? 1 : index;
    }
}

const handleResizeEvent = () => {
    let count = 0;

    elements.forEach((element) => {
        const isVisible = elementIsVisibleInViewport(element);
        if (isVisible) {
            count++;
        }
    });

    visibleElements = count - 1;
}

const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
        ? ((top > 0 && top < innerHeight) ||
            (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
        : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

const scrollToNextPage = () => {
    if (activeIndex < elements.length - 1) {
        elements[Math.min(activeIndex + visibleElements, elements.length - 1)].scrollIntoView({
            // Only do smooth scroll if reduced motion is on
            behavior: hasReducedMotion() ? undefined : 'smooth',
            inline: 'start',
        })
    }
}

const scrollToPrevPage = () => {
    if (activeIndex > 0) {
        elements[Math.max(0, activeIndex - visibleElements)].scrollIntoView({
            // Only do smooth scroll if reduced motion is on
            behavior: hasReducedMotion() ? undefined : 'smooth',
            inline: 'end',
        })
    }
}

const updateSettings = (newSettings) => {
    if (newSettings && newSettings !== settings) {
        settings = {
            ...settings,
            ...newSettings,
        };
    }
}

const init = (settings) => {
    updateSettings(settings);

    start();
}

init();