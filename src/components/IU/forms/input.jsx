import { LinkTo } from "./link"

export const Input = ({
    type,
    name,
    label,
    placeholder,
    value,
    onChange,
    disabled = false,
    required = true,
    className = ""
}) => {
    return (
    <>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`block w-full rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none ${className}`}
        />
    </>
)}

export const InputDouble = ({label_1, label_2, type_1, type_2, name_1, name_2, placeholder_1, placeholder_2, value_1, value_2, onChange_1, onChange_2}) => {
    return (
    <>
    <div className="grid grid-cols-2 gap-8">
        <label className="block w-full text-sm font-medium text-gray-700 dark:text-gray-200">{label_1}</label>
        <label className="block w-full text-sm font-medium text-gray-700 dark:text-gray-200">{label_2}</label>
    </div>
    <div className="grid grid-cols-2 gap-8">
        <input
            type={type_1}
            name={name_1}
            placeholder={placeholder_1}
            value={value_1}
            onChange={onChange_1}
            required
            className="block w-full rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
        <input
            type={type_2}
            name={name_2}
            placeholder={placeholder_2}
            value={value_2}
            onChange={onChange_2}
            required
            className="block w-full rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
        </div>
    </>
)}

export const InputLink = ({type, name, label, placeholder, linkPlaceholder, pathname, value, onChange}) => {
    return (
    <>
        {/* Correo */}
        <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
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
