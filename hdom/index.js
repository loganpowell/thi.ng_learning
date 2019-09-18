import {
  start,
  // renderOnce
} from '@thi.ng/hdom'

// stateless component w/ params
// the first arg is an auto-injected context object
// (not used here, see dedicated section in readme further below)
// Emmet-style tags with ID and/or classes are supported.
const greeter = (_, name) => ['h1.title', 'hello ', name]
// component w/ local state via H.O.F.
const counter = (i = 0) => () => ['button', { onclick: () => i++ }, `clicks: ${i}`]
// root component is just a static array
const app = () => ['div#app', [greeter, 'world'], counter()]

// start RAF update & diff loop
start(app(), { root: document.body })

// alternatively create DOM tree only once
// renderOnce(app(), { root: document.body })
