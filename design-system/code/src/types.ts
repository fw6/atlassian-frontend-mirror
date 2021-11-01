import type { HTMLProps, ReactNode } from 'react';

export type {
  SupportedLanguages,
  Language,
  LanguageAlias,
  CodeBlockProps,
} from './internal/types';

export interface CodeProps extends HTMLProps<HTMLElement> {
  /**
   * A unique string that appears as a data attribute `data-testid`
   * in the rendered code. Serves as a hook for automated tests.
   */
  testId?: string;

  /**
   * Content to be rendered in the inline code block
   */
  children?: ReactNode;

  /**
   * When false, disables decorating code with bidi warnings
   *
   * defaults to true
   */
  codeBidiWarnings?: boolean;

  /**
   * Labels for the previous and next buttons used in pagination.
   * Defaults to `Bidirectional characters change the order that text is rendered. This could be used to obscure malicious code.`.
   */
  codeBidiWarningLabel?: string;
}
