natUIve: mostly native front-end framework
===

9 KB framework leveraging browsers' built-in capabilities, with subtle customisation. ([Live demo](http://radogado.github.io/natuive/))
---

- Unbreakable, flexible (no hardcoded dimensions), responsive grid
- Baseline-aligned elements*
- Embeddable grid and elements*
- Vertically aligned column content*
- CSS reset
- Semantic structure
- Balanced functional layout
- (Mobile) navigation
- Buttons
- Modal windows with local or external content
- Lightbox gallery
- Tooltips with full HTML content*
- Nested ordered lists*
- Forms with validation, dynamic submission without page reload, full customisation and accessibility, including native file drop
- Auto-expanding textarea*
- Native sliders*, swipeable on mobile and desktop, with numbered or thumbnail navigation, vertical and full screen options
- Accordions
- Quote block
- Tables accessible on narrow screens by scrolling*
- Footer sticking to the very bottom on short pages*
- 'Back to top' button
- Animated anchor links
- Language selector
- URI parameters relay to links*
- Arabic layout with one CSS line
- Functional without JS and accessible without CSS*
- 5 KB CSS + optional 5 KB JS (effective weight with combined, minified and gzipped files)
- ~~No IE conditional operators~~ HTML5 elements also for IE8 with html5shiv
- No jQuery or other dependencies*
- Supporting IE8+, Safari, Chrome, Firefox, Opera, Android 2.3+, iOS, Windows Phone
- Graceful degradation
- Includes a FREE picture of a cat

\* exclusive features, missing in popular frameworks

2014 [rado.bg](http://rado.bg)

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

