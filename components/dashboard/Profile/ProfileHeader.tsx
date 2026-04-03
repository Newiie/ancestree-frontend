"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProfile } from '../../../providers/ProfileProvider';
import useAuth from '@/hooks/useAuth';
import { SquarePenIcon } from 'lucide-react';
import updateService from '@/services/api/updateService';
import { UpdateType } from '@/services/api/updateService';
import { UserFriend } from '@/types/profile';

const ProfileHeader = () => {
  const { user } = useAuth();
  const { 
    userData, 
    updateProfileImage, 
    updateBackgroundImage, 
    sendFriendRequest, 
    acceptFriendRequest,
    userFriends
  } = useProfile();

  const [isProfileHover, setIsProfileHover] = useState<boolean>(false);
  const [isBackgroundHover, setIsBackgroundHover] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>(userData?.profilePicture || '');
  const [backgroundImage, setBackgroundImage] = useState<string>(userData?.backgroundPicture || '/images/bg-arcade-1.jpg');
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const [newBackgroundImage, setNewBackgroundImage] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isEditingBackground, setIsEditingBackground] = useState<boolean>(false);
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
  const [selectedBackgroundFile, setSelectedBackgroundFile] = useState<File | null>(null);

  useEffect(() => {
    if (userData?.profilePicture) {
      setProfileImage(userData.profilePicture);
    } else {
      setProfileImage('/images/background_placeholder.png');
    }

    if (userData?.backgroundPicture) {
      setBackgroundImage(userData.backgroundPicture);
    } else {
      setBackgroundImage('/images/background_placeholder.png');
    }
  }, [userData]);

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      setIsEditingProfile(true);
      setNewProfileImage(imageUrl);
      setSelectedProfileFile(file);
    }
  };

  const handleBackgroundImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setIsEditingBackground(true);
      setNewBackgroundImage(imageUrl);
      setSelectedBackgroundFile(file);
    }
  };

  const handleConfirmProfileImage = () => {
    if (selectedProfileFile) {
      setProfileImage(newProfileImage || '');
      updateProfileImage(selectedProfileFile);
      setNewProfileImage(null);
      setIsEditingProfile(false);
    }
  };

  const handleConfirmBackgroundImage = () => {
    if (selectedBackgroundFile) {
      setBackgroundImage(newBackgroundImage || '');
      updateBackgroundImage(selectedBackgroundFile);
      setNewBackgroundImage(null);
      setIsEditingBackground(false);
    }
  };

  const handleCancelProfileImage = () => {
    setNewProfileImage(null);
    setIsEditingProfile(false);
  };

  const handleCancelBackgroundImage = () => {
    setNewBackgroundImage(null);
    setIsEditingBackground(false);
  };


  return (
    <div className='w-full relative bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm'>
      {/* Background image */}
      <div className='relative h-44 w-full'
        onMouseEnter={() => setIsBackgroundHover(true)}
        onMouseLeave={() => setIsBackgroundHover(false)}
      >
        <Image
          src={isEditingBackground ? newBackgroundImage || backgroundImage : backgroundImage}
          alt='Profile background'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
        {isBackgroundHover && (
          <>
            <button
              type='button'
              onClick={() => document.getElementById('backgroundFileInput')?.click()}
              className='absolute top-3 right-3 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors'
            >
              <SquarePenIcon className='text-white' width={16} height={16} />
            </button>
            <input
              id="backgroundFileInput"
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageChange}
              className="hidden"
            />
          </>
        )}
        {isEditingBackground && (
          <div className='absolute bottom-3 right-3 flex gap-2'>
            <button onClick={handleConfirmBackgroundImage} className='px-3 py-1.5 bg-[#1B5A1B] text-white text-xs font-semibold rounded-lg'>
              Confirm
            </button>
            <button onClick={handleCancelBackgroundImage} className='px-3 py-1.5 bg-white/80 text-stone-700 text-xs font-semibold rounded-lg'>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Avatar + info */}
      <div className='px-6 pb-5'>
        {/* Avatar row — overlaps background */}
        <div className='-mt-10 mb-3'>
          <div
            className='relative w-fit'
            onMouseEnter={() => setIsProfileHover(true)}
            onMouseLeave={() => setIsProfileHover(false)}
          >
            <Image
              src={isEditingProfile ? newProfileImage || profileImage : profileImage}
              alt='Profile photo'
              width={80}
              height={80}
              className='w-20 h-20 rounded-full object-cover border-4 border-white shadow-md'
            />
            {isProfileHover && user?.id === userData?.userId && (
              <>
                <button
                  type='button'
                  onClick={() => document.getElementById('profileFileInput')?.click()}
                  className='absolute -bottom-1 -right-1 p-1.5 bg-white border border-stone-200 rounded-full shadow-sm hover:bg-stone-50 transition-colors'
                >
                  <SquarePenIcon className='text-stone-500' width={12} height={12} />
                </button>
                <input
                  id="profileFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </>
            )}
          </div>
          {isEditingProfile && (
            <div className='flex gap-2 mt-2'>
              <button onClick={handleConfirmProfileImage} className='px-3 py-1.5 bg-[#1B5A1B] text-white text-xs font-semibold rounded-lg'>
                Confirm photo
              </button>
              <button onClick={handleCancelProfileImage} className='px-3 py-1.5 border border-stone-200 text-stone-600 text-xs font-semibold rounded-lg'>
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Name + subtitle + buttons */}
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='text-xl font-bold text-stone-900'>
              {userData?.generalInformation?.firstName || userData?.generalInformation?.firstname}{' '}
              {userData?.generalInformation?.middleName || userData?.generalInformation?.middlename}{' '}
              {userData?.generalInformation?.lastName || userData?.generalInformation?.lastname}
            </h1>
            <p className='text-sm text-stone-400 mt-0.5'>Family tree member</p>
          </div>

          {/* Action buttons — only shown when data is loaded */}
          {userData && (
            <div className='flex items-center gap-2 flex-shrink-0'>
              <Link
                href={'/dashboard/family-tree/' + userData?.userId}
                className='px-4 py-2 border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors'
              >
                View Tree
              </Link>
              {user?.id !== userData?.userId && (() => {
                const isConnected = userData?.friendsList?.some((friend: UserFriend) => friend.userId === user?.id);
                const sentRequest = userData?.friendRequestList?.includes(user?.id ?? '');
                const incomingRequest = userFriends?.friendRequest?.includes(userData?.userId ?? '');

                if (isConnected) {
                  return (
                    <span className='px-4 py-2 bg-[#EAF1E5] text-[#1B5A1B] text-sm font-medium rounded-xl'>
                      Connected
                    </span>
                  );
                }
                if (sentRequest) {
                  return (
                    <span className='px-4 py-2 border border-stone-200 text-stone-400 text-sm font-medium rounded-xl'>
                      Sent Request
                    </span>
                  );
                }
                if (incomingRequest) {
                  return (
                    <button
                      onClick={() => {
                        acceptFriendRequest(userData?.userId ?? '');
                        updateService.acceptConnectionRequest(userData?.name || 'User');
                      }}
                      className='px-4 py-2 bg-[#1B5A1B] hover:bg-[#1B5A1B]/90 text-white text-sm font-medium rounded-xl transition-colors'
                    >
                      Accept Request
                    </button>
                  );
                }
                return (
                  <button
                    onClick={() => {
                      sendFriendRequest(userData?.userId ?? '');
                      updateService.sendConnectionRequest(userData?.name || 'User');
                    }}
                    className='px-4 py-2 bg-[#1B5A1B] hover:bg-[#1B5A1B]/90 text-white text-sm font-medium rounded-xl transition-colors'
                  >
                    Connect
                  </button>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
