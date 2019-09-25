import { start, setStyle, setAttribs } from '@thi.ng/hdom'
import { EVENT_ROUTE_CHANGED, HTMLRouter } from '@thi.ng/router'
import { Atom, Cursor, History, View } from '@thi.ng/atom'
import { map, reduce, filter, deepTransform } from '@thi.ng/transducers'
import { EventBus, trace, valueSetter } from '@thi.ng/interceptors'
import { sync, fromAtom, fromView } from '@thi.ng/rstream'
import { css } from '@thi.ng/hiccup-css'

import invoker from 'ramda/src/invoker'
import fetch from 'isomorphic-fetch'
import 'regenerator-runtime/runtime'

const siteMap = {
  user: {},
  posts: [],
  profile: {},
  route: [],
}

const state = new Atom(siteMap)

// 888~-_                       d8
// 888   \   e88~-_  888  888 _d88__  e88~~8e  888-~\
// 888    | d888   i 888  888  888   d888  88b 888
// 888   /  8888   | 888  888  888   8888__888 888
// 888_-~   Y888   ' 888  888  888   Y888    , 888
// 888 ~-_   "88_-~  "88_-888  "88_/  "88___/  888

const componentsConfig = {
  profile: () => ['h2.profile', 'PROFILE'],
  home: () => ['h2.home', 'HOME'],
  posts: () => ['h1.posts', ['A', 'B', 'C'].map(x => ['h2.post', `POST: ${x}`])],
}

const routerConfig = {
  useFragment: false,
  defaultRouteID: 'home',
  // IMPORTANT: rules with common prefixes MUST be specified in
  // order of highest precision / longest path
  routes: [
    { id: 'home', match: ['home'] },
    { id: 'post', match: ['posts', '?id'] },
    { id: 'posts', match: ['posts'] },
    { id: 'profile', match: ['profile'] },
  ],
  // prefix: '/', // default
  // separator: '/', // default
  // initialRouteID: 'string', // triggered on start (no params!)
  // authenticator: () => {}, // see: https://github.com/thi-ng/umbrella/blob/master/packages/router/src/api.ts#L11
}

const router = new HTMLRouter(routerConfig)
// connect router to event bus so that routing events are processed
// as part of the normal batched event processing loop
router.addListener('EV-ROUTE-CHANGED', e => dispatch(['EV-ROUTE-CHANGED', e.value]))

// const dispatch = invoker(2, 'addListener')

// dispatch('EV-ROUTE-CHANGED', e => dispatch(['EV-ROUTE-CHANGED', e.value]), router)
// 888~~\
// 888   | 888  888  d88~\
// 888 _/  888  888 C888
// 888  \  888  888  Y88b
// 888   | 888  888   888D
// 888__/  "88_-888 \_88P

const events = {
  'EV-ROUTE-CHANGED': valueSetter('route'),
  'EV-ROUTE-TO': (_state, [evt_key, evt_val], evt_bus, _ctx) => ({ 'FX-ROUTE-TO': evt_val }),
  'INIT': () => ({}),
}
const effects = {
  'FX-ROUTE-TO': ([id, params]) => router.routeTo(router.format(id, params)),
}

const bus = new EventBus(state, events, effects)

bus.instrumentWith([trace])

const betterFetch = async (...opts) => {
  let x = await fetch(...opts)
  let json = await x.json()
  return json
}

const example = betterFetch('https://randomuser.me/api/')

// some dummy JSON records
let db = [
  {
    meta: {
      author: {
        name: 'Alice Bobbera',
        email: 'a@b.it',
      },
      created: '2018-02-03T12:13:14Z',
      tags: ['drama', 'queen'],
    },
    title: 'UI components for Dummies',
    content:
      'Sed doloribus molestias voluptatem ut delectus vitae quo eum. Ut praesentium sed omnis sequi rerum praesentium aperiam modi. Occaecati voluptatum quis vel facere quis quisquam.',
  },
  {
    meta: {
      author: {
        name: 'Charlie Doran',
        email: 'c@d.es',
      },
      created: '2018-02-02T01:23:45Z',
      tags: ['simplicity', 'rules'],
    },
    title: 'Look ma, so simple',
    content:
      'Ratione necessitatibus doloremque itaque. Nihil hic alias cumque beatae esse sapiente incidunt. Illum vel eveniet officia.',
  },
]

// component functions for individual keys in the JSON objects
// the `item` function is the root component for each JSON object
// it's a higher-order function, since we will create different
// instances for theming purposes... see below
const item = theme => item => [`div.item.${theme}`, item.title, item.meta, item.content]
const meta = meta => ['div.meta', meta.author, meta.created, meta.tags]
const author = author => [
  'div',
  ['strong', 'author: '],
  link(`mailto:${author.email}`, author.name),
]
const date = iso => ['div', ['strong', 'date: '], new Date(Date.parse(iso)).toLocaleString()]
const link = (href, body) => ['a', { href }, body]
const tag = tag => ['li', link('#', tag)]
const tags = tags => ['ul.tags', ...tags.map(tag)]
const title = (title, level = 3) => [`h${level}`, title]
const content = body => ['div', body]

// now compose themed component functions for the above JSON object format
// the spec below is is only partially complete and will be reused by
// the two themes below (this is only for demo purposes and of course
// one could supply completely different functions per theme, but KISS here... :)

// the full spec is an array of this recursive structure:
// [mapfn, {optional chid key specs...}]
// for leaf keys only a function needs to be given, no need to wrap in array.
// giving component functions the same name as their object keys
// makes this format very succinct
const itemSpec = {
  meta: [
    meta,
    {
      author,
      tags,
      created: date,
    },
  ],
  title,
  content,
}

// build themed component instances using @thi.ng/tranducers' deepTransform()
// deepTransform() is generic object tree transformer
// called with a nested object spec reflecting the structure
// of the source data, returns composed component function,
// which calls all nested transformer functions in post-order traversal
const itemLight = deepTransform([item('light'), itemSpec])
const itemDark = deepTransform([item('dark'), itemSpec])

// simple text area editor for our JSON data
// any change to the input should be immediately
// reflected in the rendering
const editor = (() => {
  let body = JSON.stringify(db, null, 2)
  return [
    'textarea',
    {
      oninput: e => {
        try {
          db = JSON.parse(e.target.value)
        } catch (_) {
          ;('')
        }
      },
    },
    body,
  ]
})()

const app = ({ bus }) => {
  // console.log('bus:', bus)
  return bus.processQueue()
    ? [
        'div#container',
        ['div', editor],
        [
          'div',
          ['div', ['h2', 'Light theme'], ...db.map(itemLight)],
          ['div', ['h2', 'Dark theme'], ...db.map(itemDark)],
        ],
      ]
    : null
}
const boot = () => {
  router.start()
  bus.dispatch(['INIT'])
  start(app, { ctx: { bus } })
}

boot()
