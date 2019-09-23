// we'll refactor our component to allow handing properties in from a parent
export const greeter = (_, props, name) =>
  props.state ? ['h1', props, 'thi.ngs = ', props.state.deref()] : ['h1', props, 'hello ', name]
