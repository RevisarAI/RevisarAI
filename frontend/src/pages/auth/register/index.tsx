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
  Alert,
} from '@mui/material';
import { useAuth } from '@/utils/auth-context';

const validateEmail = (email: string) => !isEmpty(email) && isEmail(email);

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registerForm = useForm<IClient>({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      businessName: '',
      businessDescription: '',
      businessId: '',
    },
    onSubmit: async ({ value }) => {
      try {
        setErrorOccurred(false);
        setIsLoading(true);
        const { email, password } = value;
        const tokens = await authenticationService.login(email, password);

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
        const requiredFields = ['email', 'password'] as Array<keyof typeof value>;
        if (!validateEmail(value.email) || requiredFields.some((field) => isEmpty(value[field].toString())))
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
              maxRows={5}
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
          name="password"
          children={(field) => (
            <TextField
              fullWidth
              id="confirm-password-input"
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
        <Button fullWidth variant="contained" disabled={isLoading} color="primary" style={{ borderRadius: '5vh' }}>
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Typography variant="button" style={{ textTransform: 'none' }}>
              Register
            </Typography>
          )}
        </Button>
      </Grid>
      {errorOccurred && (
        <Grid item>
          <Alert severity="error">Wrong email or password</Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default RegisterPage;
