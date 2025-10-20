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
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
        <Input
            type={type}
            name={name}
            placeholder={placeholder}
        />
    </>
)}