import { LinkTo } from "./link.jsx";

export const Input = ({type, name, label, placeholder}) => {
    return (
    <>
        {/* Correo */}
        <label className="block text-sm/6 font-medium text-gray-400">{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            required
            className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
        />
    </>
)}

export const InputLink = ({type, name, label, placeholder, linkPlaceholder, pathname}) => {
    return (
    <>
        {/* Correo */}
        <div className="flex items-center justify-between">
            <label className="block text-sm/6 font-medium text-gray-400">{label}</label>
            <div className="text-sm">
                <LinkTo placeholder={linkPlaceholder} pathname={pathname}/>
            </div>
        </div>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            required
            className="block w-full rounded-md border border-gray-600 bg-gray-700 text-gray-200 px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
        />
    </>
)}