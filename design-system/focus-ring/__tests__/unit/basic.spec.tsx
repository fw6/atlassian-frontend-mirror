import React from 'react';

import { render } from '@testing-library/react';

import Component from '../../src';

describe('Focus Ring', () => {
  it('renders', () => {
    const { getByTestId } = render(
      <Component>
        <div data-testid="test" />
      </Component>,
    );

    expect(getByTestId('test')).toBeDefined();
  });
});
