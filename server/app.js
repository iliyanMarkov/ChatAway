const { WSAEWOULDBLOCK } = require('constants')
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8989 })

const users = []

const broadcast = (data, webSocket) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== webSocket) {
            client.send(JSON.stringify(data))
        }
    })
}

wss.on('connection', (webSocket) => {
    let index
    webSocket.on('message', (message) => {
        const data = JSON.parse(message)
        switch (data.type) {
            case 'ADD_USER' : {
                index = users.length
                users.push({ name: data.name, id: index + 1 })
                webSocket.send(JSON.stringify({
                    type: 'USERS_LIST',
                    users
                }))
                broadcast({
                    type: 'USERS_LIST',
                    users
                }, webSocket)
                break
            }
            case 'ADD_MESSAGE':
                broadcast({
                    type: 'ADD_MESSAGE',
                    message: data.message,
                    author: data.author
                }, webSocket)
                break
            default:
                break
        }
    })

    webSocket.on('close', () => {
        users.splice(index, 1)
        broadcast({
            type: 'USERS_LIST',
            users
        }, webSocket)
    })
})