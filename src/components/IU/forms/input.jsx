import { LinkTo } from "./link"

export const Input = ({type, name, label, placeholder, value, onChange}) => {
    return (
    <>
        {/* Correo */}
        <label className="block text-sm/6 font-medium text-gray-400">{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            className="block w-full rounded-md bg-sky-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
    </>
)}

export const InputDouble = ({label_1, label_2, type_1, type_2, name_1, name_2, placeholder_1, placeholder_2, value_1, value_2, onChange_1, onChange_2}) => {
    return (
    <>
    <div className="grid grid-cols-2 gap-8">
        <label className="block w-full text-sm-6 font-medium text-gray-400">{label_1}</label>
        <label className="block w-full text-sm-6 font-medium text-gray-400">{label_2}</label>
    </div>
    <div className="grid grid-cols-2 gap-8">
        {/* Correo */}
        <input
            type={type_1}
            name={name_1}
            placeholder={placeholder_1}
            value={value_1}
            onChange={onChange_1}
            required
            className="block w-full rounded-md bg-sky-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
        <input
            type={type_2}
            name={name_2}
            placeholder={placeholder_2}
            value={value_2}
            onChange={onChange_2}
            required
            className="block w-full rounded-md bg-sky-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
        </div>
    </>
)}

export const InputLink = ({type, name, label, placeholder, linkPlaceholder, pathname, value, onChange}) => {
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
            value={value}
            onChange={onChange}
        />
    </>
)}