import { Role } from "./role";

export interface User {
    id: number,
    name: string,
    email: string,
    password: string,
    role: Role,
    address: string,
    zip_code: string,
    country: string,
    active: boolean
}