export function showToast(title_content: string) {
    const toast = useToast()
    toast.add({title: title_content})
}