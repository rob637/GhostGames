const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const admin = require('firebase-admin')

// Initialize Firebase Admin
admin.initializeApp()

// Define secret (set via: firebase functions:secrets:set STRIPE_SECRET_KEY)
const stripeSecret = defineSecret('STRIPE_SECRET_KEY')

/**
 * Create Stripe Checkout Session
 * 
 * Called from the client to start the payment flow.
 * Returns a checkout URL that redirects to Stripe's hosted page.
 */
exports.createCheckoutSession = onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    const stripe = require('stripe')(stripeSecret.value())
    
    // Get the origin for redirect URLs
    const origin = request.rawRequest?.headers?.origin || 'https://ghost-games-4206b.web.app'
    
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Ghost Games Premium',
                description: 'Unlock all 10+ party games forever',
                images: ['https://ghost-games-4206b.web.app/icon-512.png'],
              },
              unit_amount: 199, // $1.99 in cents
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/?premium=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?premium=cancelled`,
        // Store customer for future reference
        metadata: {
          product: 'ghost-games-premium',
        },
      })

      return { url: session.url, sessionId: session.id }
    } catch (error) {
      console.error('Stripe error:', error)
      throw new HttpsError('internal', 'Failed to create checkout session')
    }
  }
)

/**
 * Verify Purchase
 * 
 * Called after redirect from Stripe to verify the payment succeeded.
 */
exports.verifyPurchase = onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    const stripe = require('stripe')(stripeSecret.value())
    const { sessionId } = request.data

    if (!sessionId) {
      throw new HttpsError('invalid-argument', 'Session ID required')
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      
      if (session.payment_status === 'paid') {
        return { 
          success: true, 
          email: session.customer_details?.email 
        }
      } else {
        return { success: false }
      }
    } catch (error) {
      console.error('Verify error:', error)
      throw new HttpsError('internal', 'Failed to verify purchase')
    }
  }
)
