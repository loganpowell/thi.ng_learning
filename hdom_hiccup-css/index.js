import { start, renderOnce } from '@thi.ng/hdom'
import { css, injectStyleSheet, PRETTY, rem, at_media, percent } from '@thi.ng/hiccup-css'

const greeter = (_, name) => ['h1.title' + scope, 'hello ', name]

const counter = (i = 0) => {
  return () => ['button.btn' + scope, { onclick: () => i++ }, `clicks: ${i}`]
}

// (0) scope for component-specific styles
const scope = '_globally_specific_component_name'

/**
 * NOTE: scope names can only be appended to class names,
 * not ids or elements, so we'll use a class `.app` qualifier here
 **/
const app = () => {
  return ['div.app' + scope, [greeter, 'thi.ng'], counter()]
}

// let's create some re-usable css snippets
const bc = color => ({
  border: `1px solid ${color}`,
  outline: 'none',
})
const bloodOrange = '#DB5461'
const crs = { cursor: 'pointer' }
const f = (font, weight, style) => ({
  'font-family': font,
  'font-weight': weight,
  'font-style': style,
})
const p = size => ({ padding: size })
const br = radius => ({ 'border-radius': radius })

// using a `styled-system` inspired media query function (HOF for adaptations)
const styleSystem = (...breakPoints) => selector => (...sizes) => className =>
  breakPoints.map((bkp, idx) =>
    at_media({ 'screen': true, 'min-width': bkp }, [className, { [selector]: sizes[idx] }])
  )

// store your breakpoints once and export them if so desired:
export const pointBreaker = styleSystem(rem(10), rem(15), rem(20), rem(30))

// let's create a custom media query adapter using the breakpoints above:
const bp_4_FontSizer = pointBreaker('font-size')

// pushes our css into <head> of document:
injectStyleSheet(
  css(
    // first arg to `css` is an array of 'rules' for styling
    [
      /** styles are applied in the order they are included
       * in the rules array. Following css rules, when multiple
       * declarations have equal specificity, the last declaration
       * found in the CSS is applied to the element.
       * **/
      // the first member of a rule is the identifier of the element
      // remaining members are concatenated into a single css string
      ['.app', { background: bloodOrange }, bc('white'), p('0 0 0 20px')],
      // mix, match and compose objects, functions, and string definitions
      [
        '.btn',
        {
          'background': bloodOrange,
          'color': 'white',
          'margin': '0 0 20px 0',
          'padding': rem(0.5),
          'font-size': rem(1),
        },
        br('10px'),
        bc('white'),
        crs,
        f('System UI', 300),
      ],
      // use a media query:
      at_media({ 'screen': true, 'min-width': rem(25) }, [
        ['.btn', { 'padding': rem(1), 'font-size': rem(2) }],
        // nested media queries are supported:
        [
          at_media({ 'min-width': '35rem' }, [
            '.btn',
            { padding: rem(1) },
            f('System UI', 500, 'italic'),
          ]),
        ],
      ]),
      // spread in the custom media query adapter we created above:
      ...bp_4_FontSizer('15px', '25px', '35px', rem(5))('.title'),
      ['.title', f('System UI', 500, 'italic'), { color: 'white' }],
    ],

    // second argument is an optional configuration
    /** `format: COMPACT` (default)
     *  PRETTY format is helpful during development to inspect the
     * <head> css for debugging
     **/

    { format: PRETTY, scope } // append our scope name to these rules
  )
)

start(app(), { root: document.body })
