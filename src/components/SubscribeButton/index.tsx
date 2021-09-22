import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import Link from "next/link";
import { api } from '../../services/api';
import { GetStripeJS } from '../../services/stripe-js';

import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const [session] = useSession();
    const router = useRouter();

    async function handleSubscribe() {
        if (!session) {
            signIn('github');
            return;
        }

        if (session?.activeSubscription) {
            router.push('/posts');
            return;
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


    if (session?.activeSubscription) {
        return (
            <button
                type="button"
                className={styles.subscribeButton}
                onClick={handleSubscribe}
            >
                Go to Posts 🥰
            </button>

        )
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