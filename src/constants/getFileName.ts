export const getfilename = (name: string) => {
  const mangname = name.split('.')
  mangname.pop()
  return mangname.join('')
}
