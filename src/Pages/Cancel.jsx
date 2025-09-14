import React from 'react';

const Cancel = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
                <p className="mt-2 text-gray-700">Your payment was not completed.</p>
                <p className="mt-2 text-gray-500">You can try again or return to your bookings.</p>
            </div>
        </div>
    );
};

export default Cancel;