import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DriverApplicationForm from './DriverApplicationForm';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
  );
});

afterEach(() => jest.resetAllMocks());

// Helper: renders and waits for the initial fetchCompanies to finish
const renderForm = async () => {
  await act(async () => {
    render(<DriverApplicationForm />);
  });
};

test('renders all form fields', async () => {
  await renderForm();
  expect(screen.getByLabelText(/driver id/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/company\/sponsor name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/application title/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument();
});

test('shows validation errors when submitting empty form', async () => {
  await renderForm();
  fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
  expect(await screen.findByText(/driver id is required/i)).toBeInTheDocument();
  expect(screen.getByText(/company name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/application title is required/i)).toBeInTheDocument();
});

test('accepts input in the Driver ID field', async () => {
  await renderForm();
  const input = screen.getByLabelText(/driver id/i);
  await userEvent.type(input, 'DRV-001');
  expect(input.value).toBe('DRV-001');
});

test('accepts input in the Application Title field', async () => {
  await renderForm();
  const input = screen.getByLabelText(/application title/i);
  await userEvent.type(input, 'Experienced Long-Haul Driver');
  expect(input.value).toBe('Experienced Long-Haul Driver');
});

test('company dropdown renders with default option', async () => {
  await renderForm();
  expect(screen.getByText(/-- select a company --/i)).toBeInTheDocument();
});