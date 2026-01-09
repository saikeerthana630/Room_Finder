import { useState, useEffect } from 'react'
import { getRooms } from '../services/roomService'
import RoomCard from '../components/RoomCard'
import { Search, SlidersHorizontal, House } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    const [filters, setFilters] = useState({
        location: '',
        minPrice: '',
        maxPrice: '',
        type: '',
        tenant: ''
    })

    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        fetchRooms()
    }, []) // Initial load

    const fetchRooms = async () => {
        setLoading(true)
        const { data, error } = await getRooms(filters)
        if (error) console.error(error)
        else setRooms(data || [])
        setLoading(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        fetchRooms()
    }

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header / Navbar */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="icon bg-blue-600 text-white p-2 rounded-lg">
                            <House size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">RoomFinder</h1>
                    </div>
                    <div>
                        {user ? (
                            <Link to="/my-rooms" className="text-gray-600 hover:text-blue-600 font-medium">My Dashboard</Link>
                        ) : (
                            <Link to="/login" className="btn btn-primary text-sm px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/30">Owner Login</Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Search Section */}
            <div className="bg-blue-600 py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Find Your Perfect Room</h2>
                    <form onSubmit={handleSearch} className="bg-white p-2 rounded-full shadow-2xl flex items-center max-w-2xl mx-auto">
                        <Search className="text-gray-400 ml-4" />
                        <input
                            type="text"
                            name="location"
                            placeholder="Search by location (e.g. Bangalore, Mumbai)..."
                            className="flex-grow p-3 outline-none text-gray-700 rounded-full"
                            value={filters.location}
                            onChange={handleChange}
                        />
                        <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
                            Search
                        </button>
                    </form>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="mt-6 text-blue-100 flex items-center justify-center gap-2 mx-auto hover:text-white transition"
                    >
                        <SlidersHorizontal size={18} /> {showFilters ? 'Hide Filters' : 'Advanced Filters'}
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white border-b py-6">
                    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Min Price</label>
                            <input type="number" name="minPrice" placeholder="0" className="w-full border p-2 rounded" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Max Price</label>
                            <input type="number" name="maxPrice" placeholder="Any" className="w-full border p-2 rounded" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Property Type</label>
                            <select name="type" className="w-full border p-2 rounded" onChange={handleChange}>
                                <option value="">Any</option>
                                <option>1 BHK</option>
                                <option>2 BHK</option>
                                <option>3 BHK</option>
                                <option>1 Room Set</option>
                                <option>PG</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Tenant Preference</label>
                            <select name="tenant" className="w-full border p-2 rounded" onChange={handleChange}>
                                <option value="">Any</option>
                                <option>Bachelors</option>
                                <option>Family</option>
                                <option>Girls</option>
                                <option>Working Professionals</option>
                            </select>
                        </div>
                        <div className="md:col-span-4 flex justify-end">
                            <button onClick={fetchRooms} className="text-blue-600 font-bold text-sm hover:underline">Apply Filters</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        Loading amazing rooms...
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Rooms Found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search for a different location.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map(room => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
