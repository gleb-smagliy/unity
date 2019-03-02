import { resultMatchers } from './result-matchers';

expect.extend({
  ...resultMatchers
});