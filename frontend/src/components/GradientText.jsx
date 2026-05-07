export default function GradientText({ children, className = '' }) {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-somacan-700 via-somacan-500 to-gold-500 ${className}`}>
      {children}
    </span>
  );
}
