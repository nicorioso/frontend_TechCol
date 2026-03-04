import ImageComponent from "../image.jsx";

const CardForm = ({ content, title, subtitle }) => {
    return (
    <>
        <div className="flex flex-1 items-center justify-center bg-white dark:bg-gray-900 px-4 py-5">
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="mx-auto w-auto">
                        <ImageComponent
                            id="TechCol_logo" alttext="TechCol_logo" style="mx-auto h-20 my-5"
                        />
                    </div>
                </div>
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-200">
                    {title}
                </h2> 
                {subtitle && (
                    <p className="mt-1 text-center text-lg text-slate-500 dark:text-slate-300">
                        {subtitle}
                    </p>
                )}
                <div className="mt-6">
                    {content}
                </div>
            </div>
        </div>
    </>
)}

export default CardForm;
