

export function formatDate(date: string | undefined): string {
    if (!date || new Date(date).getFullYear() < 2000) {
        return '---';
    }
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
}