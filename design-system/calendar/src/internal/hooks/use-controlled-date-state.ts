import padToTwo from '../utils/pad-to-two';

import useControlled from './use-controlled';
import useLazyRef from './use-lazy-ref';

export default function useControlledDateState({
  day,
  defaultDay,
  month,
  defaultMonth,
  year,
  defaultYear,
  today,
  disabled,
  defaultDisabled,
  selected,
  defaultSelected,
  previouslySelected,
  defaultPreviouslySelected,
}: {
  day?: number;
  defaultDay: number;
  month?: number;
  defaultMonth: number;
  year?: number;
  defaultYear: number;
  today?: string;
  disabled?: Array<string>;
  defaultDisabled: Array<string>;
  selected?: Array<string>;
  defaultSelected: Array<string>;
  previouslySelected?: Array<string>;
  defaultPreviouslySelected: Array<string>;
}) {
  const { thisDay, thisMonth, thisYear } = useLazyRef(() => {
    const now = new Date();
    const thisDay = now.getDate();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();

    return {
      thisDay,
      thisMonth,
      thisYear,
    };
  });

  const [dayValue, setDayValue] = useControlled(
    day,
    () => defaultDay || thisDay,
  );

  const [monthValue, setMonthValue] = useControlled(
    month,
    () => defaultMonth || thisMonth,
  );

  const [yearValue, setYearValue] = useControlled(
    year,
    () => defaultYear || thisYear,
  );

  const [todayValue] = useControlled(
    today,
    () => today || `${thisYear}-${padToTwo(thisMonth)}-${padToTwo(thisDay)}`,
  );

  const [disabledValue] = useControlled(disabled, () => defaultDisabled);
  const [selectedValue, setSelectedValue] = useControlled(
    selected,
    () => defaultSelected,
  );

  const [previouslySelectedValue, setPreviouslySelectedValue] = useControlled(
    previouslySelected,
    () => defaultPreviouslySelected,
  );

  return {
    day: [dayValue, setDayValue],
    month: [monthValue, setMonthValue],
    year: [yearValue, setYearValue],
    today: [todayValue],
    disabled: [disabledValue],
    selected: [selectedValue, setSelectedValue],
    previous: [previouslySelectedValue, setPreviouslySelectedValue],
  } as const;
}