import hljs from 'highlight.js'

document.addEventListener('livewire:navigated', () => {
  hljs.highlightAll()
})
