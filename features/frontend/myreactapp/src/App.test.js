import { render, screen } from '@testing-library/react';
import App from './App';

// mock fetch for the About pg API call
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ 
      ok: true, 
      json: () => Promise.resolve({ 
        team_num: '24',
        version_num: '1.0.0',
        release_date: '2024-06-01',
        product_name: 'CocoDinoBytes',
        product_desc: 'A driver incentive program.',
       }),
      }) 
    );
  });

test('renders navigation links', () => {
  render(<App />);
  expect(screen.getByTestId(/about/I)).toBeInTheDocument();
  expect(screen.getByTestId(/apply as driver/i)).toBeInTheDocument();
  expect(screen.getByTestId(/login/i)).toBeInTheDocument();
});

test('renders about page content after fetch', async () => {
  render(<App />);
  expect(await screen.findByText(/CocoDinoBytes/i)).toBeInTheDocument();
  expect(screen.getByText(/24/)).toBeInTheDocument();
});

test('renders 404 page for unknown route', () => {
  // use memory router to start at an unknown route
  const {render: memRender} = require('@testing-library/react');
  const {MemoryRouter, Routes, Route} = require('react-router-dom');
  memRender(
    <MemoryRouter initialEntries={['/nonexistent']}>
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByText(/404/i)).toBeInTheDocument();
});