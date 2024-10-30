import Link from 'next/link'
import { Button } from './ui/button'
import H1 from './ui/h1'

type Country = {
	countryCode: string
	name: string
}

type CountriesListProps = {
	countries: Country[]
}

const CountriesList = ({ countries }: CountriesListProps) => {
	return (
		<div className="m-auto p-3 flex flex-col w-8/12 gap-4 text-center justify-center border rounded-lg border-white">
			<H1>Country List</H1>
			<ul className="grid grid-cols-4 gap-4 justify-items-stretch">
				{countries.map(country => (
					<li key={country.countryCode}>
						<Button className="w-full">
							<Link
								href={`/country/${country.countryCode}?name=${country.name}`}
							>
								{country.name}
							</Link>
						</Button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default CountriesList
