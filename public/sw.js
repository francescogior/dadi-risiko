self.addEventListener('install', () => {
  console.log('install')
})

self.addEventListener('activate', () => {
  console.log('activate')
})

self.addEventListener('fetch', event => {
  console.log('fetch')
})