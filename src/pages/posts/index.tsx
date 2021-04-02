import Head from 'next/head'

import styles from './styles.module.scss'

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.postList}>
          <a href="">
            <time>12 de março de 2021</time>
            <strong>Titulo do post em si é este aqui</strong>
            <p>
            No React 17 em diante não vamos mais precisar importar o React para apenas usar JSX. A fim de simplificar as coisas, o novo transformador de JSX irá injetar automaticamente as funções necessárias.
            </p>
          </a>
          <a href="">
            <time>12 de março de 2021</time>
            <strong>Titulo do post em si é este aqui</strong>
            <p>
            No React 17 em diante não vamos mais precisar importar o React para apenas usar JSX. A fim de simplificar as coisas, o novo transformador de JSX irá injetar automaticamente as funções necessárias.
            </p>
          </a>
          <a href="">
            <time>12 de março de 2021</time>
            <strong>Titulo do post em si é este aqui</strong>
            <p>
            No React 17 em diante não vamos mais precisar importar o React para apenas usar JSX. A fim de simplificar as coisas, o novo transformador de JSX irá injetar automaticamente as funções necessárias.
            </p>
          </a>
          <a href="">
            <time>12 de março de 2021</time>
            <strong>Titulo do post em si é este aqui</strong>
            <p>
            No React 17 em diante não vamos mais precisar importar o React para apenas usar JSX. A fim de simplificar as coisas, o novo transformador de JSX irá injetar automaticamente as funções necessárias.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}