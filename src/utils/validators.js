export const isValidUrl = (url) => {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export const extractDomain = (url) => new URL(url).hostname
