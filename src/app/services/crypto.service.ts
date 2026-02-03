import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class CryptoService{
    private readonly SECRET_KEY = 'louvre-2025'

    encrypt(data:any): string {
        const jsonString = JSON.stringify(data);
        return CryptoJS.AES.encrypt(jsonString, this.SECRET_KEY).toString();
    }

    decrypt(encryptedData: string) : any {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

            if (!decryptedString){
                return null;
            }

            return JSON.parse(decryptedString);
        } catch (error) {
            console.error('erreur dechiffrement:', error);
            return null;
        }
    }
}