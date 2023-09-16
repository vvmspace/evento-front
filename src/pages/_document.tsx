import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
    };
  }

  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <Html lang="es">
          <Head />
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      </I18nextProvider>
    );
  }
}

export default MyDocument;
