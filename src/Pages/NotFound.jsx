import React from 'react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <h1 className="text-4xl sm:text-6xl font-bold text-blue-600 mb-4">404</h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
                <a
                    href="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-semibold"
                >
                    Go Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;