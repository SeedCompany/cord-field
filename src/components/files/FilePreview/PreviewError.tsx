import { Grid, Typography } from '@mui/material';

interface PreviewErrorProps {
  errorText: string;
}

export const PreviewError = (props: PreviewErrorProps) => {
  const { errorText } = props;
  return (
    <Grid item>
      <Typography
        variant="h3"
        color="textSecondary"
        sx={(theme) => ({
          maxWidth: theme.breakpoints.values.sm,
          textAlign: 'center',
        })}
      >
        {errorText}
      </Typography>
    </Grid>
  );
};
