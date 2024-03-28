import { createContext, useEffect, useRef, useState } from 'react'
require('dotenv').config()

export const WebsocketContext = createContext(
  false,
  null,
  () => {},
  () => {},
  {
    value: null,
    setChats: () => {},
    removeChatFromUnseen: () => {}
  })

export const WebsocketProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false)
  const [val, setVal] = useState(null)
  const [chats, setChats] = useState({
    notified: false,
    newChat: false,
    unseenChats: []
  })
  const ws = useRef(null)

  const parser = () => /* istanbul ignore next */ {
    if (!val) return

    switch (val.method) {
      case 'newChat':
        setChats({ ...chats, notified: true, newChat: true })
        break
      case 'messageChat':
        if (val.data && !chats.unseenChats.includes(val.data)) { setChats({ ...chats, notified: true, unseenChats: [...chats.unseenChats, val.data] }) }
        break
      default:
        break
    }
  }

  useEffect(() => {
    const id = localStorage.getItem('id')
    if (!id) return

    const socket = new WebSocket(process.env.REACT_APP_WS_URL) // eslint-disable-line

    socket.onopen = () => setIsReady(true)
    socket.onclose = () => setIsReady(false)
    socket.onmessage = (event) => setVal(JSON.parse(event.data))

    ws.current = socket

    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => /* istanbul ignore next */ {
    if (isReady) sendMessage('login', { userId: localStorage.getItem('id') })
  }, [isReady])

  useEffect(parser, [val])

  /**
   * Function to send a message via websocket
   * Method is what function will be executed
   * Data is the data to pass through the function
   * @param {String} method
   * @param {Object} data
   */
  const sendMessage = (method, data) => /* istanbul ignore next */ {
    if (isReady) {
      ws.current?.send.bind(ws.current)(JSON.stringify({ method, data }))
    }
  }

  const removeChatFromUnseen = (chatId) => /* istanbul ignore next */ {
    if (chats.unseenChats.includes(chatId)) {
      setChats({ ...chats, unseenChats: chats.unseenChats.filter(chat => chat !== chatId) })
    }
  }

  const returnedValues = {
    ready: isReady,
    val,
    setVal,
    send: sendMessage,
    chats: {
      value: chats,
      setChats,
      removeChatFromUnseen
    }
  }

  return (
    <WebsocketContext.Provider value={returnedValues}>
      {children}
    </WebsocketContext.Provider>
  )
}
