export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister {
  username: string;
  password: string;

  fullname: string;
}

export interface UserResponse {
  id: string;
  username: string;
  roles: any;
  enabled: boolean;
  mfaEnabled: boolean;
}


export interface AuthenticationResponseDTO {
  accessToken: string;
  refreshToken: string;
  isMfa: boolean;
}

