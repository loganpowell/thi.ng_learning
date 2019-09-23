// we'll refactor our component to allow handing properties in from a parent
export const counter = (i = 0) => (_, props, name) => [
  'button',
  // spread in parent props for overrides
  { onclick: () => i++, ...props },
  `${name} ${i || props.state.deref()}`,
]
