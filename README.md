# natUIve: mostly native front-end framework


9+9 KB framework leveraging browsers' built-in capabilities, with subtle customisation. 

To use natUIve, copy **dist** and edit **dist/index.html**. Check the [homepage](https://radogado.github.io/natuive/) for details.

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
- Includes a FREE picture of a cat

\* exclusive features, missing in popular frameworks

© 2014-2019 [rado.bg](http://rado.bg)

## Standalone components

[Accordion](https://github.com/radogado/n-accordion), [Slider](https://github.com/radogado/native-slider)