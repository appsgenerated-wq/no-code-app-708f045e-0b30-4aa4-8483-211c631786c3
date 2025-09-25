import React, { useEffect, useState, useRef } from 'react';

const DashboardPage = ({ user, grapeVarieties, onLogout, onLoadGrapes, onCreateGrape }) => {
  const [newGrape, setNewGrape] = useState({ name: '', description: '', origin: '', color: 'Red' });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    onLoadGrapes();
  }, [onLoadGrapes]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCreateGrape = async (e) => {
    e.preventDefault();
    await onCreateGrape(newGrape, file);
    setNewGrape({ name: '', description: '', origin: '', color: 'Red' });
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grapevine</h1>
            <p className="text-sm text-gray-500">Welcome, {user.name} ({user.role})</p>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Create New Grape Form */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add a New Grape Variety</h2>
            <form onSubmit={handleCreateGrape} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Variety Name (e.g., Cabernet Sauvignon)"
                  value={newGrape.name}
                  onChange={(e) => setNewGrape({ ...newGrape, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Origin (e.g., Bordeaux, France)"
                  value={newGrape.origin}
                  onChange={(e) => setNewGrape({ ...newGrape, origin: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <textarea
                placeholder="Description and tasting notes..."
                value={newGrape.description}
                onChange={(e) => setNewGrape({ ...newGrape, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <select 
                    value={newGrape.color} 
                    onChange={(e) => setNewGrape({...newGrape, color: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                 >
                    <option>Red</option>
                    <option>White</option>
                    <option>Rosé</option>
                 </select>
                 <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
              </div>
              <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                Add Variety
              </button>
            </form>
          </div>

          {/* Grapes List */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Variety Collection</h2>
            {grapeVarieties.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No grape varieties yet. Add one above to get started!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grapeVarieties.map(grape => (
                  <div key={grape.id} className="bg-white rounded-lg shadow overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                    {grape.photo ? (
                        <img src={grape.photo.thumbnail.url} alt={grape.name} className="w-full h-48 object-cover" />
                    ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900">{grape.name}</h3>
                      <p className="text-sm text-indigo-600 font-medium">{grape.origin}</p>
                      <p className="text-sm text-gray-600 mt-2 truncate">{grape.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${grape.color === 'Red' ? 'bg-red-100 text-red-800' : grape.color === 'White' ? 'bg-yellow-100 text-yellow-800' : 'bg-pink-100 text-pink-800'}`}>
                          {grape.color}
                        </span>
                        <span className="text-xs text-gray-400">Added by {grape.owner?.name || '...'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
