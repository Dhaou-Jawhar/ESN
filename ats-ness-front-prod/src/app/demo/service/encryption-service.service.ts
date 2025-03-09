import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class EncryptionServiceService {
    private secretKey ="534f41535932303234414c46524553434f504645535441474546494e455455444553";
  constructor() { }

    encryptId(id: number): string {
        try {
            if (id === null || id === undefined) {
                throw new Error('ID is required for encryption');
            }

            // Convertir en string
            const idString = id.toString();

            // Utiliser la clé directement comme string
            const encrypted = CryptoJS.AES.encrypt(idString, this.secretKey);

            return encrypted.toString();
        } catch (error) {
            console.error('Encryption error:', error);
            throw error;
        }
    }

    decryptId(encryptedId: string): string {
        try {
            if (!encryptedId) {
                throw new Error('Encrypted ID is required for decryption');
            }

            // Décrypter avec la même clé
            const bytes = CryptoJS.AES.decrypt(encryptedId, this.secretKey);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

            if (!decryptedString) {
                throw new Error('Decryption resulted in empty string');
            }

            return decryptedString;
        } catch (error) {
            console.error('Decryption error:', error);
            throw error;
        }
    }
}
