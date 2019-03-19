import { resultMatchers } from './result-matchers';
const fetchMock = require('jest-fetch-mock');

jest.setMock('node-fetch', fetchMock);

expect.extend({
  ...resultMatchers
});