export const isProduct = async () => {
  const argv = (await import('minimist')).default(process.argv.slice(2))
  if (argv.development) {
    return true
  }
  return false
}
