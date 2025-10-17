const CardForm = ({content, image, title }) => {
    return (
    <>
        {/* Correo */}
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-lg bg-gray-800 rounded-md shadow-lg p-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img className="mx-auto mb-10 h-10 w-auto" alt="Your Company" src={{image}} />
                </div>
                <h2 className="text-center text-2xl font-bold text-gray-200">
                    {title}
                </h2> 
                <div className="mt-6">
                    {content}
                </div>
            </div>
        </div>
    </>
)}

export default CardForm;