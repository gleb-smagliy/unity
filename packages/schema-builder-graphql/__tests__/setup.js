import { resultMatchers } from './result-matchers';
const fetchMock = require('jest-fetch-mock');

expect.extend({
  ...resultMatchers
});