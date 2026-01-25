export function truncateText(el: HTMLElement, lines: number) {
 
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
  const maxHeight = lineHeight * lines;

  while (el.scrollHeight > maxHeight) {
    el.textContent = el.textContent!.replace(/\W*\s(\S)*$/, '...');
  }
}