# natUIve: mostly native front-end framework


9+9 KB framework leveraging browsers' built-in capabilities, with subtle customisation. 

To use natUIve, copy **dist** and edit **dist/index.html**. Check the [Guide](https://radogado.github.io/natuive/guide/) for details.

NPM usage:

- npm install --save-dev natuive
- require('./node_modules/natuive/index.js');

---

## Demo pages

[Kitchen sink](https://radogado.github.io/natuive/kitchen.html), [WordPress theme](http://rado.bg), [Microsoft](https://radogado.github.io/natuive/demos/microsoft/), [Imperial Innovations](https://radogado.github.io/natuive/demos/imperialinnovations/), [Pebble homepage](https://radogado.github.io/natuive/demos/pebble/), [Seat 61](https://radogado.github.io/natuive/demos/seat61/), [JetBlue](https://radogado.github.io/natuive/demos/jetblue/), [Mitsubishi Regional Jet](https://radogado.github.io/natuive/demos/mrj/), [MUBI](https://radogado.github.io/natuive/demos/mubi/), [SWISS](https://radogado.github.io/natuive/demos/swiss/), [Mapbox](https://radogado.github.io/natuive/demos/mapbox/), [Airbnb](https://radogado.github.io/natuive/demos/airbnb/), [GOV.UK](https://radogado.github.io/natuive/demos/gov.uk/), [Google Design](https://radogado.github.io/natuive/demos/google-design/), [Daring Fireball](https://radogado.github.io/natuive/demos/daringfireball/), [Vitsœ](https://radogado.github.io/natuive/demos/vitsoe/), [Apple](https://radogado.github.io/natuive/demos/apple/), [Brand Union](https://radogado.github.io/natuive/demos/brandunion/), [Tesla](https://radogado.github.io/natuive/demos/tesla/), [Amnesty](https://radogado.github.io/natuive/demos/amnesty/), [Stripe](https://radogado.github.io/natuive/demos/stripe/), [Star Wars](https://radogado.github.io/natuive/demos/starwars/), [Norwegian](https://radogado.github.io/natuive/demos/norwegian/), [David Bowie Is (Japan)](https://radogado.github.io/natuive/demos/davidbowieis/), [Uncharted: The Lost Legacy](https://radogado.github.io/natuive/demos/uncharted-the-lost-legacy/), [Seehotel Jägerwirt](https://radogado.github.io/natuive/demos/seehotel-jaegerwirt/), [Truphone](https://radogado.github.io/natuive/demos/truphone/), [Pixel Pioneers](https://radogado.github.io/natuive/demos/pixelpioneers/), [Apex](https://radogado.github.io/natuive/demos/apex/), [Loco2](https://radogado.github.io/natuive/demos/loco2/), [VI.nl](https://radogado.github.io/natuive/demos/vi.nl/), [Nikon D850](https://radogado.github.io/natuive/demos/nikon-d850/), [Enoden](https://radogado.github.io/natuive/demos/enoden/), [Tuts+](https://radogado.github.io/natuive/demos/tutsplus/), [Hasselblad Chinese](https://radogado.github.io/natuive/demos/hasselblad/), [CNN Travel](https://radogado.github.io/natuive/demos/cnn-travel/), [Postbank](https://radogado.github.io/natuive/demos/postbank/)

---

- Unbreakable, flexible, responsive [grid](https://radogado.github.io/natuive/guide/#grid). Supports Bootstrap-style wrapping columns, but with ._1/3 (1/3) etc., instead of .col...4 (4/12). Auto equal width columns with equal height and vertical alignment.
- Baseline-aligned [typography](https://radogado.github.io/natuive/guide/#typography)*, quote block, drop caps.
- Unique BEM-like class names
- Embeddable grid and elements*
- Built around edge cases (overflowing content etc)*
- Blank default style, without rounded edges, shadows etc*
- Semantic structure
- [Dynamic components](https://radogado.github.io/natuive/guide/#dynamic-components), dynamically initialised by MutationObserver
- (Mobile) [navigation](https://radogado.github.io/natuive/guide/#nav). Drop-down nav: Touch-first, CSS-only, JS enhanced, 1-3 levels, responsive, label/link items support
- [Buttons](https://radogado.github.io/natuive/guide/#buttons) with group container for proper line wrap
- [Modal windows](https://radogado.github.io/natuive/guide/#modal-window) with multiple instances, fully supporting iPhone Safari toolbars*
- [Lightbox gallery](https://radogado.github.io/natuive/guide/#lightbox) supporting huge galleries* and click to zoom. Can be opened automatically by URI page#lightbox_id. Video in lightbox. Inline lightboxes switchable to full screen.
- [Tooltips](https://radogado.github.io/natuive/guide/#tooltip) with full HTML content*
- Nested ordered [lists](https://radogado.github.io/natuive/guide/#lists)*
- [Forms](https://radogado.github.io/natuive/guide/#form) with validation, full customisation and accessibility, including native file drop. Range input with blank style. Auto-expanding textarea*. Optional fieldsets.
- Native [sliders](https://radogado.github.io/natuive/guide/#slider)*, swipeable on mobile and desktop, with numbered or thumbnail (tabs) navigation, vertical and full window options, slider inside slider, fade in/out option, auto height option
- [Accordions](https://radogado.github.io/natuive/guide/#fold)
- [Tabs](https://radogado.github.io/natuive/guide/#tabs)
- [Cards](https://radogado.github.io/natuive/guide/#cards)
- [Grid with inline popups](https://radogado.github.io/natuive/guide/#grid-inline-popup)
- [Tables](https://radogado.github.io/natuive/guide/#tables) accessible on narrow screens by scrolling; sortable*
- Footer sticking to the very bottom on short pages*
- Animated anchor links and 'Back to top' button 
- Language selector
- [Aspect ratio](https://radogado.github.io/natuive/guide/#aspect-ratio) image container*
- Arabic layout ready*
- [Masonry](https://radogado.github.io/natuive/guide/#masonry) CSS-only* (vertical track only)
- CSS-only [parallax scrolling](https://radogado.github.io/natuive/guide/#parallax)* 
- [Fixed background](https://radogado.github.io/natuive/guide/#fixed-background)
- [WordPress theme](rado.bg)*
- [Notification bar](https://radogado.github.io/natuive/guide/#notifications)
- Click to [copy to clipboard](https://radogado.github.io/natuive/guide/#copy)
- Support for multiple modals, nested carousels, nested accordions etc
- Functional without JS and accessible without CSS*
- [NPM install](https://radogado.github.io/natuive/guide/#npm)
- [Guide](https://radogado.github.io/natuive/guide/#)
- 9 KB First View CSS + optional 9 KB JS (combined, minified, macOS gzip)
- ~~No IE conditional operators~~ HTML5 elements also for IE8 with html5shiv
- No jQuery or other dependencies*
- Supporting IE8+, Safari, Chrome, Firefox, Opera, Android 2.3+, iOS, Windows Phone
- Graceful degradation
- All components are accessible by keyboard
- Full documentation in [natUIve.pdf](https://radogado.github.io/natuive/natUIve.pdf)
- Includes a FREE picture of a cat

\* exclusive features, missing in popular frameworks

© 2014-2019 [rado.bg](http://rado.bg)

## Standalone components

[Accordion](https://github.com/radogado/n-accordion), [Slider](https://github.com/radogado/native-slider)

## Changelog

natUIve 1.13

- Slider: animated height change
- Components in their own directories
- Lite version with essential components only, ~10K (7K CSS + 4K JS). Excludes slider, parallax, modal, ligthbox, grid with inline popups, fold, card
- Dynamic components via MutationObserver
- Proper modals for iOS Safari

–––

natUIve 1.12

- Switch inline lightbox to full screen
- Grid with inline popups
- Multiple auto-sliding sliders
- Lightbox peeking at neighboring slides
- Guide: button to copy HTML snippets to clipboard
- Exported functions: nui.animate() etc
- Dynamically add components
- NPM install
- JS encapsulation

–––

natUIve 1.11

- Keyboard access to drop nav, fold, lightbox, slider, tabs, form, modal
- Slider with detached nav
- Slider opening at a slide whose id matches URI hash
- Lightbox mobile with smaller controls, larger images
- WordPress: Crop tall galleries on home/search/archive pages
- Modal window auto-opening when id matches URI hash

–––

natUIve 1.10

- Buttons groups
- Multiple modals/lightboxes
- Custom open/close animation for modal/lightbox
- Separate CSS for dynamic content (disabled in later versions)
- Vertically-centered slides
- Horizontal fold

–––

natUIve 1.9

- CSS variables in grid
- Lightbox: inline, loading animation, zoom and scan
- Copy to clipboard indication
- **notify()** timeout option
- Focused slider keyboard control
- Old browsers CSS-only

–––

natUIve 1.8

- Guide
- Proper touch support
- Scroll effects
- Lightbox with thumbnails
- iframe in lightbox
- Slider with outside controls
- Accordion with truncated content

–––

natUIve 1.7

- Video in lightbox
- **.fold** replaces **.accordion** for universal use
- **copyButton()** makes a button copy content to clipboard
- Limited size modal window
- IE8 fallback for Flex grid
- Lightbox auto-opening at slide number or image name, depending on URI
- **init()** initializes new dynamic content
- Optional form fieldsets

–––

natUIve 1.6

- animate() function for CSS animations
- Slider with Fade option
- Nested sliders
- Scrollable horizontal nav
- Animated off-screen mobile nav
- Automatically open a lightbox by loading url#lightbox-id
- Notification bar
- Range input
- CSS-only parallax scrolling
- Fixed background behind an element
- Close n-burger content by clicking outside
- aspect ratio container now a single element
- Properly inherited font size

–––

natUIve 1.5

- Unified Flexbox grid with equal height, vertical alignment and auto wrapping
- Modular source code
- Cards
- Balanced for 10 common page designs
- Vertically centered viewport banner
- Click to zoom in lightbox
- Full screen lightbox

–––

natUIve 1.4

- New
    - Sortable tables
    - Masonry CSS-only
    - isInViewport()
    - Drop-down nav: Touch-first, CSS-only, JS enhanced, 1-3 levels, responsive, label/link items supporting
- Improved
    - Tooltip for touch
    - parentByClass() replaced by versatile getClosest()
    - Slider in CSS-only more now has visual cues
    - Form validation for email and URL inputs
    - Form: input type=number with optional data-digits to specify exact digits required
    - WordPress Gallery captions

–––

natUIve 1.3

- Core
	- Sass CSS for $font-size and $line-height
	- Reduced class dependencies
	- HTML5 elements
	- Themes support
	- openFullWindow(‘content’)
	- Overflowing mobile nav scrollable
	- Node manipulation preserves events
	- aspect ratio image container
	- Scroll polyfill for Android Browser with overthrow.js
	- Option for Header+Banner (“Hero”) to take up .viewport-height (CSS only)
	- Optimisations and fixes
- natUIve WordPress theme
- Lightbox
	- Lazy loading images to support huge galleries
- Slider
	- Rewritten slide animation to support huge sliders
	- Headless full-window option
- Video player
- Tabs

–––

natUIve 1.2

- Core
	- 50% wide columns option on narrow screens
	- Rows with border option
	- Anchor links animated by CSS
	- Various code optimisations
- Slider
	- Vertical version
	- Full-screen version
- Form
	- Border on focus
	- Dynamic form submit without page reload
- Modal
	- External content via PHP

–––

natUIve 1.1

- More stability and compatibility
- Core:
	- Clean, seamless row embedding without padding creep
	- Wrap Grid, which wraps equal-width columns on multiple lines
	- Browser capabilities detection, instead of user agent
- Tables: 
	- Highlight row by hover
- Lightbox:
	- Image captions
	- Centered/downscaled images by CSS only
	- Lightbox link can be anything, not just a thumbnail image
- Modal windows: 
	- The link can have child elements
	- A modal window can have any content – modalWindow('HTML')
- Form:
	- Supports dragging a file to a file input
	- Flat version with stacked labels/inputs
- Slider:
	- Auto-slide option
	- Jumping from last to first and first to last

