import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GeneralInfoSection from '@/components/dashboard/Profile/sections/GeneralInfoSection';

const noop = () => {};

describe('GeneralInfoSection — read-only display', () => {
  describe('General Information tab', () => {
    it('shows field value when present', () => {
      render(
        <GeneralInfoSection
          data={{ generalInformation: { firstName: 'Juan', birthPlace: 'Manila' } }}
          isEditing={false}
          onChange={noop}
          selectedDetail="General Information"
        />
      );
      expect(screen.getByText(/Juan/)).toBeInTheDocument();
      expect(screen.getByText(/Manila/)).toBeInTheDocument();
    });

    it('shows — for empty string fields', () => {
      render(
        <GeneralInfoSection
          data={{ generalInformation: { firstName: '', birthPlace: '' } }}
          isEditing={false}
          onChange={noop}
          selectedDetail="General Information"
        />
      );
      // Every empty field should show a dash
      const dashes = screen.getAllByText('—');
      expect(dashes.length).toBeGreaterThan(0);
    });

    it('shows — for missing fields', () => {
      render(
        <GeneralInfoSection
          data={{ generalInformation: {} }}
          isEditing={false}
          onChange={noop}
          selectedDetail="General Information"
        />
      );
      const dashes = screen.getAllByText('—');
      expect(dashes.length).toBeGreaterThan(0);
    });

    it('shows nationality tags when array is populated', () => {
      render(
        <GeneralInfoSection
          data={{ generalInformation: { nationality: ['Filipino', 'American'] } }}
          isEditing={false}
          onChange={noop}
          selectedDetail="General Information"
        />
      );
      expect(screen.getByText('Filipino')).toBeInTheDocument();
      expect(screen.getByText('American')).toBeInTheDocument();
    });

    it('shows — for empty nationality array', () => {
      render(
        <GeneralInfoSection
          data={{ generalInformation: { nationality: [] } }}
          isEditing={false}
          onChange={noop}
          selectedDetail="General Information"
        />
      );
      expect(screen.getAllByText('—').length).toBeGreaterThan(0);
    });
  });

  describe('Addresses tab', () => {
    it('shows address values when present', () => {
      render(
        <GeneralInfoSection
          data={{ address: { city: 'Cebu', country: 'Philippines' } }}
          isEditing={false}
          onChange={noop}
          selectedDetail="Addresses"
        />
      );
      expect(screen.getByText(/Cebu/)).toBeInTheDocument();
      expect(screen.getByText(/Philippines/)).toBeInTheDocument();
    });

    it('shows — for empty address fields', () => {
      render(
        <GeneralInfoSection
          data={{ address: { city: '', country: '' } }}
          isEditing={false}
          onChange={noop}
          selectedDetail="Addresses"
        />
      );
      expect(screen.getAllByText('—').length).toBeGreaterThan(0);
    });
  });

  describe('editing mode', () => {
    it('renders inputs in editing mode', () => {
      render(
        <GeneralInfoSection
          data={{ generalInformation: { firstName: 'Juan' } }}
          isEditing={true}
          onChange={noop}
          selectedDetail="General Information"
        />
      );
      const input = screen.getByPlaceholderText('First Name');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('Juan');
    });

    it('calls onChange when a text field is edited', async () => {
      const onChange = jest.fn();
      render(
        <GeneralInfoSection
          data={{ generalInformation: { firstName: 'Juan' } }}
          isEditing={true}
          onChange={onChange}
          selectedDetail="General Information"
        />
      );
      const input = screen.getByPlaceholderText('First Name');
      await userEvent.clear(input);
      await userEvent.type(input, 'Maria');
      expect(onChange).toHaveBeenCalled();
    });

    it('shows validation error when provided', () => {
      render(
        <GeneralInfoSection
          data={{ generalInformation: {} }}
          isEditing={true}
          onChange={noop}
          errors={{ 'generalInformation.firstName': 'First name is required' }}
          selectedDetail="General Information"
        />
      );
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });
  });
});
