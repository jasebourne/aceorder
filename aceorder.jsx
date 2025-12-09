import React, { useState, useMemo, useEffect } from 'react';
// FIX: Replaced 'Tool' with 'Wrench' as the component 'Tool' is not exported by Lucide-React.
import { Square, Briefcase, CreditCard, HardHat, RockingChair, PlusSquare, Cog, Droplet, GripVertical, Wrench, Gem, X, PiggyBank } from 'lucide-react';

// --- Placeholder Item Data ---
// The 'cost' value here is the gem cost per unit. Adjust these values as needed.
const ITEM_DATA = [
    // Row 1
    { id: 1, name: 'Wood Block', cost: 0.5, icon: Square, color: 'bg-yellow-700', defaultQ: 1 },
    { id: 2, name: 'Purple Box', cost: 10.0, icon: Briefcase, color: 'bg-purple-600', defaultQ: 5 },
    { id: 3, name: 'Blue Card', cost: 5.5, icon: CreditCard, color: 'bg-blue-500', defaultQ: 1 },
    { id: 4, name: 'Yellow Chip', cost: 20.0, icon: HardHat, color: 'bg-yellow-400', defaultQ: 1 },

    // Row 2
    { id: 5, name: 'Gray Stone', cost: 1.0, icon: RockingChair, color: 'bg-gray-500', defaultQ: 2 },
    { id: 6, name: 'Red Kit', cost: 15.0, icon: PlusSquare, color: 'bg-red-500', defaultQ: 6 },
    { id: 7, name: 'Gear', cost: 4.0, icon: Cog, color: 'bg-gray-600', defaultQ: 1 },
    { id: 8, name: 'Red Potion', cost: 8.0, icon: Droplet, color: 'bg-red-600', defaultQ: 1 },

    // Row 3 & 4
    { id: 9, name: 'Steel Bar', cost: 2.5, icon: GripVertical, color: 'bg-gray-400', defaultQ: 3 },
    // FIX: Updated icon reference to 'Wrench'
    { id: 10, name: 'Green Box', cost: 12.0, icon: Wrench, color: 'bg-green-600', defaultQ: 7 },
    { id: 11, name: 'Purple Crystal', cost: 50.0, icon: Gem, color: 'bg-purple-700', defaultQ: 4 },
    // Filler item for consistent 4x3 grid layout
    { id: 12, name: 'Placeholder', cost: 0, icon: X, color: 'bg-transparent', defaultQ: 0, hidden: true },
];

/**
 * ItemInput Component
 * Represents a single item block with its icon and quantity input.
 */
const ItemInput = ({ item, quantity, onQuantityChange }) => {
    const Icon = item.icon;
    
    // Calculate the total cost for this single item
    // const itemTotal = (quantity * item.cost).toFixed(2); // Not currently displayed

    if (item.hidden) {
        return <div className="p-2 aspect-square"></div>; // Empty space for layout
    }

    return (
        <div className="flex items-center space-x-2 p-2 bg-gray-700 rounded-xl shadow-lg border border-gray-600 transition hover:bg-gray-600/50">
            {/* Icon Block */}
            <div className={`p-1 w-10 h-10 md:w-12 md:h-12 flex-shrink-0 ${item.color} border-2 border-cyan-400 rounded-xl flex items-center justify-center shadow-lg`}>
                <Icon className="text-white w-full h-full" strokeWidth={1.5} />
            </div>

            {/* Item Name and Input */}
            <div className="flex-grow flex flex-col justify-center">
                <span className="text-white text-sm font-semibold truncate">{item.name}</span>
                <div className="flex items-center space-x-2 mt-1">
                    {/* Quantity Input */}
                    <input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            // Ensure non-negative input
                            onQuantityChange(item.id, isNaN(value) || value < 0 ? 0 : value);
                        }}
                        className="w-full bg-gray-900 text-white text-center text-lg font-mono p-1 rounded-md border-2 border-gray-600 focus:border-cyan-500 transition duration-150 shadow-inner"
                    />
                </div>
            </div>
        </div>
    );
};


// --- FIREBASE BOILERPLATE (Mandatory but unused for local calculation) ---
// This boilerplate is included to satisfy the Canvas runtime requirement for Firebase initialization,
// even though the application logic itself is purely client-side calculation.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Included for completeness

const useFirebaseSetup = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        if (!Object.keys(firebaseConfig).length || firebaseConfig.projectId === 'your-project-id') {
            console.error("Firebase config not available. Running in local mode.");
            setIsAuthReady(true);
            setUserId(crypto.randomUUID());
            return;
        }

        let app;
        try {
            app = initializeApp(firebaseConfig);
        } catch(e) {
            // Handle multiple initialization errors gracefully if hot reloading occurs
            console.warn("Firebase initialization failed, possibly already initialized:", e);
            return;
        }

        const firestore = getFirestore(app);
        const authInstance = getAuth(app);
        
        setDb(firestore);
        setAuth(authInstance);

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                // Sign in anonymously if no user is found after the initial check
                if (typeof __initial_auth_token === 'undefined' || !__initial_auth_token) {
                    signInAnonymously(authInstance).catch(e => console.error("Anonymous Sign-in failed:", e));
                }
                setUserId('Anonymous-' + crypto.randomUUID().substring(0, 8));
            }
            setIsAuthReady(true);
        });

        const initializeAuth = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(authInstance, __initial_auth_token);
                } else {
                    await signInAnonymously(authInstance);
                }
            } catch (error) {
                console.error("Firebase Auth Error during custom/anonymous sign-in:", error);
            }
        };
        initializeAuth();
        return () => unsubscribe();
    }, []);

    return { userId, isAuthReady, db, auth };
};
// --- END FIREBASE BOILERPLATE ---


/**
 * Main App Component
 */
export default function App() {
    // Initialize Firebase boilerplate to get a user ID for reference
    const { userId } = useFirebaseSetup(); 

    // Initialize quantities state based on ITEM_DATA defaults
    const [quantities, setQuantities] = useState(() => {
        return ITEM_DATA.reduce((acc, item) => {
            // Only set non-hidden items
            if (!item.hidden) {
                 acc[item.id] = item.defaultQ;
            }
            return acc;
        }, {});
    });

    // Function to handle quantity changes for a specific item
    const handleQuantityChange = (id, newQuantity) => {
        setQuantities(prev => ({
            ...prev,
            [id]: newQuantity
        }));
    };

    // Memoize the total gem cost calculation
    const totalGemCost = useMemo(() => {
        let total = 0;
        ITEM_DATA.forEach(item => {
            const quantity = quantities[item.id] || 0;
            total += quantity * item.cost;
        });
        // Use toFixed(1) for precision in cost calculation
        return total.toFixed(1); 
    }, [quantities]);

    // Function to reset all quantities to zero
    const handleClear = () => {
        setQuantities(
            ITEM_DATA.reduce((acc, item) => {
                if (!item.hidden) {
                    acc[item.id] = 0;
                }
                return acc;
            }, {})
        );
    };

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col items-center p-4 sm:p-8 font-sans">
            <header className="text-white mb-6 text-4xl font-extrabold border-b-4 border-cyan-400 pb-2 tracking-wide text-center">
                Material Cost Tracker
            </header>
            
            <p className="text-xs text-gray-400 mb-4 font-mono">
                Session ID: {userId || 'Loading...'}
            </p>

            <main className="w-full max-w-4xl bg-gray-900 p-4 sm:p-6 rounded-3xl shadow-2xl border-2 border-gray-700">
                
                {/* The Input Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ITEM_DATA.map(item => (
                        <ItemInput
                            key={item.id}
                            item={item}
                            quantity={quantities[item.id] || 0}
                            onQuantityChange={handleQuantityChange}
                        />
                    ))}
                </div>

                {/* Footer / Results Area */}
                <div className="mt-8 pt-4 border-t-2 border-cyan-400/50 flex justify-between items-center flex-wrap gap-4">
                    
                    {/* Total Cost Display */}
                    <div className="flex items-center text-white text-xl md:text-3xl font-bold bg-gray-700/70 p-4 rounded-xl shadow-inner border border-cyan-500">
                        <span className="mr-4 text-gray-300">Total Cost:</span>
                        <span className="font-mono text-cyan-400 text-3xl md:text-4xl mr-2 drop-shadow-lg">{totalGemCost}</span>
                        <Gem className="w-6 h-6 md:w-8 md:h-8 text-green-400 fill-green-400" />
                    </div>

                    {/* Clear Button (XÓA) */}
                    <button
                        onClick={handleClear}
                        className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-6 rounded-xl shadow-xl transition transform hover:scale-105 active:scale-95 text-lg sm:text-xl tracking-widest uppercase border-b-4 border-red-900 hover:border-red-600 flex items-center space-x-2"
                        title="Reset all quantities"
                    >
                        <X className="w-6 h-6" />
                        <span>CLEAR</span>
                    </button>
                </div>
            </main>

            <footer className="mt-8 text-sm text-gray-500">
                *This is a local calculation app. Item costs can be adjusted in the ITEM_DATA array.
            </footer>
        </div>
    );
}