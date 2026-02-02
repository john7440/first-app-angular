export class User{
    id: number;
    email: string;
    password : string;
    role: string ;

    constructor(id: number, email: string, password: string, role: string){
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}

