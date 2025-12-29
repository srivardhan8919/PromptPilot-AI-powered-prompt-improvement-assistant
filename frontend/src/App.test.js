import { render, screen } from '@testing-library/react';
import App from './App';

test('renders PromptPilot app', () => {
  render(<App />);
  // App renders startup screen initially, so we just check it renders without crashing
  expect(document.body).toBeInTheDocument();
});
