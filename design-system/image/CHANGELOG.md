# @atlaskit/image

## 0.2.1

### Patch Changes

- [`c674eafa051`](https://bitbucket.org/atlassian/atlassian-frontend/commits/c674eafa051) - Fixes a bug where the system preference would override the default behaviour when the color-mode was not set to auto. As a result, an OS setting of "dark" and a product setting of "light" would result in a "dark" image.

## 0.2.0

### Minor Changes

- [`8ab96dfc824`](https://bitbucket.org/atlassian/atlassian-frontend/commits/8ab96dfc824) - Adds a new Image primitive that works like the native HTML img element, with the added functionality of being theme-aware.

## 0.1.0

- Create Image component with theme functionality.