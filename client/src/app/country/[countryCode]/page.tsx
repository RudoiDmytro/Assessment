'use client'
import { Button } from '@/components/ui/button'
import H1 from '@/components/ui/h1'
import Spinner from '@/components/ui/spinner'
import axios from 'axios'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend
} from 'chart.js'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend
)

type PageProps = {
	params: { countryCode: string }
}

const CountryInfoPage = ({ params }: PageProps) => {
	const { countryCode } = use(params)
	const searchParams = useSearchParams()
	const countryName = searchParams.get('name')

	const [countryData, setCountryData] = useState({
		borders: [],
		populationData: [
			{
				year: 0,
				value: 0
			}
		],
		flagUrl: '',
		name: ''
	})

	useEffect(() => {
		const fetchData = async () => {
			if (countryName) {
				const { data } = await axios.get(
					`http://localhost:4200/api/country/info?code=${countryCode}&name=${countryName}`
				)
				setCountryData(data)
			}
		}
		fetchData()
	}, [countryCode, countryName])

	if (countryData.flagUrl === '')
		return (
			<div className="flex h-screen m-auto justify-center items-center">
				<Spinner />
			</div>
		)

	const populationData = {
		labels: countryData.populationData.map(entry => entry.year),
		datasets: [
			{
				label: 'Population',
				data: countryData.populationData.map(entry => entry.value),
				fill: false,
				backgroundColor: 'rgba(75,192,192,0.4)',
				borderColor: 'rgba(75,192,192,1)'
			}
		]
	}

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				title: {
					display: true,
					text: 'Year'
				}
			},
			y: {
				title: {
					display: true,
					text: 'Population'
				}
			}
		}
	}

	return (
		<div className="flex flex-col w-8/12 m-auto p-3 gap-5 text-center">
			<Button className="sticky top-0 w-min">
				<Link href={`/`}>Go home</Link>
			</Button>
			<H1>{countryName}</H1>
			<Image
				width={100}
				height={100}
				src={countryData.flagUrl.trim()}
				alt={`${countryName} flag`}
				className="w-full max-w-xl m-auto"
			/>
			<H1>Border Countries</H1>
			<ul className="grid grid-cols-5 gap-4 justify-items-stretch">
				{countryData.borders.map(
					(borderCountry: { commonName: string; countryCode: string }) => (
						<li key={borderCountry.commonName}>
							<Button className="w-full">
								<Link
									href={`/country/${borderCountry.countryCode}?name=${borderCountry.commonName}`}
								>
									{borderCountry.commonName}
								</Link>
							</Button>
						</li>
					)
				)}
			</ul>
			<h2>Population Over Time</h2>
			<div className=" w-full h-full min-h-[600px]">
				<Line data={populationData} options={options} />
			</div>
		</div>
	)
}

export default CountryInfoPage
