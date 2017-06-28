
import { lensFamily } from '../../src/index'

const lukePath = ['starwars', 'luke'] // alternatively 'starwars.luke'

const lensRequestMetaData = lensPath => lensFamily(lensPath)([
  'loading',
  'finished',
  'error',
])


export const lukeRequestMeta = lensRequestMetaData(lukePath)

const lukeLensFamily = lensFamily('starwars.luke.value')

export const lukeData = lukeLensFamily([
  'birth_year',
  'gender',
  'mass',
  'height',
  'name',
])

const aliceLensFamily = lensFamily('wonderland')

export const alicelenses = aliceLensFamily([
  'cheshire[10][2]',
])

const lukeURL = 'http://slowwly.robertomurray.co.uk/delay/1000/url/http://swapi.co/api/people/1/'


export const lukeDataSource = {
  path: 'starwars.luke',
  url: lukeURL,
  method: 'GET',
  body: {},
}