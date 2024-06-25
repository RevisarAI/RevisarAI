import { useAuth } from '@/utils/auth-context';
import { Grid, Typography, TextField, Paper, Stack, Button, CircularProgress, Snackbar, SnackbarContent, useTheme } from '@mui/material';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { IBusinessDetails } from 'shared-types';
import { isEmpty } from 'validator';

const CustomizePage: React.FC = () => {
  const theme = useTheme();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const customizeForm = useForm<IBusinessDetails>({
    defaultValues: {
      businessId: auth.user?.businessId || '',
      businessName: auth.user?.businessName || '',
      businessDescription: auth.user?.businessDescription || '',
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      console.log(value);
    },
    validators: {
      onSubmit({ value }) {
        const requiredFields = ['businessName', 'businessDescription'] as Array<keyof typeof value>;
        if(requiredFields.some((field) => isEmpty(value[field].toString())) || value.businessDescription.length > 200) {
          setErrorOccurred(true);
          return 'Missing or invalid values';
        }
    },
  }
  });

  return (
    <>
      <Grid container justifyContent={'center'} spacing={4}>
        <Grid item md={12}>
          <Typography variant="h6" sx={{ fontWeight: 'regular' }}>
            Customize your recommendations and settings
          </Typography>
        </Grid>
        <Grid item md={9}>
          <Paper
            elevation={1}
            sx={{
              backgroundColor: 'white',
              borderRadius: '1vh',
              height: '60vh',
            }}
          >
            <Stack direction={'column'} padding={8} spacing={2}>
              <customizeForm.Field
                name="businessName"
                children={(field) => (
                  <TextField
                    fullWidth
                    id="businessName-input"
                    label="Business Name"
                    type="string"
                    variant="outlined"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              ></customizeForm.Field>
              <customizeForm.Field
                name="businessDescription"
                children={(field) => (
                  <TextField
                    fullWidth
                    id="businessDescription-input"
                    label="Business Description"
                    type="string"
                    variant="outlined"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    multiline
                    rows={7}
                    helperText="Up to 200 characters"
                    error={field.state.value.length > 200}
                  />
                )}
              ></customizeForm.Field>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" paddingRight={8} spacing={1}>
              <Button
                sx={{ width: '13vw', color: 'primary.main' }}
                variant="outlined"
                disabled={isLoading}
                color="primary"
                style={{ borderRadius: '5vh' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  customizeForm.reset();
                }}
              >
                <Typography variant="button" style={{ textTransform: 'none' }}>
                  Reset to previous values
                </Typography>
              </Button>
              <Button
                sx={{ width: '5vw' }}
                variant="contained"
                disabled={isLoading}
                color="primary"
                style={{ borderRadius: '5vh' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  customizeForm.validateAllFields('submit');
                  customizeForm.handleSubmit();
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Typography variant="button" style={{ textTransform: 'none' }}>
                    Save
                  </Typography>
                )}
              </Button>
            </Stack>
          </Paper>
        </Grid>
        <Snackbar open={errorOccurred} onClose={() => setErrorOccurred(false)} autoHideDuration={4000}>
        <SnackbarContent message="Missing or invalid values" style={{ backgroundColor: theme.palette.error.main }} />
      </Snackbar>
      </Grid>
    </>
  );
};

export default CustomizePage;
