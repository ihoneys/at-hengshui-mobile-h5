export function sendToAppMessage (tokenkey, token) {
    console.log(uni.postMessage, '79999')
    uni.postMessage({
        data: {
            action: {
                message: token,
                token: tokenkey,
            },
        },
    })
}