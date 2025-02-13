import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

// const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
//     const token = jwt.sign(
//         payload,
//         secret,
//         {
//             algorithm: 'HS256',
//             expiresIn
//         }
//     );

//     return token;
// };

const generateToken = (payload: any, secret: Secret, expiresIn: string | any) => {
    try {
        return jwt.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn
        });
    } catch (error) {
        console.error('JWT Token Generation Error:', error);
        throw error;
    }
};

const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JwtPayload;
}
0
export const jwtHelpers = {
    generateToken,
    verifyToken
}