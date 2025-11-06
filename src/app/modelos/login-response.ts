export interface LoginResponse {
  usuario: {
    id: number;
    nome: string;
    nome_de_usuario: string;
    email: string;
    fotoPath?: string;
  };
  token: string;
}