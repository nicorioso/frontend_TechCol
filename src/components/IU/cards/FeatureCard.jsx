import PropTypes from 'prop-types';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      
      {/* Icono */}
      <div className="w-16 h-16 bg-cyan-200 rounded-full flex items-center justify-center">
        {Icon ? (
          <Icon className="w-8 h-8 text-cyan-600" />
        ) : (
          <div className="w-8 h-8 bg-cyan-400 rounded"></div>
        )}
      </div>

      {/* Titulo */}
      <h3 className="text-xl font-bold text-gray-900">
        {title}
      </h3>

      {/* Descripción */}
      <p className="text-gray-600">
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