import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client';
import { useState } from 'react';

import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

jest.mock('next/router');
jest.mock('next-auth/client', () => {
    return {
        useSession() {
            return [null, false]
        }
    }
});
jest.mock('../../services/stripe');

describe('Home page', () => {
    it('renders correctly', () => {
        render(<Home product={{ amount: '$10.00', priceId: 'fake-price-id'}} />)
        
        expect(screen.getByText('for $10.00 month')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const retrivePricesStripeMocked = mocked(stripe.prices.retrieve)

        retrivePricesStripeMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000
        } as any)


        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fake-price-id',
                        amount: '$10.00'
                    }
                }
            })
        );
    })
})