import { parse } from 'graphql';
import type { DocumentNode } from 'graphql';

export const REGISTER_WITH_CREDENTIALS: DocumentNode = parse(`
  mutation RegisterWithCredentials($email: String!, $password: String!, $username: String!) {
    registerWithCredentials(email: $email, password: $password, username: $username) {
      accessToken
      refreshToken
      user {
        id
        username
        email
        avatarUrl
        language
        role
      }
    }
  }
`);

export const LOGIN_WITH_CREDENTIALS: DocumentNode = parse(`
  mutation LoginWithCredentials($email: String!, $password: String!) {
    loginWithCredentials(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
        id
        username
        email
        avatarUrl
        language
        role
      }
    }
  }
`);

export const LOGIN_WITH_GOOGLE: DocumentNode = parse(`
  mutation LoginWithGoogle($idToken: String!) {
    loginWithGoogle(idToken: $idToken) {
      accessToken
      refreshToken
      user {
        id
        username
        email
      }
    }
  }
`);

export const LOGOUT: DocumentNode = parse(`
  mutation Logout {
    logout
  }
`);

export const UPDATE_PROFILE: DocumentNode = parse(`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      username
      avatarUrl
      language
    }
  }
`);
