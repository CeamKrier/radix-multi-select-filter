import he from "he";

export const richTextRenderer = (text: string) => {
    const decodedText = he.decode(text);

    return decodedText;
};
