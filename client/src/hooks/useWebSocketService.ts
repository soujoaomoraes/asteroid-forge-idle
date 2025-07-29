import { useState, useEffect, useRef } from 'react';
import { websocketService, WebSocketMessage } from '../services/websocketService';

interface UseWebSocketServiceReturn {
  connected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketMessage | null;
}

// Hook global para evitar múltiplas instâncias
let globalWebSocketInitialized = false;
let globalWebSocketUrl = '';
let globalHandlersCount = 0;

export const useWebSocketService = (url: string): UseWebSocketServiceReturn => {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const messageHandlerRef = useRef<(() => void) | null>(null);
  const connectionHandlerRef = useRef<(() => void) | null>(null);
  const componentId = useRef(`comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    console.log(`🔌 Component ${componentId.current} initializing WebSocket connection to:`, url);
    
    // Verificar se já existe uma conexão global para esta URL
    if (globalWebSocketInitialized && globalWebSocketUrl === url) {
      console.log(`🔌 Component ${componentId.current} using existing global WebSocket connection`);
      globalHandlersCount++;
      
      // Apenas adicionar handlers sem criar nova conexão
      messageHandlerRef.current = websocketService.addMessageHandler((message) => {
        setLastMessage(message);
      });

      connectionHandlerRef.current = websocketService.addConnectionHandler((isConnected) => {
        setConnected(isConnected);
      });

      return () => {
        console.log(`🔌 Component ${componentId.current} cleaning up WebSocket handlers (${globalHandlersCount} handlers remaining)`);
        globalHandlersCount--;
        
        if (messageHandlerRef.current) {
          messageHandlerRef.current();
          messageHandlerRef.current = null;
        }
        if (connectionHandlerRef.current) {
          connectionHandlerRef.current();
          connectionHandlerRef.current = null;
        }
      };
    }

    // Inicializar conexão global
    if (!globalWebSocketInitialized || globalWebSocketUrl !== url) {
      console.log(`🔌 Component ${componentId.current} initializing global WebSocket connection to:`, url);
      globalWebSocketInitialized = true;
      globalWebSocketUrl = url;
      globalHandlersCount = 1;
      
      // Conectar ao WebSocket
      websocketService.connect(url);
    }

    // Adicionar handlers
    messageHandlerRef.current = websocketService.addMessageHandler((message) => {
      setLastMessage(message);
    });

    connectionHandlerRef.current = websocketService.addConnectionHandler((isConnected) => {
      setConnected(isConnected);
    });

    // Cleanup function
    return () => {
      console.log(`🔌 Component ${componentId.current} cleaning up WebSocket handlers (${globalHandlersCount} handlers remaining)`);
      globalHandlersCount--;
      
      if (messageHandlerRef.current) {
        messageHandlerRef.current();
        messageHandlerRef.current = null;
      }
      if (connectionHandlerRef.current) {
        connectionHandlerRef.current();
        connectionHandlerRef.current = null;
      }
    };
  }, [url]);

  const sendMessage = (message: WebSocketMessage) => {
    websocketService.sendMessage(message);
  };

  return {
    connected,
    sendMessage,
    lastMessage
  };
}; 