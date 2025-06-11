export function highlightKeyword(text: string, keyword: string): string {
    if (!keyword) return text
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escapedKeyword, 'gi')
    return text.replace(regex, (match) => `<span class="text-yellow-400">${match}</span>`)
}
