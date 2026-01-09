import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Login = () => {
    const [email, setEmail] = useState('')
    const [activeOtp, setActiveOtp] = useState(false)
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const { signInWithOtp, verifyOtp } = useAuth()
    const navigate = useNavigate()

    const handleSendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await signInWithOtp(email)
        setLoading(false)
        if (error) {
            toast.error(error.message)
        } else {
            setActiveOtp(true)
            toast.success('OTP sent to your email!')
        }
    }

    const handleVerify = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { data, error } = await verifyOtp(email, token)
        setLoading(false)
        if (error) {
            toast.error(error.message)
        } else if (data.session) {
            toast.success('Logged in successfully!')
            navigate('/my-rooms')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Owner Login</h2>
                <p className="text-center text-gray-500 mb-8">Enter your email to manage your rooms</p>

                {!activeOtp ? (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
                        >
                            {loading ? 'Sending OTP...' : 'Send Magic Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP Code</label>
                            <input
                                type="text"
                                required
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="123456"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveOtp(false)}
                            className="w-full text-sm text-blue-600 hover:underline text-center"
                        >
                            ← Back to Email
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
export default Login
