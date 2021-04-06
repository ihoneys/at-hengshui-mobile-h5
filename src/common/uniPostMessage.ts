declare let uni: any
export function sendToAppMessage(tokenkey: string, token: string, signOut = false) {
  let action: any = {
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