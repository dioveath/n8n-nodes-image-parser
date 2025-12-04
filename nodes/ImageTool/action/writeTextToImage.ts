import { IExecuteFunctions, INodeExecutionData, IPairedItemData, NodeApiError } from 'n8n-workflow';

export async function execute(this: IExecuteFunctions, item: INodeExecutionData): Promise<INodeExecutionData> {
    const itemIndex = (item["pairedItem"] as IPairedItemData).item
    const text = this.getNodeParameter('text', itemIndex) as string;
    const imageBinaryField = this.getNodeParameter('imageBinaryField', itemIndex) as string;
    const writeOptions = this.getNodeParameter('drawOptions', itemIndex) as string;

    const parsedOptions = JSON.parse(writeOptions)
    this.logger.info(`Write Otions: ${JSON.stringify(parsedOptions, null, 2)}`)

    const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, imageBinaryField)
    if (!binaryDataBuffer) {
        throw new NodeApiError(this.getNode(), {
            message: "No image found",
            description: `Failed to get image from the binary field ${imageBinaryField}`
        })
    }

    return {
        json: {
            text,
            success: true,
        }
    };
}