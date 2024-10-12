declare const AlchemyGetAssetTransfers: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly id: {
                readonly type: "integer";
                readonly default: 1;
            };
            readonly jsonrpc: {
                readonly type: "string";
                readonly default: "2.0";
            };
            readonly method: {
                readonly default: "alchemy_getAssetTransfers";
                readonly type: "string";
            };
            readonly params: {
                readonly type: "array";
                readonly minItems: 1;
                readonly maxItems: 1;
                readonly items: {
                    readonly type: "object";
                    readonly required: readonly ["category"];
                    readonly properties: {
                        readonly fromBlock: {
                            readonly type: "string";
                            readonly description: "String - Inclusive from block (hex string, int, `latest`, or `indexed`). Defaults to `0x0`";
                            readonly default: "0x0";
                        };
                        readonly toBlock: {
                            readonly type: "string";
                            readonly description: "String - Inclusive to block (hex string, int, `latest`, or `indexed`). Defaults to `latest`. Read more about block tags <span class=\"custom-style\"><a href=\"https://docs.alchemy.com/reference/transfers-api-quickstart#what-are-the-different-types-of-block-tags\" target=\"_blank\">here</a></span>";
                            readonly default: "latest";
                        };
                        readonly fromAddress: {
                            readonly type: "string";
                            readonly description: "String - From address (hex string). Default wildcard - any address";
                            readonly pattern: "^0[xX][0-9a-fA-F]+$";
                        };
                        readonly toAddress: {
                            readonly type: "string";
                            readonly description: "String - To address (hex string). Default wildcard - any address";
                            readonly pattern: "^0[xX][0-9a-fA-F]+$";
                            readonly default: "0x5c43B1eD97e52d009611D89b74fA829FE4ac56b1";
                        };
                        readonly contractAddresses: {
                            readonly type: "array";
                            readonly description: "String - List of contract addresses (hex strings) to filter for - only applies to \"erc20\", \"erc721\", \"erc1155\" transfers. Default wildcard - any address";
                            readonly items: {
                                readonly type: "string";
                                readonly pattern: "^0[xX][0-9a-fA-F]+$";
                            };
                        };
                        readonly category: {
                            readonly type: "array";
                            readonly description: "'Array of categories, can be any of the following: \"external\", \"internal\", \"erc20\", \"erc721\", \"erc1155\", or \"specialnft\". See the table above for supported categories on each network.'\n";
                            readonly items: {
                                readonly type: "string";
                                readonly enum: readonly ["external", "internal", "erc20", "erc721", "erc1155", "specialnft"];
                                readonly default: "external";
                                readonly description: "Default: external";
                            };
                        };
                        readonly order: {
                            readonly type: "string";
                            readonly description: "String - Whether to return results in ascending (`asc`) or descending (`desc`) order. Ascending order is from oldest to newest transactions, descending order is from newest to oldest. Defaults to `asc`.\n";
                            readonly enum: readonly ["asc", "desc"];
                        };
                        readonly withMetadata: {
                            readonly type: "boolean";
                            readonly description: "Boolean - Whether or not to include additional metadata about each transfer event. Defaults to `false`.";
                            readonly default: false;
                        };
                        readonly excludeZeroValue: {
                            readonly type: "boolean";
                            readonly description: "Boolean - A boolean to exclude transfers with zero value - zero value is not the same as null value. Defaults to `true`.";
                            readonly default: true;
                        };
                        readonly maxCount: {
                            readonly type: "string";
                            readonly description: "Max hex string number of results to return per call. Defaults to `0x3e8` (1000).";
                            readonly default: "0x3e8";
                        };
                        readonly pageKey: {
                            readonly type: "string";
                            readonly description: "String - UUID for pagination. If more results are available, a uuid pageKey will be returned in the response. Pass that uuid into pageKey to fetch the next 1000 or maxCount.";
                        };
                    };
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly apiKey: {
                    readonly type: "string";
                    readonly default: "docs-demo";
                    readonly description: "<style>\n  .custom-style {\n    color: #048FF4;\n  }\n</style>\nFor higher throughput, <span class=\"custom-style\"><a href=\"https://alchemy.com/?a=docs-demo\" target=\"_blank\">create your own API key</a></span>\n";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                };
            };
            readonly required: readonly ["apiKey"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "integer";
                    readonly examples: readonly [1];
                };
                readonly jsonrpc: {
                    readonly type: "string";
                    readonly examples: readonly ["2.0"];
                };
                readonly result: {
                    readonly type: "object";
                    readonly description: "An object with the following fields.";
                    readonly properties: {
                        readonly pageKey: {
                            readonly type: "string";
                            readonly description: "Uuid of next page of results (if exists, else blank).";
                        };
                        readonly transfers: {
                            readonly type: "array";
                            readonly description: "Array of objects - sorted in ascending order by block number, ties broken by category (external , internal, token transfers).";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly category: {
                                        readonly type: "string";
                                        readonly description: "'external', 'internal', 'token', 'erc20', 'erc721', 'erc1155', 'specialnft' - label for the transfer.";
                                        readonly examples: readonly ["external"];
                                    };
                                    readonly blockNum: {
                                        readonly type: "string";
                                        readonly description: "The block where the transfer occurred (hex string).";
                                        readonly examples: readonly ["0xb0eadc"];
                                    };
                                    readonly from: {
                                        readonly type: "string";
                                        readonly description: "From address of transfer (hex string).";
                                        readonly examples: readonly ["0xef4396d9ff8107086d215a1c9f8866c54795d7c7"];
                                    };
                                    readonly to: {
                                        readonly type: "string";
                                        readonly description: "To address of transfer (hex string). null if contract creation.";
                                        readonly examples: readonly ["0x5c43b1ed97e52d009611d89b74fa829fe4ac56b1"];
                                    };
                                    readonly value: {
                                        readonly type: readonly ["number", "null"];
                                        readonly description: "Converted asset transfer value as a number (raw value divided by contract decimal). null if ERC721 transfer or contract decimal not available.";
                                        readonly examples: readonly [0.5];
                                    };
                                    readonly erc721TokenId: {
                                        readonly type: readonly ["string", "null"];
                                        readonly description: "(Deprecated) Legacy token ID field for ERC721 tokens (hex string). The `tokenId` field should be used instead.";
                                    };
                                    readonly erc1155Metadata: {
                                        readonly type: readonly ["array", "null"];
                                        readonly description: "A list of objects containing the ERC1155 tokenId (hex string) and value (hex string). null if not an ERC1155 transfer.";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly tokenId: {
                                                    readonly type: "string";
                                                };
                                                readonly value: {
                                                    readonly type: "string";
                                                };
                                            };
                                        };
                                    };
                                    readonly tokenId: {
                                        readonly type: "string";
                                        readonly description: "Token ID for ERC721 (or other NFT) tokens.";
                                    };
                                    readonly asset: {
                                        readonly type: readonly ["string", "null"];
                                        readonly description: "ETH or the token's symbol. null if not defined in the contract and not available from other sources.";
                                        readonly examples: readonly ["ETH"];
                                    };
                                    readonly uniqueId: {
                                        readonly type: "string";
                                        readonly description: "A unique identifier for the transfer object.";
                                        readonly examples: readonly ["0x3847245c01829b043431067fb2bfa95f7b5bdc7e4246c843e7a573ab6f26f5ff:external"];
                                    };
                                    readonly hash: {
                                        readonly type: "string";
                                        readonly description: "Transaction hash (hex string).";
                                        readonly examples: readonly ["0x3847245c01829b043431067fb2bfa95f7b5bdc7e4246c843e7a573ab6f26f5ff"];
                                    };
                                    readonly rawContract: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly value: {
                                                readonly type: readonly ["string", "null"];
                                                readonly description: "Raw transfer value (hex string). null if ERC721 or ERC1155 transfer.";
                                                readonly examples: readonly ["0x6f05b59d3b20000"];
                                            };
                                            readonly address: {
                                                readonly type: readonly ["string", "null"];
                                                readonly description: "Contract address (hex string). null if external or internal transfer.";
                                            };
                                            readonly decimal: {
                                                readonly type: readonly ["string", "null"];
                                                readonly description: "Contract decimal (hex string). null if not defined in the contract and not available from other sources.";
                                                readonly examples: readonly ["0x12"];
                                            };
                                        };
                                    };
                                    readonly metadata: {
                                        readonly type: "object";
                                        readonly properties: {
                                            readonly blockTimestamp: {
                                                readonly type: "string";
                                                readonly description: "Timestamp of the block from which the transaction event originated (ISO-formatted timestamp).";
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
export { AlchemyGetAssetTransfers };
