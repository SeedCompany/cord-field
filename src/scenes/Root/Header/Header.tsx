import { Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

const routeTitleByTopSegment: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  languages: 'Languages',
  users: 'People',
  partners: 'Partners',
  search: 'Search',
};

export interface HeaderProps {
  /** Toggle the navigation sidebar (visible at all viewport sizes). */
  onMenuClick?: () => void;
  /** Whether the navigation is currently open — used for `aria-expanded`. */
  navOpen?: boolean;
  /** DOM id of the nav region this button controls — for `aria-controls`. */
  navControlsId?: string;
}

export const Header = ({
  onMenuClick,
  navOpen,
  navControlsId,
}: HeaderProps) => {
  const [pageTitle, setPageTitle] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const location = useLocation();
  const topSegment = location.pathname.split('/').filter(Boolean)[0] ?? '';
  const fallbackTitle = routeTitleByTopSegment[topSegment];
  const displayTitle = pageTitle || fallbackTitle || '';

  useEffect(() => {
    const readDocumentTitle = () => {
      const title = document.title.replace(/ - CORD Field$/, '');
      // Helmet can briefly emit the base app title during transitions.
      // Ignore it so the header doesn't flicker before the real route title arrives.
      if (title && title !== 'CORD Field') {
        setPageTitle(title);
      }
    };

    // Reset stale route title immediately; fallback title renders synchronously.
    setPageTitle('');
    readDocumentTitle();

    const observer = new MutationObserver(readDocumentTitle);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname, location.search]);

  return (
    <AppBar position="static" color="inherit" sx={{ zIndex: 1 }}>
      <Toolbar
        sx={{
          gap: { xs: 1, sm: 2, md: 3 },
          minWidth: 0,
          paddingInlineStart: 'max(8px, env(safe-area-inset-left))',
          paddingInlineEnd: 'max(8px, env(safe-area-inset-right))',
          justifyContent: 'space-between',
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle navigation menu"
          aria-expanded={Boolean(navOpen)}
          aria-controls={navControlsId}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          sx={{
            display: 'block',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textAlign: 'left',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {displayTitle}
        </Typography>
        <HeaderSearch
          expanded={searchExpanded}
          onExpandedChange={setSearchExpanded}
          sx={{
            minWidth: 0,
            flex: {
              xs: searchExpanded ? '1 1 auto' : '0 0 auto',
              mobile: '1 1 auto',
            },
            maxWidth: 500,
          }}
        />
        <ProfileToolbar />
      </Toolbar>
    </AppBar>
  );
};
