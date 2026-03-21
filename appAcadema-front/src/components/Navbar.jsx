

export default function Navbar() {

    const { user, logout } = useAuth();

    const userRole = getRoleName(user);


    const NAV_LINKS = [
        { name: 'Padre', path: '/padre', allowedRoles: ['PADRE'] },
        { name: 'Profesor', path: '/profesor', allowedRoles: ['PROFESOR'] },
        { name: 'Admin', path: '/admin', allowedRoles: ['ADMINISTRACION'] }
        
    ];

    return(
        <header className="bg-white border-b-2 border-color2 sticky top-0 z-50 shadow-sm">
            <div>
                <div>
                    
                </div>
            </div>
        </header>




    );
}
