import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import * as writeTextToImage from './action/writeTextToImage';

export class ImageTool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Image Tool',
		name: 'imageTool',
		icon: { dark: 'file:apple.svg', light: 'file:apple.svg' },
		group: ['transform'],
		version: [1, 1],
		description: 'A node that transforms images.',
		defaults: {
			name: 'Image Tool',
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
						name: 'Write Text to Image',
						value: 'writeTextToImage',
						action: 'Write text to image'
					}
				],
				default: 'writeTextToImage'
			},
            {
                displayName: 'Text',
                name: 'text',
                type: 'string',
                default: '',
                placeholder: 'Text to add to image',
                description: 'Text to add to image',
                displayOptions: {
                    show: {
                        operation: ['writeTextToImage']
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
						operation: ['writeTextToImage']
					}
				}
			},
			{
				displayName: 'Draw Options JSON',
				name: 'drawOptions',
				type: 'json',
				typeOptions: {
					rows: 20,
				},
				default: '{\r\n  \"box\": {\r\n    \"x\": 100,\r\n    \"y\": 200,\r\n    \"width\": 600,\r\n    \"height\": 300\r\n  },\r\n  \"options\": {\r\n    \"align\": \"center\",\r\n    \"verticalAlign\": \"middle\",\r\n    \"padding\": {\r\n      \"top\": 20,\r\n      \"right\": 30,\r\n      \"bottom\": 20,\r\n      \"left\": 30\r\n    },\r\n    \"style\": {\r\n      \"fontSize\": 36,\r\n      \"fontFamily\": \"Inter\",\r\n      \"fontColor\": \"#ffffff\",\r\n      \"lineSpacing\": 1.4,\r\n      \"strokeColor\": \"#000000\",\r\n      \"strokeWidth\": 2,\r\n      \"keywordColor\": \"#ff0000\"\r\n    },\r\n    \"keywords\": [\"urgent\", \"important\", \"breaking\"]\r\n  }\r\n}\r\n',
				placeholder: '{\r\n  \"box\": {\r\n    \"x\": 100,\r\n    \"y\": 200,\r\n    \"width\": 600,\r\n    \"height\": 300\r\n  },\r\n  \"options\": {\r\n    \"align\": \"center\",\r\n    \"verticalAlign\": \"middle\",\r\n    \"padding\": {\r\n      \"top\": 20,\r\n      \"right\": 30,\r\n      \"bottom\": 20,\r\n      \"left\": 30\r\n    },\r\n    \"style\": {\r\n      \"fontSize\": 36,\r\n      \"fontFamily\": \"Inter\",\r\n      \"fontColor\": \"#ffffff\",\r\n      \"lineSpacing\": 1.4,\r\n      \"strokeColor\": \"#000000\",\r\n      \"strokeWidth\": 2,\r\n      \"keywordColor\": \"#ff0000\"\r\n    },\r\n    \"keywords\": [\"urgent\", \"important\", \"breaking\"]\r\n  }\r\n}\r\n',
				description: 'JSON draw options for writing text to image',
				displayOptions: {
					show: {
						operation: ['writeTextToImage']
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

			if (operation === 'writeTextToImage') {
				const result = await writeTextToImage.execute.call(this, items[i]);
				returnData.push(result);
			}
        }

        return this.prepareOutputData(returnData);
    }
}
