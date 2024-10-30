import { Controller, Get, Query } from '@nestjs/common'
import { CountryService } from './country.service'

@Controller('country')
export class CountryController {
	constructor(private readonly countryService: CountryService) {}

	@Get('all')
	async getAllCountries() {
		return this.countryService.getAllCountries()
	}

	@Get('info')
	async getCountryInfo(
		@Query('code') countryCode: string,
		@Query('name') countryName: string
	) {
		return this.countryService.getCountryData(countryCode, countryName)
	}
}
