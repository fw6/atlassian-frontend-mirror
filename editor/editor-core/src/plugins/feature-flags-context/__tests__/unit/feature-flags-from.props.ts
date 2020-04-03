import { createFeatureFlagsFromProps } from '../../feature-flags-from-props';

describe('Feature Flags from Props', () => {
  describe('interactiveExpand', () => {
    it('should default interactiveExpand to true if allowExpand is true', () => {
      const flags = createFeatureFlagsFromProps({ allowExpand: true });
      expect(flags.interactiveExpand).toBe(true);
    });

    it('should default interactiveExpand to true if allowExpand is an empty object', () => {
      const flags = createFeatureFlagsFromProps({ allowExpand: {} });
      expect(flags.interactiveExpand).toBe(true);
    });

    it('should default interactiveExpand to false if allowExpand is false', () => {
      const flags = createFeatureFlagsFromProps({ allowExpand: false });
      expect(flags.interactiveExpand).toBe(false);
    });

    it('should default interactiveExpand to false if allowExpand.allowInteractiveExpand is false', () => {
      const flags = createFeatureFlagsFromProps({
        allowExpand: { allowInteractiveExpand: false },
      });
      expect(flags.interactiveExpand).toBe(false);
    });
  });

  describe('newInsertionBehaviour', () => {
    it('should reflect allowNewInsertionBehaviour prop as newInsertionBehaviour', () => {
      const flags = createFeatureFlagsFromProps({
        allowNewInsertionBehaviour: true,
      });
      expect(flags.newInsertionBehaviour).toBe(true);
    });
  });

  describe('moreTextColors', () => {
    it('should default moreTextColors to false if allowTextColour is true', () => {
      const flags = createFeatureFlagsFromProps({
        allowTextColor: true,
      });
      expect(flags.moreTextColors).toBe(false);
    });
    it('should default moreTextColors to false if allowTextColour is an empty object', () => {
      const flags = createFeatureFlagsFromProps({
        allowTextColor: {},
      });
      expect(flags.moreTextColors).toBe(false);
    });
    it('should set moreTextColors to false if allowTextColour.EXPERIMENTAL_allowMoreTextColors is false', () => {
      const flags = createFeatureFlagsFromProps({
        allowTextColor: {
          EXPERIMENTAL_allowMoreTextColors: false,
        },
      });
      expect(flags.moreTextColors).toBe(false);
    });
    it('should set moreTextColors to true if allowTextColour.EXPERIMENTAL_allowMoreTextColors is true', () => {
      const flags = createFeatureFlagsFromProps({
        allowTextColor: {
          EXPERIMENTAL_allowMoreTextColors: true,
        },
      });
      expect(flags.moreTextColors).toBe(true);
    });
  });

  describe('placeholder text', () => {
    it('should default placeholderHints to false if a an empty placeholderHints string array is provided', () => {
      const flags = createFeatureFlagsFromProps({
        placeholderHints: [],
      });
      expect(flags.placeholderHints).toBe(false);
    });
    it('should default placeholderHints to false if a no placeholderHints string array is provided', () => {
      const flags = createFeatureFlagsFromProps({
        placeholderHints: undefined,
      });
      expect(flags.placeholderHints).toBe(false);
    });
    it('should set placeholderHints to true if a placeholderHints string array is provided', () => {
      const flags = createFeatureFlagsFromProps({
        placeholderHints: ['foo', 'bar', 'baz'],
      });
      expect(flags.placeholderHints).toBe(true);
    });

    it('should default placeholderBracketHint to false if a no placeholderBracketHint string is provided', () => {
      const flags = createFeatureFlagsFromProps({
        placeholderBracketHint: undefined,
      });
      expect(flags.placeholderBracketHint).toBe(false);
    });
    it('should set placeholderBracketHint to true if a placeholderBracketHint string is provided', () => {
      const flags = createFeatureFlagsFromProps({
        placeholderBracketHint: 'hello world',
      });
      expect(flags.placeholderBracketHint).toBe(true);
    });
  });
});
