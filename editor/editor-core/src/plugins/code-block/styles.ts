import { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, fontSize, gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import {
  blockNodesVerticalMargin,
  akEditorTableCellMinWidth,
  akEditorDeleteBackground,
  akEditorDeleteBorder,
  akEditorSelectedBorderSize,
  akEditorDeleteIconColor,
  SelectionStyle,
  getSelectionStyles,
  akEditorCodeFontFamily,
  akEditorSelectedNodeClassName,
  overflowShadow,
} from '@atlaskit/editor-shared-styles';

import { codeBlockClassNames } from './ui/class-names';

export const codeBlockStyles = css`
  .ProseMirror .code-block {
    position: relative;
    background-image: ${overflowShadow({
      background: themed({ light: colors.N20, dark: colors.DN50 }),
      width: '8px',
    })};
    background-repeat: no-repeat;
    background-color: ${themed({ light: colors.N20, dark: colors.DN50 })};
    background-attachment: local, scroll, scroll;
    background-size: 8px 100%, 8px 100%, 8px 100%;
    background-position: 100% 0, 100% 0, 0 0;
    font-family: ${akEditorCodeFontFamily};
    border-radius: ${borderRadius()}px;
    margin: ${blockNodesVerticalMargin} 0 0 0;
    counter-reset: line;
    display: flex;
    min-width: ${akEditorTableCellMinWidth}px;
    cursor: pointer;
    overflow-x: auto;

    .${codeBlockClassNames.gutter} {
      /* https://bitbucket.org/atlassian/atlassian-frontend/src/develop/packages/design-system/code/src/themes/themeBuilder.ts#packages/design-system/code/src/themes/themeBuilder.ts-19:28 */
      flex-shrink: 0;
      text-align: right;
      background-color: ${themed({ light: colors.N30, dark: colors.DN20 })};
      padding: ${gridSize()}px;

      span {
        display: block;
        line-height: 0;
        font-size: 0;

        &::before {
          display: inline-block;
          content: counter(line);
          counter-increment: line;
          font-size: ${fontSize()}px;
          line-height: 24px;
          color: ${themed({ light: colors.N400, dark: colors.DN400 })};
        }
      }
    }

    .${codeBlockClassNames.content} {
      display: flex;
      flex: 1;

      code {
        flex-grow: 1;
        tab-size: 4;
        cursor: text;
        /* https://bitbucket.org/atlassian/atlassian-frontend/src/218202daeaf527262c21841e6f88fa058d349ad4/packages/design-system/code/src/themes/themeBuilder.ts#lines-12:17 */
        font-size: ${fontSize()}px;
        line-height: 24px;
        color: ${themed({ light: colors.N800, dark: colors.DN800 })};
        border-radius: ${borderRadius()}px;
        margin: ${gridSize()}px;
        white-space: pre;
      }
    }
  }

  .ProseMirror li > .code-block {
    margin: 0;
  }

  .ProseMirror .code-block.${akEditorSelectedNodeClassName}:not(.danger) {
    ${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
  }

  /* Danger when top level node */
  .ProseMirror .danger.code-block {
    box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};

    .${codeBlockClassNames.gutter} {
      background-color: ${colors.R75};
      color: ${akEditorDeleteIconColor};
    }

    .${codeBlockClassNames.content} {
      background-color: ${akEditorDeleteBackground};
    }
  }

  /* Danger when nested node */
  .ProseMirror .danger .code-block {
    .${codeBlockClassNames.gutter} {
      background-color: rgba(255, 143, 115, 0.5);
      color: ${akEditorDeleteIconColor};
    }

    .${codeBlockClassNames.content} {
      background-color: rgba(255, 189, 173, 0.5);
    }
  }
`;
