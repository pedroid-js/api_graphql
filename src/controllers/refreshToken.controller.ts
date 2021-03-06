import { createAccessToken, createRefreshToken } from '../auth';
import { sendRefreshToken } from '../sendRefreshToken';
import { verify } from 'jsonwebtoken';
import { User } from '../entity/User';

import { Response, Request } from 'express'

const refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.jid
    if (!token) {
        return res.send({ ok: false, accessToken: '' })
    }
    let payload: any = null
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
    } catch (err) {
        console.log(err)
        return res.send({ ok: false, accessToken: '' })
    }
    const user = await User.findOne({ id: payload.userId })
    if (!user) {
        return res.send({ ok: false, accessToken: "" })
    }
    if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ ok: false, accessToken: "" })
    }
    sendRefreshToken(res, createRefreshToken(user))
    return res.send({ ok: true, accessToken: createAccessToken(user) })
}

export default refreshToken
