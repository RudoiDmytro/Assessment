import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { forkJoin, map, Observable } from 'rxjs'

@Injectable()
export class CountryService {
	constructor(private readonly httpService: HttpService) {}
	getAllCountries(): Observable<AxiosResponse<any>> {
		const url = `https://date.nager.at/api/v3/AvailableCountries`
		return this.httpService.get(url).pipe(map(response => response.data))
	}
	getBorderCountries(countryCode: string): Observable<AxiosResponse<any>> {
		const url = `https://date.nager.at/api/v3/CountryInfo/${countryCode}`
		return this.httpService
			.get(url)
			.pipe(map(response => response.data.borders || []))
	}
	getPopulationData(countryName: string): Observable<AxiosResponse<any>> {
		const url = `https://countriesnow.space/api/v0.1/countries/population`
		return this.httpService.get(url).pipe(
			map(response => {
				const countryData = response.data.data.find(
					item => item.country.toLowerCase() === countryName.toLowerCase()
				)
				return countryData ? countryData.populationCounts : []
			})
		)
	}
	getFlagUrl(countryName: string): Observable<AxiosResponse<any>> {
		const url = `https://countriesnow.space/api/v0.1/countries/flag/images`
		return this.httpService.get(url).pipe(
			map(response => {
				const countryData = response.data.data.find(
					item => item.name.toLowerCase() === countryName.toLowerCase()
				)
				return countryData ? countryData.flag : ''
			})
		)
	}
	getCountryData(countryCode: string, countryName: string): Observable<any> {
		return forkJoin({
			borders: this.getBorderCountries(countryCode),
			populationData: this.getPopulationData(countryName),
			flagUrl: this.getFlagUrl(countryName)
		})
	}
}
