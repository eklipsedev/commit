| Token | Designer name | Hex |
|-------|---------------|-----|
| `yellow` | Commit Yellow | `#FEE064` |
| `charcoal` | Charcoal | `#303030` |
| `peach` | Soft Peach | `#FFD8BF` |
| `burnt-orange` | Burnt Orange | `#CF5B28` |
| `sage` | Soft Sage | `#DFE8D0` |
| `pale-yellow` | Butter Yellow | `#FBFFC0` |
| `plum` | Plum | `#A04D79` |
| `blue` | Dusty Blue | `#5A6BAB` |
| `light-blue` | Powder Blue | `#B9CDE8` |
| `brown` | Walnut | `#7B5630` |
| `lavender` | Soft Lilac | `#F3EEF6` |
| `pink` | Hot Pink | `#FAA0E2` |
| `deep-blue` | Indigo | `#4D60A6` |
| `olive` | Olive | `#817B42` |
| `black` | Black | `#000000` |
| `white` | White | `#FFFFFF` |

## **CMS Color Editing Philosophy**

The website is maintained by the designers who created the original Figma system. Color controls should therefore preserve the expressive flexibility of the design rather than restrict editors to a small set of predefined section themes.

Editors may independently combine approved brand colors for backgrounds, headings, body text, accents, borders, buttons, cards, and other documented visual roles.

The CMS must still enforce the boundaries of the brand system:

* Editors may select only from the approved brand palette.  
* Arbitrary color pickers and custom hexadecimal values are not permitted.  
* Sanity stores stable token names rather than raw color values.  
* Each component exposes only the color roles that are meaningful for that component.  
* Color controls must be named semantically according to what they affect.  
* Nested elements should support inheritance where appropriate.  
* Accessibility issues should produce editor warnings but should not normally block publishing.  
* The frontend must provide safe defaults when a color field is unset.

Do not reduce the design system to predefined color variants such as `light`, `dark`, `pink`, or `green` when the Figma demonstrates more flexible color composition.

Example section configuration:

{  
  "backgroundColor": "peach",  
  "headingColor": "deep-blue",  
  "bodyColor": "charcoal",  
  "accentColor": "burnt-orange"  
}

Example card configuration:

{  
  "cardBackgroundColor": "yellow",  
  "cardHeadingColor": "charcoal",  
  "cardBodyColor": "brown",  
  "cardAccentColor": "pink"  
}

Color fields should use a visual swatch selector in Sanity. Each option should display the color name and swatch, with an optional hexadecimal or Figma reference for clarity.

## spacing

Each section should have the ability to have collapsable top and bottom padding/margins.

## fonts

- **Lust Text** (Adobe Fonts) — primary display / headlines
- **Bloyd** (Blaze Type) — body and UI sans (replaces Geist Sans)
- **Geist Mono** — secondary: taglines, nav links, attribute labels

Until licensed webfonts are wired, the site uses **Lora** as a Lust Text stand-in and **Geist Sans** as a Bloyd stand-in.
