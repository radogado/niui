natUIve: mostly native front-end framework
===

13 KB framework leveraging browsers' built-in capabilities, with subtle customisation. [Features demo](http://radogado.github.io/natuive/) ([minified](http://natuive.net)), [WordPress theme](http://rado.bg), [Microsoft homepage](http://natuive.net/microsoft/), [Imperial Innovations homepage](http://natuive.net/imperialinnovations/), [Pebble homepage](http://natuive.net/pebble/), [Seat 61](http://radogado.github.io/natuive/seat61/), [Classless demo](http://radogado.github.io/natuive/classless.html)
---

- Unbreakable, flexible (no hardcoded dimensions), responsive grid
- Baseline-aligned elements*
- Embeddable grid and elements*
- Vertically aligned column content*
- CSS reset
- Semantic structure
- Balanced functional layout
- (Mobile) navigation
- Drop-down nav: Touch-first, CSS-only, JS enhanced, 1-3 levels, responsive, label/link items support
- Buttons
- Modal windows with local or external content
- Lightbox gallery supporting huge galleries*
- Tooltips with full HTML content*
- Nested ordered lists*
- Forms with validation, dynamic submission without page reload, full customisation and accessibility, including native file drop
- Auto-expanding textarea*
- Native sliders*, swipeable on mobile and desktop, with numbered or thumbnail navigation, vertical and full screen options, slider inside slider
- Accordions
- Tabs
- Quote block
- Drop Caps
- Tables accessible on narrow screens by scrolling; sortable*
- Footer sticking to the very bottom on short pages*
- 'Back to top' button
- Animated anchor links
- Language selector
- Native video player
- Good usability without any classes*
- Themes
- Aspect ratio image container*
- Support for Android Browser scrolling via polyfill overthrow.js*
- CSS-only viewport height header*
- URI parameters relay to links*
- Arabic layout ready
- Masonry CSS-only
- WordPress theme
- Functional without JS and accessible without CSS*
- 6 KB CSS + optional 6 KB JS (effective weight with combined, minified and gzipped files)
- ~~No IE conditional operators~~ HTML5 elements also for IE8 with html5shiv
- No jQuery or other dependencies*
- Supporting IE8+, Safari, Chrome, Firefox, Opera, Android 2.3+, iOS, Windows Phone
- Graceful degradation
- .row.wrap grid supports Bootstrap-style wrapping columns, but with .col3 (1/3) etc., instead of .col-**-4 (4/12)
- Includes a FREE picture of a cat

\* exclusive features, missing in popular frameworks

2014-2015 [rado.bg](http://rado.bg)

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
	- A modal window can have any content – modalWindow(‘HTML')
- Form:
	- Supports dragging a file to a file input
	- Flat version with stacked labels/inputs
- Slider:
	- Auto-slide option
	- Jumping from last to first and first to last

