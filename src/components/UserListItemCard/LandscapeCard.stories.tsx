import React from 'react';
import { UserListItemCardLandscape as UserCard } from './LandscapeCard';
import { generateUserListItem } from './PortraitCard.stories';

export default { title: 'Components/User List Item' };

export const Landscape = () => <UserCard user={generateUserListItem()} />;
