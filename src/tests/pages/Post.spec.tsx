import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils'

import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';
import { getSession } from 'next-auth/client';

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
jest.mock('next-auth/client');

describe('Post page', () => {
    it('renders correctly', () => {
        render(<Post post={post} />)
        
        expect(screen.getByText('My New Post')).toBeInTheDocument()
        expect(screen.getByText('Post content')).toBeInTheDocument()
    })

    it('redirects user if no subscription if found', async () => {
        const getSessionMocked = mocked(getSession);

        getSessionMocked.mockResolvedValueOnce(null);

        const response = await getServerSideProps({
            params: {
                slug: 'fake-slug-post'
            } 
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/posts/preview/fake-slug-post'
                })
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession);
        const getPrismicClientMocked = mocked(getPrismicClient);

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any);
        
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

        const response = await getServerSideProps({
            params: {
                slug: 'fake-slug-post'
            } 
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: expect.objectContaining(
                        {
                            slug: 'fake-slug-post',
                            title: 'My new post',
                            content: '<p>Post excerpt</p>',
                            updatedAt: '23 de setembro de 2021',
                        }
                    )
                }
            })
        )
    })
})