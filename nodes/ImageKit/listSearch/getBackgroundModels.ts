import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { BackgroundModelsResponse, ImageKitCredentials } from '../types';

export async function getBackgroundModels(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const credentials = (await this.getCredentials('imageKitApi')) as ImageKitCredentials;
	if (!credentials?.baseUrl) return [];

	try {
		const response = (await this.helpers.httpRequest({
			method: 'GET',
			url: `${credentials.baseUrl}/api/v1/image/background-models`,
			headers: { Accept: 'application/json' },
		})) as BackgroundModelsResponse;

		if (!Array.isArray(response)) return [];

		return response.map((model) => ({
			name: `${model.id}${model.description ? ` - ${model.description}` : ''}`,
			value: model.id,
			description: model.pros,
		}));
	} catch (error) {
		throw new NodeOperationError(
			this.getNode(),
			`Failed to load background models: ${(error as Error).message}`,
		);
	}
}

