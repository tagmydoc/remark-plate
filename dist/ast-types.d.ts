export interface NodeTypes {
    paragraph: 'p';
    block_quote: 'blockquote';
    code_block: 'code_block';
    link: 'a';
    ul_list: 'ul';
    ol_list: 'ol';
    listItem: 'li';
    heading: {
        1: 'h1';
        2: 'h2';
        3: 'h3';
        4: 'h4';
        5: 'h5';
        6: 'h6';
    };
    emphasis_mark: 'italic';
    strong_mark: 'bold';
    delete_mark: 'strikethrough';
    inline_code_mark: 'code';
    thematic_break: 'hr';
    image: 'img';
}
export declare type MdastNodeType = 'paragraph' | 'heading' | 'list' | 'listItem' | 'link' | 'image' | 'blockquote' | 'code' | 'html' | 'emphasis' | 'strong' | 'delete' | 'inlineCode' | 'thematicBreak' | 'text' | 'break';
export declare const defaultNodeTypes: NodeTypes;
export interface LeafType {
    text: string;
    strikethrough?: boolean;
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    parentType?: string;
}
export interface BlockType {
    type: string;
    parentType?: string;
    url?: string;
    caption?: string;
    language?: string;
    break?: boolean;
    children: Array<BlockType | LeafType>;
}
export interface InputNodeTypes {
    paragraph: string;
    block_quote: string;
    code_block: string;
    link: string;
    ul_list: string;
    ol_list: string;
    listItem: string;
    heading: {
        1: string;
        2: string;
        3: string;
        4: string;
        5: string;
        6: string;
    };
    emphasis_mark: string;
    strong_mark: string;
    delete_mark: string;
    inline_code_mark: string;
    thematic_break: string;
    image: string;
}
declare type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};
export interface OptionType<T extends InputNodeTypes = InputNodeTypes> {
    nodeTypes?: RecursivePartial<T>;
    linkDestinationKey?: string;
    imageSourceKey?: string;
    imageCaptionKey?: string;
}
export interface MdastNode {
    type?: MdastNodeType;
    ordered?: boolean;
    value?: string;
    text?: string;
    children?: Array<MdastNode>;
    depth?: 1 | 2 | 3 | 4 | 5 | 6;
    url?: string;
    alt?: string;
    lang?: string;
    position?: any;
    spread?: any;
    checked?: any;
    indent?: any;
}
export declare type TextNode = {
    text?: string | undefined;
};
export declare type CodeBlockNode<T extends InputNodeTypes> = {
    type: T['code_block'];
    language: string | undefined;
    children: Array<TextNode>;
};
export declare type HeadingNode<T extends InputNodeTypes> = {
    type: T['heading'][1] | T['heading'][2] | T['heading'][3] | T['heading'][4] | T['heading'][5] | T['heading'][6];
    children: Array<DeserializedNode<T>>;
};
export declare type ListNode<T extends InputNodeTypes> = {
    type: T['ol_list'] | T['ul_list'];
    children: Array<DeserializedNode<T>>;
};
export declare type ListItemNode<T extends InputNodeTypes> = {
    type: T['listItem'];
    children: Array<DeserializedNode<T>>;
};
export declare type ParagraphNode<T extends InputNodeTypes> = {
    type: T['paragraph'];
    break?: true;
    children: Array<DeserializedNode<T>>;
};
export declare type LinkNode<T extends InputNodeTypes> = {
    type: T['link'];
    children: Array<DeserializedNode<T>>;
    [urlKey: string]: string | undefined | Array<DeserializedNode<T>>;
};
export declare type ImageNode<T extends InputNodeTypes> = {
    type: T['image'];
    children: Array<DeserializedNode<T>>;
    [sourceOrCaptionKey: string]: string | undefined | Array<DeserializedNode<T>>;
};
export declare type BlockQuoteNode<T extends InputNodeTypes> = {
    type: T['block_quote'];
    children: Array<DeserializedNode<T>>;
};
export declare type InlineCodeMarkNode<T extends InputNodeTypes> = {
    type: T['inline_code_mark'];
    children: Array<TextNode>;
    language: string | undefined;
};
export declare type ThematicBreakNode<T extends InputNodeTypes> = {
    type: T['thematic_break'];
    children: Array<DeserializedNode<T>>;
};
export declare type ItalicNode<T extends InputNodeTypes> = {
    [K in T['emphasis_mark']]: true;
} & {
    children: TextNode;
};
export declare type BoldNode<T extends InputNodeTypes> = {
    [K in T['strong_mark']]: true;
} & {
    children: TextNode;
};
export declare type StrikeThoughNode<T extends InputNodeTypes> = {
    [K in T['delete_mark']]: true;
} & {
    children: TextNode;
};
export declare type InlineCodeNode = {
    code: true;
    text: string | undefined;
};
export declare type DeserializedNode<T extends InputNodeTypes> = CodeBlockNode<T> | HeadingNode<T> | ListNode<T> | ListItemNode<T> | ParagraphNode<T> | LinkNode<T> | ImageNode<T> | BlockQuoteNode<T> | InlineCodeMarkNode<T> | ThematicBreakNode<T> | ItalicNode<T> | BoldNode<T> | StrikeThoughNode<T> | InlineCodeNode | TextNode;
export {};