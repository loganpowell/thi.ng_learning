import { start, renderOnce } from '@thi.ng/hdom'
import { css, injectStyleSheet } from '@thi.ng/hiccup-css'

// stateless component w/ params
// the first arg is an auto-injected context object
// (not used here, see dedicated section in readme further below)
const greeter = (_, name) => ['h1.title', 'hello ', name]

// component w/ local state
const counter = (i = 0) => {
  return () => ['button', { onclick: () => i++ }, `clicks: ${i}`]
}

const app = () => {
  // initialization steps
  // ...
  // root component is just a static array
  return ['div#app', [greeter, 'world'], counter(), counter(100)]
}

// re-usable property snippets
const border = { border: '1px solid black' }
const red = { color: 'red' }

injectStyleSheet(
  css(
    [
      ['#app', { background: 'white' }, border, red],
      ['button', { background: 'yellow', color: 'black' }, border],
    ],
    { format: css.PRETTY }
  )
)

// start RAF update & diff loop
start(app(), { root: document.body })

// alternatively create DOM tree only once
// renderOnce(app(), { root: document.body })
