import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

export const ProjectManagerIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  function ProjectManagerIcon(props, ref) {
    return (
      <SvgIcon {...props} ref={ref} viewBox="0 0 24 24">
        <path d="M10.67 13.02c-.22-.01-.44-.02-.67-.02-2.42 0-4.68.67-6.61 1.82-.88.52-1.39 1.5-1.39 2.53V20h9.26c-.79-1.13-1.26-2.51-1.26-4 0-1.07.25-2.07.67-2.98ZM10 12c2.2091 0 4-1.7909 4-4 0-2.20914-1.7909-4-4-4-2.20914 0-4 1.79086-4 4 0 2.2091 1.79086 4 4 4ZM16.5023 21c-2.486-.0007-4.5013-2.0177-4.5023-4.5044.0003-1.0988.3959-2.102 1.0503-2.882.4137-.1922.8681-.2936 1.3378-.2936.5917 0 1.159.1606 1.6515.4608-.7219.682-1.1727 1.6486-1.1727 2.7208 0 2.0663 1.6745 3.7418 3.7398 3.7418.1448 0 .2871-.008.4274-.0241-.7229.4934-1.5942.78-2.5318.7807Zm-2.536-8.2196c.1402-.0161.2826-.0242.4274-.0242 2.0652 0 3.7398 1.6755 3.7398 3.7419 0 1.0722-.4505 2.0387-1.1727 2.7207.4928.3006 1.0597.4612 1.6515.4612.4697 0 .9244-.1014 1.3378-.2936.654-.7796 1.0496-1.7832 1.0499-2.882-.001-2.4867-2.0163-4.5034-4.5019-4.5044-.9377.001-1.8089.2876-2.5318.7804Z" />
      </SvgIcon>
    );
  }
);
