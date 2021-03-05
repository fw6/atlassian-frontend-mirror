import React from 'react';

import {
  fireEvent,
  queryByAttribute,
  render,
  RenderResult,
  within,
} from '@testing-library/react';
import cases from 'jest-in-case';

import Calendar, { CalendarProps } from '../../index';

jest.mock('react-uid', () => ({
  useUIDSeed: () => () => 'react-uid',
}));

const getById = queryByAttribute.bind(null, 'id');

const getDayElement = (renderResult: RenderResult, textContent: string) =>
  renderResult.getAllByRole(
    (content, element) =>
      content === 'gridcell' && element.textContent === textContent,
  )[0];

const getCalendarElement = (renderResult: RenderResult) =>
  renderResult.getByRole(
    (content, element) =>
      content === 'grid' && element.getAttribute('aria-label') === 'calendar',
  );

const getSwitchMonthElement = (renderResult: RenderResult, label: string) =>
  renderResult.getAllByRole(
    (content, element) =>
      content === 'img' && element.getAttribute('aria-label') === label,
  )[0];

const getHeaderElements = (renderResult: RenderResult, values: string[]) =>
  renderResult.getByRole(
    (content, element) =>
      content === 'presentation' &&
      element.firstChild?.nodeName.toLowerCase() === 'thead' &&
      element.firstChild?.textContent === values.join(''),
  );

const getAnnouncerElementTextContent = (container: HTMLElement) =>
  getById(container, 'announce-react-uid')?.textContent;

describe('Calendar', () => {
  const setup = (calendarProps: Partial<CalendarProps> = {}) => {
    const props = {
      defaultDisabled: ['2019-12-04'],
      defaultPreviouslySelected: ['2019-12-06'],
      defaultSelected: ['2019-12-08'],
      defaultDay: 1,
      defaultMonth: 12,
      defaultYear: 2019,
      onBlur: jest.fn(),
      onChange: jest.fn(),
      onFocus: jest.fn(),
      onSelect: jest.fn(),
      testId: 'calendar',
    };
    const ref = React.createRef<HTMLDivElement>();

    const renderResult = render(
      <Calendar {...props} {...calendarProps} ref={ref} />,
    );

    return {
      renderResult,
      props,
      ref,
    };
  };

  it('should render announcer date', () => {
    const { renderResult } = setup();

    expect(getAnnouncerElementTextContent(renderResult.container)).toContain(
      'Wed Jan 01 2020',
    );
  });

  describe('Heading', () => {
    it('should render the title', () => {
      const { renderResult } = setup();

      expect(renderResult.getByText('December 2019')).toBeInTheDocument();
    });

    it('should switch to previous month when clicked on left arrow button', () => {
      const { renderResult, props } = setup();

      fireEvent.click(getSwitchMonthElement(renderResult, 'Last month'));

      expect(renderResult.getByText('November 2019')).toBeInTheDocument();

      expect(getAnnouncerElementTextContent(renderResult.container)).toContain(
        'Sun Dec 01 2019',
      );

      expect(props.onChange).toHaveBeenCalledWith(
        { day: 1, iso: '2019-11-01', month: 11, type: 'prev', year: 2019 },
        expect.anything(),
      );
    });

    it('should switch to next month when clicked on right arrow button', () => {
      const { renderResult, props } = setup();

      fireEvent.click(getSwitchMonthElement(renderResult, 'Next month'));

      expect(renderResult.getByText('January 2020')).toBeInTheDocument();

      expect(getAnnouncerElementTextContent(renderResult.container)).toContain(
        'Sat Feb 01 2020',
      );

      expect(props.onChange).toHaveBeenCalledWith(
        { day: 1, iso: '2020-01-01', month: 1, type: 'next', year: 2020 },
        expect.anything(),
      );
    });

    it('month arrow buttons should have tabindex=-1', () => {
      const { renderResult } = setup();

      expect(
        renderResult.getByTestId('calendar--previous-month'),
      ).toHaveAttribute('tabindex', '-1');

      expect(renderResult.getByTestId('calendar--next-month')).toHaveAttribute(
        'tabindex',
        '-1',
      );
    });
  });

  describe('Date', () => {
    it('should render default selected day', () => {
      const { renderResult } = setup();

      const selectedDayElement = getDayElement(renderResult, '8');

      expect(selectedDayElement).toHaveAttribute('aria-selected', 'true');
    });

    it('should handle day selection behavior', () => {
      const { renderResult, props } = setup();

      const selectedDayElement = getDayElement(renderResult, '8');
      const nextUnSelectedDayElement = selectedDayElement.nextSibling as HTMLTableDataCellElement;
      const nextUnSelectedDayInnerElement = within(
        nextUnSelectedDayElement,
      ).getByText('9');

      expect(nextUnSelectedDayElement).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(nextUnSelectedDayInnerElement).toHaveStyle(
        'background-color: transparent',
      );

      fireEvent.click(nextUnSelectedDayElement);

      expect(nextUnSelectedDayElement).toHaveAttribute('aria-selected', 'true');
      expect(nextUnSelectedDayInnerElement).toHaveStyle(
        'background-color: rgb(66, 82, 110)',
      );

      expect(props.onSelect).toHaveBeenCalledWith(
        {
          day: 9,
          iso: '2019-12-09',
          month: 12,
          year: 2019,
        },
        expect.anything(),
      );
    });

    it('should not select day if disabled', () => {
      const { renderResult, props } = setup();

      const disabledDayElement = getDayElement(renderResult, '4');
      const disabledDayInnerElement = within(disabledDayElement).getByText('4');

      expect(disabledDayInnerElement).toHaveAttribute('data-disabled', 'true');

      fireEvent.click(disabledDayElement);

      expect(props.onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Date cell cursor', () => {
    it('show cursor pointer', () => {
      const { renderResult } = setup();
      const cell = getDayElement(renderResult, '15');
      expect(cell.firstChild).toHaveStyle('cursor: pointer');
    });
    it('cursor not-allowed when disabled', () => {
      const { renderResult } = setup();
      const disabledCell = getDayElement(renderResult, '4');
      expect(disabledCell.firstChild).toHaveStyle('cursor: not-allowed');
    });
  });

  it('should have tabindex=0', () => {
    const { renderResult } = setup();

    const calendarElement = getCalendarElement(renderResult);
    expect(calendarElement).toHaveAttribute('tabindex', '0');
  });

  it('should handle onBlur and focus event', () => {
    const { renderResult, props } = setup();

    const { container } = renderResult;
    const calendarContainerElement = container.firstChild as HTMLDivElement;

    fireEvent.focus(calendarContainerElement);

    expect(props.onFocus).toHaveBeenCalledTimes(1);
    expect(getAnnouncerElementTextContent(container)).toContain(
      'Wed Jan 01 2020',
    );

    fireEvent.blur(calendarContainerElement);

    expect(props.onBlur).toHaveBeenCalledTimes(1);
    expect(getAnnouncerElementTextContent(container)).toContain(
      'Tue Dec 31 2019',
    );

    fireEvent.focus(calendarContainerElement);

    expect(props.onFocus).toHaveBeenCalledTimes(2);
    expect(getAnnouncerElementTextContent(container)).toContain(
      'Wed Jan 01 2020',
    );
  });

  cases(
    'should select day when following keys are pressed',
    ({ key, code }: { key: string; code: string }) => {
      const { renderResult, props } = setup({
        defaultDay: 10,
      });

      const currentSelectedDayElement = getDayElement(renderResult, '8');
      const currentSelectedDayInnerElement = within(
        currentSelectedDayElement,
      ).getByText('8');

      expect(currentSelectedDayElement).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(currentSelectedDayInnerElement).toHaveStyle(
        'background-color: rgb(66, 82, 110)',
      );

      const isPrevented = fireEvent.keyDown(
        renderResult.container.firstChild as HTMLDivElement,
        {
          key,
          code,
        },
      );

      expect(currentSelectedDayInnerElement).toHaveStyle(
        'background-color: rgb(222, 235, 255)',
      );

      const newSelectedDayElement = getDayElement(renderResult, '10');
      const newSelectedDayInnerElement = within(
        newSelectedDayElement,
      ).getByText('10');

      expect(newSelectedDayElement).toHaveAttribute('aria-selected', 'true');
      expect(newSelectedDayInnerElement).toHaveStyle(
        'background-color: rgb(66, 82, 110)',
      );

      expect(isPrevented).toBe(false);
      expect(props.onSelect).toHaveBeenCalledWith(
        {
          day: 10,
          iso: '2019-12-10',
          month: 12,
          year: 2019,
        },
        expect.anything(),
      );
    },
    [
      { name: 'Enter', key: 'Enter', code: 'Enter' },
      { name: 'Space', key: ' ', code: 'Space' },
    ],
  );

  cases(
    'should highlight day when following keys are pressed',
    ({
      key,
      code,
      date,
    }: {
      key: string;
      code: string;
      date: {
        day: number;
        iso: string;
        month: number;
        year: number;
      };
    }) => {
      const { renderResult, props } = setup({
        defaultDay: 15,
      });

      const currentHighlightedDayElement = getDayElement(renderResult, '15');
      const currentHighlightedDayInnerElement = within(
        currentHighlightedDayElement,
      ).getByText('15');

      expect(currentHighlightedDayInnerElement).toHaveStyle(
        'border: 2px solid #4c9aff',
      );

      const isPrevented = fireEvent.keyDown(
        renderResult.container.firstChild as HTMLDivElement,
        {
          key,
          code,
        },
      );

      expect(currentHighlightedDayInnerElement).toHaveStyle(
        'border: 2px solid transparent',
      );

      const stringifiedDay = date.day.toString();
      const newHighlightedDayElement = getDayElement(
        renderResult,
        stringifiedDay,
      );
      const newHighlightedDayInnerElement = within(
        newHighlightedDayElement,
      ).getByText(stringifiedDay);

      expect(newHighlightedDayInnerElement).toHaveStyle(
        'border: 2px solid #4c9aff',
      );

      expect(isPrevented).toBe(false);
      expect(props.onChange).toHaveBeenCalledWith(date, expect.anything());
    },
    [
      {
        name: 'ArrowDown',
        key: 'ArrowDown',
        code: 'ArrowDown',
        date: {
          day: 22,
          iso: '2019-12-22',
          month: 12,
          year: 2019,
          type: 'down',
        },
      },
      {
        name: 'ArrowLeft',
        key: 'ArrowLeft',
        code: 'ArrowLeft',
        date: {
          day: 14,
          iso: '2019-12-14',
          month: 12,
          year: 2019,
          type: 'left',
        },
      },
      {
        name: 'ArrowRight',
        key: 'ArrowRight',
        code: 'ArrowRight',
        date: {
          day: 16,
          iso: '2019-12-16',
          month: 12,
          year: 2019,
          type: 'right',
        },
      },
      {
        name: 'ArrowUp',
        key: 'ArrowUp',
        code: 'ArrowUp',
        date: {
          day: 8,
          iso: '2019-12-08',
          month: 12,
          year: 2019,
          type: 'up',
        },
      },
    ],
  );

  it('should switch to previous month and highlight the day when navigated through arrow keys at the edge', () => {
    const { renderResult, props } = setup({
      defaultDay: 1,
    });

    const currentHighlightedDayElement = getDayElement(renderResult, '1');
    const currentHighlightedDayInnerElement = within(
      currentHighlightedDayElement,
    ).getByText('1');

    expect(currentHighlightedDayInnerElement).toHaveStyle(
      'border: 2px solid #4c9aff',
    );

    const isPrevented = fireEvent.keyDown(
      renderResult.container.firstChild as HTMLDivElement,
      {
        key: 'ArrowUp',
        code: 'ArrowUp',
      },
    );

    expect(currentHighlightedDayInnerElement).toHaveStyle(
      'border: 2px solid transparent',
    );

    const newHighlightedDayElement = getDayElement(renderResult, '24');
    const newHighlightedDayInnerElement = within(
      newHighlightedDayElement,
    ).getByText('24');

    expect(newHighlightedDayInnerElement).toHaveStyle(
      'border: 2px solid #4c9aff',
    );

    expect(isPrevented).toBe(false);
    expect(props.onChange).toHaveBeenCalledWith(
      {
        day: 24,
        iso: '2019-11-24',
        month: 11,
        year: 2019,
        type: 'up',
      },
      expect.anything(),
    );
  });

  it('should assign passed ref to top level element', () => {
    const { renderResult, ref } = setup();

    expect(ref.current).toBe(renderResult.container.firstChild);
  });

  it('should rerender calendar with new date when passed from outside', () => {
    const { renderResult } = setup({
      day: 10,
      month: 5,
      year: 2019,
    });

    expect(getAnnouncerElementTextContent(renderResult.container)).toContain(
      'Mon Jun 10 2019',
    );

    renderResult.rerender(<Calendar day={15} month={5} year={2019} />);

    expect(getAnnouncerElementTextContent(renderResult.container)).toContain(
      'Sat Jun 15 2019',
    );
  });

  it('should render weekdays depending on #weekStartDay', () => {
    expect(
      getHeaderElements(setup().renderResult, [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
      ]),
    ).toBeInTheDocument();

    expect(
      getHeaderElements(setup({ weekStartDay: 1 }).renderResult, [
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
        'Sun',
      ]),
    ).toBeInTheDocument();
  });
});