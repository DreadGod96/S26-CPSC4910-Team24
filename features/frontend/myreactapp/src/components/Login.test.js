import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

const renderLogin = () => render(
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Login />
  </MemoryRouter>
);

test('renders login form', () => {
  renderLogin();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});

test('shows error when fields are empty', async () => {
  renderLogin();
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
});

test('shows error when email is invalid', async () => {
  renderLogin();
  await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
});

test('shows error when password is too short', async () => {
  renderLogin();
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), '123');
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
});

test('shows success on valid login', async () => {
  renderLogin();
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(await screen.findByText(/login successful/i)).toBeInTheDocument();
});