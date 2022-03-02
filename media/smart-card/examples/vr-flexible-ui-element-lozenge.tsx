/** @jsx jsx */
import { jsx } from '@emotion/core';

import { HorizontalWrapper, VRTestWrapper } from './utils/vr-test';
import { FlexibleUiContext } from '../src/state/flexible-ui-context';
import { getContext } from './utils/flexible-ui';
import { State } from '../src/view/FlexibleCard/components/elements';
import { LozengeAppearance } from '../src/view/FlexibleCard/components/elements/lozenge/types';

const context = getContext({ state: { text: 'State' } });
const content = ['Short', 'Very long text, longer than long, long, long'];
const appearances: LozengeAppearance[] = [
  'default',
  'inprogress',
  'moved',
  'new',
  'removed',
  'success',
];

export default () => (
  <VRTestWrapper title="Flexible UI: Element: Lozenge">
    <FlexibleUiContext.Provider value={context}>
      <HorizontalWrapper>
        {appearances.map((appearance: LozengeAppearance, idx: number) => (
          <State
            key={idx}
            text={appearance as string}
            appearance={appearance}
            testId="vr-test-lozenge"
          />
        ))}
      </HorizontalWrapper>
      <HorizontalWrapper>
        {content.map((text: string, idx: number) => (
          <State
            key={idx}
            text={text}
            appearance="default"
            testId="vr-test-lozenge"
          />
        ))}
      </HorizontalWrapper>
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);