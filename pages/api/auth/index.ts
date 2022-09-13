import { NextApiHandler } from 'next'
import { dbClient } from 'src/config/supabase'

// sets authentication cookie on auth event change
const handler: NextApiHandler = (req, res) => {
    dbClient.auth.api.setAuthCookie(req, res)
}

export default handler