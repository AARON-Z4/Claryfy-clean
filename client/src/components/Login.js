import React, { useState } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../firebase'; // CORRECTED IMPORT

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    const handleAuthAction = async () => {
        setError('');
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {isRegistering ? 'Create an Account' : 'Welcome Back'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        To access the Fake News Detector
                    </p>
                </div>
                
                {error && <p className="text-sm text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}
                
                <div className="space-y-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 text-gray-900 bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Email Address"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 text-gray-900 bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Password"
                    />
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleAuthAction}
                        className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                    
                    <div className="relative flex items-center justify-center">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="mx-4 text-xs font-medium text-gray-500 dark:text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                    >
                         <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,35.841,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Sign in with Google</span>
                    </button>
                </div>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={() => setIsRegistering(!isRegistering)} className="ml-1 font-medium text-blue-600 hover:underline">
                        {isRegistering ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
