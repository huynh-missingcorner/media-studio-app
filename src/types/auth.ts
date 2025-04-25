export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userId: string;
  role: string;
  user: ProfileDto;
}

export interface ProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
}

export interface ResetPasswordDto {
  email: string;
}

export interface SetPasswordDto {
  token: string;
  password: string;
}
