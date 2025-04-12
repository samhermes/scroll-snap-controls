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
let intersectionObserver = null;
let activeIndex = 0;

const start = () => {
    intersectionObserver = new IntersectionObserver(handleIntersect, {
        root: document.querySelector(settings.selector),
        rootMargin: "0px",
        threshold: 0.75
    });

    elements = document.querySelectorAll(settings.elementSelector);

    elements.forEach(el => {
        intersectionObserver.observe(el);
    });

    if (settings.addControls) {
        setUpButtons();
    }

    attachNavHandlers();
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

// Calculate taking in scroll offset and padding/gap
// Can we do this using the initial count of intersection observer?
const getRowLength = () => {
    const container = document.querySelector(settings.wrapper);

    return Math.floor(
        container.clientWidth /
        elements[0].clientWidth
    );
};

const handleIntersect = (entries) => {
    const entry = entries.find(e => e.isIntersecting);
    const elementsArray = Array.from(elements);

    if (entry) {
        const index = elementsArray.findIndex(
            e => e === entry.target
        );
        activeIndex = index;
    }
}

// Only do smooth scroll if reduced motion is on
const scrollToNextPage = () => {
    if (activeIndex < elements.length - 1) {
        elements[Math.min(activeIndex + (getRowLength() * 2), elements.length - 1)].scrollIntoView({
            behavior: hasReducedMotion() ? undefined : 'smooth',
        })
    }
}

// Only do smooth scroll if reduced motion is on
const scrollToPrevPage = () => {
    if (activeIndex > 0) {
        elements[Math.max(0, activeIndex - (getRowLength() * 2))].scrollIntoView({
            behavior: hasReducedMotion() ? undefined : 'smooth',
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