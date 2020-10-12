# @atlaskit/atlassian-notifications

## 0.2.2

### Patch Changes

- [`6c525a8229`](https://bitbucket.org/atlassian/atlassian-frontend/commits/6c525a8229) - Upgraded to TypeScript 3.9.6 and tslib to 2.0.0

  Since tslib is a dependency for all our packages we recommend that products also follow this tslib upgrade
  to prevent duplicates of tslib being bundled.

## 0.2.1

### Patch Changes

- [`60dd4ecc69`](https://bitbucket.org/atlassian/atlassian-frontend/commits/60dd4ecc69) - Changed export all to export individual components in index

## 0.2.0

### Minor Changes

- [`87f4720f27`](https://bitbucket.org/atlassian/atlassian-frontend/commits/87f4720f27) - Officially dropping IE11 support, from this version onwards there are no warranties of the package working in IE11.
  For more information see: https://community.developer.atlassian.com/t/atlaskit-to-drop-support-for-internet-explorer-11-from-1st-july-2020/39534

## 0.1.4

### Patch Changes

- [patch][6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  Remove namespace imports from React, ReactDom, and PropTypes- Updated dependencies [6548261c9a](https://bitbucket.org/atlassian/atlassian-frontend/commits/6548261c9a):

  - @atlaskit/docs@8.3.2

## 0.1.3

### Patch Changes

- [patch][0393e3f04e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0393e3f04e):

  Fixing types

## 0.1.2

### Patch Changes

- [patch][e1dc937728](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e1dc937728):

  Adding a private \_url prop for notifications to enable testing/examples

## 0.1.1

### Patch Changes

- [patch][5eb3d1fc75](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5eb3d1fc75):

  Removed spinner from the notifications package (handled by the iframe content instead)