/* eslint-env jasmine */
/* eslint-disable no-restricted-properties */

import { linear } from './BinaryRingBuffer');

describe('linear', () => {
    it('linear', () => {
        expect(linear(1)).toEqual(1);
    });
});
