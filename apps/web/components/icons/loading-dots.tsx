import styles from "./loading-dots.module.css";

interface LoadingDotsProps {
  color?: string;
}

const LoadingDots = () => {
  return (
    <span className={styles.loading}>
      <span />
      <span />
      <span />
    </span>
  );
};

export default LoadingDots;
