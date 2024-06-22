import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { isEmail, isEmpty } from 'validator';
import { authenticationService } from '@/services/auth-service';
import { writeTokens } from '@/utils/local-storage';
import { flushSync } from 'react-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { IUserDetails, ILoginFormData } from 'shared-types';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import StarSvg from '@/assets/star.svg';
import {
  TextField,
  Grid,
  Divider,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Snackbar,
  SnackbarContent,
  useTheme,
} from '@mui/material';
import { useAuth } from '@/utils/auth-context';

const validateEmail = (email: string) => !isEmpty(email) && isEmail(email);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const routeApi = getRouteApi('/_auth/login');
  const search = routeApi.useSearch();

  const theme = useTheme();

  const [errorOccurred, setErrorOccurred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<ILoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
    onSubmit: async ({ value }) => {
      try {
        setErrorOccurred(false);
        setIsLoading(true);
        const { email, password, remember } = value;
        const tokens = await authenticationService.login(email, password);

        writeTokens(tokens, remember);

        flushSync(() => {
          const payload = jwtDecode<JwtPayload & IUserDetails>(tokens.accessToken, {});
          auth.setUser(payload);
        });

        navigate({ to: search.redirect || '/' });
      } catch {
        setErrorOccurred(true);
      } finally {
        setIsLoading(false);
      }
    },
    validators: {
      onSubmit({ value }) {
        const requiredFields = ['email', 'password'] as Array<keyof typeof value>;
        if (!validateEmail(value.email) || requiredFields.some((field) => isEmpty(value[field].toString()))) {
          setErrorOccurred(true);
          return 'Missing or invalid values';
        }
      },
    },
  });

  const handleGoogleSuccess = async (credential: string) => {
    try {
      setErrorOccurred(false);
      setIsLoading(true);
      const tokens = await authenticationService.googleSignIn(credential);
      writeTokens(tokens, loginForm.getFieldValue('remember'));

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
  };

  const handleGoogleError = () => {
    console.error('google login failed');
    setErrorOccurred(true);
  };

  const openRegisterPage = () => {
    navigate({ to: '/register' });
  };

  return (
    <Grid container direction="column" justifyContent="center" spacing={3}>
      <Grid item>
        <img src={StarSvg} />
      </Grid>
      <Grid item>
        <Typography variant="h4" textAlign="left">
          Log in
          <Typography variant="body1" style={{ opacity: '0.5' }} textAlign="left">
            Start growing your business
          </Typography>
        </Typography>
      </Grid>
      <Grid item container direction="row" justifyContent="center">
        <Grid item md={6}>
          <GoogleLogin
            onSuccess={({ credential }) => handleGoogleSuccess(credential!)}
            onError={handleGoogleError}
            shape="circle"
            useOneTap={true}
          />
        </Grid>
      </Grid>
      <Grid item>
        <Divider>
          <Typography variant="body2" style={{ opacity: '0.5' }}>
            or Sign in with Email
          </Typography>
        </Divider>
      </Grid>
      <Grid item>
        <loginForm.Field
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
        <loginForm.Field
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
      <Grid item container direction="row" marginTop="-2vh" justifyContent="space-between" alignItems="center">
        <Grid item xs>
          <loginForm.Field
            name="remember"
            children={(field) => (
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={field.state.value}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                }
                label="Remember me"
              />
            )}
          />
        </Grid>
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
            loginForm.validateAllFields('submit');
            loginForm.handleSubmit();
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <Typography variant="button" style={{ textTransform: 'none' }}>
              Log in
            </Typography>
          )}
        </Button>
      </Grid>
      <Grid item>
        <Typography display="block" variant="body1">
          Not registered yet?{' '}
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              openRegisterPage();
            }}
          >
            Create an account
          </a>
        </Typography>
      </Grid>

      <Snackbar open={errorOccurred} onClose={() => setErrorOccurred(false)} autoHideDuration={4000}>
        <SnackbarContent message="Invalid email or password" style={{ backgroundColor: theme.palette.error.main }} />
      </Snackbar>
    </Grid>
  );
};

export default LoginPage;
