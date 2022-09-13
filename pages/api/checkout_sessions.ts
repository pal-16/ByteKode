const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
    if(req.method == 'POST'){
        try {
            const session = await stripe.checkout.sessions.create({
                line_items: [
                  {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: 'price_1Le8GaB5bILmGU85YyRQaZoL',
                    quantity: 1,
                  },
                ],
                mode: 'subscription',
                success_url: `${req.headers.origin}/?success=true`,
                cancel_url: `${req.headers.origin}/?canceled=true`,
            })
            res.redirect(303, session.url)
        }
        catch(err: any){
            res.status(err.statusCode || 500).json(err.message);
        }
    }
}

export default handler