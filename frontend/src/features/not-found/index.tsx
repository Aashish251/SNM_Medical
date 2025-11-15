import { Button } from '@shared/components/ui/button';
import React from 'react';
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-32"> {/* <-- Updated spacing */}
            <div className="text-center max-w-xl space-y-4">
                <h2 className="text-6xl font-bold text-primary">404</h2>
                <h3 className="text-2xl md:text-3xl font-semibold">Page Not Found</h3>
                <p className="text-gray-600">
                    Oops! The page you are looking for doesn't exist or has been moved.
                </p>
                <Link to="/">
                    <Button
                        variant="default"
                        className="bg-to-two-right-theme-gradient text-white px-6 py-3 rounded-md"
                    >
                        Go Back Home
                    </Button>
                </Link>
            </div>
        </main>
    );
};

export default NotFound;
