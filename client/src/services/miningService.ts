import { AsteroidResources } from '../types/asteroid';

export class MiningService {
  private static instance: MiningService;
  private totalMined: AsteroidResources = {
    crystals: 0,
    metals: 0,
    gems: 0,
    energy: 0
  };

  private constructor() {}

  public static getInstance(): MiningService {
    if (!MiningService.instance) {
      MiningService.instance = new MiningService();
    }
    return MiningService.instance;
  }

  public async addMinedResources(resources: AsteroidResources): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3000/api/mining', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resources)
      });

      const data = await response.json();

      if (data.success) {
        // Atualizar estatísticas locais
        this.totalMined.crystals += resources.crystals;
        this.totalMined.metals += resources.metals;
        this.totalMined.gems += resources.gems;
        this.totalMined.energy += resources.energy;

        console.log('⛏️ Recursos minerados adicionados:', resources);
        console.log('📊 Total minerado:', this.totalMined);
        
        return true;
      } else {
        console.error('❌ Erro ao adicionar recursos:', data.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro na comunicação com servidor:', error);
      return false;
    }
  }

  public getTotalMined(): AsteroidResources {
    return { ...this.totalMined };
  }

  public resetTotalMined(): void {
    this.totalMined = {
      crystals: 0,
      metals: 0,
      gems: 0,
      energy: 0
    };
  }

  public formatResources(resources: AsteroidResources): string {
    const parts = [];
    if (resources.crystals > 0) parts.push(`💎 ${resources.crystals}`);
    if (resources.metals > 0) parts.push(`🔧 ${resources.metals}`);
    if (resources.gems > 0) parts.push(`💎 ${resources.gems}`);
    if (resources.energy > 0) parts.push(`⚡ ${resources.energy}`);
    
    return parts.length > 0 ? parts.join(', ') : 'Nenhum recurso';
  }
} 