import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import Breadcrumbs, { BreadcrumbsItem } from '../../../index';

describe('Breadcrumbs container', () => {
  it('should be able to render a single child', () => {
    const { container } = render(
      <Breadcrumbs onExpand={() => {}} testId="bcs">
        <BreadcrumbsItem text="item" />
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(1);
  });

  it('should render multiple children', () => {
    const { getByTestId } = render(
      <Breadcrumbs testId="breadcrumbs-container">
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const container = getByTestId('breadcrumbs-container');
    const links = container.querySelectorAll('a');

    expect(links.length).toEqual(3);
    const anchors = Array.from(links).map(l => l.text);

    expect(anchors).toEqual(
      expect.arrayContaining(['Item', 'Another item', 'A third item']),
    );
  });

  it('should not count empty children', () => {
    const { container } = render(
      <Breadcrumbs onExpand={() => {}} maxItems={3}>
        {null}
        <BreadcrumbsItem text="item" />
        <BreadcrumbsItem text="item" />
        <BreadcrumbsItem text="item" />
        {undefined}
        {false}
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(3);
  });

  it('renders ellipsis for statefull breadcrumbs when there are too many items', () => {
    const { getByTestId } = render(
      <Breadcrumbs testId="breadcrumbs-container" maxItems={2}>
        <BreadcrumbsItem href="/item" text="Item" />
        <BreadcrumbsItem href="/item" text="Another item" />
        <BreadcrumbsItem href="/item" text="A third item" />
      </Breadcrumbs>,
    );

    const container = getByTestId('breadcrumbs-container');
    const links = container.querySelectorAll('a');

    expect(links.length).toEqual(2);

    const ellipsis = getByTestId('breadcrumbs-container--breadcrumb-ellipsis');
    expect(ellipsis).toBeDefined();
  });
});

describe('Controlled breadcrumbs', () => {
  it('render ellipsis', () => {
    const onExpand = jest.fn();
    const { container } = render(
      <Breadcrumbs onExpand={onExpand} maxItems={2} testId="bcs">
        <BreadcrumbsItem text="item 1" />
        <BreadcrumbsItem text="item 2" />
        <BreadcrumbsItem text="item 3" />
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(2);

    const anchors = Array.from(links).map(l => l.text);

    expect(anchors).toEqual(expect.arrayContaining(['item 1', 'item 3']));
    expect(anchors).not.toEqual(expect.arrayContaining(['item 2']));

    const ellipsis = container.querySelector('button');
    fireEvent.click(ellipsis!);
    expect(onExpand).toHaveBeenCalled();
  });

  it('render ellipsis - before and after', () => {
    const onExpand = jest.fn();
    const { container } = render(
      <Breadcrumbs
        onExpand={onExpand}
        maxItems={4}
        itemsBeforeCollapse={2}
        itemsAfterCollapse={2}
        testId="bcs"
      >
        <BreadcrumbsItem text="item 1" />
        <BreadcrumbsItem text="item 2" />
        <BreadcrumbsItem text="item 3" />
        <BreadcrumbsItem text="item 4" />
        <BreadcrumbsItem text="item 5" />
        <BreadcrumbsItem text="item 6" />
        <BreadcrumbsItem text="item 7" />
      </Breadcrumbs>,
    );

    const links = container.querySelectorAll('a');
    expect(links.length).toEqual(4);

    const anchors = Array.from(links).map(l => l.text);

    expect(anchors).toEqual(
      expect.arrayContaining(['item 1', 'item 2', 'item 6', 'item 7']),
    );
    expect(anchors).not.toEqual(
      expect.arrayContaining(['item 3', 'item 4', 'item 5']),
    );
  });
});
