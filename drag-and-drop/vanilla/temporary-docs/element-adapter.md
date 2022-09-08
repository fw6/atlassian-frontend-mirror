# Element adapter

- TODO: default drop effect = 'move'

The element adapter enables drag and drop operations for `Elements` within a web page.

Pieces:

- `draggable`: marking that an element can be dragged
- `dropTargetForElements`: marking an element as a valid drop target
- `monitorForElements`: listen for `@atlaskit/drag-and-drop` element drag operation events anywhere
- TODO: `type`s

## `draggable`

A `draggable` is an element that can be dragged around by a user.

A `draggable` can be located:

- outside of any drop targets
- inside any amount of levels of nested drop targets

> 📝 This is different to `react-beautiful-dnd` where a `<Draggable />` _must_ be located inside of a `<Droppable />`

While a drag operation is occurring:

- You can add new `draggable`s
- You can remount a `draggable`. See [What is remounting]('./what-is-remounting.md')
- You can change the dimensions of the dragging `draggable` during a drag. But keep in mind that won't change the drag preview image, as that is collected only at the start of the drag (in `onGenerateDragPreview()`)
- You can remove the dragging `draggable` during a drag operation. When a `draggable` is removed it's event functions (eg `onDrag`) will no longer be called. Being able to remove the dragging `draggable` is a common requirement for virtual lists

### `draggable` argument overview

- `element: HTMLElement`: a `HTMLElement` that will be draggable (using `HTMLElement` as that is the interface that allows the `"draggable"` attribute)
- `dragHandle?: Element`: an optional `Element` that can be used to designate the part of the `draggable` that can exclusively used to drag the whole `draggable`
- `canDrag?: (args: GetFeedbackArgs) => boolean`: used to conditionally allow dragging (see below)
- `getInitialData?: (args: GetFeedbackArgs) => Record<string, unknown>`: a one time attaching of data to a draggable as a drag is starting

For events (eg `onDragStart`) see [our events guide]('./events.md)

- `onGenerateDragPreview`
- `onDragStart`
- `onDrag`
- `onDropTargetChange`
- `onDrop`

### Drag handles

A _drag handle_ is the part of your `draggable` element that can dragged in order to drag the whole `draggable`. By default, the entire `draggable` is a _drag handle_. However, you can optionally mark child element of your `draggable` as the _drag handle_, which will mean that the whole `draggable` can only be dragged by dragging the _drag handle_

```ts
draggable({
  element: myElement,
  dragHandle: myDragHandle,
});
```

A _drag handle_ can be the `draggable` element (default), or any child of the `draggable` element.

### Conditional dragging (`canDrag()`)

A `draggable` can conditionally allow dragging by using the `canDrag()` function. Returning `true` from `canDrag()` will allow the drag, and returning `false` will prevent a drag.

```ts
draggable({
  element: myElement,
  // disable dragging
  canDrag: () => false,
});
```

Disabling a drag by returning `false` from `canDrag()` will prevent any other `draggable` on the page from being dragged. `@atlaskit/drag-and-drop` calls `event.preventDefault()` under the hood when `canDrag()` returns false, which cancels the drag operation. Unfortunately, once a drag event has started, a `draggable` element cannot individually opt out of dragging and allow another element to be dragged.

If you want to disable dragging for a `draggable`, but still want a parent `draggable` to be able to be dragged, then rather than using `canDrag()` you can conditionally apply `draggable()`

Here is example of what that could look like using `react`:

```ts
import {useEffect} from 'react';
import {draggable} from '@atlaskit/drag-and-drop/adapter/element';

function noop(){};

function App({isEnabled}) {
  const ref = useRef();

  useEffect({
    // when disabled, don't make the element draggable
    // this will allow a parent draggable to still be dragged
    if(!isEnabled) {
      return noop;
    }
    return draggable({
      element: el,
    });
  }, [isEnabled]);

  return <div ref={ref}>Item</div>
};
```

### Drag previews

A _drag preview_ is the entity that a user drags around during a drag operation. For draggable elements, the default _drag preview_ is a picture of the draggable element.

We have a number of supported techniques for controlling what the _drag preview_ looks like.

### Make your draggable element totally visible

If you are leveraging the native _drag preview_ generation (where a picture of the draggable element is dragged around), then it is important that your draggable element is _completely_ visible at the start of the drag operation. Your _drag preview_ will only be the visible part of your draggable element. So if you have any partially obstructed parts of your draggable element, those parts will not be included in the _drag preview_, which ends up looking like there are chunks missing from your _drag preview_.

It is important that you do what you need to in order to make your draggable element completely visible during the `onGenerateDragPreview` event.

We have created a helper to ensure that draggable elements that are partially visible due to scroll become visible at the start of a drag:

```ts
import { scrollJustEnoughIntoView } from '@atlaskit/drag-and-drop/util/scroll-just-enough-into-view';
import { draggable } from '@atlaskit/drag-and-drop/adapter/element';

draggable({
  element: myElement,
  onGenerateDragPreview: ({ source }) => {
    scrollJustEnoughIntoView({ element: source.element });
  },
});
```

`scrollJustEnoughIntoView` will scroll the draggable element just enough into view so that the element becomes totally visible. If the element is already totally visible then no scrolling will occur.

Note: we don't bake `scrollJustEnoughIntoView` into the `@atlaskit/drag-and-drop` itself as it may not be the best approach in all circumstances (for example, you might be making a small drag preview for a large draggable element, or you might be opting out of the native drag preview)

### Technique 1: Default

The default browser behaviour is that the _drag preview_ is a picture is created of your draggable element. If you are for no visual changes

### Technique 2: Leveraging events

This technique is simple, powerful and cheap. It is the primary mechanism we recommend for drag previews

> [More information about how this technique works 🧑‍🔬](https://twitter.com/alexandereardon/status/1510826920023248900)

1. in `onGenerateDragPreview` make whatever visual changes you want to the `draggable` element and those changes will be captured in the drag preview
2. in `onDragStart`:
   2a. revert changes of step 1. The user will never see the `draggable` element with the styles applied in `onGenerateDragPreview` due to paint timings
   2b. apply visual changes to the `draggable` element to make it clear to the user what element is being dragged
3. in `onDrop` remove any visual changes you applied to the `draggable` element during the drag

### Technique 3: `nativeSetDragImage`

Inside of the `onGenerateDragPreview` event you get access to `nativeSetDragImage` which is a reference to the native [`setDragImage`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setDragImage) function. You can use `nativeSetDragImage` to use another visible element or an image as the drag preview.

### Technique 4: Disable the native drag preview

In some situations you might want not completely disable the native drag preview. We have created a `disableNativeDragPreview` utility to do this for you that will work across all supported browsers and platforms:

```ts
import { disableNativeDragPreview } from '@atlaskit/drag-and-drop/util/disable-native-drag-preview';

draggable({
  element: myElement,
  onGenerateDragPreview({ setNativeDragPreview }) {
    disableNativeDragPreview({ setNativeDragPreview });
  },
});
```

This technique renders a `1x1` transparent image as the native drag preview. There are a few alternative techniques for hiding the drag preview, but this technique yielded the best results across many browsers and devices.

### Technique 5: Render your own drag preview

If you want to take complete control and render your own drag preview, here is what you need to do:

1. Disable the native drag preview (see technique #4 above)
2. in `onDragStart` create the element you want to have as your drag preview.

- You need to ensure that the element is positioned correctly. under the users cursor. This can involve measuring the dimensions of the `draggable` element, and looking at the users input (`location.initial.input`)
- You need to ensure your element is on a layer where it won't be impacted by parent elements. This usually involves rendering your element in a [portal](https://reactjs.org/docs/portals.html)

3. Move your drag preview around in response to input changes using `onDrag()`. You will likely want to be using a css `transform()` to do this movement
4. Remove your custom drag preview in `onDrop()`

If you are doing this technique, you will likely want to use the `cancelUnhandled` _addon_. Using that addon will prevent the strange situation where when the user does not drop on a drop target there is a fairly large pause before the drop event. This is because the browser does a drop animation when the user does not drop on a drop target; a "return home" animation. Because you have hidden the native drag preview, the user won't see this return home drop animation, but will experience a delay. Using `cancelUnhandled()` ensures that the return home drop animation won't run.

## `dropTargetForElements`

The `dropTargetForElements` is a [drop target](./drop-target.md) which only allows elements to be dropped on it.

The default `dropEffect` for this type of drop target is `"move"`. This lines up with our [visual affordance guide](TODO). You can override this default with `getDropEffect()`.

## `monitorForElements`

A [monitor]('./monitor.md) for elements

## Source data

Each element adapter event is given at least the following data:

```ts
type ElementEventBasePayload = {
  location: DragLocationHistory;
  source: {
    items: DataTransferItemList | null;
  };
};
```

You can get this type from the file adapter:

```ts
import type { ElementEventBasePayload } from '@atlaskit/drag-and-drop/adapter/file';
```

You can get payload types for all file events using the following types as well:

```ts
import type {
  // the payload for each element adapter event
  ElementEventPayloadMap,

  // the payload for each element adapter event, including drop target `self` and derived events
  ElementDropTargetEventPayloadMap,
} from '@atlaskit/drag-and-drop/adapter/file';

type OnDragStart = FileEventPayloadMap['onDragStart'];
```