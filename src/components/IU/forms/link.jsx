import { Link } from "react-router-dom";

export const LinkTo = ({ placeholder, pathname }) => {
    return (
        <>
            <Link 
                to={pathname}
                className="cursor-pointer text-blue-400 font-semibold"
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
                <label className="block text-sm/6 font-medium text-gray-400">{label}</label>
                <div className="text-sm">
                    <LinkTo placeholder={linkPlaceholder} pathname={pathname}/>
                </div>
            </div>
        </>
    )
}