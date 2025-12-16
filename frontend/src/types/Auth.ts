export type UserRole = "USER" | "EMPLOYEE" | "ADMIN";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    role: UserRole;
}

export interface AuthResponse {
    message: string;
    role: UserRole;
}
