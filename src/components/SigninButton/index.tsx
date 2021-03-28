import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fI';

import styles from './styles.module.scss'

export default function SignInButton () {
  const isUserLoggedIn = true;

  return isUserLoggedIn ? (
    <button 
      type="button"
      className={styles.signInButton}
    >
      <FaGithub color="#04D361"/>
      marconwillian
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button 
      type="button"
      className={styles.signInButton}
      >
      <FaGithub color="#EBA417"/>
      Sign In with Github
    </button>
  )
}