import { GetServerSideProps } from "next"
import { getSession } from 'next-auth/react'
import Head from "next/head";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../services/prismic";
import styles from './post.module.scss';

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;

  excerpt: string;
  datePublished: string,
  dateModified: string,
  lang: string,
}

interface PostsProps {
  post: Post
}

export default function Post({ post }: PostsProps) {
  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>

        <meta name="description" content={post.excerpt}/>

        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "datePublished": post.datePublished,
              "dateModified": post.dateModified,
              "author": { "@type": "Person", "name": "Marcon Willian" },
              "publisher": {
                "@type": "Person",
                "name": "Marcon Willian",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://github.com/MarconWillian.png"
                }
              }
            })
          }}
        />
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time dateTime={post.dateModified}>{post.updatedAt}</time>
          <div 
            className={styles.postContent}
            dangerouslySetInnerHTML={{
              __html: post.content
            }} />
        </article>
      </main>
    </>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({req});
  const { slug } = params;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false
      }
    };
  }

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  if(!response?.data){
    return {
      notFound: true
    }
  }

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    excerpt: response.data.content.find(content => content.type == 'paragraph')?.text ?? '',
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    datePublished: response.first_publication_date,
    dateModified: response.last_publication_date,
    lang: response.lang,
  }

  return {
    props: {
      post
    }
  }
}