import { useSession, signIn } from 'next-auth/client';
import { api } from '../../services/api';
import { GetStripeJS } from '../../services/stripe-js';

import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string;
}

export default function SubscribeButton ({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  async function handleSubscribe(){
    if(!session){
      signIn('github');
      return ;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await GetStripeJS();

      await stripe.redirectToCheckout({
        sessionId
      });
    } catch (error) {
      alert(error.message);
    }
    // Fazer a criação da cobrança
  }

  return (
    <button 
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
      >
      Subscribe Now
    </button>
  )
}