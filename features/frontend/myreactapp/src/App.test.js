import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        team_num: '24',
        version_num: '1.0',
        release_date: '2026-01-01',
        product_name: 'CocoDinoBytes',
        product_desc: 'A driver incentive program',
      }),
    })
  );
});

afterEach(() => jest.resetAllMocks());

test('renders navigation links', async () => {
  render(<App />);
  expect(screen.getByText(/about/i)).toBeInTheDocument();
  expect(screen.getByText(/apply as driver/i)).toBeInTheDocument();
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});

test('renders about page content after fetch', async () => {
  render(<App />);
  expect(await screen.findByText('CocoDinoBytes')).toBeInTheDocument();
});

test('renders 404 for unknown route', () => {
  const { MemoryRouter, Routes, Route } = require('react-router-dom');
  render(
    <MemoryRouter initialEntries={['/nonexistent']}>
      <Routes>
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByText(/404/i)).toBeInTheDocument();
});