import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';
export type AlchemyGetAssetTransfersBodyParam = FromSchema<typeof schemas.AlchemyGetAssetTransfers.body>;
export type AlchemyGetAssetTransfersMetadataParam = FromSchema<typeof schemas.AlchemyGetAssetTransfers.metadata>;
export type AlchemyGetAssetTransfersResponse200 = FromSchema<typeof schemas.AlchemyGetAssetTransfers.response['200']>;
