import { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { createContext, FC, ReactNode, useEffect, useState } from 'react'
import { dbClient as supabase } from 'src/config/supabase'

export interface IAuthContext {
    currentUser: User | null,
    isLoadingAuth: boolean
}

const AuthContext = createContext<IAuthContext | null>(null)

const AuthContextProvider: FC<{
    children: ReactNode
}> = ({ children }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [isLoadingAuth, setIsLoadingAuth] = useState(false)

    const handleAuthChangeCookie = async (
        event: AuthChangeEvent, 
        session: Session | null
    ) => {
        await fetch('/api/auth', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify({ event, session })
        })
    }

    useEffect(() => {
        const session = supabase.auth.session()
        session && setCurrentUser(session.user ?? null)
        setIsLoadingAuth(false)

        const { data: authEventListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            handleAuthChangeCookie(event, session)
            if(session && session.user){
                setCurrentUser(session.user)
            } 
            setIsLoadingAuth(false)
        })

        return () => authEventListener?.unsubscribe()
    }, [])

    return(
        <AuthContext.Provider value={{ currentUser, isLoadingAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }