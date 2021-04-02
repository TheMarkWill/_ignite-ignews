import { query } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionID: string,
  customerId: string
) {
  try {
    const userRef = await fauna.query(
      query.Select(
        "ref",
        query.Get(
          query.Match(
            query.Index('user_by_stripe_customer_id'),
            customerId
          )
        )
      )
    )
  
    const subscription = await stripe.subscriptions.retrieve(subscriptionID);
  
    const subscriptionData = {
      id: subscription.id,
      userId: userRef,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id
    };
  
    console.log(subscriptionData);
  
    await fauna.query(
      query.Create(
        query.Collection('subscriptions'),
        {
          data: subscriptionData
        }
      )
    )
  } catch(error){
    console.log(error)
  }
}