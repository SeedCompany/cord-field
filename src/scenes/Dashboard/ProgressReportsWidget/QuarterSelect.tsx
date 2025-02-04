import { Autocomplete, TextField } from '@mui/material';
import { useQuarterState } from './useQuarterState';

export const QuarterSelect = ({
  available,
  current,
  set,
}: ReturnType<typeof useQuarterState>) => (
  <Autocomplete
    disablePortal
    options={available}
    getOptionLabel={(q) => `Q${q.fiscalQuarter} FY${q.fiscalYear}`}
    isOptionEqualToValue={(a, b) => +a === +b}
    value={current}
    onChange={(_, q) => set(q)}
    disableClearable
    size="small"
    renderInput={(params) => (
      <TextField variant="outlined" margin="none" {...params} />
    )}
    sx={{ width: 137 }}
  />
);
