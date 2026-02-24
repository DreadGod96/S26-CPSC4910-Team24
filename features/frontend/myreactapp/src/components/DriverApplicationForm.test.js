import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DriverApplicationForm from './DriverApplicationForm';

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ message: 'Success' }) })
  );
});

afterEach(() => jest.resetAllMocks());

test('renders all required form fields', () => {
  render(<DriverApplicationForm />);
  expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/application title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/motivation/i)).toBeInTheDocument();
});

test('shows validation errors when submitting empty form', async () => {
  render(<DriverApplicationForm />);
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
});

test('shows invalid email error', async () => {
  render(<DriverApplicationForm />);
  await userEvent.type(screen.getByLabelText(/email/i), 'bademail');
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
});

test('shows motivation length error', async () => {
  render(<DriverApplicationForm />);
  await userEvent.type(screen.getByLabelText(/motivation/i), 'Too short');
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(await screen.findByText(/at least 50 characters/i)).toBeInTheDocument();
});

test('submits successfully with valid data', async () => {
  render(<DriverApplicationForm />);
  await userEvent.type(screen.getByLabelText(/first name/i), 'Jane');
  await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
  await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
  await userEvent.type(screen.getByLabelText(/phone/i), '8641234567');
  await userEvent.type(screen.getByLabelText(/application title/i), 'Driver');
  await userEvent.type(screen.getByLabelText(/company name/i), 'Acme Co');
  await userEvent.type(screen.getByLabelText(/motivation/i), 'I want to join because I am a great driver with 10 years of experience.');
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(await screen.findByText(/submitted successfully/i)).toBeInTheDocument();
});