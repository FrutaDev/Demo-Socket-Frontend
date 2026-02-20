import { Outlet, NavLink } from "react-router-dom"

export default function RootLayout() {
    return (
        <>
            <header className="">
                <nav className="bg-gray-800/15 p-4 shadow-md">
                    <ul className="flex justify-center gap-4">
                        <li>
                            <NavLink to="/" className={({ isActive }) => isActive ? activeStyles : defaultStyles}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/products" className={({ isActive }) => isActive ? activeStyles : defaultStyles}>Products</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="flex-1 h-full">
                <Outlet />
            </main>
        </>
    )
}

const defaultStyles = "hover:bg-gray-800/15 p-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out"
const activeStyles = "bg-gray-800/15 p-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out"