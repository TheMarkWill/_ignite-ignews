import styles from './styles.module.scss'

export default function SubscribeButton () {
  const isUserLoggedIn = true;

  return (
    <button 
      type="button"
      className={styles.subscribeButton}
      >
      Subscribe Now
    </button>
  )
}