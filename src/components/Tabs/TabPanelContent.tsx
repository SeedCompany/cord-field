import { Paper, PaperProps } from '@mui/material';
import { styled } from '@mui/material/styles';

type TabPanelContentProps = PaperProps;

export const TabPanelContent = styled((props: TabPanelContentProps) => (
  <Paper {...props} />
))(({ theme }) => ({
  padding: theme.spacing(2, 3),
  maxWidth: `${theme.breakpoints.values.lg}px`,
  // TODO I don't really like this. We should call out some other explicit way.
  '&:has(> .MuiDataGrid-root)': {
    flex: 1,
    padding: 0,
    maxWidth: '100cqw',
    width: 'min-content',
    // idk why -50, MUI pushes down past container
    maxHeight: 'calc(100cqh - 50px)',
  },
}));
