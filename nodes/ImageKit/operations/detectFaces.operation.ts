import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { FaceDetectionRequest, FaceDetectionResponse } from '../types';

export async function executeDetectFaces(
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

	const requestBody: FaceDetectionRequest = {
		image: imageBase64,
	};

	const confidenceThreshold = this.getNodeParameter('confidence_threshold', itemIndex);
	if (confidenceThreshold !== undefined && confidenceThreshold !== null) {
		requestBody.confidence_threshold = confidenceThreshold as number;
	}

	const response = (await this.helpers.httpRequest({
		method: 'POST',
		url: `${baseUrl}/api/v1/face/detect`,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: requestBody,
		json: true,
	})) as FaceDetectionResponse;

	return {
		json: response as unknown as IDataObject,
		pairedItem: { item: itemIndex },
	};
}

