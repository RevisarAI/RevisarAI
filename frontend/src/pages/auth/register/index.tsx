import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { isEmail, isEmpty } from 'validator';
import { authenticationService } from '@/services/auth-service';
import { writeTokens } from '@/utils/local-storage';
import { flushSync } from 'react-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { IUserDetails, IClient } from 'shared-types';
import { useNavigate } from '@tanstack/react-router';
import {
  TextField,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  useTheme,
} from '@mui/material';
import { useAuth } from '@/utils/auth-context';

const validateEmail = (email: string) => !isEmpty(email) && isEmail(email);
const validatePasswords = (password: string, confirmPassword: string) => password === confirmPassword;

const RegisterPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const auth = useAuth();

  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registerForm = useForm<IClient & {confirmPassword: string}>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      businessName: '',
      businessDescription: '',
      businessId: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setErrorOccurred(false);
        setIsLoading(true);
        const tokens = await authenticationService.register(value);

        writeTokens(tokens, false);

        flushSync(() => {
          const payload = jwtDecode<JwtPayload & IUserDetails>(tokens.accessToken, {});
          auth.setUser(payload);
        });

        navigate({ to: '/' });
      } catch {
        setErrorOccurred(true);
      } finally {
        setIsLoading(false);
      }
    },
    validators: {
      onSubmit({ value }) {
        const requiredFields = ['email', 'password', 'fullName', 'businessName', 'businessDescription'] as Array<keyof typeof value>;
        if (!validateEmail(value.email) ||
            !validatePasswords(value.password, value.confirmPassword) ||
            requiredFields.some((field) => isEmpty(value[field].toString())))
            setErrorOccurred(true);
            return 'Missing or invalid values';
      },
    },
  });

  return (
    <Grid container direction="column" justifyContent="center" spacing={3}>
      <Grid item>
        <Typography variant="h4" textAlign="left">
          Register
          <Typography variant="body1" style={{ opacity: '0.5' }} textAlign="left">
          Let’s get to know each other!
          </Typography>
        </Typography>
      </Grid>
      <Grid item>
        <registerForm.Field
          name="email"
          children={(field) => (
            <TextField
              fullWidth
              id="email-input"
              label="Email"
              type="email"
              variant="outlined"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </Grid>
      <Grid item>
        <registerForm.Field
          name="fullName"
          children={(field) => (
            <TextField
              fullWidth
              id="fullName-input"
              label="Full Name"
              type="name"
              variant="outlined"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </Grid>
      <Grid item>
        <registerForm.Field
          name="businessName"
          children={(field) => (
            <TextField
              fullWidth
              id="businessName-input"
              label="Business Name"
              type="name"
              variant="outlined"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </Grid>
      <Grid item>
        <registerForm.Field
          name="businessDescription"
          children={(field) => (
            <TextField
              fullWidth
              multiline
              rows={5}
              id="businessDescription-input"
              label="Business Description"
              placeholder='Up to 200 characters'
              type="name"
              variant="outlined"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </Grid>
      <Grid item>
        <registerForm.Field
          name="password"
          children={(field) => (
            <TextField
              fullWidth
              id="password-input"
              label="Password"
              type="password"
              variant="outlined"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </Grid>
      <Grid item>
        <registerForm.Field
          name="confirmPassword"
          children={(field) => (
            <TextField
              fullWidth
              id="confirmPassword-input"
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      </Grid>
      <Grid item>
        <Button
         fullWidth
         variant="contained"
         disabled={isLoading}
         color="primary"
         style={{ borderRadius: '5vh' }}
         onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          registerForm.validateAllFields('submit');
          registerForm.handleSubmit();
        }}
         >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Typography variant="button" style={{ textTransform: 'none' }}>
              Register
            </Typography>
          )}
        </Button>
      </Grid>
      <Snackbar open={errorOccurred} onClose={() => setErrorOccurred(false)} autoHideDuration={4000}>
        <SnackbarContent message="Invalid email or password" style={{ backgroundColor: theme.palette.error.main }} />
      </Snackbar>
    </Grid>
  );
};

export default RegisterPage;
