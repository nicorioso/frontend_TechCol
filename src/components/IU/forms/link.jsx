import { Link } from "react-router-dom";

export const LinkTo = ({ placeholder, pathname }) => {
    return (
        <>
            <Link 
                to={pathname}
                className="cursor-pointer text-cyan-600 font-semibold dark:text-cyan-400 hover:underline"
            >
                {placeholder}
            </Link>
        </>
    );
};

export const LabelLinkTo = ({label, linkPlaceholder, pathname}) =>{
    return (
        <>
            <div className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-400 dark:text-gray-400">{label}</label>
                <div className="text-sm">
                    <LinkTo placeholder={linkPlaceholder} pathname={pathname}/>
                </div>
            </div>
        </>
    )
}