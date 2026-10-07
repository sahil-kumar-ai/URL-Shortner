import crypto from 'crypto';

const generateUniqueCode = () => {
    return crypto.randomBytes(4).toString("base64url");
}

export default generateUniqueCode;