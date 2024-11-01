export interface LoginResponse {
    token: string;
    username: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }