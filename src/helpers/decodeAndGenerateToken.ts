const secret = process.env.SECRET_KEY as string
import jwt from 'jsonwebtoken'

const decodeAndGenerateToken = {
    generateToken: function (params = {}) {
        return jwt.sign(params, secret, {
          expiresIn: '1h',
        })
    },

    decodedToken: function(token: string){
      const parts = token.split(' ')
        const [scheme, newToken] = parts
        return newToken
      // return jwt.decode(newToken) as jwt.JwtPayload
    }
}

export default decodeAndGenerateToken;