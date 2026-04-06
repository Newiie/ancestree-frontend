import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FamilyBackgroundSection from '@/components/dashboard/Profile/sections/FamilyBackgroundSection';

const noop = () => {};

describe('FamilyBackgroundSection (Vital Information) — read-only display', () => {
  it('shows values when present', () => {
    render(
      <FamilyBackgroundSection
        data={{ vitalInformation: { height: '170cm', weight: '65kg', bloodType: 'O+' } }}
        isEditing={false}
        onChange={noop}
      />
    );
    expect(screen.getByText(/170cm/)).toBeInTheDocument();
    expect(screen.getByText(/65kg/)).toBeInTheDocument();
    expect(screen.getByText(/O\+/)).toBeInTheDocument();
  });

  it('shows — for empty string fields', () => {
    render(
      <FamilyBackgroundSection
        data={{ vitalInformation: { height: '', weight: '', bloodType: '' } }}
        isEditing={false}
        onChange={noop}
      />
    );
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('shows — for missing fields', () => {
    render(
      <FamilyBackgroundSection
        data={{ vitalInformation: {} }}
        isEditing={false}
        onChange={noop}
      />
    );
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
  });

  it('renders Physical Attributes heading', () => {
    render(
      <FamilyBackgroundSection
        data={{}}
        isEditing={false}
        onChange={noop}
      />
    );
    expect(screen.getByText('Physical Attributes')).toBeInTheDocument();
  });

  describe('editing mode', () => {
    it('renders text inputs for non-select fields', () => {
      render(
        <FamilyBackgroundSection
          data={{ vitalInformation: { height: '170cm' } }}
          isEditing={true}
          onChange={noop}
        />
      );
      expect(screen.getByPlaceholderText('Height')).toHaveValue('170cm');
    });

    it('renders a select for Sex field', () => {
      render(
        <FamilyBackgroundSection
          data={{ vitalInformation: { sex: 'Male' } }}
          isEditing={true}
          onChange={noop}
        />
      );
      const select = screen.getByDisplayValue('Male');
      expect(select.tagName).toBe('SELECT');
    });

    it('calls onChange when a text field is edited', async () => {
      const onChange = jest.fn();
      render(
        <FamilyBackgroundSection
          data={{ vitalInformation: { height: '' } }}
          isEditing={true}
          onChange={onChange}
        />
      );
      const input = screen.getByPlaceholderText('Height');
      await userEvent.type(input, '175cm');
      expect(onChange).toHaveBeenCalled();
    });

    it('shows validation error when provided', () => {
      render(
        <FamilyBackgroundSection
          data={{ vitalInformation: {} }}
          isEditing={true}
          onChange={noop}
          errors={{ 'vitalInformation.bloodType': 'Blood type is required' }}
        />
      );
      expect(screen.getByText('Blood type is required')).toBeInTheDocument();
    });
  });
});
