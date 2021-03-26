export function sendToAppMessage (tokenkey, token, signOut = false) {
    let action = {
        message: token,
        token: tokenkey,
    }
    if (signOut) action = 1
    uni.postMessage({
        data: {
            action,
        },
    })
}