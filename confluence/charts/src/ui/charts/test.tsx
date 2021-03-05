import React from 'react';

import { render } from '@testing-library/react';

import Charts from './index';

describe('Charts', () => {
  describe('testId property', () => {
    test('Should be found by data-testid', async () => {
      const testId = 'charts';
      const { getByTestId } = render(<Charts testId={testId} />);
      expect(getByTestId(testId)).toBeTruthy();
    });
  });
});