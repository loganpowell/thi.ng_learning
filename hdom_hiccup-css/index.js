import './normalize.css' // for codesandbox
import './index.css' // for codesandbox

import { start } from '@thi.ng/hdom'
import { css, injectStyleSheet, PRETTY, rem, at_media } from '@thi.ng/hiccup-css'

/**
 * You can use the full power of javascript to define your styles
 * Let's explore the benefits of treating everything as data
 **/

// We'll start by defining a globally unique scope for our component:
const scope = '_jumbotron_clicker'

/** FUNCTIONAL COMPONENTS
 * NOTE: `scope` names can only be appended to class names,
 * not ids or elements, so we terminate our element tag with class names
 * and append our css named scope later
 **/
const greeter = (_, name) => ['h1#my_id.greeter' + scope, 'hello ', name]
const counter = (i = 0) => () => ['button.counter' + scope, { onclick: () => i++ }, `clicks: ${i}`]
const jumbotron = () => ['div.jumbotron' + scope, [greeter, 'thi.ng'], counter()]

// STYLES
// create some utilities (we'll move these into a util directory later)
// factories
const border = (color = 'black', radius = '0px', type = 'solid', thickness = '1px') => ({
  'border-radius': radius,
  'border': `${thickness} ${type} ${color}`,
  'outline': 'none',
})
const font = (font = 'system-ui', weight = 'normal', style = 'normal', decoration = 'none') => ({
  'font-family': font,
  'font-weight': weight,
  'font-style': style,
  'text-decoration': decoration,
})
// scales
const orangeScale = ['#DB5461', '#FF6D7C', '#FF939E']
// shortcodes
const crs = { cursor: 'pointer' }
// use math to create variants
const px = xsRem => ({
  xs: { padding: xsRem },
  sm: { padding: rem(xsRem * 1.5) },
  md: { padding: rem(xsRem * 3) },
  lg: { padding: rem(xsRem * 5) },
  xl: { padding: rem(xsRem * 8) },
})
const padding = px(0.5)

// using a `styled-system` inspired media query function (HOF for adaptations)
const styleSystem = (...breakPoints) => selector => (...sizes) => className =>
  breakPoints.map((bkp, idx) =>
    at_media({ 'screen': true, 'min-width': bkp }, [className, { [selector]: sizes[idx] }])
  )

// store your breakpoints once and export them if so desired:
export const breakPointsOn = styleSystem('0px', '599px', '959px', '1279px', '1919px')

// Creating styles ===================

// use media queries:
const jumboLighten = at_media({ 'screen': true, 'min-width': '1000px' }, [
  ['.jumbotron', { background: orangeScale[1] }],
])
// nested media queries are supported:
const nestedMediaQueries = at_media({ 'screen': true, 'min-width': '800px' }, [
  ['.counter', padding.md, { 'font-size': rem(2) }],
  [at_media({ 'min-width': '1000px' }, ['.counter', { 'font-size': rem(2.5) }])],
])

// adapter for font-sizes
const responsiveFonts = breakPointsOn('font-size')

// the first member of a css rule is the identifier of the element
// remaining members are concatenated into a single css definition
const buttonStyles = [
  '.counter',
  {
    'background': orangeScale[1],
    'color': 'white',
    'font-size': rem(1.5),
  },
  padding.sm,
  font('Rubik', 500),
  border('white', '5px'),
  crs,
]

/** The `css` function
 * styles are applied in the order they are included
 * in the rules array. Following css rules, when multiple
 * declarations have equal specificity, the last declaration
 * found in the CSS is applied to the element.
 *
 * @param {Array} rules An array of css rules
 * @param {Object} options An optional configuration
 *        format  = Formatting for the css (default: COMPACT)
 *        scope = A name to append to the css classes herein
 * **/
const styles = css(
  [
    ['.jumbotron', { background: orangeScale[0] }, border('white'), padding.lg],
    jumboLighten,
    buttonStyles,
    nestedMediaQueries,
    ...responsiveFonts(rem(3), rem(4), rem(5), rem(8))('.greeter'),
    ['.greeter', font('Rubik', 800, 'italic'), { color: 'white' }],
  ],
  { format: PRETTY, scope: scope }
)

// pushes our css into <head> of document:
injectStyleSheet(styles)

// start RAF loop with component to mount and destination
start(jumbotron(), { root: document.body })
