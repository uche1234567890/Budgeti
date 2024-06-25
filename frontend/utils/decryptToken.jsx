import CryptoJS from 'crypto-js';

export const handleDecrypt = (encryptedMessage, keyValue) => {
    try {
      const [ivHex, encryptedHex] = encryptedMessage.split(':');
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
      const key = CryptoJS.enc.Hex.parse(keyValue); 

      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encrypted },
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      const decryptedMessage = decrypted.toString(CryptoJS.enc.Utf8);
      return decryptedMessage
    } catch (error) {
      console.error('Error decrypting message:', error);
      return 'Failed to decrypt message.'
    }
  }