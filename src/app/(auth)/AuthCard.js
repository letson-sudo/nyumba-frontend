const AuthCard = ({ logo, children }) => (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 justify-center">


        <div className="w-full sm:max-w-md mt-6 px-6   overflow-hidden sm:rounded-lg">
            <div>{logo}</div>
            {children}
        </div>
    </div>
)

export default AuthCard
