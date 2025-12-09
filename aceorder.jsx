import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';

// --- Item Data ---
const ITEM_DATA = [
    // Row 1
    { id: 1, name: 'Wood', cost: 6.7, image: '/aceorder/images/Wood.png', color: 'bg-blue-500' },
    { id: 2, name: 'Iron', cost: 20, image: '/aceorder/images/Iron.png', color: 'bg-blue-500' },
    { id: 3, name: 'Steel', cost: 6.7, image: '/aceorder/images/Steel.png', color: 'bg-blue-500' },
    { id: 4, name: 'Crystone', cost: 26.7, image: '/aceorder/images/Crystone.png', color: 'bg-purple-600' },

    // Row 2
    { id: 5, name: 'Weapon Supply Crate', cost: 13.3, image: '/aceorder/images/WeaponSupplyCrate.png', color: 'bg-blue-500' },
    { id: 6, name: 'Medical Supply Crate', cost: 6.7, image: '/aceorder/images/MedicalSupplyCrate.png', color: 'bg-blue-500' },
    { id: 7, name: 'Food Supply Crate', cost: 20, image: '/aceorder/images/FoodSupplyCrate.png', color: 'bg-blue-500' },
  
    // Row 3
    { id: 8, name: 'Identity Card', cost: 26.7, image: '/aceorder/images/IdentityCard.png', color: 'bg-blue-500' },
    { id: 9, name: 'Precision Gear', cost: 13.3, image: '/aceorder/images/PrecisionGear.png', color: 'bg-purple-600' },

    // Row 4
    { id: 10, name: 'Integrated Chip', cost: 80, image: '/aceorder/images/IntegratedChip.png', color: 'bg-yellow-400' },
    { id: 11, name: 'Energy Drive Core', cost: 160, image: '/aceorder/images/EnergyDriveCore.png', color: 'bg-yellow-400' },
];

/**
 * ItemInput Component
 * Represents a single item block with its image and quantity input.
 */
const ItemInput = ({ item, quantity, onQuantityChange }) => {
    // Calculate the total cost for this single item
    // const itemTotal = (quantity * item.cost).toFixed(2); // Not currently displayed

    // No need for item.hidden check since the filler item was removed

    return (
        <div className="flex items-center space-x-2 p-2 bg-gray-700 rounded-xl shadow-lg border border-gray-600 transition hover:bg-gray-600/50">
            {/* Image Block */}
            <div className={`p-1 w-10 h-10 md:w-12 md:h-12 flex-shrink-0 ${item.color} border-2 border-cyan-400 rounded-xl flex items-center justify-center shadow-lg overflow-hidden`}>
                <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-contain"
                />
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

/**
 * Main App Component
 */
export default function App() {
    // Initialize quantities state - all items start at 0
    const [quantities, setQuantities] = useState(() => {
        return ITEM_DATA.reduce((acc, item) => {
            acc[item.id] = 0;
            return acc;
        }, {});
    });

    // Handle quantity changes
    const handleQuantityChange = (id, newQuantity) => {
        setQuantities(prev => ({
            ...prev,
            [id]: newQuantity
        }));
    };

    // Calculate total cost
    const totalGemCost = useMemo(() => {
        let total = 0;
        ITEM_DATA.forEach(item => {
            const quantity = quantities[item.id] || 0;
            total += quantity * item.cost;
        });
        return total.toFixed(1); 
    }, [quantities]);

    // Reset all quantities
    const handleClear = () => {
        setQuantities(
            ITEM_DATA.reduce((acc, item) => {
                acc[item.id] = 0;
                return acc;
            }, {})
        );
    };

    // --- ITEM GROUPING FOR THE CUSTOM LAYOUT ---
    const row1Items = ITEM_DATA.slice(0, 4); // 4 items (IDs 1-4)
    const row2Items = ITEM_DATA.slice(4, 7); // 3 items (IDs 5-7)
    const row3Items = ITEM_DATA.slice(7, 9); // 2 items (IDs 8-9)
    const row4Items = ITEM_DATA.slice(9, 11); // 2 items (IDs 10-11)

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col items-center p-4 sm:p-8 font-sans">
            <header className="text-white mb-6 text-4xl font-extrabold border-b-4 border-cyan-400 pb-2 tracking-wide text-center">
                Ace Order Cost Calculator
            </header>
                    
            <main className="w-full max-w-4xl bg-gray-900 p-4 sm:p-6 rounded-3xl shadow-2xl border-2 border-gray-700">
                
                {/* The Custom Layout Grid */}
                <div className="flex flex-col space-y-4">
                    
                    {/* Row 1: 4 Items */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {row1Items.map(item => (
                            <ItemInput key={item.id} item={item} quantity={quantities[item.id] || 0} onQuantityChange={handleQuantityChange} />
                        ))}
                    </div>

                    {/* Row 2: 3 Items */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {row2Items.map(item => (
                            <ItemInput key={item.id} item={item} quantity={quantities[item.id] || 0} onQuantityChange={handleQuantityChange} />
                        ))}
                    </div>

                    {/* Row 3: 2 Items */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {row3Items.map(item => (
                            <ItemInput key={item.id} item={item} quantity={quantities[item.id] || 0} onQuantityChange={handleQuantityChange} />
                        ))}
                    </div>

                    {/* Row 4: 2 Items */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {row4Items.map(item => (
                            <ItemInput key={item.id} item={item} quantity={quantities[item.id] || 0} onQuantityChange={handleQuantityChange} />
                        ))}
                    </div>

                </div>

                {/* Footer / Results Area */}
                <div className="mt-8 pt-4 border-t-2 border-cyan-400/50 flex justify-between items-center flex-wrap gap-4">
                    
                    {/* Total Cost Display */}
                    <div className="flex items-center text-white text-xl md:text-3xl font-bold bg-gray-700/70 p-4 rounded-xl shadow-inner border border-cyan-500">
                        <span className="mr-4 text-gray-300">Total Cost:</span>
                        <span className="font-mono text-cyan-400 text-3xl md:text-4xl mr-2 drop-shadow-lg">{totalGemCost}</span>
                        <img 
                            src="/aceorder/images/Gem.png" 
                            alt="Gem"
                            className="w-6 h-6 md:w-8 md:h-8"
                        />
                    </div>

                    {/* Clear Button (CLEAR) */}
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
                This is a local calculation app created by Jase Bourne for VLC clan.
            </footer>
        </div>
    );
}