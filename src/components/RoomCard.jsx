import { MapPin, Phone, User } from 'lucide-react'

const RoomCard = ({ room }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="h-56 bg-gray-200 relative overflow-hidden">
                <img
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=60'}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-md text-xs font-bold uppercase shadow-sm">
                    {room.property_type}
                </div>
            </div>
            <div className="p-5">
                <h3 className="font-bold text-lg mb-2 truncate text-gray-900 leading-tight">{room.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin size={16} className="mr-1.5 text-blue-500" /> {room.location}
                </div>

                <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                    <div>
                        <div className="text-gray-400 text-xs uppercase font-semibold mb-1">Monthly Rent</div>
                        <div className="font-bold text-blue-600 text-xl">₹{room.rent.toLocaleString()}</div>
                    </div>

                    <div className="text-right space-y-2">
                        <div className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                            <User size={12} className="mr-1" /> {room.tenant_preference}
                        </div>
                        <div>
                            <a href={`tel:${room.contact_number}`} className="flex items-center justify-end text-sm font-medium text-gray-700 hover:text-blue-600 transition">
                                <Phone size={14} className="mr-1" /> Contact Owner
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RoomCard
