import { start, renderOnce } from '@thi.ng/hdom'
import { css, injectStyleSheet, PRETTY, rem, at_media, percent } from '@thi.ng/hiccup-css'

const greeter = (_, name) => ['h1.title' + scope, 'hello ', name]

const counter = (i = 0) => {
  return () => ['button.btn' + scope, { onclick: () => i++ }, `clicks: ${i}`]
}

const scope = '_globally_specific_component_name'

const app = () => {
  return ['div.app' + scope, [greeter, 'thi.ng'], counter()]
}

// color inspiration: https://coolors.co/fafafa-8aa29e-5d737e-e3f2fd-db5461
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

const styleSystem = (...breakPoints) => selector => (...sizes) => className =>
  breakPoints.map((bkp, idx) =>
    at_media({ 'screen': true, 'min-width': bkp }, [className, { [selector]: sizes[idx] }])
  )

export const pointBreaker = styleSystem(rem(10), rem(15), rem(20), rem(30))

const bp_4_FontSizer = pointBreaker('font-size')

injectStyleSheet(
  css(
    [
      ['.app', { background: bloodOrange }, bc('white'), p('0 0 0 20px')],
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
        f('Rubik', 300),
      ],
      ...bp_4_FontSizer('15px', '25px', '35px', rem(5))('.title'),
      ['.title', f('Rubik', 500, 'italic'), { color: 'white' }],
    ],
    { format: PRETTY, scope }
  )
)

start(app(), { root: document.body })
