import { ADFEntity, ValidationError } from '@atlaskit/adf-utils';

import {
  validationErrorHandler,
  wrapWithUnsupported,
} from '../../../utils/validate-using-spec';

const unsupportedNode: ADFEntity = {
  type: 'xyz',
  text: 'hello',
};

const unsupportedBlockWithContents: ADFEntity = {
  type: 'x',
  text: 'hello',
  attrs: { id: '4' },
  content: [
    {
      type: 'text',
      text: 'task',
      marks: [{ type: 'strong' }],
    },
  ],
};

const unsupportedInlineWithContents: any = {
  type: 'x',
  attrs: { id: '4', text: '@hey' },
};

const marks: string[] = ['indentation'];

describe('wrapWithUnsupported', () => {
  it('should wrap given node in unsupported block by default', () => {
    const wrapped = wrapWithUnsupported(unsupportedNode);
    expect(wrapped.type).toBe('unsupportedBlock');
    expect(wrapped.attrs).toEqual({
      originalValue: unsupportedNode,
    });
  });

  it('should wrap given node in unsupported block when type is block', () => {
    const wrapped = wrapWithUnsupported(unsupportedNode, 'block');
    expect(wrapped.type).toBe('unsupportedBlock');
    expect(wrapped.attrs).toEqual({
      originalValue: unsupportedNode,
    });
  });

  it('should preserve contents in unsupported block', () => {
    const wrapped = wrapWithUnsupported(unsupportedBlockWithContents);
    expect(wrapped.type).toBe('unsupportedBlock');
    expect(wrapped.attrs.originalValue).toEqual(unsupportedBlockWithContents);
  });

  it('should wrap given inline node in unsupported inline', () => {
    const wrapped = wrapWithUnsupported(unsupportedNode, 'inline');
    expect(wrapped.type).toBe('unsupportedInline');
    expect(wrapped.attrs).toEqual({
      originalValue: unsupportedNode,
    });
  });

  it('should preserve contents in unsupported inline', () => {
    const wrapped = wrapWithUnsupported(
      unsupportedInlineWithContents,
      'inline',
    );
    expect(wrapped.type).toBe('unsupportedInline');
    expect(wrapped.attrs.originalValue).toEqual(unsupportedInlineWithContents);
  });
});

describe('validationErrorHandler', () => {
  const validationError: ValidationError = {
    code: 'INVALID_CONTENT',
    message: 'x: invalid content.',
  };

  it('should handle unsupported block', () => {
    const options = {
      allowUnsupportedBlock: true,
    };
    const result = validationErrorHandler(
      unsupportedNode,
      validationError,
      options,
      marks,
    );
    expect(result).toBeDefined();
    expect(result && result.type).toBe('unsupportedBlock');
  });

  it('should handle unsupported inline', () => {
    const options = {
      allowUnsupportedInline: true,
    };
    const result = validationErrorHandler(
      unsupportedNode,
      validationError,
      options,
      marks,
    );
    expect(result).toBeDefined();
    expect(result && result.type).toBe('unsupportedInline');
  });

  it('should ignore INVALID_CONTENT_LENGTH error', () => {
    const invalidNode = unsupportedNode;
    const invalidContentLengthError: ValidationError = {
      code: 'INVALID_CONTENT_LENGTH',
      message: "'content' should have more than 1 child",
    };
    const options = {
      allowUnsupportedBlock: true,
    };
    const result = validationErrorHandler(
      invalidNode,
      invalidContentLengthError,
      options,
      marks,
    );
    expect(result).toBeDefined();
    expect(result).toEqual(invalidNode);
  });

  it('should add empty content for paragraph with missing properties', () => {
    const paragraphNodeWithoutContent = { type: 'paragraph' };
    const error: ValidationError = {
      code: 'MISSING_PROPERTIES',
      message: 'missing properties error message',
    };
    const options = {
      allowUnsupportedInline: true,
    };

    const result = validationErrorHandler(
      paragraphNodeWithoutContent,
      error,
      options,
      marks,
    );
    expect(result).toBeDefined();
    expect(result && result.type).toBe('paragraph');
    expect(result).toEqual({
      type: 'paragraph',
      content: [],
    });
  });

  it('should drop the mark when invalid mark is not wrapped as unsupported', () => {
    const invalidMarkType = {
      type: 'indentation',
    };
    const error: ValidationError = {
      code: 'INVALID_TYPE',
      message: 'indentation: type not allowed here',
    };
    const options = {
      allowUnsupportedInline: true,
    };

    const result = validationErrorHandler(
      invalidMarkType,
      error,
      options,
      marks,
    );
    expect(result).not.toBeDefined();
  });

  it('should ignore the invalid node if no wrapping options are given', () => {
    const error: ValidationError = {
      code: 'INVALID_TYPE',
      message: 'xyz: type not allowed here',
    };
    const result = validationErrorHandler(unsupportedNode, error, {}, []);
    expect(result).toEqual(unsupportedNode);
  });
});