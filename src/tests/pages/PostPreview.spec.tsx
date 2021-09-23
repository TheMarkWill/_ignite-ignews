import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils'

import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

const post = {
        slug: 'my-new-post',
        title: 'My New Post',
        content: '<p>Post content</p>',
        updatedAt: '10 of April',

        excerpt: 'Post',
        datePublished: '7 of september',
        dateModified: '10 of september',
        lang: 'Javascript',
};

jest.mock('../../services/prismic');
jest.mock('next/router');
jest.mock('next-auth/client');

describe('Post Preview page', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<PostPreview post={post} />)


        // Generate a link of playground to test element and select a item
        screen.logTestingPlaygroundURL()
        
        expect(screen.getByText('My New Post')).toBeInTheDocument()
        expect(screen.getByText('Post content')).toBeInTheDocument()
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
    })

    it('redirects user to full post when user id subscribed', async () => {
        const useSessionMocked = mocked(useSession);
        const useRouterMocked = mocked(useRouter);
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([
            { activeSubscription: 'fake-id-subscription' }, 
            false
        ]);

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<PostPreview post={post} />)


        expect(pushMock).toHaveBeenCalled()
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'My new post' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post excerpt' }
                    ]
                },
                last_publication_date: '09-23-2021',
                first_publication_date: '09-20-2021'
            })
        } as any)

        const response = await getStaticProps({
            params: {
                slug: 'fake-slug-post'
            }
        })

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post:
                    expect.objectContaining({
                        slug: 'fake-slug-post',
                        title: 'My new post',
                        content: '<p>Post excerpt</p>',
                        updatedAt: '23 de setembro de 2021',
                    })
                }
            })
        )
    })
})