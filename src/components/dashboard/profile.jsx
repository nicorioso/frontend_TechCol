import UserSidebar from "../IU/section/userSidebar";
import Sidebar from "./sidebar";



export default function Profile() {
    return (
        <>
        <div className="flex">
            <Sidebar
            content={
                <div className="flex-1 p-10">
                    <h1>User Settings</h1>
                    
                </div>
            }
            />
            
        </div>
        </>
    );
}
