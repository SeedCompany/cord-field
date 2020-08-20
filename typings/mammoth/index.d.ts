import { ImgHTMLAttributes } from 'react';
import { MergeExclusive } from 'type-fest';

export function convertToHtml(
  input: MammothInput,
  options: MammothOptions
): Promise<MammothResult>;

export function convertToMarkdown(
  input: MammothInput,
  options: MammothOptions
): Promise<MammothResult>;

export function extractRawText(input: MammothInput): Promise<unknown>;

export function embedStyleMap(
  input: MammothInput,
  styleMap: StyleMap
): Promise<{ toBuffer: () => Buffer }>;

export type MammothInput = MergeExclusive<
  MergeExclusive<{ path: string }, { buffer: Buffer }>,
  { arrayBuffer: ArrayBuffer }
>;

export interface MammothOptions {
  /**
   * Controls the mapping of Word styles to HTML.
   *
   * If a string, each line is treated as a separate style mapping,
   * ignoring blank lines and lines starting with #
   *
   * If an array, each element is expected to be a string representing a
   * single style mapping.
   *
   * See [Writing style maps](https://github.com/mwilliamson/mammoth.js#writing-style-maps)
   * for a reference to the syntax for style maps.
   */
  styleMap?: StyleMap;

  /**
   * By default, if the document contains an embedded style map, then it is
   * combined with the default style map.
   * To ignore any embedded style maps, set this to false.
   */
  includeEmbeddedStyleMap?: boolean;

  /**
   * By default, the style map passed in styleMap is combined with the default
   * style map.
   * To stop using the default style map altogether, set this to false.
   */
  includeDefaultStyleMap?: boolean;

  /**
   * By default, images are converted to <img> elements with the source
   * included inline in the src attribute.
   * Set this option to an image converter to override the default behaviour.
   */
  convertImage?: ImageConverter;

  /**
   * By default, empty paragraphs are ignored.
   * Set this option to false to preserve empty paragraphs in the output.
   */
  ignoreEmptyParagraphs?: boolean;

  /**
   * A string to prepend to any generated IDs, such as those used by bookmarks,
   * footnotes and endnotes.
   * Defaults to an empty string.
   */
  idPrefix?: string;

  /**
   * If set, this function is applied to the document read from the docx file
   * before the conversion to HTML.
   *
   * The API for document transforms should be considered unstable.
   * See [document transforms](https://github.com/mwilliamson/mammoth.js#document-transforms).
   */
  transformDocument?: unknown;
}

export type StyleMap = string | string[];

export interface MammothResult {
  value: string;
  messages: MammothMessage[];
}

export type MammothMessage = WarningMessage | ErrorMessage;
interface WarningMessage {
  type: 'warning';
  message: string;
}
interface ErrorMessage {
  type: 'error';
  message: string;
  error: Error;
}

interface FreshElement {
  type: 'element';
  tag: string;
  children: any[];
}

interface ImgElement {
  type: 'image';
  read: (() => Promise<Buffer>) &
    ((encoding: BufferEncoding) => Promise<string>);
  contentType: string;
  altText?: string;
}

type ImageHandler = (image: ImgElement) => Promise<ImgHTMLAttributes<unknown>>;
type ImageConverter = (
  image: ImgElement,
  messages: MammothMessage[]
) => Promise<FreshElement[]>;

export namespace images {
  export const imgElement: (handler: ImageHandler) => ImageConverter;
  export const dataUri: ImageConverter;
}

// Flush out if/when needed
export namespace transforms {
  export const paragraph: unknown;
  export const run: unknown;
  export const getDescendants: unknown;
  export const getDescendantsOfType: unknown;
}
