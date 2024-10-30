import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
