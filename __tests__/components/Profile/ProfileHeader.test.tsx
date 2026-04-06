import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileHeader from '@/components/dashboard/Profile/ProfileHeader';

// Mock Next.js Image to render a plain <img>
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    const { fill: _fill, ...rest } = props;
    return <img {...rest} />;
  },
}));

// Mock Next.js Link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

// Mock updateService
jest.mock('@/services/api/updateService', () => ({
  __esModule: true,
  default: {
    sendConnectionRequest: jest.fn(),
    acceptConnectionRequest: jest.fn(),
  },
  UpdateType: {},
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
  updateProfileImage: jest.fn(),
  updateBackgroundImage: jest.fn(),
  sendFriendRequest: jest.fn(),
  acceptFriendRequest: jest.fn(),
  userFriends: { friends: [], friendRequest: [] },
};

const ownUserId = 'user-123';
const otherUserId = 'user-456';

const baseUserData = {
  userId: otherUserId,
  profilePicture: '/img/avatar.jpg',
  backgroundPicture: '/img/bg.jpg',
  generalInformation: { firstName: 'Maria', lastName: 'Santos' },
  friendsList: [],
  friendRequestList: [],
};

describe('ProfileHeader — connection button states', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: { id: ownUserId } });
  });

  it('hides connection button on own profile', () => {
    mockUseProfile.mockReturnValue({
      ...baseProfile,
      userData: { ...baseUserData, userId: ownUserId },
    });
    render(<ProfileHeader />);
    expect(screen.queryByText('Connect')).not.toBeInTheDocument();
    expect(screen.queryByText('Connected')).not.toBeInTheDocument();
    expect(screen.queryByText('Sent Request')).not.toBeInTheDocument();
  });

  it('shows Connect button when not connected', () => {
    mockUseProfile.mockReturnValue({
      ...baseProfile,
      userData: { ...baseUserData, friendsList: [], friendRequestList: [] },
    });
    render(<ProfileHeader />);
    expect(screen.getByRole('button', { name: 'Connect' })).toBeInTheDocument();
  });

  it('shows Connected badge when already in friendsList', () => {
    mockUseProfile.mockReturnValue({
      ...baseProfile,
      userData: {
        ...baseUserData,
        friendsList: [{ userId: ownUserId }],
      },
    });
    render(<ProfileHeader />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
    // Should not be a button — non-interactive
    expect(screen.queryByRole('button', { name: 'Connected' })).not.toBeInTheDocument();
  });

  it('shows Sent Request badge when request was already sent', () => {
    mockUseProfile.mockReturnValue({
      ...baseProfile,
      userData: {
        ...baseUserData,
        friendsList: [],
        friendRequestList: [ownUserId],
      },
    });
    render(<ProfileHeader />);
    expect(screen.getByText('Sent Request')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sent Request' })).not.toBeInTheDocument();
  });

  it('shows Accept Request button when there is an incoming request', () => {
    mockUseProfile.mockReturnValue({
      ...baseProfile,
      userData: { ...baseUserData, friendsList: [], friendRequestList: [] },
      userFriends: { friends: [], friendRequest: [otherUserId] },
    });
    render(<ProfileHeader />);
    expect(screen.getByRole('button', { name: 'Accept Request' })).toBeInTheDocument();
  });

  it('shows View Tree link pointing to user tree', () => {
    mockUseProfile.mockReturnValue({
      ...baseProfile,
      userData: baseUserData,
    });
    render(<ProfileHeader />);
    const link = screen.getByRole('link', { name: 'View Tree' });
    expect(link).toHaveAttribute('href', `/dashboard/family-tree/${otherUserId}`);
  });

  it('renders user full name', () => {
    mockUseProfile.mockReturnValue({
      ...baseProfile,
      userData: baseUserData,
    });
    render(<ProfileHeader />);
    expect(screen.getByText(/Maria/)).toBeInTheDocument();
    expect(screen.getByText(/Santos/)).toBeInTheDocument();
  });
});
