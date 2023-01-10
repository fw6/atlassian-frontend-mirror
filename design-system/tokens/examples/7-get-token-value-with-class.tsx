/** @jsx jsx */
import { jsx } from '@emotion/react';

import { getTokenValue, ThemeMutationObserver, token } from '../src';

// Themes mounted to the page as css files
import '../css/atlassian-light.css';
import '../css/atlassian-dark.css';

const ExampleDiv = () => (
  <p
    style={{
      backgroundColor: token('color.background.accent.blue.subtle'),
      padding: 20,
    }}
  >
    Token used: <code>color.background.accent.blue.subtle</code>
  </p>
);

export default () => {
  let theme;
  const observer = new ThemeMutationObserver((newTheme) => {
    theme = newTheme;
  });
  observer.observe();

  return (
    <div style={{ padding: '1em' }}>
      <h1>Current theme: {theme}</h1>
      <ExampleDiv />
      <p>
        <code>getTokenValue('color.background.accent.blue.subtle')</code> ={' '}
        {getTokenValue('color.background.accent.blue.subtle')}
      </p>
    </div>
  );
};
