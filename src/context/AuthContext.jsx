import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signInWithOtp = async (email) => {
        return await supabase.auth.signInWithOtp({ email })
    }

    const verifyOtp = async (email, token) => {
        return await supabase.auth.verifyOtp({ email, token, type: 'email' })
    }

    const signOut = async () => {
        return await supabase.auth.signOut()
    }

    const value = {
        user,
        signInWithOtp,
        verifyOtp,
        signOut,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div className="flex items-center justify-center h-screen">Loading...</div>}
        </AuthContext.Provider>
    )
}
