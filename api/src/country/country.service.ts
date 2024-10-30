import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { catchError, forkJoin, map, Observable } from 'rxjs'

@Injectable()
export class CountryService {
	constructor(private readonly httpService: HttpService) {}
	getAllCountries(): Observable<AxiosResponse<any>> {
		const url = `https://date.nager.at/api/v3/AvailableCountries`
		return this.httpService
			.get(url)
			.pipe(map(response => response.data))
			.pipe(
				catchError(err => {
					console.error('Error fetching data:', err)
					throw new Error('Failed to fetch country data')
				})
			)
	}
	getBorderCountries(countryCode: string): Observable<AxiosResponse<any>> {
		const url = `https://date.nager.at/api/v3/CountryInfo/${countryCode}`
		return this.httpService
			.get(url)
			.pipe(map(response => response.data.borders || []))
			.pipe(
				catchError(err => {
					console.error('Error fetching data:', err)
					throw new Error('Failed to fetch country data')
				})
			)
	}
	getPopulationData(countryName: string): Observable<AxiosResponse<any>> {
		const url = `https://countriesnow.space/api/v0.1/countries/population`
		return this.httpService
			.get(url)
			.pipe(
				map(response => {
					const countryData = response.data.data.find(
						item => item.country.toLowerCase() === countryName.toLowerCase()
					)
					return countryData ? countryData.populationCounts : []
				})
			)
			.pipe(
				catchError(err => {
					console.error('Error fetching data:', err)
					throw new Error('Failed to fetch country data')
				})
			)
	}
	getFlagUrl(countryName: string): Observable<AxiosResponse<any>> {
		const url = `https://countriesnow.space/api/v0.1/countries/flag/images`
		return this.httpService
			.get(url)
			.pipe(
				map(response => {
					const countryData = response.data.data.find(
						item => item.name.toLowerCase() === countryName.toLowerCase()
					)
					return countryData ? countryData.flag : ''
				})
			)
			.pipe(
				catchError(err => {
					console.error('Error fetching data:', err)
					throw new Error('Failed to fetch country data')
				})
			)
	}
	getCountryData(countryCode: string, countryName: string): Observable<any> {
		return forkJoin({
			borders: this.getBorderCountries(countryCode),
			populationData: this.getPopulationData(countryName),
			flagUrl: this.getFlagUrl(countryName)
		}).pipe(
			catchError(err => {
				console.error('Error fetching data:', err)
				throw new Error('Failed to fetch country data')
			})
		)
	}
}
