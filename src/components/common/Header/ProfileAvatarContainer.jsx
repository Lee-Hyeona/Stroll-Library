import React, { useState, useRef } from "react";
import styled from "styled-components";
import ProfilePopover from "./ProfilePopover";

function ProfileAvatarContainer({ profile }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState(null);
  const triggerRef = useRef(null);

  const handleAvatarClick = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTriggerRect(rect);
    }
    setIsPopoverOpen(!isPopoverOpen);
  };

  return (
    <ProfileContainer>
      <UserProfileButton ref={triggerRef} onClick={handleAvatarClick}>
        <UserProfileIcon src={"/profile/profile.svg"} alt={profile?.name} />
      </UserProfileButton>
      {isPopoverOpen && (
        <ProfilePopover
          setPopoverOpen={setIsPopoverOpen}
          profile={profile}
          triggerRect={triggerRect}
        />
      )}
    </ProfileContainer>
  );
}

export default ProfileAvatarContainer;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const UserProfileButton = styled.div`
  cursor: pointer;
  background-color: ${({ theme }) => theme.palette.white};
  color: ${({ theme }) => theme.palette.black};
  font-weight: 500;
  font-size: 1rem;
`;

const UserProfileIcon = styled.img`
  width: 2rem;
  height: 2rem;
`;
