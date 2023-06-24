import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    private readonly httpService: AxiosAdapter,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }
  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.httpService.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=151');
    const pokemonToInsert = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      return { name, no };
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed executed successfully';
  }
}
