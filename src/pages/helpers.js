import cookie from 'js-cookie'

// set in cookie
export const setCookie = (key, value) => {
    if (typeof window !== 'undefined') {
        cookie.set(key, value, {
            expires: 1
        })
    }
}

// remove from cookie
export const removeCookie = (key) => {
    if (typeof window !== 'undefined') {
        cookie.remove(key)
    }
}

// get from cookie such a stored token
//will be useful when need to make request to server with token
export const getCookie = (key) => {
    if (typeof window !== 'undefined') {
        return cookie.get(key)
    }
}

// set in localstorage
export const setLocalStorage = (key, value) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

// remove from localstorage
export const removeLocalStorage = (key) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key)
    }
}

// authenticate user by passing data to cookie and localstorage during signin
export const authenticate = (response, next) => {
    setCookie('token', response.data.token)
    setLocalStorage('user', response.data.user)
    next()
}

// access user info from localstorage
export const isAuth = () => {
    if (typeof window !== 'undefined') {
        const cookieChecked = getCookie('token')
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'))
            } else {
                return false
            }
        }
    }
}

export const signout = next => {
    removeCookie('token')
    removeLocalStorage('user')
    next();
}

export const updateUser = (response, next) => {
    console.log('UPDATE USER IN LOCALSTORAGE HELPERS', response);
    if (typeof window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem('user'))
        auth = response.data;
        localStorage.setItem('user', JSON.stringify(auth));
    }
    next();
}

export const formatDate = (dateStr, lng = 'he') => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    const locale = typeof lng === 'string' && lng.startsWith('he') ? 'he-IL' : 'en-GB'
    return d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
}