import RegisterAndLoginButton from '../SignInButton'

import styles from './styles.module.scss'
import { ActiveLink } from '../ActiveLink';
import Link from 'next/link';

export function Header(){
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <img src="/images/logo.svg" alt="ig.news"/>
        </Link>
        <nav>
          <ActiveLink activeClassName={styles.active} href='/' prefetch>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href='/posts' prefetch>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <RegisterAndLoginButton />
      </div>
    </header>
  )
}