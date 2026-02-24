import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from  '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import Login from './Login';

// wrap with memory router because login uses useNavigate
const renderLogin = () => render(<MemoryRouter><Login /></MemoryRouter>);

test('renders login form', () => {
  renderLogin();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', {name: /sign in/i})).toBeInTheDocument();
});

test('shows error when the fields are empty', async () => {
    renderLogin();
    userEvent.click(screen.getByRole('button', {name: /sign in/i}));  
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
});

test('shows error when the email is invalid', async () => {
    renderLogin();
    userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    userEvent.click(screen.getByRole('button', {name: /sign in/i}));  
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
});

test('shows error when the password is too short', async () => {
    renderLogin();
    userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), '123');
    userEvent.click(screen.getByRole('button', {name: /sign in/i}));  
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
});

test('shows success message on valid input', async () => {
    renderLogin();
    userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    userEvent.click(screen.getByRole('button', {name: /sign in/i}));  
    expect(await screen.findByText(/login successful/i)).toBeInTheDocument();
});