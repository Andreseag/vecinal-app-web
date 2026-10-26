/**
 * DTOs: la FORMA EXACTA que viaja por la red (contrato con el backend, ver
 * docs/API_CONTRACT.md). Si el backend cambia nombres, se cambia aquí y en los
 * mappers; dominio, casos de uso y UI no se enteran.
 */
export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operador" | "porteria" | "consejo";
  organization: string;
}

export interface TokensDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponseDto extends TokensDto {
  user: UserDto;
}
