import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { FaceCropRequest, FaceCropResponse } from '../types';

export async function executeCropFace(
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

	const requestBody: FaceCropRequest = {
		image: imageBase64,
	};

	const confidenceThreshold = this.getNodeParameter('confidence_threshold', itemIndex);
	if (confidenceThreshold !== undefined && confidenceThreshold !== null) {
		requestBody.confidence_threshold = confidenceThreshold as number;
	}

	const width = this.getNodeParameter('width', itemIndex);
	if (width !== undefined && width !== null) {
		requestBody.width = width as number;
	}

	const height = this.getNodeParameter('height', itemIndex);
	if (height !== undefined && height !== null) {
		requestBody.height = height as number;
	}

	const respectAspectRatio = this.getNodeParameter('respect_aspect_ratio', itemIndex);
	if (respectAspectRatio !== undefined && respectAspectRatio !== null) {
		requestBody.respect_aspect_ratio = respectAspectRatio as boolean;
	}

	const response = (await this.helpers.httpRequest({
		method: 'POST',
		url: `${baseUrl}/api/v1/face/crop`,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: requestBody,
		json: true,
	})) as FaceCropResponse;

	const outputImageBuffer = Buffer.from(response.image, 'base64');
	const mimeType = 'image/png'; // Default, adjust if API returns format info

	return {
		json: {
			width: response.width,
			height: response.height,
			face_confidence: response.face_confidence,
		},
		binary: {
			data: await this.helpers.prepareBinaryData(
				outputImageBuffer,
				'cropped_face.png',
				mimeType,
			),
		},
		pairedItem: { item: itemIndex },
	};
}

