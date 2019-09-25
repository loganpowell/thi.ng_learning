import { rem, at_media } from '@thi.ng/hiccup-css'
import { isObject, isString } from '@thi.ng/checks'
// create some utilities (we'll move these into a util directory later)

// factories
export const border = (color = 'black', radius = '0px', type = 'solid', thickness = '1px') => ({
  'border-radius': radius,
  'border': `${thickness} ${type} ${color}`,
  'outline': 'none',
})
export const font = (
  font = 'system-ui',
  weight = 'normal',
  style = 'normal',
  decoration = 'none'
) => ({
  'font-family': font,
  'font-weight': weight,
  'font-style': style,
  'text-decoration': decoration,
})
// scales
export const orangeScale = ['#DB5461', '#FF6D7C', '#FF939E']
// shortcodes
export const crs = { cursor: 'pointer' }
// use math to create variants
export const px = xsRem => ({
  xs: { padding: xsRem },
  sm: { padding: rem(xsRem * 1.5) },
  md: { padding: rem(xsRem * 3) },
  lg: { padding: rem(xsRem * 5) },
  xl: { padding: rem(xsRem * 8) },
})
export const padding = px(0.5)

// using a `styled-system` inspired media query function (HOF for adaptations)
export const styleSystem = (...breakPoints) => selector => (...values) => className =>
  isString(values[0])
    ? breakPoints.map((bkp, idx) =>
        values[idx]
          ? at_media({ 'screen': true, 'min-width': bkp }, [className, { [selector]: values[idx] }])
          : null
      )
    : isObject(values[0])
    ? breakPoints.map((bkp, idx) =>
        values[idx]
          ? at_media({ 'screen': true, 'min-width': bkp }, [className, values[idx]])
          : null
      )
    : null

// store your breakpoints once and export them if so desired:
export const breakPointsOn = styleSystem('0px', '599px', '959px', '1279px', '1919px')
