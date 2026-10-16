import type { Preview } from '@storybook/react-vite';
// Full (non-subset) Pretendard Variable so rendering matches Figma deterministically.
import 'pretendard/dist/web/variable/pretendardvariable.css';
import '../src/styles.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
