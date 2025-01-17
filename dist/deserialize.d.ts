import { HeadingNode, InputNodeTypes, ItalicNode, MdastNode, OptionType } from './ast-types';
export default function deserialize<T extends InputNodeTypes>(node: MdastNode, opts?: OptionType<T>): HeadingNode<T> | ItalicNode<T> | {
    ordered?: boolean | undefined;
    value?: string | undefined;
    depth?: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
    url?: string | undefined;
    alt?: string | undefined;
    lang?: string | undefined;
    position?: any;
    spread?: any;
    checked?: any;
    indent?: any;
    text: string | undefined;
};
