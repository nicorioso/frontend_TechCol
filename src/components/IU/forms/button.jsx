import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'font-semibold transition-all duration-300 cursor-pointer border-2 rounded';
  
  const variants = {
    primary: 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500 hover:border-cyan-600 dark:bg-cyan-500 dark:border-cyan-500',
    secondary: 'bg-transparent text-cyan-700 border-cyan-700 hover:bg-cyan-700 hover:text-white dark:text-cyan-200 dark:border-cyan-200 dark:hover:bg-cyan-600 dark:hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default Button;
