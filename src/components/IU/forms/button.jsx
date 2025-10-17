const Button = ({placeholder}) => {
    return (
    <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
    >
        {placeholder}
    </button>
    );
};

export default Button;