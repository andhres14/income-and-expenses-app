export class User {

    static fromFirebase(data: UserDataFirebase) {
        return new User(data.uid, data.nombre, data.email)
    }
     

    constructor(
        public uid: string,
        public nombre: string,
        public email: string,
    ) { }
}

export interface UserDataFirebase {
    nombre: string;
    email: string;
    uid: string
}