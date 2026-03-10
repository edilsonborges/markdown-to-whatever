const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\u{FE0F}\u{FE0E}\u{200D}]/gu

export function stripEmoji(text: string): string {
  return text.replace(emojiRegex, '')
}
