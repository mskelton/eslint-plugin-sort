declare global {
  // eslint-disable-next-line no-var
  var resolver: ((source: string) => boolean) | undefined
}
