import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { RemoveBackgroundRequest, RemoveBackgroundResponse } from '../types';

export async function executeRemoveBackground(
	this: IExecuteFunctions,
	itemIndex: number,
	baseUrl: string,
): Promise<INodeExecutionData> {
	const imageBinaryField = this.getNodeParameter('imageBinaryField', itemIndex) as string;
	const items = this.getInputData();

	if (!items[itemIndex].binary?.[imageBinaryField]) {
		throw new NodeOperationError(
			this.getNode(),
			`No binary data found in field "${imageBinaryField}"`,
			{ itemIndex },
		);
	}

	const imageBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, imageBinaryField);
	const imageBase64 = imageBuffer.toString('base64');

	const requestBody: RemoveBackgroundRequest = { image: imageBase64 };

	const model = this.getNodeParameter('model', itemIndex) as string;
	if (model) {
		requestBody.model = model;
	}

	const response = (await this.helpers.httpRequest({
		method: 'POST',
		url: `${baseUrl}/api/v1/image/remove-background`,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: requestBody,
		json: true,
	})) as RemoveBackgroundResponse;

	const outputImageBuffer = Buffer.from(response.image, 'base64');
	const outputFormat = response.format || 'png';
	const mimeType =
		outputFormat === 'png'
			? 'image/png'
			: outputFormat === 'jpeg'
				? 'image/jpeg'
				: 'image/webp';

	return {
		json: {
			format: response.format,
			width: response.width,
			height: response.height,
		},
		binary: {
			data: await this.helpers.prepareBinaryData(
				outputImageBuffer,
				`background-removed.${outputFormat}`,
				mimeType,
			),
		},
		pairedItem: { item: itemIndex },
	};
}

