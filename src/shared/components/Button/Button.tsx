import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outlined' | 'error';
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  className,
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={`items-center justify-center ${styles.button} ${styles[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}