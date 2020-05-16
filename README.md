# niui: mostly native front-end library


A lightweight framework leveraging browsers' built-in capabilities, with subtle and powerful customisation. 

To use niui, get [niui.min.css](https://radogado.github.io/niui/dist/niui.min.css), [niui.min.js](https://radogado.github.io/niui/dist/niui.min.js) and [index.html](https://radogado.github.io/niui/dist/index.html) and edit the latter. Check the [homepage](https://radogado.github.io/niui/) for details.

NPM usage:

- npm install --save-dev niui-npm
- require('./node_modules/niui-npm/index.js');

---

## Demo pages (reimplemented real world examples)

[WordPress theme](http://rado.bg), [Microsoft](https://radogado.github.io/niui/demos/microsoft/), [Imperial Innovations](https://radogado.github.io/niui/demos/imperialinnovations/), [Pebble homepage](https://radogado.github.io/niui/demos/pebble/), [Seat 61](https://radogado.github.io/niui/demos/seat61/), [JetBlue](https://radogado.github.io/niui/demos/jetblue/), [Mitsubishi Regional Jet](https://radogado.github.io/niui/demos/mrj/), [MUBI](https://radogado.github.io/niui/demos/mubi/), [SWISS](https://radogado.github.io/niui/demos/swiss/), [Mapbox](https://radogado.github.io/niui/demos/mapbox/), [Airbnb](https://radogado.github.io/niui/demos/airbnb/), [GOV.UK](https://radogado.github.io/niui/demos/gov.uk/), [Google Design](https://radogado.github.io/niui/demos/google-design/), [Daring Fireball](https://radogado.github.io/niui/demos/daringfireball/), [Vitsœ](https://radogado.github.io/niui/demos/vitsoe/), [Apple](https://radogado.github.io/niui/demos/apple/), [Brand Union](https://radogado.github.io/niui/demos/brandunion/), [Tesla](https://radogado.github.io/niui/demos/tesla/), [Amnesty](https://radogado.github.io/niui/demos/amnesty/), [Stripe](https://radogado.github.io/niui/demos/stripe/), [Star Wars](https://radogado.github.io/niui/demos/starwars/), [Norwegian](https://radogado.github.io/niui/demos/norwegian/), [David Bowie Is (Japan)](https://radogado.github.io/niui/demos/davidbowieis/), [Uncharted: The Lost Legacy](https://radogado.github.io/niui/demos/uncharted-the-lost-legacy/), [Seehotel Jägerwirt](https://radogado.github.io/niui/demos/seehotel-jaegerwirt/), [Truphone](https://radogado.github.io/niui/demos/truphone/), [Pixel Pioneers](https://radogado.github.io/niui/demos/pixelpioneers/), [Apex](https://radogado.github.io/niui/demos/apex/), [Loco2](https://radogado.github.io/niui/demos/loco2/), [VI.nl](https://radogado.github.io/niui/demos/vi.nl/), [Nikon D850](https://radogado.github.io/niui/demos/nikon-d850/), [Enoden](https://radogado.github.io/niui/demos/enoden/), [Tuts+](https://radogado.github.io/niui/demos/tutsplus/), [Hasselblad Chinese](https://radogado.github.io/niui/demos/hasselblad/), [CNN Travel](https://radogado.github.io/niui/demos/cnn-travel/), [Postbank](https://radogado.github.io/niui/demos/postbank/), [To Make a Film](https://radogado.github.io/niui/demos/tomakeafilm/), [Oslo](https://radogado.github.io/niui/demos/oslo/)

---

- Unbreakable, flexible, responsive [grid](https://radogado.github.io/niui/#grid). Supports Bootstrap-style wrapping columns, but with ._1/3 (1/3) etc., instead of .col...4 (4/12). Auto equal width columns with equal height and vertical alignment.
- Baseline-aligned [typography](https://radogado.github.io/guide/#typography), quote block, drop caps.
- Unique class names
- Embeddable grid and elements. Support for multiple modals, nested carousels, nested accordions etc
- Built around edge cases (overflowing headlines, images etc)
- Flat default style without rounded edges, shadows etc
- Semantic structure
- [Dynamic components](https://radogado.github.io/niui/#dynamic-components), dynamically initialised by MutationObserver
- (Mobile) [navigation](https://radogado.github.io/niui/#nav). Drop-down nav: Touch-first, CSS-only, JS enhanced, 1-3 levels, responsive, label/link items support
- [Buttons](https://radogado.github.io/niui/#buttons) with group container for proper line wrap
- [Modal windows](https://radogado.github.io/niui/#modal-window) with multiple instances, supporting iPhone Safari toolbars
- [Lightbox gallery](https://radogado.github.io/niui/#lightbox) supporting huge galleries and click to zoom. Can be opened automatically by URI page#lightbox_id. Video in lightbox. Inline lightboxes switchable to full screen.
- [Tooltips](https://radogado.github.io/niui/#tooltip) with full HTML content
- Nested ordered [lists](https://radogado.github.io/niui/#lists)
- [Forms](https://radogado.github.io/niui/#form) with validation, customisation and accessibility.
- Native [sliders](https://radogado.github.io/niui/#slider), swipeable on mobile and desktop, with numbered or thumbnail (tabs) navigation, vertical and full window options, slider inside slider, fade in/out option, auto height option
- [Accordions](https://radogado.github.io/niui/#fold)
- [Tabs](https://radogado.github.io/niui/#tabs)
- [Cards](https://radogado.github.io/niui/#cards)
- [Grid with inline popups](https://radogado.github.io/niui/#grid-inline-popup)
- [Tables](https://radogado.github.io/niui/#tables) accessible on narrow screens by scrolling; sortable.
- Footer sticking to the very bottom on short pages
- Language selector
- [Aspect ratio](https://radogado.github.io/niui/#aspect-ratio) image container
- Arabic (RTL) layout ready
- [Masonry](https://radogado.github.io/niui/#masonry) CSS-only (vertical track only)
- [Parallax scrolling](https://radogado.github.io/niui/#parallax)
- [Fixed background](https://radogado.github.io/niui/#fixed-background)
- [WordPress theme](https://radogado.github.io/niui/niui-wp.zip) with lightbox gallery
- [Notification bar](https://radogado.github.io/niui/#notifications)
- Click to [copy to clipboard](https://radogado.github.io/niui/#copy)
- Functional without JS and accessible without CSS
- [NPM install](https://radogado.github.io/niui/#npm)
- [Documentation](https://radogado.github.io/niui/#)
- ~10 KB first view CSS + optional ~10 KB JS (combined, minified, macOS gzip)
- Seamless transition from CSS-only to JS-enhanced layout
- No dependencies
- Supporting evergreen browsers and Internet Explorer (CSS-only)
- All components accessible by keyboard

© 2014-2020 [rado.bg](http://rado.bg)

## Standalone components

[Accordion](https://github.com/radogado/n-accordion), [Slider](https://github.com/radogado/native-slider), [Drop nav](https://github.com/radogado/nav.drop)
## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/radogado/niui/graphs/contributors"><img src="https://opencollective.com/niui/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/niui/contribute)]

#### Individuals

<a href="https://opencollective.com/niui"><img src="https://opencollective.com/niui/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/niui/contribute)]

<a href="https://opencollective.com/niui/organization/0/website"><img src="https://opencollective.com/niui/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/niui/organization/1/website"><img src="https://opencollective.com/niui/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/niui/organization/2/website"><img src="https://opencollective.com/niui/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/niui/organization/3/website"><img src="https://opencollective.com/niui/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/niui/organization/4/website"><img src="https://opencollective.com/niui/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/niui/organization/5/website"><img src="https://opencollective.com/niui/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/niui/organization/6/website"><img src="https://opencollective.com/niui/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/niui/organization/7/website"><img src="https://opencollective.com/niui/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/niui/organization/8/website"><img src="https://opencollective.com/niui/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/niui/organization/9/website"><img src="https://opencollective.com/niui/organization/9/avatar.svg"></a>
