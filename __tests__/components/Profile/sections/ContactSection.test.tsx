import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactSection from '@/components/dashboard/Profile/sections/ContactSection';

const noop = () => {};

describe('ContactSection — read-only display', () => {
  it('shows contact values when present', () => {
    render(
      <ContactSection
        data={{ personalContact: { email: 'juan@example.com', phone: '09171234567' } }}
        isEditing={false}
        onChange={noop}
      />
    );
    expect(screen.getByText(/juan@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/09171234567/)).toBeInTheDocument();
  });

  it('shows — for empty contact fields', () => {
    render(
      <ContactSection
        data={{ personalContact: { email: '', phone: '' } }}
        isEditing={false}
        onChange={noop}
      />
    );
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('shows — for missing contact fields', () => {
    render(
      <ContactSection
        data={{ personalContact: {} }}
        isEditing={false}
        onChange={noop}
      />
    );
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('shows emergency contact values when present', () => {
    render(
      <ContactSection
        data={{ emergencyContact: { name: 'Maria', phone: '09180000000' } }}
        isEditing={false}
        onChange={noop}
      />
    );
    expect(screen.getByText(/Maria/)).toBeInTheDocument();
    expect(screen.getByText(/09180000000/)).toBeInTheDocument();
  });

  it('shows — for empty emergency contact fields', () => {
    render(
      <ContactSection
        data={{ emergencyContact: { name: '', phone: '' } }}
        isEditing={false}
        onChange={noop}
      />
    );
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  describe('editing mode', () => {
    it('renders inputs for personal contact', () => {
      render(
        <ContactSection
          data={{ personalContact: { email: 'test@test.com' } }}
          isEditing={true}
          onChange={noop}
        />
      );
      // Use name attribute to disambiguate from emergency contact email
      const input = document.querySelector('input[name="personalContact.email"]') as HTMLInputElement;
      expect(input).not.toBeNull();
      expect(input).toHaveValue('test@test.com');
    });

    it('calls onChange when a field is edited', async () => {
      const onChange = jest.fn();
      render(
        <ContactSection
          data={{ personalContact: { phone: '' } }}
          isEditing={true}
          onChange={onChange}
        />
      );
      const input = document.querySelector('input[name="personalContact.phone"]') as HTMLInputElement;
      expect(input).not.toBeNull();
      await userEvent.type(input, '09171234567');
      expect(onChange).toHaveBeenCalled();
    });

    it('shows validation error when provided', () => {
      render(
        <ContactSection
          data={{ personalContact: {} }}
          isEditing={true}
          onChange={noop}
          errors={{ 'personalContact.email': 'Email is required' }}
        />
      );
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });
});
