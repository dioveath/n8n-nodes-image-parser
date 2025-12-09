import type { INodeProperties } from 'n8n-workflow';
import { compositeHtmlImageProperties } from './compositeHtmlImage.properties';
import { detectFacesProperties } from './detectFaces.properties';
import { cropFaceProperties } from './cropFace.properties';
import { listBackgroundModelsProperties } from './listBackgroundModels.properties';
import { removeBackgroundProperties } from './removeBackground.properties';

export const operationFields: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Composite HTML Image',
				value: 'compositeHtmlImage',
				action: 'Composite HTML image',
			},
			{
				name: 'List Fonts',
				value: 'listFonts',
				action: 'List available fonts',
			},
			{
				name: 'Detect Faces',
				value: 'detectFaces',
				action: 'Detect faces in image',
			},
			{
				name: 'Crop Face',
				value: 'cropFace',
				action: 'Crop face from image',
			},
			{
				name: 'List Background Models',
				value: 'listBackgroundModels',
				action: 'List background models',
			},
			{
				name: 'Remove Background',
				value: 'removeBackground',
				action: 'Remove image background',
			},
		],
		default: 'compositeHtmlImage',
	},
	...compositeHtmlImageProperties,
	...detectFacesProperties,
	...cropFaceProperties,
	...listBackgroundModelsProperties,
	...removeBackgroundProperties,
];

