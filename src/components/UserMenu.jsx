const UserMenu = ({ userName, userEmail, collapsed }) => {
    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };
    const initials = getInitials(userName);

    return (
        <div className="flex items-center" style={{
            flexDirection: collapsed ? 'column' : 'row',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? '5px' : '10px',
            padding: collapsed ? '10px 0' : '10px 15px',
            width: '100%',
            position: 'relative',
        }}>
            <div className="flex-shrink-0 w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-md font-semibold text-white">
                {initials}


            {!collapsed && (
                <div className="ml-2 flex-grow overflow-hidden">
                    <div className="text-sm font-semibold text-white truncate">{userName}</div>
                    <div className="text-xs text-gray-400 truncate">{userEmail}</div>
                </div>
            )}
            </div>
        </div>
    );
};

export default UserMenu;