import { useState } from 'react';
import { HeaderSearch as HS } from './HeaderSearch';

export default { title: 'Scenes/Root/Header' };

export const HeaderSearch = () => {
  const [expanded, setExpanded] = useState(false);
  return <HS expanded={expanded} onExpandedChange={setExpanded} />;
};
