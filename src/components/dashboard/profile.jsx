import UserSidebar from "../IU/section/userSidebar";
import Sidebar from "./sidebar";



export default function Profile() {
    return (
        <>
        <div className="flex">
            <Sidebar
            content={
                <div className="flex-1 p-10">
                    <h1>Configuracion de usuario</h1>
                    
                </div>
            }
            />
            
        </div>
        </>
    );
}
