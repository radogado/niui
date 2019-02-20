# natUIve: mostly native front-end framework


10+10 KB framework leveraging browsers' built-in capabilities, with subtle customisation. 

To use natUIve, copy **dist** and edit **dist/index.html**. Check the [homepage](https://radogado.github.io/natuive/) for details.

NPM usage:

- npm install --save-dev natuive
- require('./node_modules/natuive/index.js');

---

## Demo pages

[Kitchen sink](https://radogado.github.io/natuive/kitchen.html), [WordPress theme](http://rado.bg), [Microsoft](https://radogado.github.io/natuive/demos/microsoft/), [Imperial Innovations](https://radogado.github.io/natuive/demos/imperialinnovations/), [Pebble homepage](https://radogado.github.io/natuive/demos/pebble/), [Seat 61](https://radogado.github.io/natuive/demos/seat61/), [JetBlue](https://radogado.github.io/natuive/demos/jetblue/), [Mitsubishi Regional Jet](https://radogado.github.io/natuive/demos/mrj/), [MUBI](https://radogado.github.io/natuive/demos/mubi/), [SWISS](https://radogado.github.io/natuive/demos/swiss/), [Mapbox](https://radogado.github.io/natuive/demos/mapbox/), [Airbnb](https://radogado.github.io/natuive/demos/airbnb/), [GOV.UK](https://radogado.github.io/natuive/demos/gov.uk/), [Google Design](https://radogado.github.io/natuive/demos/google-design/), [Daring Fireball](https://radogado.github.io/natuive/demos/daringfireball/), [Vitsœ](https://radogado.github.io/natuive/demos/vitsoe/), [Apple](https://radogado.github.io/natuive/demos/apple/), [Brand Union](https://radogado.github.io/natuive/demos/brandunion/), [Tesla](https://radogado.github.io/natuive/demos/tesla/), [Amnesty](https://radogado.github.io/natuive/demos/amnesty/), [Stripe](https://radogado.github.io/natuive/demos/stripe/), [Star Wars](https://radogado.github.io/natuive/demos/starwars/), [Norwegian](https://radogado.github.io/natuive/demos/norwegian/), [David Bowie Is (Japan)](https://radogado.github.io/natuive/demos/davidbowieis/), [Uncharted: The Lost Legacy](https://radogado.github.io/natuive/demos/uncharted-the-lost-legacy/), [Seehotel Jägerwirt](https://radogado.github.io/natuive/demos/seehotel-jaegerwirt/), [Truphone](https://radogado.github.io/natuive/demos/truphone/), [Pixel Pioneers](https://radogado.github.io/natuive/demos/pixelpioneers/), [Apex](https://radogado.github.io/natuive/demos/apex/), [Loco2](https://radogado.github.io/natuive/demos/loco2/), [VI.nl](https://radogado.github.io/natuive/demos/vi.nl/), [Nikon D850](https://radogado.github.io/natuive/demos/nikon-d850/), [Enoden](https://radogado.github.io/natuive/demos/enoden/), [Tuts+](https://radogado.github.io/natuive/demos/tutsplus/), [Hasselblad Chinese](https://radogado.github.io/natuive/demos/hasselblad/), [CNN Travel](https://radogado.github.io/natuive/demos/cnn-travel/), [Postbank](https://radogado.github.io/natuive/demos/postbank/)

---

- Unbreakable, flexible, responsive [grid](https://radogado.github.io/natuive/#grid). Supports Bootstrap-style wrapping columns, but with ._1/3 (1/3) etc., instead of .col...4 (4/12). Auto equal width columns with equal height and vertical alignment.
- Baseline-aligned [typography](https://radogado.github.io/guide/#typography), quote block, drop caps.
- Unique BEM-like class names
- Embeddable grid and elements. Support for multiple modals, nested carousels, nested accordions etc
- Built around edge cases (overflowing headlines etc)
- Blank default style, without rounded edges or shadows
- Semantic structure
- [Dynamic components](https://radogado.github.io/natuive/#dynamic-components), dynamically initialised by MutationObserver
- (Mobile) [navigation](https://radogado.github.io/natuive/#nav). Drop-down nav: Touch-first, CSS-only, JS enhanced, 1-3 levels, responsive, label/link items support
- [Buttons](https://radogado.github.io/natuive/#buttons) with group container for proper line wrap
- [Modal windows](https://radogado.github.io/natuive/#modal-window) with multiple instances, fully supporting iPhone Safari toolbars
- [Lightbox gallery](https://radogado.github.io/natuive/#lightbox) supporting huge galleries and click to zoom. Can be opened automatically by URI page#lightbox_id. Video in lightbox. Inline lightboxes switchable to full screen.
- [Tooltips](https://radogado.github.io/natuive/#tooltip) with full HTML content
- Nested ordered [lists](https://radogado.github.io/natuive/#lists)
- [Forms](https://radogado.github.io/natuive/#form) with validation, full customisation and accessibility, including native file drop. Auto-expanding textarea. Optional fieldsets.
- Native [sliders](https://radogado.github.io/natuive/#slider), swipeable on mobile and desktop, with numbered or thumbnail (tabs) navigation, vertical and full window options, slider inside slider, fade in/out option, auto height option
- [Accordions](https://radogado.github.io/natuive/#fold)
- [Tabs](https://radogado.github.io/natuive/#tabs)
- [Cards](https://radogado.github.io/natuive/#cards)
- [Grid with inline popups](https://radogado.github.io/natuive/#grid-inline-popup)
- [Tables](https://radogado.github.io/natuive/#tables) accessible on narrow screens by scrolling; sortable.
- Footer sticking to the very bottom on short pages*
- Animated anchor links and 'Back to top' button 
- Language selector
- [Aspect ratio](https://radogado.github.io/natuive/#aspect-ratio) image container
- Arabic (RTL) layout ready
- [Masonry](https://radogado.github.io/natuive/#masonry) CSS-only (vertical track only)
- CSS-only [parallax scrolling](https://radogado.github.io/natuive/#parallax)
- [Fixed background](https://radogado.github.io/natuive/#fixed-background)
- [WordPress theme](rado.bg)
- [Notification bar](https://radogado.github.io/natuive/#notifications)
- Click to [copy to clipboard](https://radogado.github.io/natuive/#copy)
- Functional without JS and accessible without CSS
- [NPM install](https://radogado.github.io/natuive/#npm)
- [Documentation](https://radogado.github.io/natuive/#)
- 10 KB First View CSS + optional 10 KB JS (combined, minified, macOS gzip)
- No jQuery or other dependencies
- Supporting evergreen browsers and Internet Explorer (CSS-only)
- All components accessible by keyboard

\* exclusive features, missing in popular frameworks

© 2014-2019 [rado.bg](http://rado.bg)

## Standalone components

[Accordion](https://github.com/radogado/n-accordion), [Slider](https://github.com/radogado/native-slider), [Drop nav](https://github.com/radogado/nav.drop)