import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { BackgroundModelsResponse } from '../types';

export async function executeListBackgroundModels(
	this: IExecuteFunctions,
	itemIndex: number,
	baseUrl: string,
): Promise<INodeExecutionData> {
	const response = (await this.helpers.httpRequest({
		method: 'GET',
		url: `${baseUrl}/api/v1/image/background-models`,
		headers: {
			Accept: 'application/json',
		},
	})) as BackgroundModelsResponse;

	return {
		json: { models: response } as IDataObject,
		pairedItem: { item: itemIndex },
	};
}

