const secret = process.env.SECRET_KEY as string
import jwt from 'jsonwebtoken'

const decodeAndGenerateToken = {
    generateToken: function (params = {}) {
        return jwt.sign(params, secret, {
          expiresIn: '1h',
        })
    },

    decodedToken: function(token: string){
      return jwt.decode(token) as jwt.JwtPayload
    }
}

export default decodeAndGenerateToken;