import { BlockType, LeafType, NodeTypes } from './ast-types';
interface Options {
    nodeTypes: NodeTypes;
    listDepth?: number;
    ignoreParagraphNewline?: boolean;
}
export default function serialize(chunk: BlockType | LeafType, opts?: Options): string | undefined;
export {};
