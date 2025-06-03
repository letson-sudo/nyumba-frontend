const Header = ({ title }) => {
    return (
        <header className="bg-black/70 shadow-lg">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h2 className="font-semibold text-2xl bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] bg-clip-text text-transparent drop-shadow">
                    {title}
                </h2>
            </div>
        </header>
    )
}

export default Header
