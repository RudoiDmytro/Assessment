import CountriesList from '@/components/countriesList'
import axios from 'axios'

type Country = {
	countryCode: string
	name: string
}

const Home = async () => {
	const countries: Country[] = await axios
		.get('http://localhost:4200/api/country/all')
		.then(res => res.data)
	return <CountriesList countries={countries} />
}

export default Home
