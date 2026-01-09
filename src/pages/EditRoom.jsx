import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getRoomById, updateRoom, uploadImage } from '../services/roomService'
import toast from 'react-hot-toast'
import { X, Upload } from 'lucide-react'

const EditRoom = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        rent: '',
        property_type: '1 BHK',
        tenant_preference: 'Any',
        contact_number: ''
    })

    useEffect(() => {
        if (user && id) fetchRoom()
    }, [user, id])

    const fetchRoom = async () => {
        const { data, error } = await getRoomById(id)
        if (error) {
            toast.error('Could not fetch room details')
            navigate('/my-rooms')
        } else {
            if (data.owner_id !== user.id) {
                toast.error('Unauthorized')
                navigate('/my-rooms')
                return
            }
            setFormData({
                title: data.title,
                location: data.location,
                rent: data.rent,
                property_type: data.property_type,
                tenant_preference: data.tenant_preference,
                contact_number: data.contact_number
            })
            setImages(data.images || [])
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        setUploading(true)
        const newImages = []

        for (const file of files) {
            const { data, error } = await uploadImage(file)
            if (error) {
                toast.error(`Failed to upload ${file.name}`)
            } else {
                newImages.push(data)
            }
        }

        setImages([...images, ...newImages])
        setUploading(false)
    }

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)

        const roomData = {
            ...formData,
            rent: Number(formData.rent),
            images
        }

        const { error } = await updateRoom(id, roomData)
        setLoading(false)

        if (error) {
            toast.error('Failed to update room: ' + error.message)
        } else {
            toast.success('Room updated successfully!')
            navigate('/my-rooms')
        }
    }

    if (loading) return <div className="p-10 text-center">Loading room details...</div>

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Room</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Room Title / Description</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                {/* Location & Rent */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rent (Monthly)</label>
                        <input
                            type="number"
                            name="rent"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={formData.rent}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Type & Preference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Property Type</label>
                        <select
                            name="property_type"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={formData.property_type}
                            onChange={handleChange}
                        >
                            <option>1 BHK</option>
                            <option>2 BHK</option>
                            <option>3 BHK</option>
                            <option>1 Room Set</option>
                            <option>PG</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tenant Preference</label>
                        <select
                            name="tenant_preference"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={formData.tenant_preference}
                            onChange={handleChange}
                        >
                            <option>Any</option>
                            <option>Bachelors</option>
                            <option>Family</option>
                            <option>Girls</option>
                            <option>Working Professionals</option>
                        </select>
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                    <input
                        type="text"
                        name="contact_number"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={formData.contact_number}
                        onChange={handleChange}
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Images</label>
                    <div className="flex flex-wrap gap-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative w-24 h-24 rounded-md overflow-hidden shadow-sm">
                                <img src={img} alt="Room" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-md hover:bg-red-600"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                            <Upload size={20} className="text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1">{uploading ? '...' : 'Upload'}</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full btn btn-primary py-3 text-lg"
                >
                    {loading ? 'Updating...' : 'Update Listing'}
                </button>
            </form>
        </div>
    )
}

export default EditRoom
