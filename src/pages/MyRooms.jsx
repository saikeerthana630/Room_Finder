import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getOwnerRooms, deleteRoom } from '../services/roomService'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Plus, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

const MyRooms = () => {
    const { user } = useAuth()
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) fetchRooms()
    }, [user])

    const fetchRooms = async () => {
        setLoading(true)
        const { data, error } = await getOwnerRooms(user.id)
        if (error) toast.error('Error fetching rooms')
        else setRooms(data || [])
        setLoading(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return

        const { error } = await deleteRoom(id)
        if (error) {
            toast.error('Failed to delete')
        } else {
            toast.success('Room deleted')
            setRooms(rooms.filter(r => r.id !== id))
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
                <Link to="/add-room" className="btn btn-primary flex items-center gap-2">
                    <Plus size={20} /> Add Room
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : rooms.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow">
                    <p className="text-gray-500 mb-4">You haven't listed any rooms yet.</p>
                    <Link to="/add-room" className="text-blue-600 hover:underline">Create your first listing</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map(room => (
                        <div key={room.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                            <div className="h-48 bg-gray-200 relative">
                                {room.images?.[0] ? (
                                    <img src={room.images[0]} alt={room.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                                    {room.property_type}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate">{room.title}</h3>
                                <div className="flex items-center text-gray-600 text-sm mb-2">
                                    <MapPin size={14} className="mr-1" /> {room.location}
                                </div>
                                <div className="font-bold text-blue-600 text-xl mb-4">₹{room.rent}</div>

                                <div className="flex gap-2">
                                    <Link to={`/edit-room/${room.id}`} className="flex-1 btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex justify-center items-center gap-2">
                                        <Edit size={16} /> Edit
                                    </Link>
                                    <button onClick={() => handleDelete(room.id)} className="flex-1 btn bg-red-50 text-red-600 hover:bg-red-100 flex justify-center items-center gap-2">
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyRooms
