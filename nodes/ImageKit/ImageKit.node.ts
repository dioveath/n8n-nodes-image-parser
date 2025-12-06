import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class ImageKit implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Image Kit',
		name: 'imageKit',
		icon: { dark: 'file:apple.svg', light: 'file:apple.svg' },
		group: ['transform'],
		version: [1, 1],
		description: 'A node that transforms images.',
		defaults: {
			name: 'Image Kit',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Composite HTML Image',
						value: 'compositeHtmlImage',
						action: 'Composite HTML image'
					}
				],
				default: 'compositeHtmlImage'
			},
            {
                displayName: 'HTML',
                name: 'html',
                type: 'string',
				typeOptions: {
					rows: 20,
				},
                default: '<div>Hello, world!</div>',
                placeholder: '<div>Hello, world!</div>',
                description: 'HTML to add to image',
				displayOptions: {
					show: {
						operation: ['compositeHtmlImage']
					}
				}
            },
			{
				displayName: 'Image Binary Field',
				name: 'imageBinaryField',
				type: 'string',
				default: 'data',
				placeholder: 'data',
				description: 'Data field of the image binary',
				displayOptions: {
					show: {
						operation: ['compositeHtmlImage']
					}
				}
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = []

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;

			if (operation === 'compositeHtmlImage') {
				// const result = 
				// returnData.push(result);
			}
        }

        return this.prepareOutputData(returnData);
    }
}
