const Link = ({placeholder, question}) => {
    return (
        <>
            {question}
            <span
                className="cursor-pointer text-blue-400 font-semibold"
            >
                {placeholder}
            </span>
        </>
    )
}

export default Link;