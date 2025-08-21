export enum ERole {
    Admin = 'admin',
    Empleado = 'agente',
    Supervisor = 'supervisor',
    // Add other roles if you have them
  }
  
  // This represents the User object you get from the API
  // Note: The password is intentionally omitted for security.
  export interface User {
    id: number; // Or string, depending on your database
    username: string;
    password: string;
    rol: ERole;
  }
  
  // This is the DTO for the PATCH request. 
  // All fields are optional.
  export interface UpdateUserDto {
    username?: string;
    password?: string; // For changing the password
    rol?: ERole;
  }