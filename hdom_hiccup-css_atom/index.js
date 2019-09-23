// import './normalize.css' // for codesandbox
// import './index.css' // for codesandbox

// import our utilities
import { border, font, orangeScale, crs, padding, breakPointsOn } from './utils/css'
import { greeter, counter } from './components'

import { start } from '@thi.ng/hdom'
import { css, injectStyleSheet, PRETTY, rem, at_media } from '@thi.ng/hiccup-css'
import { Atom, Cursor, History } from '@thi.ng/atom'

const SCOPE = '_jumbotron_clicker'

// create an immutable state container and record it
const atom = new History(new Atom({ count: 0 }))
// create a cursor to the count for read/write access
const cursor = new Cursor(atom, 'count')
// let's log our changes to the atom:
cursor.addWatch('watcher says', (id, prev, curr) => console.log(`${id}: ${prev} -> ${curr}`))
// create a read-only derived view
const view = atom.addView('count', x => x * 2)

/**
 * the atom's value can be obtained via deref(),
 * replaced via reset()
 * and updated using swap()
 **/
// Let's use swap; this is the same as: atom.reset(inc(a.deref(), 1))
const incState = () => cursor.swap(inc, 1)
const inc = (old, int) => old + int
// props are passed in via the second element in an hdom array
const jumbotron = () => [
  'div',
  { selected: true, class: 'jumbotron' + SCOPE },
  [greeter, { class: 'greeter' + SCOPE, state: view }, 'thi.ng'],
  // let's add a new click handler that updates our atom:
  [counter(), { class: 'counter' + SCOPE, onclick: incState, state: cursor }, 'clicks: '],
  ['button', { class: 'counter' + SCOPE, onclick: () => atom.reset({ count: 0 }) }, 'reset'],
  ['button', { class: 'counter' + SCOPE, onclick: () => atom.undo() }, 'undo'],
  ['button', { class: 'counter' + SCOPE, onclick: console.log }, 'log'],
  ['a', { href: 'xxx.xxx', onclick: e => (e.preventDefault(), console.log(e)) }, 'route'],
]

const responsiveFonts = breakPointsOn('font-size')
const responsivePadding = breakPointsOn('padding')

const buttonStyles = [
  '.counter',
  {
    'background': orangeScale[1],
    'color': 'white',
    'font-size': rem(1.5),
    'margin': '15px 15px 0 0',
    ...font('Rubik', 500),
    ...border('white', '5px'),
    ...crs,
  },
]

const styles = css(
  [
    ['.jumbotron', { background: orangeScale[0] }, border('white'), padding.lg],
    buttonStyles,
    ...responsivePadding(padding.sm, padding.sm, padding.md)('.counter'),
    ...responsiveFonts(rem(1), rem(1.5), rem(2), rem(3))('.counter'),
    ...responsiveFonts(rem(3), rem(4), rem(5), rem(8))('.greeter'),
    ['.greeter', font('Rubik', 800, 'italic'), { color: 'white' }],
  ],
  { format: PRETTY, scope: SCOPE }
)

// pushes our css into <head> of document:
injectStyleSheet(styles)

// start RAF loop with component to mount and destination
start(jumbotron(), { root: document.body })
