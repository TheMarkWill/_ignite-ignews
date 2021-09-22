import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils'
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';


jest.mock('next-auth/client')
jest.mock('next/router')

describe('SubscribeButton component', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false])
        render(<SubscribeButton priceId={"idInStripe"} />);

        
        expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
    })

    it('redirects user to sign in when not authenticated', () => {
        const signInMocked = mocked(signIn);
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false])
        render(<SubscribeButton priceId={"idInStripe"} />);

        const subscribeButton = screen.getByText('Subscribe Now');

        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled();
    })

    it('redirects to posts when user already has a subscription', () => {
        const useRouterMocked = mocked(useRouter);
        const useSessionMocked = mocked(useSession);

        const pushMocked = jest.fn();

        useSessionMocked.mockReturnValueOnce([
            { 
                user : { 
                    name: 'John Doe', 
                    email: 'john.doe@example.com'
                }, 
                activeSubscription: 'fake-active-subscription',
                expires: 'fake-expires' 
            }, 
            true
        ])
        useRouterMocked.mockReturnValueOnce({
            push: pushMocked
        } as any)


        render(<SubscribeButton priceId={"idInStripe"} />);

        const subscribeButton = screen.getByText('Go to Posts 🥰');

        fireEvent.click(subscribeButton);

        expect(pushMocked).toHaveBeenCalled();
    })
})