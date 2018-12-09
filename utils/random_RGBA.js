export const random_rgba = () => {
  const o = Math.round,
    r = Math.random,
    s = 255
  return (
    'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.4 + ')'
  )
}
