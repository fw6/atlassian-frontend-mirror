import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, PluginKey, Transaction } from 'prosemirror-state';

import { Dispatch } from '../../../event-dispatcher';
import { textColorPalette } from '../../../ui/ColorPalette/Palettes/textColorPalette';
import { PaletteColor } from '../../../ui/ColorPalette/Palettes/type';
import { DEFAULT_BORDER_COLOR } from '../../../ui/ColorPalette/Palettes/common';
import { DEFAULT_COLOR, getActiveColor } from '../utils/color';
import { getDisabledState } from '../utils/disabled';

export { DEFAULT_COLOR } from '../utils/color';

export type TextColorPluginState = {
  palette: Array<PaletteColor>;
  defaultColor: string;
  disabled?: boolean;
  color: string | null;
};

export type ActionHandlerParams = {
  dispatch: Dispatch;
  pluginState: TextColorPluginState;
  tr: Transaction;
  params?: {
    color?: string;
    disabled?: boolean;
  };
};

export type TextColorDefaultColor = {
  color: string;
  label: string;
};

export interface TextColorPluginConfig {
  defaultColor?: TextColorDefaultColor;
  /** @deprecated [ED-15849] Color selection palette now shows more colors by default. */
  allowMoreTextColors?: boolean;
}

export function createInitialPluginState(
  editorState: EditorState,
  pluginConfig?: TextColorPluginConfig,
): TextColorPluginState {
  const defaultColor = pluginConfig?.defaultColor || DEFAULT_COLOR;

  const palette: Array<PaletteColor> = [
    {
      value: defaultColor.color,
      label: defaultColor.label,
      border: DEFAULT_BORDER_COLOR,
    },
    ...textColorPalette,
  ];

  const state = {
    color: getActiveColor(editorState),
    disabled: getDisabledState(editorState),
    palette,
    defaultColor: defaultColor.color,
  };

  return state;
}

export enum ACTIONS {
  RESET_COLOR,
  SET_COLOR,
  DISABLE,
}

export const pluginKey = new PluginKey<TextColorPluginState>('textColorPlugin');

export function createPlugin(
  dispatch: Dispatch,
  pluginConfig?: TextColorPluginConfig,
): SafePlugin {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init(_config, editorState) {
        return createInitialPluginState(editorState, pluginConfig);
      },
      apply(tr, pluginState, _, newState) {
        const meta = tr.getMeta(pluginKey) || {};

        let nextState;
        switch (meta.action) {
          case ACTIONS.RESET_COLOR:
            nextState = { ...pluginState, color: pluginState.defaultColor };
            break;

          case ACTIONS.SET_COLOR:
            nextState = { ...pluginState, color: meta.color, disabled: false };
            break;

          case ACTIONS.DISABLE:
            nextState = { ...pluginState, disabled: true };
            break;

          default:
            nextState = {
              ...pluginState,
              color: getActiveColor(newState),
              disabled: getDisabledState(newState),
            };
        }

        if (
          (pluginState && pluginState.color !== nextState.color) ||
          (pluginState && pluginState.disabled !== nextState.disabled)
        ) {
          dispatch(pluginKey, nextState);
          return nextState;
        }

        return pluginState;
      },
    },
  });
}
