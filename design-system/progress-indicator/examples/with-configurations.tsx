/** @jsx jsx */
import React, { ChangeEvent, FC, useState } from 'react';

import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import Box from '@atlaskit/ds-explorations/box';
import Inline from '@atlaskit/ds-explorations/inline';
import Stack from '@atlaskit/ds-explorations/stack';
import Text from '@atlaskit/ds-explorations/text';
import { N900 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ProgressIndicator } from '../src';

type Appearances = 'default' | 'help' | 'inverted' | 'primary';
type Sizes = 'small' | 'default' | 'large';
type Spacing = 'comfortable' | 'cozy' | 'compact';

const appearances: Appearances[] = ['default', 'primary', 'help', 'inverted'];
const sizes: Sizes[] = ['small', 'default', 'large'];
const spacing: Spacing[] = ['comfortable', 'cozy', 'compact'];
const values = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];

const invertedFooterStyles = css({
  backgroundColor: token('color.text', N900),
});

const Footer: FC<{ appearance: string }> = ({ appearance, children }) => (
  <Box
    as="footer"
    display="block"
    css={appearance === 'inverted' ? invertedFooterStyles : null}
  >
    {children}
  </Box>
);

const headingStyles = css({
  color: token('color.background.neutral.bold', 'N900'),
  fontWeight: token('font.weight.medium', '500'),
});

const pageStyles = css({
  maxWidth: '840px',
  marginInline: 'auto',
});

const SpreadInlineLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Inline gap="space.100" justifyContent="space-between" alignItems="center">
      {children}
    </Inline>
  );
};

const ProgressIndicatorDots: FC<{}> = () => {
  const [isInteractive, setIsInteractive] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedAppearance, setSelectedAppearance] =
    useState<Appearances>('primary');
  const [selectedSize, setSelectedSize] = useState<Sizes>('default');
  const [selectedSpacing, setSelectedSpacing] =
    useState<Spacing>('comfortable');

  const handleSelect = ({
    event,
    index: selectedIndex,
  }: {
    event: React.MouseEvent<HTMLButtonElement>;
    index: number;
  }): void => {
    setSelectedIndex(selectedIndex);
  };

  const handlePrev = () => {
    setSelectedIndex((prevState) => prevState - 1);
  };

  const handleNext = () => {
    setSelectedIndex((prevState) => prevState + 1);
  };

  const toggleAppearance = (
    selectedAppearance: 'default' | 'help' | 'inverted' | 'primary',
  ) => setSelectedAppearance(selectedAppearance);

  const toggleSize = (selectedSize: Sizes) => setSelectedSize(selectedSize);

  const toggleSpacing = (selectedSpacing: Spacing) =>
    setSelectedSpacing(selectedSpacing);

  const toggleInteractivity = (event: ChangeEvent<HTMLInputElement>) =>
    setIsInteractive(event.target.checked);

  return (
    <Box display="block" css={pageStyles}>
      <Box display="block" paddingBlock="space.400">
        <Stack gap="space.400">
          <SpreadInlineLayout>
            <Stack gap="space.150">
              <Box css={headingStyles} display="block">
                Appearance
              </Box>
              <ButtonGroup>
                {appearances.map((app) => (
                  <Button
                    isSelected={selectedAppearance === app}
                    key={app}
                    onClick={() => toggleAppearance(app)}
                    spacing="compact"
                  >
                    {app}
                  </Button>
                ))}
              </ButtonGroup>
            </Stack>
            <Stack gap="space.150">
              <Box css={headingStyles} display="block">
                Spacing
              </Box>
              <ButtonGroup>
                {spacing.map((spc) => (
                  <Button
                    isSelected={selectedSpacing === spc}
                    key={spc}
                    onClick={() => toggleSpacing(spc)}
                    spacing="compact"
                  >
                    {spc}
                  </Button>
                ))}
              </ButtonGroup>
            </Stack>
            <Stack gap="space.150">
              <Box css={headingStyles} display="block">
                Size
              </Box>
              <ButtonGroup>
                {sizes.map((sz) => (
                  <Button
                    isSelected={selectedSize === sz}
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    spacing="compact"
                  >
                    {sz}
                  </Button>
                ))}
              </ButtonGroup>
            </Stack>
          </SpreadInlineLayout>
          <SpreadInlineLayout>
            <Box as="label" htmlFor="input">
              <Inline gap="space.100" alignItems="center">
                {/* eslint-disable-next-line @repo/internal/react/use-primitives*/}
                <input
                  checked={isInteractive}
                  id="input"
                  onChange={toggleInteractivity}
                  type="checkbox"
                />
                <Text as="strong" fontWeight="bold">
                  Allow interaction with indicators
                </Text>
              </Inline>
            </Box>
          </SpreadInlineLayout>
          <Box display="block">
            {values.map((v, i) => {
              const selected = i === selectedIndex;
              const panelId = `panel${i}`;

              return (
                <Box
                  display="block"
                  aria-hidden={!selected}
                  aria-labelledby={`tab${i}`}
                  key={v}
                  id={panelId}
                  role="tabpanel"
                  UNSAFE_style={{ display: selected ? 'block' : 'none' }}
                >
                  <Stack gap="space.100">
                    <Text as="strong" fontSize="size.100" fontWeight="bold">
                      Panel {i + 1}
                    </Text>
                    <Lorem count={3} />
                  </Stack>
                </Box>
              );
            })}
          </Box>
          <Footer appearance={selectedAppearance}>
            <Box
              display="block"
              paddingBlock="space.150"
              paddingInline="space.100"
            >
              <SpreadInlineLayout>
                <Button
                  isDisabled={selectedIndex === 0}
                  appearance={
                    selectedAppearance === 'inverted' ? 'primary' : 'default'
                  }
                  onClick={handlePrev}
                >
                  Prev
                </Button>
                <ProgressIndicator
                  appearance={selectedAppearance}
                  onSelect={isInteractive ? handleSelect : undefined}
                  selectedIndex={selectedIndex}
                  size={selectedSize}
                  spacing={selectedSpacing}
                  values={values}
                />
                <Button
                  isDisabled={selectedIndex === values.length - 1}
                  appearance={
                    selectedAppearance === 'inverted' ? 'primary' : 'default'
                  }
                  onClick={handleNext}
                >
                  Next
                </Button>
              </SpreadInlineLayout>
            </Box>
          </Footer>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProgressIndicatorDots;
