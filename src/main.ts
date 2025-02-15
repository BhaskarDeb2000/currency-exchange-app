import { Data } from './types';

const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;

const baseURL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`;

class FetchWrapper {
	baseURL: string;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
	}

	get(endpoint: string): Promise<Data> {
		return fetch(this.baseURL + endpoint).then((response) => response.json());
	}

	put(endpoint: string, body: any): Promise<any> {
		return this._send('put', endpoint, body);
	}

	post(endpoint: string, body: any): Promise<any> {
		return this._send('post', endpoint, body);
	}

	delete(endpoint: string, body: any): Promise<any> {
		return this._send('delete', endpoint, body);
	}

	_send(method: string, endpoint: string, body: any): Promise<any> {
		return fetch(this.baseURL + endpoint, {
			method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).then((response) => response.json());
	}
}

const baseCurrencyEl = document.querySelector('#base-currency') as HTMLSelectElement;

const targetCurrencyEl = document.querySelector('#target-currency') as HTMLSelectElement;

const resultEl = document.querySelector('#conversion-result') as HTMLParagraphElement;

let conversionsArr: [string, number][] = [];

const apiTool = new FetchWrapper(baseURL);

const getConversionRates = async () => {
	const base = baseCurrencyEl.value;
	const target = targetCurrencyEl.value;

	conversionsArr = [];

	await apiTool.get(base).then((res) => {
		const data = res.conversion_rates;
		for (const item in data) {
			const itemArr: [string, number] = [item, data[item]];
			conversionsArr.push(itemArr);
		}
	});

	currencyConversion(conversionsArr, target);
};

baseCurrencyEl.addEventListener('change', getConversionRates);

targetCurrencyEl.addEventListener('change', getConversionRates);

const currencyConversion = (currencyArr: [string, number][], target: string) => {
	const conversionRate = currencyArr.find(([currency]) => currency === target)?.[1];
	resultEl.textContent = conversionRate ? conversionRate.toString() : 'fetching error';
};