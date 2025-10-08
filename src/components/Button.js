// const Button = ({ type = 'submit', className, ...props }) => (
//     <button
//         type={type}
//         className={`${className} inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150`}
//         {...props}
//     />
// )

// export default Button


const Button = ({ type = 'submit', className, ...props }) => (
    <button
        type={type}
        className={`${className}
            inline-flex items-center px-4 py-2
            bg-gradient-to-r from-cyan-600 to-blue-500 text-white
            border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest
            hover:from-cyan-700 hover:to-blue-600
            active:from-cyan-800 active:to-blue-700
            focus:outline-none focus:ring ring-gray-300
            disabled:opacity-25 transition ease-in-out duration-150`}
        {...props}
    />
)

export default Button
