import PropTypes from 'prop-types';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center space-y-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/40">
        {Icon ? (
          <Icon className="h-6 w-6 text-slate-800 dark:text-cyan-200" />
        ) : (
          <div className="h-6 w-6 rounded bg-cyan-400"></div>
        )}
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100">
        {title}
      </h3>

      <p className="max-w-[220px] text-sm text-slate-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
};

FeatureCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default FeatureCard;
