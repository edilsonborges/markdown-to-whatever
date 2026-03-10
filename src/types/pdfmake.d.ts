declare module 'pdfmake/build/pdfmake' {
  interface PdfMakeStatic {
    fonts: Record<string, Record<string, string>>;
    vfs: Record<string, string>;
    createPdf(
      docDefinition: Record<string, unknown>,
      tableLayouts?: Record<string, unknown>,
    ): {
      download(filename: string, cb?: () => void): void;
      open(): void;
      getBlob(cb: (blob: Blob) => void): void;
      getBuffer(cb: (buffer: Uint8Array) => void): void;
    };
  }

  const pdfMake: PdfMakeStatic;
  export default pdfMake;
}

declare module 'pdfmake/build/standard-fonts/Helvetica' {
  const fontData: { vfs: Record<string, string> };
  export = fontData;
}

declare module 'pdfmake/build/standard-fonts/Courier' {
  const fontData: { vfs: Record<string, string> };
  export = fontData;
}

declare module 'pdfmake/build/standard-fonts/Times' {
  const fontData: { vfs: Record<string, string> };
  export = fontData;
}

declare module 'html-to-pdfmake' {
  interface HtmlToPdfmakeOptions {
    window?: Window;
    tableAutoSize?: boolean;
    defaultStyles?: Record<string, Record<string, unknown> | null>;
    imagesByReference?: boolean;
    removeExtraBlanks?: boolean;
  }

  function htmlToPdfmake(
    html: string,
    options?: HtmlToPdfmakeOptions,
  ): unknown[];

  export default htmlToPdfmake;
}
