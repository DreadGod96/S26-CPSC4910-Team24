import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DriverApplicationForm from './DriverApplicationForm';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

afterEach(() => jest.resetAllMocks());

test('renders all form fields', () => {
  render(<DriverApplicationForm />);
  expect(screen.getByLabelText(/driver id/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/company\/sponsor name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/application title/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument();
});

test('shows validation errors when submitting empty form', async () => {
  render(<DriverApplicationForm />);
  fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
  expect(await screen.findByText(/driver id is required/i)).toBeInTheDocument();
  expect(screen.getByText(/company name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/application title is required/i)).toBeInTheDocument();
});

test('accepts input in the Driver ID field', async () => {
  render(<DriverApplicationForm />);
  const input = screen.getByLabelText(/driver id/i);
  await userEvent.type(input, 'DRV-001');
  expect(input.value).toBe('DRV-001');
});

test('accepts input in the Application Title field', async () => {
  render(<DriverApplicationForm />);
  const input = screen.getByLabelText(/application title/i);
  await userEvent.type(input, 'Experienced Long-Haul Driver');
  expect(input.value).toBe('Experienced Long-Haul Driver');
});

test('company dropdown renders with default option', () => {
  render(<DriverApplicationForm />);
  expect(screen.getByText(/-- select a company --/i)).toBeInTheDocument();
});