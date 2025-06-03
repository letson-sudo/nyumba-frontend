const Loading = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-4xl space-y-6">
                {/* Skeleton for title */}
                <div className="h-8 bg-gray-300 rounded w-2/3 animate-pulse"></div>

                {/* Skeleton for form fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                </div>

                {/* Skeleton for textarea */}
                <div className="h-32 bg-gray-300 rounded animate-pulse"></div>

                {/* Skeleton for submit button */}
                <div className="h-12 bg-gray-300 rounded w-1/3 animate-pulse"></div>
            </div>
        </div>
    )
}

export default Loading
