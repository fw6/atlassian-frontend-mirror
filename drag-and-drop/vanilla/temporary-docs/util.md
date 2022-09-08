# Utils

## `combine`

Most entities in `@atlaskit/drag-and-drop` return a cleanup function

```ts
import { CleanupFn } from '...';
import { draggable } from '...';

const cleanup: CleanupFn = draggable({ element: myElement });

// unbind functionality
cleanup();
```

Sometimes you might be creating a whole lot of cleanup functions:

```ts
const cleanupDraggable: CleanupFn = draggable({ element: myElement });
const cleanupDropTarget: CleanupFn = dropTargetForElements({
  element: myElement,
});
const cleanupMonitor: CleanupFn = monitorForElements({ element: myElement });

// unbind all functionality:
cleanupDraggable();
cleanupDropTarget();
cleanupMonitor();
```

`combine` smooshes multiple cleanup functions into a single cleanup function

```ts
const cleanup: CleanupFn = combine(
  draggable({ element: myElement }),
  dropTargetForElements({
    element: myElement,
  }),
  monitorForElements({ element: myElement }),
);

// unbind all functionality:
cleanup();
```

Using `combine()` is helpful when working with `react` effects:

```ts
useEffect(() => {
  const cleanup: CleanupFn = combine(
    draggable({ element: myElement }),
    dropTargetForElements({
      element: myElement,
    }),
    monitorForElements({ element: myElement }),
  );
  return cleanup;
}, []);

// or even simpler:
useEffect(() => {
  return combine(
    draggable({ element: myElement }),
    dropTargetForElements({
      element: myElement,
    }),
    monitorForElements({ element: myElement }),
  );
}, []);
```

## `reorder`

> TODO

## `reorderWithEdge`

> TODO

## `once`

> A helper to allow a function to only ever be called once

The `getData()` function on a `dropTarget` is called repeatedly through a drag and drop operation. This allows addons such as `addon-closest-edge` to work. Sometimes your `getData()` function can be expensive to calculate. `once` allows you to avoid any `getData()` recalculations.

```ts
dropTargetForFiles({
  getData: once(getExpensiveData),
});
```

Alternative patterns:

```ts
// calculate your data outside of get data
const data = getExpensiveData();
dropTargetForFiles({
  getData: () => data,
});
```

```ts
// have expensive data along with updated addons
const getDataOnce = once(getExpensiveData);
dropTargetForFiles({
  getData: ({ input, element }) => {
    const data = getDataOnce();
    return attachClosestEdge(data, { input, element, allowedEdges: ['top'] });
  },
});
```

### `memoize-one`

You can also leverage other memoization libraries, such as `memoize-one`:

```ts
const memoizedGetData = memoizeOne(getExpensiveData);
dropTargetForFiles({
  getData: ({ input, element }) => {
    const data = memoizedGetData();
    return attachClosestEdge(data, { input, element, allowedEdges: ['top'] });
  },
});
```