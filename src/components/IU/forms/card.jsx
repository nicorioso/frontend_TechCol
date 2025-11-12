import {  } from "module";
import ImageComponent from "../image.jsx";

const CardForm = ({content, title }) => {
    return (
    <>
        {/* Correo */}
        <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
            <div className="w-full max-w-lg bg-white rounded-md shadow-lg p-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="mx-auto mb-10 h-10 w-auto">
                        <ImageComponent
                            id="TechCol_logo" alttext="TechCol_logo"
                        />

                    </div>
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