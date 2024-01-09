// import { createContext, useContext, useEffect, useRef, useState } from 'react'

// export const WebsocketContext = createContext(false, null, () => {})

// export const WebsocketProvider = ({ children }) => {
//   const [isReady, setIsReady] = useState(false)
//   const [val, setVal] = useState(null)

//   const ws = useRef(null)
//   useEffect(() => {
//     const socket = new WebSocket(process.env.REACT_APP_WS_URL) // eslint-disable-line

//     socket.onopen = () => setIsReady(true)
//     socket.onclose = () => setIsReady(false)
//     socket.onmessage = (event) => setVal(JSON.parse(event.data))

//     ws.current = socket

//     return () => {
//       socket.close()
//     }
//   }, [])

//   const returnedValues = [isReady, val, ws.current?.send.bind(ws.current)]

//   return (
//     <WebsocketContext.Provider value={returnedValues}>
//       {children}
//     </WebsocketContext.Provider>
//   )
// }

// export const WebsocketConsumer = () => {
//   const [ready, val, send] = useContext(WebsocketContext)

//   useEffect(() => {
//     if (ready) {
//       send('test message')
//     }
//   }, [ready, send])

//   return (
//     <div>
//       Ready: {JSON.stringify(ready)}, Value: {JSON.stringify(val)}
//     </div>
//   )
// }
