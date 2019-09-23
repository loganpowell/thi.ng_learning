import './normalize.css' // for codesandbox
import './index.css' // for codesandbox

import { border, font, orangeScale, crs, padding, breakPointsOn } from './utils/css'
import { greeter, counter } from './components'

import { start } from '@thi.ng/hdom'
import { css, injectStyleSheet, PRETTY, rem, at_media } from '@thi.ng/hiccup-css'
import { Atom, Cursor, History } from '@thi.ng/atom'

const SCOPE = '_jumbotron_clicker'

const atom = new History(new Atom({ count: 0 }))
const cursor = new Cursor(atom, 'count')
cursor.addWatch('watcher says', (id, prev, curr) => console.log(`${id}: ${prev} -> ${curr}`))

const view = atom.addView('count', x => x * 2)

const incState = () => cursor.swap(inc, 1)
const inc = (old, int) => old + int
const jumbotron = () => [
  'div',
  { class: 'jumbotron' + SCOPE },
  [greeter, { class: 'greeter' + SCOPE, state: view }, 'thi.ng'],
  [counter(), { class: 'counter' + SCOPE, onclick: incState, state: cursor }, 'clicks: '],
  ['button', { class: 'counter' + SCOPE, onclick: () => atom.reset({ count: 0 }) }, 'reset'],
  ['button', { class: 'counter' + SCOPE, onclick: () => atom.undo() }, 'undo'],
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

injectStyleSheet(styles)

start(jumbotron(), { root: document.body })
