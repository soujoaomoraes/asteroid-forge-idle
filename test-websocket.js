const WebSocket = require('ws');

console.log('🧪 Testando conexão WebSocket...');

const ws = new WebSocket('ws://localhost:3000');

let messageCount = 0;
let lastMessageTime = Date.now();

ws.on('open', () => {
  console.log('✅ WebSocket conectado com sucesso!');
  
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
    
    console.log(`📨 Mensagem #${messageCount} recebida:`, message.type);
    
    if (message.type === 'RESOURCES_UPDATED') {
      console.log('💎 Recursos atualizados:', message.data);
    }
  } catch (error) {
    console.error('❌ Erro ao processar mensagem:', error);
  }
});

ws.on('close', (code, reason) => {
  console.log(`🔌 WebSocket desconectado: ${code} - ${reason}`);
});

ws.on('error', (error) => {
  console.error('❌ Erro no WebSocket:', error);
});

// Teste de duração
setTimeout(() => {
  console.log(`\n📊 Resultado do teste:`);
  console.log(`- Mensagens recebidas: ${messageCount}`);
  console.log(`- Última mensagem: ${Date.now() - lastMessageTime}ms atrás`);
  console.log(`- Status da conexão: ${ws.readyState === WebSocket.OPEN ? 'Conectado' : 'Desconectado'}`);
  
  ws.close(1000, 'Teste concluído');
  process.exit(0);
}, 10000); // Teste por 10 segundos 