import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import TextArea from '../../text-area';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';

const noop = () => {};
const attributes = {
  componentName: 'textArea',
  packageName,
  packageVersion,
};

describe('TextArea analytics', () => {
  [
    { method: 'onFocus', action: 'focused' },
    { method: 'onBlur', action: 'blurred' },
  ].forEach(event => {
    it(`should fire an event on internal channel when ${event.action}`, async () => {
      const onAtlaskitEvent = jest.fn();
      const { getByTestId } = render(
        <AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
          <div>
            <TextArea testId="test" onBlur={noop} onFocus={noop} />
          </div>
        </AnalyticsListener>,
      );
      const textarea = getByTestId('test') as HTMLTextAreaElement;
      const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
        payload: {
          action: event.action,
          actionSubject: 'textArea',
          attributes,
        },
      });
      event.action === 'focused'
        ? fireEvent.focus(textarea)
        : fireEvent.blur(textarea);
      const mock: jest.Mock = onAtlaskitEvent;
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock.mock.calls[0][0].payload).toEqual(expected.payload);
    });
  });
});
