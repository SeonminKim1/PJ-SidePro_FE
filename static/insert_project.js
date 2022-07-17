src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"

const Editor = toastui.Editor;

const editor = new Editor({
    el: document.querySelector('#editor'),
    height: '600px',
    initialEditType: 'markdown',
    previewStyle: 'vertical'
});

seeHtml = function(){
    alert(editor.getHTML());
}
seeMd = function(){
    alert(editor.getMarkdown());
}