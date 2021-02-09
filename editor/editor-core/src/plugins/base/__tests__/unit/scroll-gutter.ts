import {
  scrollIntoView,
  insertText,
} from '@atlaskit/editor-test-helpers/transactions';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import basePlugin from '../../';
import { GUTTER_SELECTOR } from '../../pm-plugins/scroll-gutter';

function createScrollContainer(height: number) {
  const scrollableContent = document.createElement('div');
  jest
    .spyOn(scrollableContent, 'offsetHeight', 'get')
    .mockImplementation(() => height);
  return scrollableContent;
}

describe('ScrollGutter Plugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  const scrollIntoViewSpy = jest.fn();

  const mockCaretTopPosition = (top: number) => {
    jest.spyOn(window, 'getSelection').mockReturnValue({
      rangeCount: 1,
      getRangeAt: jest.fn(() => ({
        getClientRects: jest.fn(() => [{ top }]),
      })),
    } as any);
  };

  beforeEach(() => {
    // plugin manually creates scroll gutter div element
    // mock scrollIntoView as it won't exist by default and plugin will crash
    const _createElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation(tagName => {
      const el = _createElement(tagName);
      el.scrollIntoView = scrollIntoViewSpy;
      return el;
    });
    // mock full-page editor finding .fabric-editor-popup-scroll-parent
    jest
      .spyOn(document, 'querySelector')
      .mockReturnValue(_createElement('div'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    scrollIntoViewSpy.mockReset();
  });

  it('scrolls to gutter element when the container has 50px height', () => {
    mockCaretTopPosition(500);
    const scrollableContent = createScrollContainer(50);

    const { editorView } = createEditor({
      attachTo: scrollableContent,
      preset: new Preset<LightEditorPlugin>().add([
        basePlugin,
        { allowScrollGutter: { getScrollElement: () => scrollableContent } },
      ]),
    });

    insertText(editorView, 'hi');
    scrollIntoView(editorView);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });

  it('should not scroll to gutter element when the container has 1000px height', () => {
    mockCaretTopPosition(500);
    const scrollableContent = createScrollContainer(1000);

    const { editorView } = createEditor({
      attachTo: scrollableContent,
      preset: new Preset<LightEditorPlugin>().add([
        basePlugin,
        { allowScrollGutter: { getScrollElement: () => scrollableContent } },
      ]),
    });

    insertText(editorView, 'hi');
    scrollIntoView(editorView);
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });

  it('should persist the scroll gutter when persistScrollGutter is true', () => {
    const scrollableContent = createScrollContainer(1000);
    const contentContainer = createScrollContainer(200);
    const { editorView } = createEditor({
      attachTo: contentContainer,
      preset: new Preset<LightEditorPlugin>().add([
        basePlugin,
        {
          allowScrollGutter: {
            getScrollElement: () => scrollableContent,
            persistScrollGutter: true,
          },
        },
      ]),
    });

    insertText(editorView, 'hi');

    expect(contentContainer.querySelector(GUTTER_SELECTOR)).not.toBe(null);
  });

  it('should set the gutter size based on the plugin option', () => {
    const scrollableContent = createScrollContainer(1000);
    const contentContainer = createScrollContainer(2000);
    const { editorView } = createEditor({
      attachTo: contentContainer,
      preset: new Preset<LightEditorPlugin>().add([
        basePlugin,
        {
          allowScrollGutter: {
            getScrollElement: () => scrollableContent,
            gutterSize: 50,
          },
        },
      ]),
    });

    insertText(editorView, 'hi');

    expect(
      (contentContainer.querySelector(GUTTER_SELECTOR) as HTMLElement).style
        .paddingBottom,
    ).toBe('50px');
  });

  it('should set the default gutter size (120px) when gutter size for plugin option is not passed', () => {
    const scrollableContent = createScrollContainer(1000);
    const contentContainer = createScrollContainer(2000);
    const { editorView } = createEditor({
      attachTo: contentContainer,
      preset: new Preset<LightEditorPlugin>().add([
        basePlugin,
        {
          allowScrollGutter: {
            getScrollElement: () => scrollableContent,
          },
        },
      ]),
    });

    insertText(editorView, 'hi');

    expect(
      (contentContainer.querySelector(GUTTER_SELECTOR) as HTMLElement).style
        .paddingBottom,
    ).toBe('120px');
  });
});
