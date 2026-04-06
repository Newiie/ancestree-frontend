import React from 'react';
import { render, screen } from '@testing-library/react';
import DetailsContent from '@/components/dashboard/Profile/DetailsContent';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const { fill: _fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockUseProfile = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('@/providers/ProfileProvider', () => ({
  useProfile: () => mockUseProfile(),
}));

jest.mock('@/hooks/useAuth', () => ({
  __esModule: true,
  default: () => mockUseAuth(),
}));

const baseProfile = {
  selectedDetail: 'General Information',
  profileTabs: 'Connections',
  updateUserData: jest.fn(),
  isFetching: false,
};

describe('DetailsContent — Connections tab', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { id: 'user-123' } });
  });

  it('shows "No connections yet" when friendsList is empty', () => {
    mockUseProfile.mockReturnValue({
      ...baseProfile,
      userData: { userId: 'user-123', friendsList: [] },
    });
    render(<DetailsContent />);
    expect(screen.getByText('No connections yet')).toBeInTheDocument();
  });

  it('shows "No connections yet" when friendsList is undefined', () => {
    mockUseProfile.mockReturnValue({
      ...baseProfile,
      userData: { userId: 'user-123', friendsList: undefined },
    });
    render(<DetailsContent />);
    expect(screen.getByText('No connections yet')).toBeInTheDocument();
  });

  it('does not show empty state when connections exist', () => {
    mockUseProfile.mockReturnValue({
      ...baseProfile,
      userData: {
        userId: 'user-123',
        friendsList: [{ userId: 'friend-1', user: { generalInformation: { firstName: 'Ana' } } }],
      },
    });
    render(<DetailsContent />);
    expect(screen.queryByText('No connections yet')).not.toBeInTheDocument();
  });

  it('shows loading state while fetching', () => {
    mockUseProfile.mockReturnValue({
      ...baseProfile,
      isFetching: true,
      userData: null,
    });
    render(<DetailsContent />);
    expect(screen.getByText('Loading profile…')).toBeInTheDocument();
  });
});
