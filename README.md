natUIve: mostly native front-end framework
===

~15 KB framework leveraging browsers' built-in capabilities, with subtle customisation. 

To use natUIve, copy **dist** and edit **dist/index.html**. Check the [Guide](http://radogado.github.io/natuive/guide.html) for details.

NPM usage:

- npm install --save-dev natuive
- require('./node_modules/natuive/index.js');

---

natUIve demo pages: [Features demo](http://radogado.github.io/natuive/kitchen.html), [WordPress theme](http://rado.bg), [Classless demo](http://radogado.github.io/natuive/demos/classless.html), [Microsoft](http://radogado.github.io/natuive/demos/microsoft/), [Imperial Innovations](http://radogado.github.io/natuive/demos/imperialinnovations/), [Pebble homepage](http://radogado.github.io/natuive/demos/pebble/), [Seat 61](http://radogado.github.io/natuive/demos/seat61/), [JetBlue](http://radogado.github.io/natuive/demos/jetblue/), [Mitsubishi Regional Jet](http://radogado.github.io/natuive/demos/mrj/), [MUBI](http://radogado.github.io/natuive/demos/mubi/), [SWISS](http://radogado.github.io/natuive/demos/swiss/), [Mapbox](http://radogado.github.io/natuive/demos/mapbox/), [Airbnb](http://radogado.github.io/natuive/demos/airbnb/), [GOV.UK](http://radogado.github.io/natuive/demos/gov.uk/), [Google Design](http://radogado.github.io/natuive/demos/google-design/), [Daring Fireball](http://radogado.github.io/natuive/demos/daringfireball/), [Vitsœ](http://radogado.github.io/natuive/demos/vitsoe/), [Apple](http://radogado.github.io/natuive/demos/apple/), [Brand Union](http://radogado.github.io/natuive/demos/brandunion/), [Tesla](http://radogado.github.io/natuive/demos/tesla/), [Amnesty](http://radogado.github.io/natuive/demos/amnesty/), [Stripe](http://radogado.github.io/natuive/demos/stripe/), [Star Wars](http://radogado.github.io/natuive/demos/starwars/), [Norwegian](http://radogado.github.io/natuive/demos/norwegian/), [David Bowie Is (Japan)](http://radogado.github.io/natuive/demos/davidbowieis/), [Uncharted: The Lost Legacy](http://radogado.github.io/natuive/demos/uncharted-the-lost-legacy/), [Seehotel Jägerwirt](http://radogado.github.io/natuive/demos/seehotel-jaegerwirt/), [Truphone](http://radogado.github.io/natuive/demos/truphone/), [Pixel Pioneers](http://radogado.github.io/natuive/demos/pixelpioneers/), [Apex](http://radogado.github.io/natuive/demos/apex/), [Loco2](http://radogado.github.io/natuive/demos/loco2/), [VI.nl](http://radogado.github.io/natuive/demos/vi.nl/), [Nikon D850](http://radogado.github.io/natuive/demos/nikon-d850/), [Enoden](http://radogado.github.io/natuive/demos/enoden/), [Tuts+](http://radogado.github.io/natuive/demos/tutsplus/), [Hasselblad Chinese](http://radogado.github.io/natuive/demos/hasselblad/), [CNN Travel](http://radogado.github.io/natuive/demos/cnn-travel/)

---

- Unbreakable, flexible (no hardcoded dimensions), responsive grid. Supports Bootstrap-style wrapping columns, but with .col3 (1/3) etc., instead of .col...4 (4/12). Auto equal width columns with equal height and vertical alignment.
- Baseline-aligned text elements*
- Embeddable grid and elements*
- Built around edge cases (overflowing content etc)*
- CSS reset
- Really blank default style, unlike frameworks with baked-in rounded edges, shadows etc*
- Semantic structure
- Components conveniently segregated and dynamically initialised by MutationObserver
- Balanced functional layout
- (Mobile) navigation
- Drop-down nav: Touch-first, CSS-only, JS enhanced, 1-3 levels, responsive, label/link items support
- Buttons with a grouping container for proper line wrap
- Modal windows with local or external content, multiple instances, fully supporting iPhone Safari toolbars*
- Lightbox gallery supporting huge galleries* and click to zoom. Can be opened automatically by URI page#lightbox_id. Video in lightbox. Inline lightboxes switchable to full screen.
- Tooltips with full HTML content*
- Nested ordered lists*
- Forms with validation, dynamic submission without page reload, full customisation and accessibility, including native file drop. Range input with blank style. Auto-expanding textarea*. Optional fieldsets.
- Native sliders*, swipeable on mobile and desktop, with numbered or thumbnail (tabs) navigation, vertical and full window options, slider inside slider, fade in/out option, auto height option
- Accordions
- Tabs
- Cards
- Quote block
- Drop Caps
- Grid with inline popups
- Tables accessible on narrow screens by scrolling; sortable*
- Footer sticking to the very bottom on short pages*
- 'Back to top' button
- Animated anchor links
- Language selector
- Native video player
- Good usability without any classes*
- Aspect ratio image container*
- CSS-only viewport height header*
- URI parameters relay to links*
- Arabic layout ready*
- Masonry CSS-only* (vertical track only)
- CSS-only parallax scrolling* 
- Fixed background option
- WordPress theme*
- Notificaton bar
- Click to copy to clipboard
- Multiple modals, nested carousels, nested accordions etc
- Functional without JS and accessible without CSS*
- NPM install
- Guide
- 9 KB First View CSS + optional 8 KB JS (combined, minified, macOS gzip)
- ~~No IE conditional operators~~ HTML5 elements also for IE8 with html5shiv
- No jQuery or other dependencies*
- Supporting IE8+, Safari, Chrome, Firefox, Opera, Android 2.3+, iOS, Windows Phone
- Graceful degradation
- All components are accessible by keyboard
- Full documentation in [natUIve.pdf](http://radogado.github.io/natuive/natUIve.pdf)
- Includes a FREE picture of a cat

\* exclusive features, missing in popular frameworks

© 2014-2018 [rado.bg](http://rado.bg)

–––

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
- Slider with outside contols
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
- Close burger content by clicking outside
- Aspect ratio container now a single element
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
	- Aspect ratio image container
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

