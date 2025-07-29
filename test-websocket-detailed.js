const WebSocket = require('ws');

console.log('🧪 Teste detalhado de WebSocket iniciado...');
console.log('⏰ Início:', new Date().toISOString());

const ws = new WebSocket('ws://localhost:3000');

let messageCount = 0;
let lastMessageTime = Date.now();
let connectionStartTime = Date.now();

ws.on('open', () => {
  console.log('✅ WebSocket conectado com sucesso!');
  console.log('⏰ Tempo de conexão:', new Date().toISOString());
  
  // Enviar mensagem de teste
  ws.send(JSON.stringify({
    type: 'REQUEST_RESOURCES',
    timestamp: new Date().toISOString()
  }));
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    messageCount++;
    lastMessageTime = Date.now();
    
    const timeSinceStart = (Date.now() - connectionStartTime) / 1000;
    console.log(`📨 Mensagem #${messageCount} (${timeSinceStart.toFixed(1)}s):`, message.type);
    
    if (message.type === 'RESOURCES_UPDATED') {
      console.log('💎 Recursos atualizados:', message.data);
    }
  } catch (error) {
    console.error('❌ Erro ao processar mensagem:', error);
  }
});

ws.on('close', (code, reason) => {
  const timeSinceStart = (Date.now() - connectionStartTime) / 1000;
  console.log(`🔌 WebSocket desconectado após ${timeSinceStart.toFixed(1)}s:`);
  console.log(`   Código: ${code}`);
  console.log(`   Razão: ${reason}`);
  console.log(`   Timestamp: ${new Date().toISOString()}`);
});

ws.on('error', (error) => {
  const timeSinceStart = (Date.now() - connectionStartTime) / 1000;
  console.error(`❌ Erro no WebSocket após ${timeSinceStart.toFixed(1)}s:`, error);
});

// Monitorar conexão a cada segundo
const connectionMonitor = setInterval(() => {
  const timeSinceStart = (Date.now() - connectionStartTime) / 1000;
  const timeSinceLastMessage = (Date.now() - lastMessageTime) / 1000;
  
  console.log(`📊 Status (${timeSinceStart.toFixed(1)}s):`, {
    readyState: ws.readyState,
    messagesReceived: messageCount,
    timeSinceLastMessage: `${timeSinceLastMessage.toFixed(1)}s`,
    connected: ws.readyState === WebSocket.OPEN
  });
  
  // Parar monitoramento se desconectado
  if (ws.readyState === WebSocket.CLOSED) {
    clearInterval(connectionMonitor);
  }
}, 1000);

// Teste de duração - 2 minutos
setTimeout(() => {
  console.log(`\n📊 Resultado final do teste:`);
  console.log(`- Duração total: ${((Date.now() - connectionStartTime) / 1000).toFixed(1)}s`);
  console.log(`- Mensagens recebidas: ${messageCount}`);
  console.log(`- Última mensagem: ${((Date.now() - lastMessageTime) / 1000).toFixed(1)}s atrás`);
  console.log(`- Status da conexão: ${ws.readyState === WebSocket.OPEN ? 'Conectado' : 'Desconectado'}`);
  
  clearInterval(connectionMonitor);
  ws.close(1000, 'Teste concluído');
  process.exit(0);
}, 120000); // Teste por 2 minutos 