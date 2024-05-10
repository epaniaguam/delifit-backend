import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
// const moviesJSON = require('./movies.json')

export const readJSON = (path) => require(path)
