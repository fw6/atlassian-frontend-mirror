import React from 'react';

import styled from '@emotion/styled';
import { scaleOrdinal } from '@visx/scale';

import { colorSequence } from '../../colors';

import { LinearChart } from './LinearChart';
import { PieChart } from './PieChart';
import { Wrapper } from './styled';
import { ChartTypes } from './types';
import { tableToColumnSet } from './utilities';

export { ChartTypes };

export const ChartTitle = styled.div`
  font-size: 20px;
  text-align: center;
  position: relative;
  top: 10px;
`;

export const Chart = ({
  testId,
  chartType,
  data,
  chartTitle,
  showLegend,
  legendPosition,
  height,
}: any) => {
  if (!data) {
    return <Wrapper testId={testId} />;
  }

  const ChartComponent = chartType === ChartTypes.PIE ? PieChart : LinearChart;
  const [seriesNames, tableData] = tableToColumnSet(data);
  const xAccessor = seriesNames[0];

  const ordinalColorScale = scaleOrdinal({
    domain: seriesNames.filter(name => name !== xAccessor),
    range: colorSequence,
  });

  const chartProps = {
    testId,
    chartType,
    data,
    chartTitle,
    showLegend,
    seriesNames,
    tableData,
    chartScale: ordinalColorScale,
    xAccessor,
    legendPosition,
    height,
  };

  return (
    <Wrapper testId={testId}>
      <ChartTitle>{chartTitle}</ChartTitle>
      <ChartComponent {...chartProps} />
    </Wrapper>
  );
};
