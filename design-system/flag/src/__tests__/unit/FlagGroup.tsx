import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import Flag from '../../index';
import { FlagProps } from '../../types';
import FlagGroup from '../../flag-group';

// eslint-disable-next-line import/no-extraneous-dependencies
import { matchers } from 'jest-emotion';

expect.extend(matchers);

describe('FlagGroup', () => {
  const generateFlag = (extraProps?: Partial<FlagProps>) => (
    <Flag id={''} icon={<div />} title="Flag" {...extraProps} />
  );

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render Flag children in the correct place', () => {
    const { getByTestId, queryByTestId } = render(
      <FlagGroup>
        {generateFlag({ testId: '0' })}
        {generateFlag({ testId: '1' })}
        {generateFlag({ testId: '2' })}
      </FlagGroup>,
    );

    expect(queryByTestId('0')).toBeTruthy();

    const flag1Container = getByTestId('1').parentElement;
    const flag2Container = getByTestId('2').parentElement;
    if (flag1Container === null || flag2Container === null) {
      throw Error('Flag 1 and 1 missing container');
    }

    const flag1ContainerStyle = window.getComputedStyle(flag1Container);
    expect(flag1ContainerStyle.transform).toBe(
      'translateX(0) translateY(100%) translateY(16px)',
    );

    const flag2ContainerStyle = window.getComputedStyle(flag2Container);
    expect(flag2ContainerStyle.transform).toBe(
      'translateX(0) translateY(100%) translateY(16px)',
    );
  });

  it('should move Flag children up when dismissed', () => {
    const spy = jest.fn();
    const { getByTestId, queryByTestId, rerender } = render(
      <FlagGroup onDismissed={spy}>
        {generateFlag({ testId: '0', id: '0' })}
        {generateFlag({ testId: '1', id: '2' })}
        {generateFlag({ testId: '2', id: '2' })}
      </FlagGroup>,
    );

    rerender(
      <FlagGroup onDismissed={spy}>
        {generateFlag({ testId: '1', id: '2' })}
        {generateFlag({ testId: '2', id: '2' })}
      </FlagGroup>,
    );

    act(() => jest.runAllTimers());
    expect(queryByTestId('0')).toBeNull();

    const flag1Container = getByTestId('1').parentElement;
    const flag2Container = getByTestId('2').parentElement;
    if (flag1Container === null || flag2Container === null) {
      throw Error('Flag 1 or 2 missing container');
    }

    const flag1ContainerStyle = window.getComputedStyle(flag1Container);
    expect(flag1ContainerStyle.transform).toBe('translate(0,0)');

    const flag2ContainerStyle = window.getComputedStyle(flag2Container);
    expect(flag2ContainerStyle.transform).toBe(
      'translateX(0) translateY(100%) translateY(16px)',
    );
    expect(flag2ContainerStyle.visibility).toBe('visible');
  });

  it('should move Flag children down when new flag is added', () => {
    const spy = jest.fn();
    const { getByTestId, rerender } = render(
      <FlagGroup onDismissed={spy}>
        {generateFlag({ testId: '1', id: '1' })}
        {generateFlag({ testId: '2', id: '2' })}
      </FlagGroup>,
    );

    rerender(
      <FlagGroup onDismissed={spy}>
        {generateFlag({ testId: '0', id: '0' })}
        {generateFlag({ testId: '1', id: '2' })}
        {generateFlag({ testId: '2', id: '2' })}
      </FlagGroup>,
    );

    act(() => jest.runAllTimers());

    const flag0Container = getByTestId('0').parentElement;
    const flag1Container = getByTestId('1').parentElement;
    const flag2Container = getByTestId('2').parentElement;
    if (
      flag0Container === null ||
      flag1Container === null ||
      flag2Container === null
    ) {
      throw Error('Flag 0, 1 or 2 missing container');
    }

    const flag0ContainerStyle = window.getComputedStyle(flag0Container);
    expect(flag0ContainerStyle.transform).toBe('translate(0,0)');

    const flag1ContainerStyle = window.getComputedStyle(flag1Container);
    expect(flag1ContainerStyle.transform).toBe(
      'translateX(0) translateY(100%) translateY(16px)',
    );

    const flag2ContainerStyle = window.getComputedStyle(flag2Container);
    expect(flag2ContainerStyle.transform).toBe(
      'translateX(0) translateY(100%) translateY(16px)',
    );
  });

  it('onDismissed should be called when child Flag is dismissed', () => {
    const spy = jest.fn();
    const { getByTestId } = render(
      <FlagGroup onDismissed={spy}>
        {generateFlag({
          id: 'a',
          testId: 'a',
        })}
        {generateFlag({ id: 'b' })}
      </FlagGroup>,
    );

    fireEvent.click(getByTestId('a-dismiss'));
    act(() => jest.runAllTimers());

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a', expect.anything());
  });

  it('should render screen reader text only when FlagGroup has children', () => {
    const { queryByText } = render(<FlagGroup>{generateFlag()}</FlagGroup>);
    expect(queryByText('Flag notifications')).toBeTruthy();
  });

  it("should not render screen reader text when FlagGroup doesn't have children", () => {
    const { queryByText } = render(<FlagGroup></FlagGroup>);
    expect(queryByText('Flag notifications')).toBeFalsy();
  });

  it('should render custom screen reader text and tag from props', () => {
    const { getByText } = render(
      <FlagGroup label="notifs" labelTag="h3">
        {generateFlag()}
      </FlagGroup>,
    );
    const screenReaderText = getByText('notifs');
    expect(screenReaderText.nodeName).toBe('H3');
  });
});