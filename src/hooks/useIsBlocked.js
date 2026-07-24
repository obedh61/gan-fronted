import { useState, useEffect } from 'react'
import axios from 'axios'
import { isAuth, getCookie } from '../pages/helpers'

// Returns the up-to-date blocked status of the logged-in user.
// Starts from the value cached in localStorage and refreshes it from the
// server, so admin block/unblock changes apply without requiring re-login.
const useIsBlocked = () => {
    const auth = isAuth()
    const [isBlocked, setIsBlocked] = useState(!!(auth && auth.isBlocked))

    useEffect(() => {
        if (!auth || !auth._id) return
        const token = getCookie('token')
        axios.get(`${process.env.REACT_APP_API}/user/${auth._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setIsBlocked(!!response.data.isBlocked))
            .catch(() => { /* keep cached value on error */ })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return isBlocked
}

export default useIsBlocked
