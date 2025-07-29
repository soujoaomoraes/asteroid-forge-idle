const WebSocket = require('ws');

console.log('🧪 Teste WebSocket simulando React...');
console.log('⏰ Início:', new Date().toISOString());

// Simular múltiplas conexões como o React faria
function createConnection(id) {
  console.log(`🔌 Criando conexão #${id}...`);
  
  const ws = new WebSocket('ws://localhost:3000');
  let messageCount = 0;
  let startTime = Date.now();

  ws.on('open', () => {
    console.log(`✅ Conexão #${id} conectada`);
    
    // Enviar heartbeat
    setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'PING',
          timestamp: new Date().toISOString(),
          connectionId: id
        }));
      }
    }, 5000);
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      messageCount++;
      console.log(`📨 Conexão #${id} - Mensagem #${messageCount}:`, message.type);
    } catch (error) {
      console.error(`❌ Erro na conexão #${id}:`, error);
    }
  });

  ws.on('close', (code, reason) => {
    const duration = (Date.now() - startTime) / 1000;
    console.log(`🔌 Conexão #${id} desconectada após ${duration.toFixed(1)}s:`, {
      code: code,
      reason: reason?.toString(),
      messagesReceived: messageCount
    });
  });

  ws.on('error', (error) => {
    console.error(`❌ Erro na conexão #${id}:`, error);
  });

  return ws;
}

// Simular múltiplas instâncias como o React faria
const connections = [];

// Criar primeira conexão
connections.push(createConnection(1));

// Simular React StrictMode - criar e destruir conexões rapidamente
setTimeout(() => {
  console.log('🔄 Simulando React StrictMode - criando conexão #2...');
  connections.push(createConnection(2));
}, 1000);

setTimeout(() => {
  console.log('🔄 Simulando React StrictMode - criando conexão #3...');
  connections.push(createConnection(3));
}, 2000);

setTimeout(() => {
  console.log('🔄 Simulando React StrictMode - criando conexão #4...');
  connections.push(createConnection(4));
}, 3000);

setTimeout(() => {
  console.log('🔄 Simulando React StrictMode - criando conexão #5...');
  connections.push(createConnection(5));
}, 4000);

// Fechar todas as conexões após 30 segundos
setTimeout(() => {
  console.log('🔄 Fechando todas as conexões...');
  connections.forEach((ws, index) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close(1000, 'Teste concluído');
    }
  });
  process.exit(0);
}, 30000);

// Monitorar conexões a cada 5 segundos
setInterval(() => {
  const activeConnections = connections.filter(ws => ws.readyState === WebSocket.OPEN).length;
  console.log(`📊 Status: ${activeConnections}/${connections.length} conexões ativas`);
}, 5000); 