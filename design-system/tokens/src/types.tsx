import type { InternalTokenIds } from './artifacts/types-internal';
import type { SpacingPaletteToken } from './palettes/spacing-scale';

export type Groups =
  | 'raw'
  | 'paint'
  | 'shadow'
  | 'palette'
  | 'opacity'
  | 'spacing'
  | 'scale'
  | 'fontSize'
  | 'fontWeight'
  | 'fontFamily'
  | 'lineHeight';

export type ActiveTokenState = 'active';
export type DeprecatedTokenState = 'deprecated';
export type DeletedTokenState = 'deleted';
export type ExperimentalTokenState = 'experimental';
export type TokenState =
  | ActiveTokenState
  | DeprecatedTokenState
  | DeletedTokenState
  | ExperimentalTokenState;
export type Replacement = InternalTokenIds | InternalTokenIds[]; // Ideally, this is typed to all tokens that are active
export type ExperimentalReplacement =
  | InternalTokenIds
  | InternalTokenIds[]
  | string; // Allow replacements that aren't tokens for experimental state

export type PaletteCategory =
  | 'blue'
  | 'purple'
  | 'red'
  | 'magenta'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'light mode neutral'
  | 'dark mode neutral';

export type ValueCategory = 'opacity';

export interface Token<TValue, Group extends Groups> {
  value: TValue;
  attributes: {
    group: Group;
    description?: string;
    state?: TokenState;
    replacement?: Replacement | ExperimentalReplacement;
  };
}

/**
 * Base tokens define the raw values consumed by Design Tokens. They are a context-agnostic
 * name:value pairing (for example, the base token Neutral0 represents the value #FFFFFF ).
 */
export interface BaseToken<TValue, Group extends Groups>
  extends Token<TValue, Group> {
  attributes: {
    group: Group;
  };
}

/**
 * Design tokens represent single sources of truth to name and store semantic design decisions.
 * They map a semantic name (color.background.default) to a base token (Neutral0).
 */
export interface DesignToken<TValue, Group extends Groups>
  extends Token<TValue, Group> {
  attributes:
    | {
        state: ActiveTokenState;
        group: Group;
        description: string;
        introduced: string;
        // specific to spacing values
        pixelValue?: Group extends 'spacing' ? string : never;
        suggest?: string[]; // optionally provide values that you want ESLint to suggest replacing
      }
    | {
        state: DeprecatedTokenState;
        group: Group;
        description: string;
        introduced: string;
        deprecated: string;
        replacement?: Replacement; // Still optional, as there may be no correct replacement
      }
    | {
        state: DeletedTokenState;
        group: Group;
        description: string;
        introduced: string;
        deprecated: string;
        deleted: string;
        replacement?: Replacement; // Still optional, as there may be no correct replacement
      }
    | {
        state: ExperimentalTokenState;
        group: Group;
        description: string;
        introduced: string;
        replacement?: ExperimentalReplacement; // Still optional, as there may be no correct replacement
        suggest?: string[]; // optionally provide values that you want ESLint to suggest replacing
      };
}

type OmitDistributive<T, K extends PropertyKey> = T extends any
  ? T extends object
    ? Id<DeepOmit<T, K>>
    : T
  : never;
type Id<T> = {} & { [P in keyof T]: T[P] };
type DeepOmit<T extends any, K extends PropertyKey> = Omit<
  { [P in keyof T]: OmitDistributive<T[P], K> },
  K
>;

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// Recursively strips out attributes from schema
export type ValueSchema<Schema extends object> = DeepOmit<Schema, 'attributes'>;

// Recursively strips out all token values from schema
export type ExtendedValueSchema<Schema extends object> = DeepPartial<
  ValueSchema<Schema>
>;

// Recursively strips out values from schema
export type AttributeSchema<Schema extends object> = DeepOmit<Schema, 'value'>;

export interface PaletteToken extends BaseToken<string, 'palette'> {
  attributes: {
    group: 'palette';
    category: PaletteCategory;
  };
}

export interface ValueToken extends BaseToken<number, 'palette'> {
  attributes: {
    group: 'palette';
    category: ValueCategory;
  };
}

export type PaintToken<BaseToken> = DesignToken<BaseToken, 'paint'>;

export type ShadowToken<BaseToken> = DesignToken<
  Array<{
    color: BaseToken;
    opacity: number;
    offset: { x: number; y: number };
    radius: number;
    spread?: number;
    inset?: boolean;
  }>,
  'shadow'
>;

export type OpacityToken = DesignToken<string, 'opacity'>;
export type SpacingToken = DesignToken<SpacingPaletteToken, 'spacing'>;
export type FontSizeToken<BaseToken> = DesignToken<BaseToken, 'fontSize'>;
export type FontWeightToken<BaseToken> = DesignToken<BaseToken, 'fontWeight'>;
export type FontFamilyToken<BaseToken> = DesignToken<BaseToken, 'fontFamily'>;
export type LineHeightToken<BaseToken> = DesignToken<BaseToken, 'lineHeight'>;

export type TypographyToken<BaseToken> = DesignToken<
  BaseToken,
  'fontSize' | 'fontWeight' | 'fontFamily' | 'lineHeight'
>;

export type RawToken = DesignToken<string, 'raw'>;

export interface ScaleToken extends BaseToken<string, 'scale'> {
  attributes: {
    group: 'scale';
  };
}

export interface PaletteColorTokenSchema<PaletteValues extends string> {
  value: {
    opacity: {
      Opacity20: ValueToken;
      Opacity40: ValueToken;
    };
  };
  color: {
    palette: Record<PaletteValues, PaletteToken>;
  };
}

export interface SpacingScaleTokenSchema<ScaleValues extends string> {
  space: Record<ScaleValues, ScaleToken>;
  spacing: {
    scale: Record<ScaleValues, ScaleToken>;
  };
}

export interface FontSizeScaleTokenSchema<ScaleValues extends string> {
  fontSize: Record<ScaleValues, ScaleToken>;
}

export interface FontWeightScaleTokenSchema<ScaleValues extends string> {
  fontWeight: Record<ScaleValues, ScaleToken>;
}

export interface FontFamilyPaletteTokenSchema<ScaleValues extends string> {
  fontFamily: Record<ScaleValues, ScaleToken>;
}

export interface LineHeightScaleTokenSchema<ScaleValues extends string> {
  lineHeight: Record<ScaleValues, ScaleToken>;
}

export interface BackgroundColorTokenSchema<BaseToken> {
  color: {
    blanket: {
      '[default]': PaintToken<BaseToken>;
      selected: PaintToken<BaseToken>;
      danger: PaintToken<BaseToken>;
    };
    background: {
      disabled: PaintToken<BaseToken>;
      inverse: {
        subtle: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      input: {
        '[default]': PaintToken<BaseToken>;
        hovered: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      neutral: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        subtle: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      brand: {
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      selected: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      danger: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      warning: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      success: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      discovery: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      information: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
    };
  };
}

export interface BorderColorTokenSchema<BaseToken> {
  color: {
    border: {
      '[default]': PaintToken<BaseToken>;
      bold: PaintToken<BaseToken>;
      inverse: PaintToken<BaseToken>;
      focused: PaintToken<BaseToken>;
      input: PaintToken<BaseToken>;
      disabled: PaintToken<BaseToken>;
      brand: PaintToken<BaseToken>;
      selected: PaintToken<BaseToken>;
      danger: PaintToken<BaseToken>;
      warning: PaintToken<BaseToken>;
      success: PaintToken<BaseToken>;
      discovery: PaintToken<BaseToken>;
      information: PaintToken<BaseToken>;
    };
  };
}

export interface IconColorTokenSchema<BaseToken> {
  color: {
    icon: {
      '[default]': PaintToken<BaseToken>;
      subtle: PaintToken<BaseToken>;
      inverse: PaintToken<BaseToken>;
      disabled: PaintToken<BaseToken>;
      brand: PaintToken<BaseToken>;
      selected: PaintToken<BaseToken>;
      danger: PaintToken<BaseToken>;
      warning: {
        '[default]': PaintToken<BaseToken>;
        inverse: PaintToken<BaseToken>;
      };
      success: PaintToken<BaseToken>;
      discovery: PaintToken<BaseToken>;
      information: PaintToken<BaseToken>;
    };
  };
}

export interface TextColorTokenSchema<BaseToken> {
  color: {
    text: {
      '[default]': PaintToken<BaseToken>;
      subtle: PaintToken<BaseToken>;
      subtlest: PaintToken<BaseToken>;
      inverse: PaintToken<BaseToken>;
      brand: PaintToken<BaseToken>;
      selected: PaintToken<BaseToken>;
      danger: PaintToken<BaseToken>;
      warning: {
        '[default]': PaintToken<BaseToken>;
        inverse: PaintToken<BaseToken>;
      };
      success: PaintToken<BaseToken>;
      information: PaintToken<BaseToken>;
      discovery: PaintToken<BaseToken>;
      disabled: PaintToken<BaseToken>;
    };
    link: {
      '[default]': PaintToken<BaseToken>;
      pressed: PaintToken<BaseToken>;
    };
  };
}

export interface AccentColorTokenSchema<BaseToken> {
  color: {
    text: {
      accent: {
        blue: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        red: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        orange: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        yellow: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        green: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        purple: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        teal: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        magenta: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        gray: {
          '[default]': PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
      };
    };
    icon: {
      accent: {
        blue: PaintToken<BaseToken>;
        red: PaintToken<BaseToken>;
        orange: PaintToken<BaseToken>;
        yellow: PaintToken<BaseToken>;
        green: PaintToken<BaseToken>;
        purple: PaintToken<BaseToken>;
        teal: PaintToken<BaseToken>;
        magenta: PaintToken<BaseToken>;
        gray: PaintToken<BaseToken>;
      };
    };
    border: {
      accent: {
        blue: PaintToken<BaseToken>;
        red: PaintToken<BaseToken>;
        orange: PaintToken<BaseToken>;
        yellow: PaintToken<BaseToken>;
        green: PaintToken<BaseToken>;
        purple: PaintToken<BaseToken>;
        teal: PaintToken<BaseToken>;
        magenta: PaintToken<BaseToken>;
        gray: PaintToken<BaseToken>;
      };
    };
    background: {
      accent: {
        blue: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        red: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        orange: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        yellow: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        green: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        teal: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        purple: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        magenta: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
        gray: {
          subtlest: PaintToken<BaseToken>;
          subtler: PaintToken<BaseToken>;
          subtle: PaintToken<BaseToken>;
          bolder: PaintToken<BaseToken>;
        };
      };
    };
  };
}

export interface InteractionColorTokenSchema<BaseToken> {
  color: {
    interaction: {
      pressed: PaintToken<BaseToken>;
      hovered: PaintToken<BaseToken>;
    };
  };
}

export interface SkeletonColorTokenSchema<BaseToken> {
  color: {
    skeleton: {
      '[default]': PaintToken<BaseToken>;
      subtle: PaintToken<BaseToken>;
    };
  };
}

export interface ChartColorTokenSchema<BaseToken> {
  color: {
    chart: {
      // semantic chart tokens
      brand: {
        '[default]': PaintToken<BaseToken>;
        hovered: PaintToken<BaseToken>;
      };
      neutral: {
        '[default]': PaintToken<BaseToken>;
        hovered: PaintToken<BaseToken>;
      };
      success: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      danger: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      warning: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      information: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      discovery: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      // categorical chart tokens
      categorical: {
        1: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        2: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        3: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        4: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        5: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        6: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        7: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        8: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      // generic chart tokens
      blue: {
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bolder: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        boldest: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      red: {
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bolder: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        boldest: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      orange: {
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bolder: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        boldest: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      yellow: {
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bolder: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        boldest: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      green: {
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bolder: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        boldest: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      teal: {
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bolder: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        boldest: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      purple: {
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bolder: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        boldest: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      magenta: {
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bolder: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        boldest: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
      gray: {
        bold: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        bolder: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
        boldest: {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
        };
      };
    };
  };
}

export interface UtilTokenSchema<BaseToken> {
  UNSAFE_util: {
    transparent: RawToken;
    MISSING_TOKEN: RawToken;
  };
}

export interface SurfaceTokenSchema<BaseToken> {
  elevation: {
    surface: {
      '[default]': {
        '[default]': PaintToken<BaseToken>;
        hovered: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      sunken: PaintToken<BaseToken>;
      raised: {
        '[default]': PaintToken<BaseToken>;
        hovered: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      overlay: {
        '[default]': PaintToken<BaseToken>;
        hovered: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
    };
  };
}

export interface ShadowTokenSchema<BaseToken> {
  elevation: {
    shadow: {
      raised: ShadowToken<BaseToken>;
      overflow: {
        '[default]': ShadowToken<BaseToken>;
        spread: PaintToken<BaseToken>;
        perimeter: PaintToken<BaseToken>;
      };
      overlay: ShadowToken<BaseToken>;
    };
  };
}

export interface OpacityTokenSchema {
  opacity: {
    loading: OpacityToken;
    disabled: OpacityToken;
  };
}

export interface DeprecatedTokenSchema<BaseToken> {
  color: {
    accent: {
      boldBlue: PaintToken<BaseToken>;
      boldGreen: PaintToken<BaseToken>;
      boldOrange: PaintToken<BaseToken>;
      boldPurple: PaintToken<BaseToken>;
      boldRed: PaintToken<BaseToken>;
      boldTeal: PaintToken<BaseToken>;
      subtleBlue: PaintToken<BaseToken>;
      subtleRed: PaintToken<BaseToken>;
      subtleGreen: PaintToken<BaseToken>;
      subtleOrange: PaintToken<BaseToken>;
      subtleTeal: PaintToken<BaseToken>;
      subtlePurple: PaintToken<BaseToken>;
      subtleMagenta: PaintToken<BaseToken>;
    };
    background: {
      accent: {
        blue: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        red: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        orange: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        yellow: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        green: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        teal: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        purple: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
        magenta: {
          '[default]': PaintToken<BaseToken>;
          bold: PaintToken<BaseToken>;
        };
      };
      default: PaintToken<BaseToken>;
      sunken: PaintToken<BaseToken>;
      card: PaintToken<BaseToken>;
      inverse: {
        '[default]': PaintToken<BaseToken>;
      };
      overlay: PaintToken<BaseToken>;
      selected: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
      };
      blanket: PaintToken<BaseToken>;
      brand: {
        '[default]': {
          '[default]': PaintToken<BaseToken>;
          hovered: PaintToken<BaseToken>;
          pressed: PaintToken<BaseToken>;
        };
      };
      boldBrand: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleBrand: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      boldDanger: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleDanger: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      boldWarning: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleWarning: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      boldSuccess: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleSuccess: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      boldDiscovery: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleDiscovery: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      boldNeutral: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      transparentNeutral: {
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleNeutral: {
        resting: PaintToken<BaseToken>;
        hover: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
      subtleBorderedNeutral: {
        resting: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
    };
    border: {
      focus: PaintToken<BaseToken>;
      neutral: PaintToken<BaseToken>;
    };
    iconBorder: {
      brand: PaintToken<BaseToken>;
      danger: PaintToken<BaseToken>;
      warning: PaintToken<BaseToken>;
      success: PaintToken<BaseToken>;
      discovery: PaintToken<BaseToken>;
    };
    text: {
      highEmphasis: PaintToken<BaseToken>;
      mediumEmphasis: PaintToken<BaseToken>;
      lowEmphasis: PaintToken<BaseToken>;
      onBold: PaintToken<BaseToken>;
      onBoldWarning: PaintToken<BaseToken>;
      link: {
        resting: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
    };
    overlay: {
      pressed: PaintToken<BaseToken>;
      hover: PaintToken<BaseToken>;
    };
    interaction: {
      inverse: {
        hovered: PaintToken<BaseToken>;
        pressed: PaintToken<BaseToken>;
      };
    };
  };
  shadow: {
    card: ShadowToken<BaseToken>;
    overlay: ShadowToken<BaseToken>;
  };
}

export type ElevationTokenSchema<BaseToken> = SurfaceTokenSchema<BaseToken> &
  ShadowTokenSchema<BaseToken>;

export type ColorTokenSchema<BaseToken> =
  BackgroundColorTokenSchema<BaseToken> &
    BorderColorTokenSchema<BaseToken> &
    IconColorTokenSchema<BaseToken> &
    TextColorTokenSchema<BaseToken> &
    AccentColorTokenSchema<BaseToken> &
    UtilTokenSchema<BaseToken>;

export type TokenSchema<BaseToken> = ColorTokenSchema<BaseToken> &
  ElevationTokenSchema<BaseToken>;

export interface SpacingTokenSchema {
  space: {
    '0': SpacingToken;
    '025': SpacingToken;
    '050': SpacingToken;
    '075': SpacingToken;
    '100': SpacingToken;
    '150': SpacingToken;
    '200': SpacingToken;
    '250': SpacingToken;
    '300': SpacingToken;
    '400': SpacingToken;
    '500': SpacingToken;
    '600': SpacingToken;
    '800': SpacingToken;
    '1000': SpacingToken;
  };
  spacing: {
    scale: {
      '0': SpacingToken;
      '025': SpacingToken;
      '050': SpacingToken;
      '075': SpacingToken;
      '100': SpacingToken;
      '150': SpacingToken;
      '200': SpacingToken;
      '250': SpacingToken;
      '300': SpacingToken;
      '400': SpacingToken;
      '500': SpacingToken;
      '600': SpacingToken;
      '800': SpacingToken;
      '1000': SpacingToken;
    };
    scaleLinear: {
      '0': SpacingToken;
      '100': SpacingToken;
      '200': SpacingToken;
      '300': SpacingToken;
      '400': SpacingToken;
      '500': SpacingToken;
      '600': SpacingToken;
      '700': SpacingToken;
      '800': SpacingToken;
      '900': SpacingToken;
      '1000': SpacingToken;
      '1100': SpacingToken;
    };
    size: {
      none: SpacingToken;
      xxxxSmall: SpacingToken;
      xxxSmall: SpacingToken;
      xxSmall: SpacingToken;
      xsmall: SpacingToken;
      small: SpacingToken;
      medium: SpacingToken;
      large: SpacingToken;
      xlarge: SpacingToken;
      xxlarge: SpacingToken;
      xxxlarge: SpacingToken;
      xxxxlarge: SpacingToken;
    };
    ecl: {
      element: {
        '2': SpacingToken;
        '4': SpacingToken;
        '6': SpacingToken;
        '8': SpacingToken;
      };
      container: {
        '12': SpacingToken;
        '16': SpacingToken;
        '20': SpacingToken;
        '24': SpacingToken;
      };
      layout: {
        '32': SpacingToken;
        '40': SpacingToken;
        '64': SpacingToken;
      };
    };
    ccc: {
      component: {
        '2': SpacingToken;
        '4': SpacingToken;
        '6': SpacingToken;
        '8': SpacingToken;
      };
      content: {
        '12': SpacingToken;
        '16': SpacingToken;
        '20': SpacingToken;
        '24': SpacingToken;
      };
      container: {
        '32': SpacingToken;
        '40': SpacingToken;
        '48': SpacingToken;
      };
    };
    gap: {
      '100': { value: 'Space100' };
      '200': { value: 'Space200' };
      '300': { value: 'Space300' };
    };
    inset: {
      '100': { value: 'Space100' };
      '200': { value: 'Space200' };
      '300': { value: 'Space300' };
    };
  };
}

export interface FontSizeTokenSchema<BaseToken> {
  font: {
    size: {
      '050': TypographyToken<BaseToken>;
      '075': TypographyToken<BaseToken>;
      '100': TypographyToken<BaseToken>;
      '200': TypographyToken<BaseToken>;
      '300': TypographyToken<BaseToken>;
      '400': TypographyToken<BaseToken>;
      '500': TypographyToken<BaseToken>;
      '600': TypographyToken<BaseToken>;
    };
  };
}

export interface FontWeightTokenSchema<BaseToken> {
  font: {
    weight: {
      regular: TypographyToken<BaseToken>;
      medium: TypographyToken<BaseToken>;
      semibold: TypographyToken<BaseToken>;
      bold: TypographyToken<BaseToken>;
    };
  };
}

export interface FontFamilyTokenSchema<BaseToken> {
  font: {
    family: {
      sans: TypographyToken<BaseToken>;
      monospace: TypographyToken<BaseToken>;
    };
  };
}

export interface LineHeightTokenSchema<BaseToken> {
  font: {
    lineHeight: {
      '100': TypographyToken<BaseToken>;
      '200': TypographyToken<BaseToken>;
      '300': TypographyToken<BaseToken>;
      '400': TypographyToken<BaseToken>;
      '500': TypographyToken<BaseToken>;
      '600': TypographyToken<BaseToken>;
    };
  };
}
